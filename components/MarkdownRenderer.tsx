import React, { useState, useEffect } from 'react';
import { Copy, Check, Brain } from 'lucide-react';

interface MarkdownProps {
  content: string;
}

// Robust Markdown & LaTeX Processing
const processMarkdown = (text: string) => {
  let html = text;

  // 1. Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 mt-6 mb-3">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-6 mb-4">$1</h1>');

  // 2. Bold (**text**) - Fixed regex to capture content non-greedily
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');

  // 3. Italic (*text*)
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-700 dark:text-slate-300">$1</em>');

  // 4. Lists (- item)
  html = html.replace(/^\s*-\s+(.*)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300 marker:text-blue-500">$1</li>');

  // 5. LaTeX Block ($$ ... $$)
  // Use [\s\S] to match across lines
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, equation) => {
      return `<div class="font-serif text-lg py-3 px-4 my-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg border-l-4 border-blue-500 overflow-x-auto text-blue-900 dark:text-blue-200 text-center shadow-sm">${equation}</div>`;
  });

  // 6. LaTeX Inline ($ ... $)
  // IMPROVED: Strict boundary checks to avoid matching prices (e.g. "$5 and $10")
  // Requires that the $ is NOT followed by a space, and NOT preceded by a word character if possible, 
  // but regex in JS is limited. We use a pattern that enforces content between $...$
  html = html.replace(/(^|\s)\$([^$\s][^$]*?[^$\s])\$(?=\s|[.,!?]|$)/g, (match, prefix, equation) => {
      return `${prefix}<span class="font-serif text-blue-800 dark:text-blue-300 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded inline-block shadow-sm text-sm">${equation}</span>`;
  });

  return html;
};

const MermaidBlock: React.FC<{ code: string }> = ({ code }) => {
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        // Detect Dark Mode
        const isDark = document.documentElement.classList.contains('dark');
        
        // Dynamic import from ESM CDN
        import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs')
            .then(mermaid => {
                mermaid.default.initialize({ 
                    startOnLoad: false, 
                    theme: 'base', // CRITICAL: Use base theme to allow full variable override
                    securityLevel: 'loose',
                    themeVariables: {
                        darkMode: isDark,
                        primaryColor: '#3b82f6', // Tailwind blue-500
                        primaryTextColor: isDark ? '#f8fafc' : '#0f172a',
                        primaryBorderColor: '#60a5fa',
                        lineColor: isDark ? '#94a3b8' : '#475569',
                        secondaryColor: isDark ? '#1e293b' : '#f1f5f9',
                        tertiaryColor: isDark ? '#0f172a' : '#ffffff',
                        background: 'transparent', // CRITICAL: No white background
                        mainBkg: 'transparent',    // CRITICAL
                        nodeBorder: isDark ? '#475569' : '#cbd5e1',
                        clusterBkg: 'transparent',
                        edgeLabelBackground: isDark ? '#1e293b' : '#ffffff',
                    }
                });
                mermaid.default.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, code)
                    .then((result: any) => {
                         setSvg(result.svg);
                    })
                    .catch((e: any) => {
                         console.error("Mermaid Render Error", e);
                         setError(true);
                    });
            });
    }, [code]);

    if (error) return <CodeBlock language="mermaid" code={code} />;

    return (
        <div className="my-4 p-4 bg-transparent flex justify-center w-full overflow-x-auto mermaid-container">
            {svg ? (
              <div 
                dangerouslySetInnerHTML={{ __html: svg }} 
                className="w-full flex justify-center min-w-0" 
              />
            ) : (
              <div className="text-xs text-slate-400 animate-pulse flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                Rendering Visual...
              </div>
            )}
        </div>
    );
};

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-slate-700 bg-[#1e1e1e] shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-[#2d2d2d] border-b border-slate-700/50">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{language || 'CODE'}</span>
        <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-700">
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-slate-300 leading-relaxed whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const ThinkingBlock: React.FC<{ content: string }> = ({ content }) => {
    return (
        <details className="mb-4 group">
            <summary className="cursor-pointer list-none">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-100 dark:border-indigo-800">
                    <Brain size={14} />
                    <span>View Reasoning Process</span>
                </div>
            </summary>
            <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 text-sm italic leading-relaxed animate-fade-in">
                {content}
            </div>
        </details>
    );
};

export const MarkdownRenderer: React.FC<MarkdownProps> = ({ content }) => {
  if (!content) return null;
  
  let thinkingContent = null;
  let displayContent = content;

  // Extract thinking content if present
  const thinkingMatch = content.match(/<thinking>([\s\S]*?)<\/thinking>/);
  if (thinkingMatch) {
      thinkingContent = thinkingMatch[1].trim();
      displayContent = content.replace(thinkingMatch[0], '').trim();
  }

  const parts = displayContent.split(/(```[\s\S]*?```)/g);

  return (
    <div className="markdown-body text-slate-800 dark:text-slate-200 leading-7 font-sans">
      {thinkingContent && <ThinkingBlock content={thinkingContent} />}

      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.split('\n');
          const language = lines[0].replace('```', '').trim();
          const code = lines.slice(1, -1).join('\n');
          
          if (language === 'mermaid') {
              return <MermaidBlock key={index} code={code} />;
          }
          return <CodeBlock key={index} language={language} code={code} />;
        }

        const processedHtml = processMarkdown(part);
        
        return (
            <div key={index} dangerouslySetInnerHTML={{ __html: processedHtml }} className="whitespace-pre-wrap mb-4" />
        );
      })}
    </div>
  );
};