import {
  YouTubeChannelInfo,
  YouTubeVideo,
  YouTubeMetrics,
  YouTubeAnalysis,
  SEOAnalysis,
} from "@/types";

const API_KEY = process.env.YOUTUBE_API_KEY!;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

// --- URL Parsing ---

export function parseChannelUrl(url: string): {
  type: "id" | "handle" | "custom";
  value: string;
} | null {
  const trimmed = url.trim();

  // channel ID: youtube.com/channel/UCxxxx
  const channelIdMatch = trimmed.match(
    /youtube\.com\/channel\/(UC[\w-]{22})/i
  );
  if (channelIdMatch) return { type: "id", value: channelIdMatch[1] };

  // handle: youtube.com/@handle
  const handleMatch = trimmed.match(/youtube\.com\/@([\w.-]+)/i);
  if (handleMatch) return { type: "handle", value: handleMatch[1] };

  // custom URL: youtube.com/c/name or youtube.com/user/name
  const customMatch = trimmed.match(
    /youtube\.com\/(?:c|user)\/([\w.-]+)/i
  );
  if (customMatch) return { type: "custom", value: customMatch[1] };

  // bare handle: @handle (no full URL)
  const bareHandle = trimmed.match(/^@([\w.-]+)$/);
  if (bareHandle) return { type: "handle", value: bareHandle[1] };

  return null;
}

// --- API calls ---

