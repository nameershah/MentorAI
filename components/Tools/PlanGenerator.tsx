import React, { useState } from 'react';
import { useApp } from '../../context/appContext';
import { generateStudyPlan } from '../../services/geminiService';
import { CheckSquare, Square, Loader2, Calendar, Clock, BookOpen, Target } from 'lucide-react';

export const PlanGenerator: React.FC = () => {
  const { state, dispatch } = useApp();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
      if(!topic) return;
      setLoading(true);
      try {
        const planData = await generateStudyPlan(topic);
        const plan = {
            id: crypto.randomUUID(),
            topic: topic,
            overview: planData.overview,
            weeks: planData.weeks,
            createdAt: Date.now()
        };
        dispatch({ type: 'ADD_PLAN', payload: plan });
      } catch(e) {
        dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: 'Failed to create plan' }});
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
        <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Create New Study Plan</h3>
            <div className="flex gap-4">
                <input 
                    className="flex-1 p-3 border border-slate-300 rounded-lg dark:bg-slate-900 dark:border-slate-700"
                    placeholder="e.g. Master Linear Algebra in 1 week..."
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                />
                <button 
                    onClick={handleCreate}
                    disabled={loading}
                    className="bg-emerald-600 text-white px-6 rounded-lg font-medium hover:bg-emerald-700 transition flex items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Create Plan'}
                </button>
            </div>
        </div>

        <div className="space-y-8">
            {state.studyPlans.map(plan => (
                <div key={plan.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm animate-slide-up">
                    <div className="flex justify-between items-start mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{plan.topic}</h4>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">{plan.overview}</p>
                        </div>
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            {new Date(plan.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="space-y-8">
                        {plan.weeks.map((week) => (
                            <div key={week.weekNumber} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
                                <h5 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                                    <Calendar size={20} className="text-blue-500" /> Week {week.weekNumber}: {week.focus}
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {week.days.map((day) => (
                                        <div key={day.day} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="font-bold text-slate-600 dark:text-slate-300">Day {day.day}</span>
                                                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                                    {day.milestone}
                                                </span>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                {day.activities.map((act, i) => (
                                                    <div key={i} className="flex gap-3 text-sm">
                                                        <div className="mt-0.5 text-slate-400"><Clock size={14} /></div>
                                                        <div>
                                                            <p className="font-semibold text-slate-700 dark:text-slate-300">{act.type} ({act.duration}m)</p>
                                                            <p className="text-slate-500 dark:text-slate-400">{act.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};