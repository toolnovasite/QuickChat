import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export function EmojiCombiner({ onAction }: { onAction: () => void }) {
  const [emoji1, setEmoji1] = useState('😀');
  const [emoji2, setEmoji2] = useState('🔥');
  const [copied, setCopied] = useState(false);

  const combinations = [
    ['😀', '🔥'], ['😎', '👍'], ['❤️', '🔥'], ['😂', '💯'], ['🥺', '👉👈'],
    ['🤔', '💭'], ['🚀', '🌕'], ['🎉', '🎊'], ['🙏', '✨'], ['👀', '👄']
  ];

  const handleRandom = () => {
    const combo = combinations[Math.floor(Math.random() * combinations.length)];
    setEmoji1(combo[0]);
    setEmoji2(combo[1]);
  };

  const combined = `${emoji1}${emoji2}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(combined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onAction();
  };

  return (
    <div className="p-[20px] space-y-[16px]">
      <div className="bg-[#FFFFFF] dark:bg-[#171717] rounded-[18px] p-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent dark:border-gray-800">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-[#FFFFFF]">Emoji Combiner</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[13px] font-semibold text-[#6B7280] mb-1 uppercase tracking-wider">Emoji 1</label>
              <input
                type="text"
                value={emoji1}
                onChange={(e) => setEmoji1(e.target.value)}
                maxLength={2}
                className="w-full bg-[#F5F6F8] dark:bg-[#1F1F1F] border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-[#FFFFFF] focus:ring-2 focus:ring-[#25D366] outline-none transition-all font-medium text-center text-2xl"
              />
            </div>
            <div className="flex items-center justify-center pt-6 font-bold text-gray-400">+</div>
            <div className="flex-1">
              <label className="block text-[13px] font-semibold text-[#6B7280] mb-1 uppercase tracking-wider">Emoji 2</label>
              <input
                type="text"
                value={emoji2}
                onChange={(e) => setEmoji2(e.target.value)}
                maxLength={2}
                className="w-full bg-[#F5F6F8] dark:bg-[#1F1F1F] border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-[#FFFFFF] focus:ring-2 focus:ring-[#25D366] outline-none transition-all font-medium text-center text-2xl"
              />
            </div>
          </div>

          <div className="bg-[#F5F6F8] dark:bg-[#1F1F1F] rounded-[14px] p-6 min-h-[120px] flex items-center justify-center text-6xl">
            {combined}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRandom}
              className="flex-1 bg-[#F5F6F8] hover:bg-gray-200 dark:bg-[#1F1F1F] dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={18} />
              Random
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 active:bg-[#25D366]/80 text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#25D366]/30"
            >
              {!copied && <Copy size={20} />}
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