async function ytFetch<T>(
  endpoint: string,
  params: Record<string, string>
): Promise<T> {
  const qs = new URLSearchParams({ ...params, key: API_KEY }).toString();
  const res = await fetch(`${BASE_URL}/${endpoint}?${qs}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export async function resolveChannelId(
  parsed: { type: "id" | "handle" | "custom"; value: string }
): Promise<string> {
  if (parsed.type === "id") return parsed.value;

  if (parsed.type === "handle") {
    const data = await ytFetch<{ items?: { id: string }[] }>("channels", {
      part: "id",
      forHandle: parsed.value,
    });
    if (!data.items?.length)
      throw new Error(`Canale non trovato per @${parsed.value}`);
    return data.items[0].id;
  }

  // custom or user — search
  const data = await ytFetch<{ items?: { id: { channelId: string } }[] }>(
    "search",
    { part: "id", type: "channel", q: parsed.value, maxResults: "1" }
  );
  if (!data.items?.length)
    throw new Error(`Canale non trovato: ${parsed.value}`);
  return data.items[0].id.channelId;
}

export async function fetchChannelInfo(
  channelId: string
): Promise<YouTubeChannelInfo> {
  const data = await ytFetch<{
    items?: {
      id: string;
      snippet: {
        title: string;
        description: string;
        customUrl: string;
        thumbnails: { medium: { url: string } };
        publishedAt: string;
      };
      statistics: {
        subscriberCount: string;
        viewCount: string;
        videoCount: string;
      };
    }[];
  }>("channels", {
    part: "snippet,statistics",
    id: channelId,
  });

  if (!data.items?.length)
    throw new Error("Canale non trovato");

  const ch = data.items[0];
  return {
    channelId: ch.id,
    title: ch.snippet.title,
    description: ch.snippet.description,
    customUrl: ch.snippet.customUrl,
    thumbnailUrl: ch.snippet.thumbnails.medium.url,
    subscriberCount: parseInt(ch.statistics.subscriberCount) || 0,
    viewCount: parseInt(ch.statistics.viewCount) || 0,
    videoCount: parseInt(ch.statistics.videoCount) || 0,
    publishedAt: ch.snippet.publishedAt,
  };
}

export async function fetchRecentVideos(
  channelId: string,
  maxResults = 20
): Promise<YouTubeVideo[]> {
  // Step 1: get video IDs via search
  const searchData = await ytFetch<{
    items?: { id: { videoId: string } }[];
  }>("search", {
    part: "id",
    channelId,
    order: "date",
    type: "video",
    maxResults: String(maxResults),
  });

  if (!searchData.items?.length) return [];

  const videoIds = searchData.items
    .map((i) => i.id.videoId)
    .filter(Boolean)
    .join(",");

  // Step 2: get full video details including snippet for descriptions and tags
  const videoData = await ytFetch<{
    items?: {
      id: string;
      snippet: {
        title: string;
        description: string;
        publishedAt: string;
        thumbnails: { medium: { url: string } };
        tags?: string[];
      };
      statistics: {
        viewCount: string;
        likeCount: string;
        commentCount: string;
      };
      contentDetails: { duration: string };
    }[];
  }>("videos", {
    part: "snippet,statistics,contentDetails",
    id: videoIds,
  });

  if (!videoData.items) return [];

  return videoData.items.map((v) => ({
    videoId: v.id,
    title: v.snippet.title,
    description: v.snippet.description || "",
    publishedAt: v.snippet.publishedAt,
    thumbnailUrl: v.snippet.thumbnails.medium.url,
    viewCount: parseInt(v.statistics.viewCount) || 0,
    likeCount: parseInt(v.statistics.likeCount) || 0,
    commentCount: parseInt(v.statistics.commentCount) || 0,
    duration: v.contentDetails.duration,
    tags: v.snippet.tags || [],
  }));
}

// --- SEO Analysis ---

function analyzeSEO(videos: YouTubeVideo[]): SEOAnalysis {
  if (!videos.length) {
    return {
      avgTitleLength: 0,
      titlesWithKeywords: 0,
      descriptionsOptimized: 0,
      avgDescriptionLength: 0,
      videosWithTags: 0,
      avgTagCount: 0,
      seoScore: 0,
      findings: ["Nessun video disponibile per l'analisi SEO."],
    };
  }

  const findings: string[] = [];

  // Title analysis
  const avgTitleLength = avg(videos.map((v) => v.title.length));
  const optimalTitleRange = videos.filter(
    (v) => v.title.length >= 30 && v.title.length <= 70
  );
  const titlesWithKeywords = (optimalTitleRange.length / videos.length) * 100;

  // Description analysis
  const avgDescriptionLength = avg(
    videos.map((v) => v.description.length)
  );
  const wellDescribed = videos.filter((v) => v.description.length >= 150);
  const descriptionsOptimized = (wellDescribed.length / videos.length) * 100;

  // Tags analysis
  const videosWithTagsArr = videos.filter((v) => v.tags.length > 0);
  const videosWithTags = (videosWithTagsArr.length / videos.length) * 100;
  const avgTagCount =
    videos.length > 0
      ? videos.reduce((sum, v) => sum + v.tags.length, 0) / videos.length
      : 0;

  // Generate SEO findings
  if (avgTitleLength < 30) {
    findings.push(
      `I tuoi titoli sono troppo corti (media ${Math.round(avgTitleLength)} caratteri). I titoli ottimali per YouTube SEO hanno tra 40 e 60 caratteri e contengono la keyword principale.`
    );
  } else if (avgTitleLength > 70) {
    findings.push(
      `I tuoi titoli sono troppo lunghi (media ${Math.round(avgTitleLength)} caratteri). YouTube tronca i titoli oltre i 60-70 caratteri — rischi di perdere informazioni importanti.`
    );
  }

  if (descriptionsOptimized < 50) {
    findings.push(
      `Solo il ${Math.round(descriptionsOptimized)}% dei tuoi video ha una descrizione ottimizzata (150+ caratteri). Le descrizioni sono fondamentali per la SEO di YouTube: inserisci keyword, timestamp e link.`
    );
  }

  if (videosWithTags < 60) {
    findings.push(
      `Il ${Math.round(100 - videosWithTags)}% dei tuoi video non ha tag. I tag aiutano YouTube a capire il contenuto del video e a suggerirlo nelle ricerche correlate.`
    );
  }

  if (avgTagCount < 5 && videosWithTags > 0) {
    findings.push(
      `Usi in media solo ${Math.round(avgTagCount)} tag per video. Si consiglia di usare 8-15 tag rilevanti per massimizzare la visibilita' nelle ricerche.`
    );
  }

  if (!findings.length) {
    findings.push(
      "La tua ottimizzazione SEO su YouTube e' buona! Titoli, descrizioni e tag sono ben curati."
    );
  }

  // Calculate SEO score
  const titleScore = avgTitleLength >= 30 && avgTitleLength <= 70 ? 100 : avgTitleLength < 30 ? (avgTitleLength / 30) * 100 : Math.max(0, 100 - ((avgTitleLength - 70) / 30) * 100);
  const descScore = Math.min(100, descriptionsOptimized * 1.2);
  const tagScore = Math.min(100, videosWithTags + (avgTagCount >= 8 ? 20 : 0));

  const seoScore = Math.round(titleScore * 0.35 + descScore * 0.35 + tagScore * 0.3);

  return {
    avgTitleLength: Math.round(avgTitleLength),
    titlesWithKeywords: Math.round(titlesWithKeywords),
    descriptionsOptimized: Math.round(descriptionsOptimized),
    avgDescriptionLength: Math.round(avgDescriptionLength),
    videosWithTags: Math.round(videosWithTags),
    avgTagCount: Math.round(avgTagCount * 10) / 10,
    seoScore,
    findings,
  };
}

// --- Metrics ---

