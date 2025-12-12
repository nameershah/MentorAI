import React, { useState } from 'react';
import { useApp } from '../../context/appContext';
import { generateFlashcards } from '../../services/geminiService';
import { RotateCw, Plus, Brain } from 'lucide-react';

export const Flashcards: React.FC = () => {
  const { state, dispatch } = useApp();
  const [topic, setTopic] = useState('');
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const loading = state.toolLoading?.flashcards || false;

  const handleGenerate = async () => {
    if(!topic) return;
    dispatch({ type: 'SET_TOOL_LOADING', payload: { tool: 'flashcards', isLoading: true } });
    
    generateFlashcards(topic)
        .then(cards => {
            if (cards.length === 0) throw new Error("No cards generated");
            const enriched = cards.map((c: any) => ({ 
                ...c, 
                id: crypto.randomUUID(), 
                box: 0, 
                nextReview: Date.now() 
            }));
            dispatch({ type: 'ADD_FLASHCARDS', payload: enriched });
            dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'success', message: 'Flashcards generated!' }});
            setTopic(''); 
        })
        .catch(e => {
            dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: 'Generation failed. Try again.' }});
            dispatch({ type: 'SET_TOOL_LOADING', payload: { tool: 'flashcards', isLoading: false } });
        });
  };

  const toggleFlip = (id: string) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getDifficultyColor = (diff?: string) => {
      switch(diff) {
          case 'easy': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
          case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
          case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
          default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
      }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto min-h-full">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-8 animate-slide-up">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
              Create New Deck
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <Brain className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic (e.g. 'Photosynthesis', 'React Hooks')..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
                />
            </div>
            <button 
                onClick={handleGenerate} 
                disabled={loading || !topic.trim()}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 whitespace-nowrap min-w-[160px]"
            >
                {loading ? <RotateCw className="animate-spin" /> : <Plus />}
                {loading ? 'Generating...' : 'Create Cards'}
            </button>
          </div>
      </div>

      {loading && state.flashcards.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 animate-pulse">
              <RotateCw className="animate-spin mx-auto mb-4 text-blue-500" size={40} />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Generating Cards...</h3>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {state.flashcards.map((card, idx) => (
            <div 
                key={card.id || idx} 
                onClick={() => toggleFlip(card.id)}
                className="relative h-72 w-full cursor-pointer perspective-1000 group animate-fade-in"
                style={{ animationDelay: `${idx * 0.05}s` }}
            >
                <div className={`relative h-full w-full transition-all duration-500 transform-style-3d shadow-md hover:shadow-xl rounded-2xl ${flipped[card.id] ? 'rotate-y-180' : ''}`}>
                    
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 p-6 rounded-2xl flex flex-col border border-slate-200 dark:border-slate-700 group-hover:border-blue-400 transition-colors z-10">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">Question</span>
                            <div className="flex gap-2">
                                {card.difficulty && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${getDifficultyColor(card.difficulty)}`}>
                                        {card.difficulty}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex-1 flex items-center justify-center text-center overflow-y-auto">
                            <p className="text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                                {card.front}
                            </p>
                        </div>

                        {card.category && (
                            <div className="mt-4 text-center">
                                <span className="text-xs text-slate-400 font-medium bg-slate-100 dark:bg-slate-900/50 px-2 py-1 rounded">
                                    {card.category}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden bg-blue-600 dark:bg-blue-700 p-6 rounded-2xl rotate-y-180 flex flex-col items-center justify-center text-center text-white border border-blue-500 shadow-inner z-10">
                        <span className="absolute top-4 left-4 text-xs font-bold text-blue-200 uppercase tracking-widest">Answer</span>
                        <div className="overflow-y-auto max-h-[80%] w-full">
                             <p className="text-lg font-medium leading-relaxed">
                                {card.back}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};