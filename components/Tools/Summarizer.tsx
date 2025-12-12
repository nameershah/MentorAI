import React, { useState } from 'react';
import { useApp } from '../../context/appContext';
import { summarizeText } from '../../services/geminiService';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { Zap, ArrowRight, Loader2 } from 'lucide-react';

export const Summarizer: React.FC = () => {
    const { state, dispatch } = useApp();
    const [input, setInput] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSummarize = async () => {
        if(!input.trim()) return;
        setLoading(true);
        try {
            const result = await summarizeText(input);
            setSummary(result);
        } catch(e: any) {
            dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: e.message }});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Input Text</label>
                <textarea 
                    className="w-full h-40 p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Paste text, notes, or articles here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={handleSummarize}
                        disabled={loading || !input.trim()}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                        Summarize
                    </button>
                </div>
            </div>

            {summary && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-slide-up">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <ArrowRight size={20} className="text-indigo-500" />
                        Summary
                    </h3>
                    <div className="prose prose-slate max-w-none">
                        <MarkdownRenderer content={summary} />
                    </div>
                </div>
            )}
        </div>
    );
};