import React, { useState } from 'react';
import { analyzeCode } from '../../services/geminiService';
import { useApp } from '../../context/appContext';
import { Code, Bug, Zap, Activity, Loader2, CheckCircle } from 'lucide-react';

export const CodeAnalyzer: React.FC = () => {
    const { dispatch } = useApp();
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!code.trim()) return;
        setLoading(true);
        try {
            const data = await analyzeCode(code, language);
            setResult(data);
            dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'success', message: 'Analysis Complete' } });
        } catch (e) {
            dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: 'Analysis Failed' } });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <Code className="text-blue-500" /> Code Analyzer
                    </h3>
                    <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm font-medium"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="html">HTML/CSS</option>
                    </select>
                </div>
                
                <textarea 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your code here for debugging and optimization..."
                    className="w-full h-48 font-mono text-sm p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />

                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={handleAnalyze}
                        disabled={loading || !code.trim()}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Activity size={18} />}
                        Analyze Code
                    </button>
                </div>
            </div>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Summary Card */}
                    <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-lg mb-2">Analysis Summary</h4>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{result.summary}</p>
                            </div>
                            <div className="text-center bg-slate-50 dark:bg-slate-800 p-3 rounded-xl min-w-[80px]">
                                <span className="block text-xs text-slate-400 uppercase font-bold">Rating</span>
                                <span className={`text-2xl font-black ${result.rating > 7 ? 'text-emerald-500' : result.rating > 4 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {result.rating}/10
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bugs */}
                    <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
                        <h4 className="font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                            <Bug size={18} /> Potential Issues
                        </h4>
                        <ul className="space-y-2">
                            {result.bugs?.map((bug: string, i: number) => (
                                <li key={i} className="flex gap-2 text-sm text-red-800 dark:text-red-200">
                                    <span className="mt-1">•</span> {bug}
                                </li>
                            )) || <li className="text-sm text-slate-500">No bugs detected.</li>}
                        </ul>
                    </div>

                    {/* Optimizations */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-4 flex items-center gap-2">
                            <Zap size={18} /> Optimizations
                        </h4>
                        <ul className="space-y-2">
                            {result.optimizations?.map((opt: string, i: number) => (
                                <li key={i} className="flex gap-2 text-sm text-blue-800 dark:text-blue-200">
                                    <span className="mt-1">•</span> {opt}
                                </li>
                            )) || <li className="text-sm text-slate-500">No optimizations needed.</li>}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};