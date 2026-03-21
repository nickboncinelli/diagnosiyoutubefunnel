import { create } from "zustand";
import {
  YouTubeAnalysis,
  QuizAnswers,
  LeadInfo,
  FunnelScore,
} from "@/types";

export type AppStep =
  | "landing"
  | "analyzing"
  | "preview"
  | "lead_capture"
  | "quiz"
  | "calculating"
  | "results";

interface AppState {
  step: AppStep;
  channelUrl: string;
  youtube: YouTubeAnalysis | null;
  lead: LeadInfo | null;
  quizAnswers: QuizAnswers;
  currentQuestionIndex: number;
  score: FunnelScore | null;
  resultId: string | null;
  error: string | null;

  setStep: (step: AppStep) => void;
  setChannelUrl: (url: string) => void;
  setYouTube: (data: YouTubeAnalysis) => void;
  setLead: (lead: LeadInfo) => void;
  setQuizAnswer: (questionId: string, value: number) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setScore: (score: FunnelScore) => void;
  setResultId: (id: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  step: "landing" as AppStep,
  channelUrl: "",
  youtube: null,
  lead: null,
  quizAnswers: {},
  currentQuestionIndex: 0,
  score: null,
  resultId: null,
  error: null,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setChannelUrl: (channelUrl) => set({ channelUrl }),
  setYouTube: (youtube) => set({ youtube }),
  setLead: (lead) => set({ lead }),
  setQuizAnswer: (questionId, value) =>
    set((state) => ({
      quizAnswers: { ...state.quizAnswers, [questionId]: value },
    })),
  setCurrentQuestionIndex: (currentQuestionIndex) =>
    set({ currentQuestionIndex }),
  setScore: (score) => set({ score }),
  setResultId: (resultId) => set({ resultId }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
