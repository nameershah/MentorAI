import React, { useState } from 'react';
import { useApp } from '../../context/appContext';
import { solveProblem } from '../../services/geminiService';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { Calculator, Code, Loader2 } from 'lucide-react';

export const Solver: React.FC = () => {
    const { state, dispatch } = useApp();
    const [mode, setMode] = useState<'math' | 'code'>('math');
    const [input, setInput] = useState('');
    const [solution, setSolution] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSwitchMode = (newMode: 'math' | 'code') => {
        if (newMode !== mode) {
            setMode(newMode);
            setSolution(''); // Clear solution when switching
        }
    };

    const handleSolve = async () => {
        if(!input.trim()) return;
        setLoading(true);
        try {
            const result = await solveProblem(input, mode);
            setSolution(result);
        } catch(e: any) {
            dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: e.message }});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center mb-6">
                <div className="bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-1">
                    <button 
                        onClick={() => handleSwitchMode('math')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'math' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        <Calculator size={16} /> Math
                    </button>
                    <button 
                        onClick={() => handleSwitchMode('code')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'code' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        <Code size={16} /> Code
                    </button>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                    {mode === 'math' ? 'Enter Math Problem' : 'Enter Coding Problem'}
                </label>
                <textarea 
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm placeholder:text-slate-400"
                    placeholder={mode === 'math' ? "e.g., Integrate x^2 from 0 to 5" : "e.g., Write a Python function to reverse a string"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={handleSolve}
                        disabled={loading || !input.trim()}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Solve'}
                    </button>
                </div>
            </div>

            {solution && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 animate-slide-up">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 border-b dark:border-slate-700 pb-2">Step-by-Step Solution</h3>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <MarkdownRenderer content={solution} />
                    </div>
                </div>
            )}
        </div>
    );
};