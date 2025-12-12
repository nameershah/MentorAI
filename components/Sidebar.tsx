import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/appContext';
import { MessageSquare, FileText, Zap, BrainCircuit, Settings, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const [contextMenu, setContextMenu] = useState<{ id: string, x: number, y: number } | null>(null);
  
  // Rename State
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  // Close context menu on global click
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleClick); 
    return () => {
        window.removeEventListener('click', handleClick);
        window.removeEventListener('scroll', handleClick);
    };
  }, []);

  // Auto-focus input when editing starts
  useEffect(() => {
      if (editingSessionId && editInputRef.current) {
          editInputRef.current.focus();
      }
  }, [editingSessionId]);

  const navItems = [
    { icon: MessageSquare, label: 'Chat', path: '/' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: Zap, label: 'Tools', path: '/tools' },
    { icon: BrainCircuit, label: 'Quiz Agent', path: '/quiz' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleNewChat = () => {
    const newSession = {
      id: crypto.randomUUID(),
      title: 'New Study Session',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      attachedDocs: []
    };
    dispatch({ type: 'NEW_SESSION', payload: newSession });
  };

  // NUCLEAR HANDLER: Prevents any default browser action or bubbling
  const handleAction = (e: React.MouseEvent, action: () => void) => {
      e.preventDefault();
      e.stopPropagation();
      action();
  };

  const openContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Position menu fixed relative to viewport
    setContextMenu({ id, x: e.clientX + 5, y: e.clientY + 5 });
  };

  const handleRenameStart = (sessionId: string) => {
      const session = state.sessions.find(s => s.id === sessionId);
      if (session) {
          setEditingSessionId(session.id);
          setEditTitle(session.title);
      }
      setContextMenu(null);
  };

  const saveRename = () => {
      if (editingSessionId && editTitle.trim()) {
          dispatch({ type: 'UPDATE_SESSION_TITLE', payload: { sessionId: editingSessionId, title: editTitle.trim() }});
      }
      setEditingSessionId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Enter') saveRename();
      if (e.key === 'Escape') setEditingSessionId(null);
  };

  const handleDelete = (id: string) => {
      // Must close menu first
      setContextMenu(null);
      if (window.confirm("Are you sure you want to delete this session permanently?")) {
          dispatch({ type: 'DELETE_SESSION', payload: id });
      }
  };

  return (
    <aside 
      className={`bg-slate-900 dark:bg-slate-950 h-full flex flex-col border-r border-slate-800 shadow-2xl relative z-20 transition-all duration-300
      ${state.isSidebarCollapsed ? 'w-20' : 'w-64'} min-w-0`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800 h-16 shrink-0">
        {!state.isSidebarCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-slate-100 font-bold tracking-tight truncate">MentorAI</span>
            <span className="text-[10px] bg-slate-800 text-blue-400 px-1.5 py-0.5 rounded border border-slate-700 uppercase tracking-wider">Pro</span>
          </div>
        )}
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className={`text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition ${state.isSidebarCollapsed ? 'mx-auto' : ''}`}
        >
          {state.isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Main Nav */}
      <nav className="p-2 space-y-1 mt-4 shrink-0">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
                ${state.isSidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <item.icon size={20} className="shrink-0" />
              {!state.isSidebarCollapsed && <span className="font-medium text-sm truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Recent Chats */}
      <div className="flex-1 overflow-y-auto mt-6 px-2 min-h-0 relative">
        {!state.isSidebarCollapsed && (
            <div className="flex items-center justify-between px-2 mb-2 sticky top-0 bg-slate-900 dark:bg-slate-950 z-10 py-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent</span>
                <button onClick={handleNewChat} className="text-blue-400 hover:text-blue-300">
                    <Plus size={16} />
                </button>
            </div>
        )}
        
        <div className="space-y-1 pb-4">
            {state.sessions.map(session => (
                <div 
                    key={session.id}
                    onContextMenu={(e) => openContextMenu(e, session.id)}
                    onClick={() => dispatch({ type: 'SET_ACTIVE_SESSION', payload: session.id })}
                    className={`
                        relative group z-10
                        cursor-pointer p-2 rounded-lg transition-colors text-sm truncate flex items-center justify-between
                        ${state.activeSessionId === session.id ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:bg-slate-800/50 border border-transparent'}
                        ${state.isSidebarCollapsed ? 'hidden' : 'block'}
                    `}
                >
                    {editingSessionId === session.id ? (
                        <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                            <input 
                                ref={editInputRef}
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onBlur={saveRename}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-slate-700 text-white px-1.5 py-0.5 rounded outline-none border border-blue-500 text-sm min-w-0"
                            />
                            <button onMouseDown={(e) => { e.preventDefault(); saveRename(); }} className="text-emerald-400 hover:text-white p-0.5"><Check size={14}/></button>
                            <button onMouseDown={(e) => { e.preventDefault(); setEditingSessionId(null); }} className="text-red-400 hover:text-white p-0.5"><X size={14}/></button>
                        </div>
                    ) : (
                        <>
                            <span className="truncate flex-1">{session.title}</span>
                            
                            {/* Inline Actions - Visible on Hover - Replaces clipped dropdown */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault(); 
                                        e.stopPropagation(); 
                                        handleRenameStart(session.id);
                                    }}
                                    className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                                    title="Rename"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDelete(session.id);
                                    }}
                                    className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-red-500 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* Footer */}
      {!state.isSidebarCollapsed && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
              Engineered by <br/> Muhammad Nameer Shah
          </div>
      )}

      {/* Global Context Menu - Using Portal to Escape Stacking Contexts */}
      {contextMenu && createPortal(
        <div 
            className="fixed bg-slate-800 border border-slate-700 shadow-2xl rounded-lg py-1 w-40 animate-fade-in ring-1 ring-white/10 z-[99999]"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => handleAction(e, () => {})}
        >
            <button 
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2 transition-colors"
                onClick={(e) => handleAction(e, () => handleRenameStart(contextMenu.id))}
            >
                <Edit2 size={14} /> Rename
            </button>
            <button 
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 flex items-center gap-2 transition-colors"
                onClick={(e) => handleAction(e, () => handleDelete(contextMenu.id))}
            >
                <Trash2 size={14} /> Delete
            </button>
        </div>,
        document.body
      )}
    </aside>
  );
};