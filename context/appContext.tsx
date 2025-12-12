import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, ChatSession, Message, Document, Flashcard, StudyPlan, UserSettings, Toast } from '../types';
import { INITIAL_SETTINGS } from '../constants';

// --- Actions ---
type Action =
  | { type: 'SET_ACTIVE_SESSION'; payload: string }
  | { type: 'NEW_SESSION'; payload: ChatSession }
  | { type: 'ADD_MESSAGE'; payload: { sessionId: string; message: Message } }
  | { type: 'UPDATE_LAST_MESSAGE'; payload: { sessionId: string; content: string } }
  | { type: 'UPDATE_SESSION_TITLE'; payload: { sessionId: string; title: string } }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'CLEAR_ALL_SESSIONS' }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'PIN_DOCUMENT'; payload: string | null }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'ADD_FLASHCARDS'; payload: Flashcard[] }
  | { type: 'ADD_PLAN'; payload: StudyPlan }
  | { type: 'TOGGLE_PLAN_ITEM'; payload: { planId: string; itemId: string } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SET_TOOL_LOADING'; payload: { tool: keyof AppState['toolLoading']; isLoading: boolean } };

// --- Initial State ---
const initialState: AppState = {
  sessions: [],
  activeSessionId: null,
  documents: [],
  pinnedDocumentId: null,
  flashcards: [],
  studyPlans: [],
  settings: INITIAL_SETTINGS as UserSettings,
  isSidebarCollapsed: false,
  toasts: [],
  toolLoading: {
    flashcards: false,
    quiz: false,
    solver: false,
    summarizer: false,
    planner: false,
  }
};

// --- Reducer ---
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'NEW_SESSION':
      return { ...state, sessions: [action.payload, ...state.sessions], activeSessionId: action.payload.id };
    case 'SET_ACTIVE_SESSION':
      return { ...state, activeSessionId: action.payload };
    case 'ADD_MESSAGE':
      return {
        ...state,
        sessions: state.sessions.map(s => 
          s.id === action.payload.sessionId 
            ? { ...s, messages: [...s.messages, action.payload.message], updatedAt: Date.now() } 
            : s
        )
      };
    case 'UPDATE_LAST_MESSAGE':
      return {
          ...state,
          sessions: state.sessions.map(s => {
              if (s.id !== action.payload.sessionId) return s;
              const msgs = [...s.messages];
              if (msgs.length > 0) {
                  const last = msgs[msgs.length - 1];
                  msgs[msgs.length - 1] = { ...last, content: action.payload.content };
              }
              return { ...s, messages: msgs, updatedAt: Date.now() };
          })
      };
    case 'UPDATE_SESSION_TITLE':
      return {
        ...state,
        sessions: state.sessions.map(s => s.id === action.payload.sessionId ? { ...s, title: action.payload.title } : s)
      };
    case 'DELETE_SESSION':
      const remaining = state.sessions.filter(s => s.id !== action.payload);
      const nextActiveId = state.activeSessionId === action.payload 
          ? (remaining.length > 0 ? remaining[0].id : null) 
          : state.activeSessionId;
          
      return { 
        ...state, 
        sessions: remaining,
        activeSessionId: nextActiveId
      };
    case 'CLEAR_ALL_SESSIONS':
      return { 
          ...state, 
          sessions: [], 
          activeSessionId: null, 
          documents: [], 
          pinnedDocumentId: null,
          flashcards: [], 
          studyPlans: [],
          toolLoading: {
            flashcards: false,
            quiz: false,
            solver: false,
            summarizer: false,
            planner: false,
          }
      };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'PIN_DOCUMENT':
      return { ...state, pinnedDocumentId: action.payload };
    case 'DELETE_DOCUMENT':
        return { 
            ...state, 
            documents: state.documents.filter(d => d.id !== action.payload),
            pinnedDocumentId: state.pinnedDocumentId === action.payload ? null : state.pinnedDocumentId
        };
    case 'ADD_FLASHCARDS':
      return { 
          ...state, 
          flashcards: [...state.flashcards, ...action.payload],
          toolLoading: { ...state.toolLoading, flashcards: false } // Auto turn off loading
      };
    case 'ADD_PLAN':
      return { ...state, studyPlans: [action.payload, ...state.studyPlans] };
    case 'TOGGLE_PLAN_ITEM':
      // NOTE: StudyPlan structure currently does not support tracking individual activity completion by ID.
      // Returning state as-is to resolve type error.
      return state;
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarCollapsed: !state.isSidebarCollapsed };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case 'SET_TOOL_LOADING':
      return {
          ...state,
          toolLoading: {
              ...state.toolLoading,
              [action.payload.tool]: action.payload.isLoading
          }
      };
    default:
      return state;
  }
};

// --- Context ---
const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage with deep merge
  const loadState = (): AppState => {
    const saved = localStorage.getItem('mentorai_v2'); 
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Deep merge to ensure new fields in initialState (like toolLoading) are present
        return { 
            ...initialState, 
            ...parsed, 
            activeSessionId: null, 
            toasts: [],
            // Ensure toolLoading exists even if not in saved state
            toolLoading: { ...initialState.toolLoading, ...(parsed.toolLoading || {}) }
        };
      } catch (e) { console.error("Migration failed", e); }
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(appReducer, loadState());

  const { sessions, documents, pinnedDocumentId, flashcards, studyPlans, settings } = state;

  useEffect(() => {
    try {
        const serialized = JSON.stringify({
            sessions,
            documents,
            pinnedDocumentId,
            flashcards,
            studyPlans,
            settings
        });
        localStorage.setItem('mentorai_v2', serialized);
    } catch (e) {
        console.error("Local Storage Save Error:", e);
    }
  }, [sessions, documents, pinnedDocumentId, flashcards, studyPlans, settings]);

  useEffect(() => {
    if (state.settings.theme === 'dark' || (state.settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [state.settings.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};