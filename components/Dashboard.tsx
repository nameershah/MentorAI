import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../context/appContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { predictMastery } from '../services/geminiService';
import { Sparkles, Trophy } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { state } = useApp();
  const [prediction, setPrediction] = useState<string>('');

  // Calculate Real Stats
  const stats = useMemo(() => {
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (6 - i));
        return { 
            date: d.toLocaleDateString('en-US', { weekday: 'short' }), 
            fullDate: d.toDateString(),
            messages: 0,
            cards: 0
        };
    });

    state.sessions.forEach(session => {
        session.messages.forEach(msg => {
            const msgDate = new Date(msg.timestamp).toDateString();
            const dayStat = last7Days.find(d => d.fullDate === msgDate);
            if (dayStat) {
                dayStat.messages += 1;
            }
        });
    });

    return {
        chartData: last7Days.map(d => ({
            name: d.date,
            activity: d.messages,
            mastery: Math.min(100, d.messages * 5 + state.flashcards.length * 2) 
        })),
        totalMessages: state.sessions.reduce((acc, s) => acc + s.messages.length, 0),
        totalCards: state.flashcards.length,
        totalSessions: state.sessions.length,
        streak: state.sessions.length > 0 ? "Active" : "New"
    };
  }, [state.sessions, state.flashcards]);

  useEffect(() => {
      if (stats.totalMessages > 0 && !prediction) {
          predictMastery({ 
              msgCount: stats.totalMessages, 
              sessions: stats.totalSessions, 
              cards: stats.totalCards 
          }).then(setPrediction);
      }
  }, [stats]);

  if (state.sessions.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 min-h-0 bg-slate-50 dark:bg-slate-950">
            <h3 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-200">No Activity Yet</h3>
            <p className="max-w-md">Start a chat, upload a document, or generate flashcards to see your learning analytics appear here.</p>
        </div>
      );
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0 p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Learning Analytics</h2>
        
        {/* Prediction Card */}
        {prediction && (
            <div className="mb-8 p-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl text-white shadow-lg animate-fade-in flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                    <Sparkles size={24} className="text-yellow-300" />
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-1">AI Forecast</h3>
                    <p className="text-indigo-100">{prediction}</p>
                </div>
            </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
            {/* Activity Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                <h3 className="font-semibold mb-6 text-slate-600 dark:text-slate-300">Message Activity (7 Days)</h3>
                <div className="w-full h-72 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                                cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="activity" 
                                stroke="#2563eb" 
                                strokeWidth={3} 
                                dot={{r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} 
                                activeDot={{r: 6}} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Mastery Score Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                <h3 className="font-semibold mb-6 text-slate-600 dark:text-slate-300">Knowledge Velocity</h3>
                <div className="w-full h-72 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.chartData} barSize={32}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                cursor={{fill: '#f1f5f9'}} 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                            />
                            <Bar dataKey="mastery" fill="#10b981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Total Messages</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stats.totalMessages}</p>
            </div>
             <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Sessions</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stats.totalSessions}</p>
            </div>
             <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Flashcards</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stats.totalCards}</p>
            </div>
             <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Status</p>
                <p className="text-2xl font-bold text-emerald-500 mt-1">{stats.streak}</p>
            </div>
        </div>
    </div>
  );
};