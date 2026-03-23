import React, { useState } from 'react';
import { Type, Copy, Check } from 'lucide-react';

const fonts = [
  { name: 'Serif', transform: (t: string) => t }, // Placeholder for actual transformation
  { name: 'Monospace', transform: (t: string) => t.split('').map(c => c).join('') },
  { name: 'Cursive', transform: (t: string) => t },
  { name: 'Bold', transform: (t: string) => t },
];

// Re-using the fancyAlphabets from utils for simplicity or just basic ones
import { generateFancyText } from '../lib/utils';

export function FontPreview({ onAction }: { onAction: () => void }) {
  const [text, setText] = useState('Preview Text');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const previewStyles = ['bold', 'italic', 'script', 'doubleStruck', 'monospace', 'circle', 'square'];

  const handleCopy = (formattedText: string, index: number) => {
    navigator.clipboard.writeText(formattedText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    onAction();
  };

  return (
    <div className="p-[20px] space-y-[16px]">
      <div className="bg-[#FFFFFF] dark:bg-[#171717] rounded-[18px] p-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent dark:border-gray-800">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-[#FFFFFF] flex items-center gap-2">
          <Type size={20} className="text-[#C084FC]" />
          Font Preview
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#6B7280] mb-1 uppercase tracking-wider">Enter Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-[#F5F6F8] dark:bg-[#1F1F1F] border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-[#FFFFFF] focus:ring-2 focus:ring-[#C084FC] outline-none transition-all font-medium"
              placeholder="Type something..."
            />
          </div>

          <div className="space-y-3 mt-4">
            {previewStyles.map((style, index) => {
              const formatted = generateFancyText(text || 'Preview Text', style as any);
              return (
                <div key={style} className="flex items-center justify-between bg-[#F5F6F8] dark:bg-[#1F1F1F] p-4 rounded-[14px]">
                  <span className="text-lg text-gray-900 dark:text-white overflow-hidden text-ellipsis whitespace-nowrap mr-4">
                    {formatted}
                  </span>
                  <button
                    onClick={() => handleCopy(formatted, index)}
                    className="p-2 bg-white dark:bg-[#2A2A2A] rounded-full text-[#C084FC] hover:bg-[#C084FC] hover:text-white transition-colors shadow-sm flex items-center gap-1 px-3"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check size={16} />
                        <span className="text-xs font-medium">Copied ✓</span>
                      </>
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
