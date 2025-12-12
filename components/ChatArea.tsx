import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useApp } from '../context/appContext';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Send, Mic, Square, Paperclip, Volume2, VolumeX, Sparkles, Lightbulb, FileText, Loader2, ArrowDown, StopCircle, FolderOpen, Image as ImageIcon, X } from 'lucide-react';
import { streamChatMessage } from '../services/geminiService';
import { Link } from 'react-router-dom';

export const ChatArea: React.FC = () => {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Multimodal State
  const [imageAttachment, setImageAttachment] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isAtBottomRef = useRef(true); 
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeSession = state.sessions.find(s => s.id === state.activeSessionId);
  const pinnedDoc = state.documents.find(d => d.id === state.pinnedDocumentId);

  const rawSuggestions = [
      "Summarize the attached document", 
      "Create a study quiz", 
      "Explain this concept like I'm 5", 
      "Solve a calculus problem",
  ];
  const uniqueSuggestions = Array.from(new Set(rawSuggestions));

  // --- Scroll Logic ---
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 150; // Increased threshold
    isAtBottomRef.current = isBottom;
    setShowScrollButton(!isBottom);
  };

  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current) {
        if (force || isAtBottomRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [activeSession?.messages, activeSession?.updatedAt]);

  useLayoutEffect(() => {
      scrollToBottom(true);
  }, [activeSession?.id]);

  // --- Voice & Audio ---
  useEffect(() => {
      if (!state.settings.autoRead) {
          window.speechSynthesis.cancel();
      }
      return () => {
          window.speechSynthesis.cancel();
      };
  }, [state.settings.autoRead]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInput(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/<thinking>[\s\S]*?<\/thinking>/, '').replace(/```[\s\S]*?```/g, 'Code block omitted.').replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Daniel') || v.name.includes('Samantha') || v.lang.startsWith('en')) || voices[0];
    if(preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  };

  // --- Image Handling ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 5 * 1024 * 1024) {
              dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: "Image too large (Max 5MB)" }});
              return;
          }
          const reader = new FileReader();
          reader.onload = (e) => setImageAttachment(e.target?.result as string);
          reader.readAsDataURL(file);
      }
  };

  // --- Messaging (Streaming) ---
  const handleStop = () => {
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
          setIsSending(false);
      }
  };

  const handleSend = async (txt: string = input) => {
    if ((!txt.trim() && !imageAttachment) || !activeSession || isSending) return;

    // 1. Add User Message
    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: txt,
      timestamp: Date.now(),
      attachments: imageAttachment ? [{ name: 'Image', type: 'image', content: imageAttachment, size: 0 }] : undefined
    };
    dispatch({ type: 'ADD_MESSAGE', payload: { sessionId: activeSession.id, message: userMsg } });
    setInput('');
    setImageAttachment(null);
    setIsSending(true);
    isAtBottomRef.current = true;
    scrollToBottom(true);

    // 2. Add Placeholder Bot Message
    const botMsgId = crypto.randomUUID();
    const botMsg = {
      id: botMsgId,
      role: 'model' as const,
      content: '', 
      timestamp: Date.now(),
      isThinking: true
    };
    dispatch({ type: 'ADD_MESSAGE', payload: { sessionId: activeSession.id, message: botMsg } });

    // 3. Setup Abort Controller
    abortControllerRef.current = new AbortController();

    try {
      const history = activeSession.messages.map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
      }));

      let accumulatedText = "";
      const stream = streamChatMessage(
          history, 
          userMsg.content, 
          pinnedDoc, 
          state.documents, 
          abortControllerRef.current.signal,
          userMsg.attachments?.[0]?.content // Pass image base64 if exists
      );

      for await (const chunk of stream) {
          accumulatedText += chunk;
          dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: { sessionId: activeSession.id, content: accumulatedText } });
      }

      if (state.settings.autoRead) {
          speak(accumulatedText);
      }

    } catch (error: any) {
      if (error.name !== 'AbortError') {
          dispatch({ type: 'ADD_TOAST', payload: { id: Date.now().toString(), type: 'error', message: error.message || "Network Error" }});
          dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: { sessionId: activeSession.id, content: "⚠️ Error generating response." } });
      }
    } finally {
      setIsSending(false);
      abortControllerRef.current = null;
    }
  };

  if (!activeSession) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-8 text-center min-w-0">
        <h2 className="text-3xl font-light text-slate-700 dark:text-slate-200 mb-4">Welcome to MentorAI</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">Select a chat from the sidebar or start a new session.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative min-w-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Header */}
      <div className="glass-panel px-6 py-4 flex justify-between items-center z-10 sticky top-0 shrink-0 border-b border-slate-200 dark:border-slate-800">
        <div className="min-w-0 flex-1 mr-4">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{activeSession.title}</h2>
            {pinnedDoc && (
                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mt-0.5 bg-blue-50 dark:bg-blue-900/30 w-fit px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800 animate-fade-in">
                    <Paperclip size={12} />
                    <span className="truncate max-w-[200px]">Context: {pinnedDoc.name}</span>
                </div>
            )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
           <button 
             onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { autoRead: !state.settings.autoRead } })}
             className={`p-2 rounded-full transition-colors ${state.settings.autoRead ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
             title={state.settings.autoRead ? "Mute Auto-Read" : "Enable Auto-Read"}
           >
             {state.settings.autoRead ? <Volume2 size={18} /> : <VolumeX size={18} />}
           </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6 min-h-0 scroll-smooth"
      >
        {activeSession.messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in mt-10">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Hello! I am <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">MentorAI</span>.
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mb-8 leading-relaxed">
              I can help you study, summarize documents, solve math problems, and more.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                {uniqueSuggestions.map((suggestion, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleSend(suggestion)}
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm flex items-center gap-2"
                    >
                        <Lightbulb size={14} />
                        {suggestion}
                    </button>
                ))}
            </div>
          </div>
        )}

        {activeSession.messages.map((msg, idx) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[90%] md:max-w-[80%] rounded-2xl p-5 shadow-sm border text-base transition-all
              ${msg.role === 'user' ? 'bg-blue-600 text-white border-transparent dark:bg-blue-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100'}
            `}>
              {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mb-4">
                      <img 
                          src={msg.attachments[0].content || ''} 
                          alt="Attachment" 
                          className="max-h-60 rounded-lg border border-white/20"
                      />
                  </div>
              )}

              {/* If empty and sending, show Thinking */}
              {msg.role === 'model' && msg.content === '' && isSending && idx === activeSession.messages.length - 1 ? (
                  <div className="flex items-center gap-2 text-slate-500">
                      <Loader2 className="animate-spin" size={18} />
                      <span className="text-sm">Thinking...</span>
                  </div>
              ) : (
                  msg.role === 'model' ? <MarkdownRenderer content={msg.content} /> : <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              )}
              
              {msg.role === 'model' && msg.content !== '' && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => speak(msg.content)} className="text-slate-400 hover:text-blue-500 transition-colors" title="Read Aloud">
                          <Volume2 size={16} />
                      </button>
                  </div>
              )}
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {showScrollButton && (
          <button 
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-24 right-6 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition animate-slide-up z-30"
          >
              <ArrowDown size={20} />
          </button>
      )}

      {/* Input */}
      <div className="p-4 md:p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 sticky bottom-0 z-20 shrink-0">
        <div className="relative flex items-end gap-3 max-w-5xl mx-auto">
          
          <Link to="/documents" className="mb-2 p-3 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" title="Manage Documents">
            <FolderOpen size={24} />
          </Link>

          <div className="flex-1 relative bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all shadow-inner">
             {/* Pinned Document Indicator */}
             {pinnedDoc && (
                 <div className="absolute -top-10 left-0 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 text-xs px-3 py-1.5 rounded-t-lg border border-b-0 border-blue-200 dark:border-blue-800 flex items-center gap-2 animate-slide-up shadow-sm">
                     <FileText size={12} />
                     Using: <span className="font-semibold">{pinnedDoc.name}</span>
                 </div>
             )}

             {/* Image Attachment Preview */}
             {imageAttachment && (
                 <div className="m-3 mb-0 relative w-fit">
                     <img src={imageAttachment} alt="Preview" className="h-16 rounded-lg border border-slate-300 dark:border-slate-600" />
                     <button 
                         onClick={() => setImageAttachment(null)} 
                         className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors"
                     >
                         <X size={12} />
                     </button>
                 </div>
             )}

             <textarea 
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={isListening ? "Listening..." : "Ask anything... (Ctrl+K to focus)"}
                aria-label="Chat message input"
                className={`w-full bg-transparent border-0 rounded-2xl px-4 py-3.5 pr-24 resize-none focus:ring-0 min-h-[56px] max-h-32 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500
                  ${isListening ? 'placeholder:text-red-500' : ''}
                `}
                rows={1}
                style={{height: 'auto', minHeight: '56px'}}
             />
             
             {/* Input Actions */}
             <div className="absolute right-2 bottom-2 flex gap-1">
                 <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    title="Upload Image"
                    aria-label="Upload Image"
                 >
                    <ImageIcon size={20} />
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                 </button>

                 <button 
                    onClick={toggleVoice}
                    className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-md' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    title={isListening ? "Stop Listening" : "Start Voice Input"}
                    aria-label={isListening ? "Stop Listening" : "Start Voice Input"}
                 >
                    {isListening ? <Square size={18} fill="currentColor" /> : <Mic size={20} />}
                 </button>
             </div>
          </div>

          {isSending ? (
              <button 
                onClick={handleStop}
                className="p-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-lg active:scale-95 flex items-center justify-center min-w-[56px]"
                title="Stop Generating"
              >
                <StopCircle size={22} />
              </button>
          ) : (
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() && !imageAttachment}
                aria-label="Send Message"
                className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20 active:scale-95 flex items-center justify-center min-w-[56px]"
              >
                <Send size={22} />
              </button>
          )}
        </div>
      </div>
    </div>
  );
};