import React, { useRef } from 'react';
import { useApp } from '../context/appContext';
import { Upload, File, FileText, Pin, Trash2, PinOff, Image as ImageIcon, Music, Headphones, AlertCircle } from 'lucide-react';

export const Documents: React.FC = () => {
    const { state, dispatch } = useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 20MB Limit for Audio/Images
        if (file.size > 20 * 1024 * 1024) {
             dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: 'File too large. Max 20MB.' }});
             return;
        }

        dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'info', message: `Processing ${file.name}...` }});

        const reader = new FileReader();

        // 1. Logic: Robust Text Handling
        const isText = file.type === 'text/plain' || file.name.match(/\.(txt|md|json|js|ts|tsx)$/i);

        reader.onload = (event) => {
            const result = event.target?.result as string;
            
            let type: 'text' | 'pdf' | 'image' | 'audio' | 'other' = 'other';
            let content = result;
            let mimeType = file.type;

            if (file.type.startsWith('image/')) {
                type = 'image';
            } else if (file.type === 'application/pdf') {
                type = 'pdf';
            } else if (file.type.startsWith('audio/')) {
                type = 'audio';
            } else if (isText) {
                type = 'text';
                // Ensure we aren't getting a data URL for text
                if (content.startsWith('data:')) {
                     // Fallback decode if readAsDataURL was somehow triggered for text
                     try {
                        content = atob(content.split(',')[1]);
                     } catch(e) { console.error("Decode error", e); }
                }
            }

            const doc = {
                id: crypto.randomUUID(),
                name: file.name,
                type: type,
                content: content,
                mimeType: mimeType,
                uploadedAt: Date.now(),
                isSimulated: false
            };

            dispatch({ type: 'ADD_DOCUMENT', payload: doc });
            dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'success', message: 'Content indexed successfully' }});
            
            // Reset input
            if(fileInputRef.current) fileInputRef.current.value = '';
        };

        if (isText) {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    };

    const togglePin = (docId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (state.pinnedDocumentId === docId) {
            dispatch({ type: 'PIN_DOCUMENT', payload: null });
            dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'info', message: 'Context removed' }});
        } else {
            dispatch({ type: 'PIN_DOCUMENT', payload: docId });
            dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'success', message: 'Pinned to Chat Context' }});
        }
    };

    const deleteDoc = (docId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this document?')) {
            dispatch({ type: 'DELETE_DOCUMENT', payload: docId });
        }
    };

    const getIcon = (type: string) => {
        switch(type) {
            case 'image': return <ImageIcon size={24} />;
            case 'pdf': return <FileText size={24} />;
            case 'audio': return <Headphones size={24} />;
            default: return <File size={24} />;
        }
    };

    return (
        <div className="flex-1 flex flex-col p-8 overflow-y-auto min-h-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Knowledge Base</h2>
            
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-blue-400 transition-all bg-white dark:bg-slate-900 shadow-sm mb-8 group"
            >
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="text-blue-500 dark:text-blue-400" size={32} />
                </div>
                <p className="text-slate-700 dark:text-slate-200 font-medium text-lg">Click to upload materials</p>
                <p className="text-slate-400 text-sm mt-1">Text, PDF, Images, or Audio</p>
                <input ref={fileInputRef} type="file" accept=".pdf,.txt,.md,.json,.jpg,.jpeg,.png,.mp3,.wav,.m4a" className="hidden" onChange={handleFileChange} />
            </div>

            {/* 2. UI: Conditional Rendering for List */}
            {state.documents.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                    <AlertCircle className="mx-auto mb-2 text-slate-400" size={32} />
                    <p className="text-slate-500">No documents yet. Upload one above to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-slide-up">
                    {state.documents.map(doc => {
                        const isPinned = state.pinnedDocumentId === doc.id;
                        return (
                            <div key={doc.id} className={`
                                bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border transition-all hover:shadow-md
                                ${isPinned ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-800'}
                            `}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`p-3 rounded-xl ${doc.type === 'audio' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                        {getIcon(doc.type)}
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => togglePin(doc.id, e)}
                                            className={`p-2 rounded-lg transition-colors ${isPinned ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                            title={isPinned ? "Unpin" : "Pin to Context"}
                                        >
                                            {isPinned ? <PinOff size={18} /> : <Pin size={18} />}
                                        </button>
                                        <button 
                                            onClick={(e) => deleteDoc(doc.id, e)}
                                            className="p-2 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate mb-1" title={doc.name}>{doc.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                
                                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 h-24 overflow-hidden relative flex items-center justify-center">
                                    {doc.type === 'image' ? (
                                        <img src={doc.content} alt="preview" className="w-full h-full object-cover rounded opacity-80" />
                                    ) : doc.type === 'audio' ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Music size={24} className="text-slate-300" />
                                            <audio controls src={doc.content} className="w-full h-8 max-w-[150px]" />
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-500 font-mono break-all text-left w-full h-full overflow-hidden leading-relaxed">
                                            {doc.type === 'pdf' ? '[PDF Binary Data]' : doc.content.slice(0, 150) + '...'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};