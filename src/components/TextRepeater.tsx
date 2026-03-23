import React, { useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';

export function TextRepeater({ onAction }: { onAction: () => void }) {
  const [text, setText] = useState('');
  const [count, setCount] = useState(10);
  const [separator, setSeparator] = useState('new-line');
  const [customSeparator, setCustomSeparator] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!text || count < 1 || count > 10000) return;

    let sep = '';
    switch (separator) {
      case 'space': sep = ' '; break;
      case 'comma': sep = ', '; break;
      case 'new-line': sep = '\n'; break;
      case 'custom': sep = customSeparator; break;
      default: sep = '';
    }

    const repeated = Array(count).fill(text).join(sep);
    setResult(repeated);
    onAction();
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white dark:bg-card-dark rounded-[18px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Text Repeater</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Text to Repeat</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-bg-light dark:bg-input-dark border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              placeholder="Enter text..."
            />
          </div>

          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Repeat Count</label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 0)}
                min="1"
                max="10000"
                className="w-full bg-bg-light dark:bg-input-dark border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Separator</label>
              <select
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                className="w-full bg-bg-light dark:bg-input-dark border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all font-medium appearance-none"
              >
                <option value="none">None</option>
                <option value="space">Space</option>
                <option value="comma">Comma</option>
                <option value="new-line">New Line</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {separator === 'custom' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Custom Separator</label>
              <input
                type="text"
                value={customSeparator}
                onChange={(e) => setCustomSeparator(e.target.value)}
                className="w-full bg-bg-light dark:bg-input-dark border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                placeholder="e.g. - or |"
              />
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!text || count < 1 || count > 10000}
            className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/30"
          >
            <RefreshCw size={20} />
            Generate Text
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white dark:bg-card-dark rounded-[18px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white">Result</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {!copied && <Copy size={16} />}
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
          <div className="bg-bg-light dark:bg-input-dark rounded-[14px] p-4 max-h-60 overflow-y-auto">
            <pre className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap font-sans text-sm">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
