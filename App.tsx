import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { Tools } from './components/Tools/Tools';
import { QuizAgent } from './components/QuizAgent';
import { Documents } from './components/Documents';
import { Settings } from './components/Settings';
import { useApp } from './context/appContext';

// Toast Container
const Toaster = () => {
    const { state, dispatch } = useApp();
    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-full max-w-sm items-center">
            {state.toasts.map(toast => (
                <div 
                    key={toast.id}
                    onAnimationEnd={() => setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id }), 3000)}
                    className={`
                        px-6 py-3 rounded-full shadow-2xl text-sm font-medium animate-slide-up flex items-center gap-2 pointer-events-auto backdrop-blur-md border border-white/10
                        ${toast.type === 'error' ? 'bg-red-500/90 text-white' : 
                          toast.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-slate-800/90 dark:bg-slate-700/90 text-white'}
                    `}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
};

export default function App() {
    const { state, dispatch } = useApp();

    // Auto-create session if none exists
    useEffect(() => {
        if (state.sessions.length === 0) {
            const newSession = {
                id: crypto.randomUUID(),
                title: 'New Session',
                messages: [], // Empty to trigger Welcome UI
                createdAt: Date.now(),
                updatedAt: Date.now(),
                attachedDocs: []
            };
            dispatch({ type: 'NEW_SESSION', payload: newSession });
        }
    }, [state.sessions.length, dispatch]);

    // Global Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + K: Focus Chat Input
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const input = document.getElementById('chat-input');
                if (input) input.focus();
            }
            // Ctrl/Cmd + B: Toggle Sidebar
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                dispatch({ type: 'TOGGLE_SIDEBAR' });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dispatch]);

    return (
        <HashRouter>
            <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
                <Sidebar />
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    {/* Subtle Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20 pointer-events-none" />
                    
                    <Routes>
                        <Route path="/" element={<ChatArea />} />
                        <Route path="/tools" element={<Tools />} />
                        <Route path="/quiz" element={<QuizAgent />} />
                        <Route path="/documents" element={<Documents />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    
                    <Toaster />
                </main>
            </div>
        </HashRouter>
    );
}