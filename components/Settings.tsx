import React from 'react';
import { useApp } from '../context/appContext';
import { Download, Trash2, Moon, Sun, Volume2, VolumeX, RefreshCcw } from 'lucide-react';

export const Settings: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleExport = () => {
    try {
        const dataStr = JSON.stringify(state, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", `mentorai_backup_${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        URL.revokeObjectURL(url);
        
        dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'success', message: 'Data exported successfully' }});
    } catch (e) {
        dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: 'Export failed' }});
    }
  };

  const handleClear = () => {
      if(window.confirm("DANGER: Are you sure you want to delete ALL history and settings? This cannot be undone and the app will reload.")) {
          try {
              // 1. Wipe Storage
              localStorage.removeItem('mentorai_v2');
              
              // 2. Dispatch Clear (Redundant but good for in-memory)
              dispatch({ type: 'CLEAR_ALL_SESSIONS' }); 
              
              // 3. Force Reload to ensure clean slate
              setTimeout(() => {
                  window.location.reload();
              }, 500);
              
          } catch (e) {
              dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: 'Failed to clear history' }});
          }
      }
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 p-8">
        <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-slate-100">Settings & Preferences</h2>
        
        <div className="max-w-3xl space-y-6">
            
            {/* Appearance & Accessibility */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                     <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"><Sun size={18} /> Appearance</h3>
                </div>
                <div className="p-6 space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300"><Moon size={20} /></div>
                             <div>
                                <p className="font-medium text-slate-700 dark:text-slate-300">Dark Mode</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Toggle dark theme</p>
                             </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={state.settings.theme === 'dark'} 
                                onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', payload: { theme: e.target.checked ? 'dark' : 'light' } })} 
                            />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                                {state.settings.autoRead ? <Volume2 size={20} /> : <VolumeX size={20} />}
                             </div>
                             <div>
                                <p className="font-medium text-slate-700 dark:text-slate-300">Auto-Read Responses</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Text-to-speech for all AI replies</p>
                             </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={state.settings.autoRead} onChange={(e) => {
                                const newVal = e.target.checked;
                                dispatch({ type: 'UPDATE_SETTINGS', payload: { autoRead: newVal } });
                                if (!newVal) window.speechSynthesis.cancel();
                            }} />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                     <h3 className="font-semibold text-slate-800 dark:text-slate-200">Data Management</h3>
                </div>
                <div className="p-6 flex gap-4">
                    <button 
                        onClick={handleExport}
                        className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 transition"
                    >
                        <Download size={18} /> Export Data (JSON)
                    </button>
                    <button 
                        onClick={handleClear}
                        className="flex-1 flex items-center justify-center gap-2 p-3 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 font-medium text-red-600 dark:text-red-400 transition"
                    >
                        <Trash2 size={18} /> Clear All History
                    </button>
                </div>
            </div>

        </div>
    </div>
  );
};