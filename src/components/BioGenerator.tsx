import React, { useState } from 'react';
import { Copy, RefreshCw, Check, UserCircle } from 'lucide-react';

const bios = {
  Attitude: [
    "I'm not changed, I just grew up.",
    "My attitude is based on how you treat me.",
    "I don't have an attitude problem, you have a perception problem.",
    "Silence is the best response to a fool.",
    "I am who I am, your approval is not needed."
  ],
  Funny: [
    "I'm not lazy, I'm on energy saving mode.",
    "Life is short. Smile while you still have teeth.",
    "I followed my heart, it led me to the fridge.",
    "My bed is a magical place where I suddenly remember everything I forgot to do.",
    "I put the 'elusive' in 'exclusive'."
  ],
  Love: [
    "You are my today and all of my tomorrows.",
    "Together is my favorite place to be.",
    "Every love story is beautiful, but ours is my favorite.",
    "You stole my heart, but I'll let you keep it.",
    "I look at you and see the rest of my life in front of my eyes."
  ],
  Professional: [
    "Striving for excellence in everything I do.",
    "Turning ideas into reality.",
    "Passionate about learning and growing.",
    "Focused on the goal, not the obstacles.",
    "Creating value through innovation."
  ]
};

type Category = keyof typeof bios;

export function BioGenerator({ onAction }: { onAction: () => void }) {
  const [category, setCategory] = useState<Category>('Attitude');
  const [currentBio, setCurrentBio] = useState(bios['Attitude'][0]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const list = bios[category];
    const randomBio = list[Math.floor(Math.random() * list.length)];
    setCurrentBio(randomBio);
    onAction();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentBio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white dark:bg-card-dark rounded-[18px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <UserCircle size={20} className="text-primary" />
          WhatsApp Bio Generator
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Select Category</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(bios) as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setCurrentBio(bios[cat][0]);
                  }}
                  className={`py-2 px-3 rounded-[10px] text-sm font-semibold transition-colors ${
                    category === cat 
                      ? 'bg-primary text-white' 
                      : 'bg-bg-light dark:bg-input-dark text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-bg-light dark:bg-input-dark rounded-[14px] p-6 text-center relative min-h-[120px] flex items-center justify-center">
            <p className="text-lg font-medium text-gray-900 dark:text-white italic">"{currentBio}"</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={18} />
              Random
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/30"
            >
              {!copied && <Copy size={18} />}
              {copied ? 'Copied ✓' : 'Copy Bio'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