export function calculateMetrics(
  channel: YouTubeChannelInfo,
  videos: YouTubeVideo[]
): YouTubeMetrics {
  const sorted = [...videos].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const recent10 = sorted.slice(0, 10);
  const recent30 = sorted.slice(0, 30);

  const avgViewsRecent10 = avg(recent10.map((v) => v.viewCount));
  const avgViewsRecent30 = avg(recent30.map((v) => v.viewCount));

  // Engagement rate
  const totalInteractions = sorted.reduce(
    (sum, v) => sum + v.likeCount + v.commentCount,
    0
  );
  const totalViews = sorted.reduce((sum, v) => sum + v.viewCount, 0);
  const engagementRate =
    totalViews > 0 ? (totalInteractions / totalViews) * 100 : 0;

  // Publishing frequency (videos per month)
  const publishingFrequency = calcPublishingFrequency(sorted);

  // Views to subscriber ratio
  const viewsToSubRatio =
    channel.subscriberCount > 0
      ? (avgViewsRecent10 / channel.subscriberCount) * 100
      : 0;

  // Growth trend
  const { growthTrend, growthTrendPercent } = calcGrowthTrend(sorted);

  const avgTitleLength =
    sorted.length > 0
      ? sorted.reduce((sum, v) => sum + v.title.length, 0) / sorted.length
      : 0;

  // SEO Analysis
  const seo = analyzeSEO(sorted);

  return {
    avgViewsRecent10: Math.round(avgViewsRecent10),
    avgViewsRecent30: Math.round(avgViewsRecent30),
    engagementRate: round2(engagementRate),
    publishingFrequency: round2(publishingFrequency),
    viewsToSubRatio: round2(viewsToSubRatio),
    growthTrend,
    growthTrendPercent: round2(growthTrendPercent),
    avgTitleLength: Math.round(avgTitleLength),
    seo,
  };
}

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function calcPublishingFrequency(sortedVideos: YouTubeVideo[]): number {
  if (sortedVideos.length < 2) return sortedVideos.length;
  const newest = new Date(sortedVideos[0].publishedAt);
  const oldest = new Date(sortedVideos[sortedVideos.length - 1].publishedAt);
  const months =
    (newest.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24 * 30);
  return months > 0 ? sortedVideos.length / months : sortedVideos.length;
}

function calcGrowthTrend(sortedVideos: YouTubeVideo[]): {
  growthTrend: YouTubeMetrics["growthTrend"];
  growthTrendPercent: number;
} {
  if (sortedVideos.length < 6)
    return { growthTrend: "stable", growthTrendPercent: 0 };

  const half = Math.floor(sortedVideos.length / 2);
  const recentHalf = sortedVideos.slice(0, half);
  const olderHalf = sortedVideos.slice(half);

  const recentAvg = avg(recentHalf.map((v) => v.viewCount));
  const olderAvg = avg(olderHalf.map((v) => v.viewCount));

  if (olderAvg === 0) return { growthTrend: "stable", growthTrendPercent: 0 };

  const change = ((recentAvg - olderAvg) / olderAvg) * 100;

  let growthTrend: YouTubeMetrics["growthTrend"];
  if (change < -10) growthTrend = "declining";
  else if (change < 10) growthTrend = "stable";
  else if (change < 40) growthTrend = "slow_growth";
  else growthTrend = "strong_growth";

  return { growthTrend, growthTrendPercent: round2(change) };
}

// --- Full analysis ---

export async function analyzeChannel(url: string): Promise<YouTubeAnalysis> {
  const parsed = parseChannelUrl(url);
  if (!parsed) throw new Error("URL del canale YouTube non valido");

  const channelId = await resolveChannelId(parsed);
  const [channel, recentVideos] = await Promise.all([
    fetchChannelInfo(channelId),
    fetchRecentVideos(channelId, 20),
  ]);

  const metrics = calculateMetrics(channel, recentVideos);

  // Calculate YouTube sub-score (now includes SEO)
  const youtubeScore = calculateYouTubeScore(metrics);

  return { channel, recentVideos, metrics, youtubeScore };
}

function calculateYouTubeScore(metrics: YouTubeMetrics): number {
  const freqScore = scoreRange(metrics.publishingFrequency, [1, 2, 4]);
  const viewsScore = scoreRange(metrics.avgViewsRecent10, [100, 500, 2000]);
  const engScore = scoreRange(metrics.engagementRate, [1, 3, 6]);
  const trendScore =
    metrics.growthTrend === "declining"
      ? 12
      : metrics.growthTrend === "stable"
        ? 37
        : metrics.growthTrend === "slow_growth"
          ? 62
          : 87;
  const subRatioScore = scoreRange(metrics.viewsToSubRatio, [1, 5, 15]);
  const seoScore = metrics.seo.seoScore;

  // Weighted average — now includes SEO
  return Math.round(
    freqScore * 0.2 +
      viewsScore * 0.2 +
      engScore * 0.15 +
      trendScore * 0.1 +
      subRatioScore * 0.1 +
      seoScore * 0.25
  );
}

function scoreRange(value: number, thresholds: [number, number, number]): number {
  if (value < thresholds[0]) return Math.round((value / thresholds[0]) * 25);
  if (value < thresholds[1])
    return 25 + Math.round(((value - thresholds[0]) / (thresholds[1] - thresholds[0])) * 25);
  if (value < thresholds[2])
    return 50 + Math.round(((value - thresholds[1]) / (thresholds[2] - thresholds[1])) * 25);
  return 75 + Math.min(25, Math.round(((value - thresholds[2]) / thresholds[2]) * 25));
}
