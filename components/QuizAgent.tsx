import React, { useState } from 'react';
import { useApp } from '../context/appContext';
import { generateQuiz } from '../services/geminiService';
import { playSound } from '../utils/sounds';
import { Trophy, HelpCircle, ArrowRight, RotateCcw, BrainCircuit, Loader2, Sparkles, AlertCircle, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty?: string;
}

export const QuizAgent: React.FC = () => {
    const { state, dispatch } = useApp();
    const [status, setStatus] = useState<'setup' | 'loading' | 'playing' | 'result'>('setup');
    const [topic, setTopic] = useState('');
    const [questionCount, setQuestionCount] = useState(5);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleStart = async () => {
        if (!topic.trim()) return;
        setStatus('loading');
        try {
            const quizData = await generateQuiz(topic, questionCount);
            if (!quizData || quizData.length === 0) throw new Error("No questions generated");
            
            setQuestions(quizData as any);
            setCurrentIndex(0);
            setScore(0);
            setSelectedIndex(null);
            setIsAnswered(false);
            setStatus('playing');
        } catch (e: any) {
            dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: e.message }});
            setStatus('setup');
        }
    };

    const handleOptionClick = (index: number) => {
        if (isAnswered) return;
        setSelectedIndex(index);
        setIsAnswered(true);
        if (index === questions[currentIndex].correctAnswer) {
            setScore(prev => prev + 1);
            playSound('correct');
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } else {
            playSound('wrong');
        }
    };

    const handleNext = () => {
        playSound('click');
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedIndex(null);
            setIsAnswered(false);
        } else {
            setStatus('result');
            if ((score / questions.length) > 0.8) {
                playSound('achievement');
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
        }
    };

    if (status === 'setup') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-md w-full animate-slide-up space-y-8">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BrainCircuit className="text-blue-600 dark:text-blue-400" size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Quiz Agent</h2>
                        <p className="text-slate-500">Master any topic with AI-generated challenges.</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl">
                        <input 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                            placeholder="e.g., Quantum Physics..."
                            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white mb-6"
                        />
                        <button 
                            onClick={handleStart}
                            disabled={!topic.trim()}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition"
                        >
                            Start Challenge
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'loading') return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin" size={40}/></div>;

    if (status === 'result') {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
                <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl border text-center max-w-lg w-full">
                    <Trophy className="text-yellow-500 mx-auto mb-6" size={48} />
                    <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-2">{percentage}%</h2>
                    <p className="text-slate-500 mb-8">Score: {score} / {questions.length}</p>
                    <button onClick={() => setStatus('setup')} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">Try Again</button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 min-w-0">
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${((currentIndex) / questions.length) * 100}%` }} />
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center">
                <div className="max-w-3xl w-full pb-40"> 
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-mono text-slate-400">Question {currentIndex + 1}</span>
                        {currentQ.difficulty && (
                            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded uppercase tracking-wide text-slate-500">{currentQ.difficulty}</span>
                        )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight mb-8">{currentQ.question}</h3>

                    <div className="grid grid-cols-1 gap-4 mb-8">
                        {currentQ.options.map((option, idx) => {
                            let btnClass = "border-slate-200 dark:border-slate-700 hover:border-blue-400";
                            if (isAnswered) {
                                if (idx === currentQ.correctAnswer) btnClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700";
                                else if (idx === selectedIndex) btnClass = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700";
                                else btnClass = "opacity-50";
                            }
                            return (
                                <button 
                                    key={idx}
                                    onClick={() => handleOptionClick(idx)}
                                    disabled={isAnswered}
                                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all text-lg font-medium bg-white dark:bg-slate-900 ${btnClass}`}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>

                    {isAnswered && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-6 rounded-2xl animate-fade-in">
                            <h4 className="font-bold text-blue-800 dark:text-blue-200 flex items-center gap-2 mb-2">
                                <BookOpen size={18} /> Explanation
                            </h4>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{currentQ.explanation}</p>
                        </div>
                    )}
                </div>
            </div>

            {isAnswered && (
                <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 z-10 flex justify-end">
                    <button onClick={handleNext} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg flex items-center gap-2">
                        {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'} <ArrowRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};