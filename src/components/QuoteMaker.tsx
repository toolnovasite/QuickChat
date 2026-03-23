import React, { useState } from 'react';
import { Quote, Copy, RefreshCw, Share2 } from 'lucide-react';

const quotes = [
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Everything you've ever wanted is on the other side of fear.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.",
  "Don't watch the clock; do what it does. Keep going."
];

export function QuoteMaker({ onAction }: { onAction: () => void }) {
  const [quote, setQuote] = useState(quotes[0]);
  const [copied, setCopied] = useState(false);

  const handleRandom = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(quote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onAction();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Quote',
        text: quote,
      }).catch(console.error);
    }
  };

  return (
    <div className="p-[20px] space-y-[16px]">
      <div className="bg-[#FFFFFF] dark:bg-[#171717] rounded-[18px] p-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent dark:border-gray-800">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-[#FFFFFF] flex items-center gap-2">
          <Quote size={20} className="text-[#F59E0B]" />
          Quote Maker
        </h2>
        
        <div className="space-y-4">
          <div className="bg-[#F5F6F8] dark:bg-[#1F1F1F] rounded-[14px] p-6 min-h-[150px] flex items-center justify-center text-center relative">
            <Quote size={40} className="absolute top-4 left-4 text-gray-300 dark:text-gray-700 opacity-50" />
            <p className="text-lg font-medium text-gray-900 dark:text-white italic z-10">"{quote}"</p>
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
              onClick={handleShare}
              className="flex-1 bg-[#F5F6F8] hover:bg-gray-200 dark:bg-[#1F1F1F] dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 size={18} />
              Share
            </button>
          </div>
          <button
            onClick={handleCopy}
            className="w-full bg-[#F59E0B] hover:bg-[#F59E0B]/90 active:bg-[#F59E0B]/80 text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#F59E0B]/30"
          >
            {!copied && <Copy size={20} />}
            {copied ? 'Copied ✓' : 'Copy Quote'}
          </button>
        </div>
      </div>
    </div>
  );
}
