export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  attachments?: Attachment[];
  isThinking?: boolean;
}

export interface Attachment {
  name: string;
  type: string;
  content: string | null; // Null if binary/simulated
  size: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  attachedDocs: string[]; // Doc IDs
}

export interface Document {
  id: string;
  name: string;
  type: 'text' | 'pdf' | 'docx' | 'image' | 'audio' | 'other';
  content: string; // Base64 string for binaries, text for text files
  mimeType?: string; // e.g., 'application/pdf', 'image/png'
  uploadedAt: number;
  isSimulated: boolean; // False now, we use real base64
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  box: number; // For spaced repetition (0-5)
  nextReview: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: string;
}

export interface StudyPlanActivity {
    type: string;
    duration: number; // minutes
    description: string;
}

export interface StudyPlanDay {
    day: number;
    topics: string[];
    activities: StudyPlanActivity[];
    milestone: string;
}

export interface StudyPlanWeek {
    weekNumber: number;
    focus: string;
    days: StudyPlanDay[];
}

export interface StudyPlan {
  id: string;
  topic: string;
  overview?: string;
  weeks: StudyPlanWeek[];
  createdAt: number;
}

export interface UserSettings {
  isVoiceEnabled: boolean;
  autoRead: boolean;
  demoMode: boolean; // If true, use direct API key instead of proxy
  apiKey?: string;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ur';
}

export interface AppState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  documents: Document[];
  pinnedDocumentId: string | null; // Globally pinned doc for context
  flashcards: Flashcard[]; 
  studyPlans: StudyPlan[];
  settings: UserSettings;
  isSidebarCollapsed: boolean;
  toasts: Toast[];
  // Persist tool loading states across navigation
  toolLoading: {
    flashcards: boolean;
    quiz: boolean;
    solver: boolean;
    summarizer: boolean;
    planner: boolean;
  };
}

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warn' | 'error';
  message: string;
}