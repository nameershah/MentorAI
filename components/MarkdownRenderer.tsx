import React, { useState, useEffect } from 'react';
import { Copy, Check, Brain } from 'lucide-react';
import { marked } from 'marked';

interface MarkdownProps {
  content: string;
}

// Configure marked for safety and standard GFM features
marked.use({
  gfm: true,
  breaks: true,
});

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
                    theme: 'base',
                    securityLevel: 'loose',
                    themeVariables: {
                        darkMode: isDark,
                        primaryColor: '#3b82f6',
                        primaryTextColor: isDark ? '#f8fafc' : '#0f172a',
                        primaryBorderColor: '#60a5fa',
                        lineColor: isDark ? '#94a3b8' : '#475569',
                        secondaryColor: isDark ? '#1e293b' : '#f1f5f9',
                        tertiaryColor: isDark ? '#0f172a' : '#ffffff',
                        background: 'transparent',
                        mainBkg: 'transparent',
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
    <div className="my-5 rounded-xl overflow-hidden border border-slate-700 bg-[#1e1e1e] shadow-lg relative group">
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

  // Extract thinking content if present (before markdown processing)
  const thinkingMatch = content.match(/<thinking>([\s\S]*?)<\/thinking>/);
  if (thinkingMatch) {
      thinkingContent = thinkingMatch[1].trim();
      displayContent = content.replace(thinkingMatch[0], '').trim();
  }

  // Pre-process LaTeX to protect it from marked (fake LaTeX tokens)
  const mathBlocks: string[] = [];
  const mathInlines: string[] = [];

  // Protect Block Math $$ ... $$
  displayContent = displayContent.replace(/\$\$([\s\S]*?)\$\$/g, (match, equation) => {
      mathBlocks.push(equation);
      return `__MATH_BLOCK_${mathBlocks.length - 1}__`;
  });

  // Protect Inline Math $ ... $
  displayContent = displayContent.replace(/(^|\s)\$([^$\s][^$]*?[^$\s])\$(?=\s|[.,!?]|$)/g, (match, prefix, equation) => {
      mathInlines.push(equation);
      return `${prefix}__MATH_INLINE_${mathInlines.length - 1}__`;
  });

  // Split by Code Blocks (```) to use custom React Components for code
  const parts = displayContent.split(/(```[\s\S]*?```)/g);

  return (
    <div className="markdown-body text-slate-800 dark:text-slate-200 leading-7 font-sans">
      {thinkingContent && <ThinkingBlock content={thinkingContent} />}

      {parts.map((part, index) => {
        // Handle Code Blocks
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.split('\n');
          const language = lines[0].replace('```', '').trim();
          const code = lines.slice(1, -1).join('\n');
          
          if (language === 'mermaid') {
              return <MermaidBlock key={index} code={code} />;
          }
          return <CodeBlock key={index} language={language} code={code} />;
        }

        // Handle Text Parts using marked
        if (!part.trim()) return null;

        // 1. Parse Markdown to HTML
        let html = marked.parse(part, { async: false }) as string;

        // 2. Restore LaTeX tokens
        // Restore Blocks
        html = html.replace(/__MATH_BLOCK_(\d+)__/g, (match, idx) => {
            const eq = mathBlocks[parseInt(idx)];
            return `<div class="font-serif text-lg py-3 px-4 my-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg border-l-4 border-blue-500 overflow-x-auto text-blue-900 dark:text-blue-200 text-center shadow-sm">\$\$${eq}\$\$</div>`;
        });

        // Restore Inlines
        html = html.replace(/__MATH_INLINE_(\d+)__/g, (match, idx) => {
            const eq = mathInlines[parseInt(idx)];
            return `<span class="font-serif text-blue-800 dark:text-blue-300 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded inline-block shadow-sm text-sm">\$${eq}\$</span>`;
        });

        return (
            <div 
                key={index} 
                dangerouslySetInnerHTML={{ __html: html }} 
                className="prose prose-slate dark:prose-invert max-w-none prose-p:my-3 prose-headings:mb-3 prose-headings:mt-6 prose-ul:my-3 prose-li:my-1" 
            />
        );
      })}
    </div>
  );
};
