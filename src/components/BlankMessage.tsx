import React, { useState } from 'react';
import { Copy, Send, Check, AlignLeft } from 'lucide-react';

export function BlankMessage({ onAction }: { onAction: () => void }) {
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState(false);

  const generateBlank = () => {
    // Hangul Filler character works well for blank messages on WhatsApp
    return Array(count).fill('\u3164').join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateBlank());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onAction();
  };

  const handleSend = () => {
    const text = encodeURIComponent(generateBlank());
    window.open(`https://wa.me/?text=${text}`, '_blank');
    onAction();
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-[#FFFFFF] dark:bg-[#171717] rounded-[18px] p-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent dark:border-gray-800">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-[#FFFFFF]">Blank Message Sender</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#6B7280] mb-1 uppercase tracking-wider">Number of Blank Rows</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              min="1"
              max="10000"
              className="w-full bg-[#F5F6F8] dark:bg-[#1F1F1F] border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-[#FFFFFF] focus:ring-2 focus:ring-[#25D366] outline-none transition-all font-medium"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors"
            >
              {!copied && <Copy size={20} />}
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
            <button
              onClick={handleSend}
              className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 active:bg-[#25D366]/80 text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#25D366]/30"
            >
              <Send size={20} />
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-[#171717] rounded-[18px] p-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent dark:border-gray-800">
        <h3 className="font-bold text-gray-900 dark:text-[#FFFFFF] mb-2 flex items-center gap-2">
          <AlignLeft size={18} className="text-[#25D366]" />
          How it works
        </h3>
        <p className="text-[13px] text-[#6B7280] dark:text-gray-400 leading-relaxed">
          WhatsApp normally doesn't allow sending empty messages. This tool uses special invisible characters (Hangul Filler) that WhatsApp recognizes as text, allowing you to send completely blank messages to your friends for fun!
        </p>
      </div>
    </div>
  );
}
