"use client";
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto my-10 px-6 md:px-0 w-full">
      <div className="border-2 border-border-rule bg-surface text-fg overflow-hidden shadow-[4px_4px_0px_var(--rule)]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-rule bg-black/40 font-mono text-xs uppercase tracking-widest text-muted select-none">
          <span>{language || 'code'}</span>
          <button
            onClick={copyToClipboard}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all duration-200 rounded-none bg-transparent ${
              copied
                ? 'border-green-500 text-green-400 bg-green-500/10'
                : 'border-accent/40 text-accent hover:border-accent hover:bg-accent/10'
            }`}
            aria-label="Copy code block"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        {/* Preformatted body */}
        <pre className="p-6 overflow-x-auto font-mono text-sm leading-relaxed text-fg bg-transparent text-left scrollbar-thin">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
