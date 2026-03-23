import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function TextToEmoji({ onAction }: { onAction: () => void }) {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const generateTextToEmoji = () => {
    if (!text) return '';
    const charMap: Record<string, string> = {
      'a': '🅰️', 'b': '🅱️', 'c': '©️', 'd': '🇩', 'e': '🇪', 'f': '🇫', 'g': '🇬', 'h': '🇭',
      'i': 'ℹ️', 'j': '🇯', 'k': '🇰', 'l': '🇱', 'm': 'Ⓜ️', 'n': '🇳', 'o': '🅾️', 'p': '🅿️',
      'q': '🇶', 'r': '®️', 's': '🇸', 't': '🇹', 'u': '🇺', 'v': '🇻', 'w': '🇼', 'x': '✖️',
      'y': '🇾', 'z': '💤', ' ': '  '
    };
    return text.toLowerCase().split('').map(c => charMap[c] || c).join(' ');
  };

  const handleCopy = () => {
    const result = generateTextToEmoji();
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onAction();
  };

  return (
    <div className="p-[20px] space-y-[16px]">
      <div className="bg-[#FFFFFF] dark:bg-[#171717] rounded-[18px] p-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent dark:border-gray-800">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-[#FFFFFF]">Text To Emoji</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#6B7280] mb-1 uppercase tracking-wider">Enter Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-[#F5F6F8] dark:bg-[#1F1F1F] border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-[#FFFFFF] focus:ring-2 focus:ring-[#25D366] outline-none transition-all font-medium"
              placeholder="Type here..."
            />
          </div>

          {text && (
            <div className="bg-[#F5F6F8] dark:bg-[#1F1F1F] rounded-[14px] p-4 min-h-[100px] break-words text-2xl text-center">
              {generateTextToEmoji()}
            </div>
          )}

          <button
            onClick={handleCopy}
            disabled={!text}
            className="w-full bg-[#25D366] hover:bg-[#25D366]/90 active:bg-[#25D366]/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#25D366]/30"
          >
            {!copied && <Copy size={20} />}
            {copied ? 'Copied ✓' : 'Copy Emoji Text'}
          </button>
        </div>
      </div>
    </div>
  );
}
