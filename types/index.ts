// ============================================================
// YouTube Funnel Score — Type Definitions
// ============================================================

// --- YouTube Data ---

export interface YouTubeChannelInfo {
  channelId: string;
  title: string;
  description: string;
  customUrl: string;
  thumbnailUrl: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  publishedAt: string;
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string; // ISO 8601
  tags: string[];
}

export interface SEOAnalysis {
  avgTitleLength: number;
  titlesWithKeywords: number; // percentage
  descriptionsOptimized: number; // percentage
  avgDescriptionLength: number;
  videosWithTags: number; // percentage
  avgTagCount: number;
  seoScore: number; // 0-100
  findings: string[];
}

export interface YouTubeMetrics {
  avgViewsRecent10: number;
  avgViewsRecent30: number;
  engagementRate: number; // (likes + comments) / views
  publishingFrequency: number; // videos per month
  viewsToSubRatio: number; // avg views / subscribers
  growthTrend: "declining" | "stable" | "slow_growth" | "strong_growth";
  growthTrendPercent: number;
  avgTitleLength: number;
  seo: SEOAnalysis;
}

export interface YouTubeAnalysis {
  channel: YouTubeChannelInfo;
  recentVideos: YouTubeVideo[];
  metrics: YouTubeMetrics;
  youtubeScore: number; // 0-100
}

// --- Quiz ---

export interface QuizOption {
  label: string;
  value: number; // 0-100
}

export interface QuizQuestion {
  id: string;
  section: "attrazione" | "fidelizzazione" | "conversione";
  question: string;
  options: QuizOption[];
}

export interface QuizAnswers {
  [questionId: string]: number; // value selected
}

// --- Lead Capture ---

export interface LeadInfo {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  role: string;
  privacyAccepted: boolean;
}

// --- Scoring ---

export interface AreaScore {
  area: "attrazione" | "fidelizzazione" | "conversione";
  label: string;
  score: number; // 0-100
  findings: string[];
  tip: string;
}

export interface FunnelScore {
  totalScore: number;
  areas: AreaScore[];
}

// --- Full Result ---

export interface AnalysisResult {
  id: string;
  createdAt: string;
  lead: LeadInfo;
  youtube: YouTubeAnalysis;
  quizAnswers: QuizAnswers;
  score: FunnelScore;
}
