import React, { useState } from 'react';
import { Flashcards } from './Flashcards';
import { Solver } from './Solver';
import { PlanGenerator } from './PlanGenerator';
import { Summarizer } from './Summarizer';
import { CodeAnalyzer } from './CodeAnalyzer';
import { RotateCw, Calculator, Calendar, FileText, Code } from 'lucide-react';

export const Tools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'solver' | 'planner' | 'summarizer' | 'code'>('flashcards');

  const tabs = [
    { id: 'flashcards', label: 'Flashcards', icon: RotateCw },
    { id: 'solver', label: 'Problem Solver', icon: Calculator },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'summarizer', label: 'Summarizer', icon: FileText },
    { id: 'code', label: 'Code Analyzer', icon: Code },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 pt-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">AI Power Tools</h2>
        <div className="flex gap-8 overflow-x-auto pb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 pb-4 px-2 text-sm font-medium transition-all relative whitespace-nowrap
                ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}
              `}
            >
              <tab.icon size={18} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 p-8">
        {activeTab === 'flashcards' && <Flashcards />}
        {activeTab === 'solver' && <Solver />}
        {activeTab === 'planner' && <PlanGenerator />}
        {activeTab === 'summarizer' && <Summarizer />}
        {activeTab === 'code' && <CodeAnalyzer />}
      </div>
    </div>
  );
};