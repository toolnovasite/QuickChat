import React, { useState } from 'react';
import { Copy, RefreshCw, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

const emojiList = [
  "😀","😃","😄","😁","😂","🤣","😍","😘","😎","🔥",
  "❤️","👍","👏","🥳","🤩","😜","😇","😈","💯","✨",
  "🎉","🚀","🌟","💎","🐶","🐱","🍕","🍔","🍟","🍩",
  "🍉","⚽","🏀","🎮","🎧","📱","💻","📸","✈️","🌈"
];

const combos = [
  "🔥🔥🔥",
  "😂😂😂",
  "😍❤️😍",
  "🎉🥳🎉",
  "💯🔥💯"
];

const emojiCategories = [
  { id: 'smileys', name: 'Smileys', emojis: ['😀', '😂', '🤣', '😍', '😎', '😭', '😡', '🥺', '🥳', '🤔', '😴', '🤯', '😇', '🙃', '😉', '😋', '😜', '🤪', '🤫', '🤭'] },
  { id: 'love', name: 'Love', emojis: ['❤️', '💔', '💕', '💖', '💗', '💘', '💙', '💜', '🖤', '🤍', '🤎', '❤️‍🔥', '💌', '💟', '❣️', '😘', '🥰', '😻', '💑', '👩‍❤️‍💋‍👨'] },
  { id: 'hands', name: 'Hands', emojis: ['👍', '👎', '👏', '🙌', '🤝', '🙏', '✌️', '🤞', '🤌', '🤏', '🤘', '🤙', '👋', '🤚', '🖐️', '🖖', '💪', '🦾', '✍️', '💅'] },
  { id: 'animals', name: 'Animals', emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐺'] },
  { id: 'food', name: 'Food', emojis: ['🍎', '🍔', '🍕', '🌮', '🍣', '🍩', '☕', '🍺', '🍿', '🍟', '🍦', '🍰', '🍉', '🍇', '🍓', '🥑', '🥕', '🥐', '🥞', '🧀'] },
  { id: 'symbols', name: 'Symbols', emojis: ['✨', '🔥', '💯', '💢', '💥', '💫', '💦', '💨', '⭐', '🌟', '⚡', '🎉', '🎊', '🎈', '🏆', '🥇', '💎', '🔮', '🧿', '💡'] },
];

export function EmojiGenerator({ onAction }: { onAction: () => void }) {
  const [generatedEmoji, setGeneratedEmoji] = useState('😀🔥✨');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState(emojiCategories[0].id);

  const generateRandomEmoji = () => {
    let result = "";
    for(let i=0;i<5;i++){
      result += emojiList[Math.floor(Math.random()*emojiList.length)];
    }
    setGeneratedEmoji(result);
    onAction();
  };

  const generateCombo = () => {
    const randomCombo = combos[Math.floor(Math.random() * combos.length)];
    setGeneratedEmoji(randomCombo);
    onAction();
  };

  const handleCopy = () => {
    if (!generatedEmoji) return;
    navigator.clipboard.writeText(generatedEmoji);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onAction();
  };

  const handleTapEmoji = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setToastMessage('Emoji Copied ✓');
    setTimeout(() => setToastMessage(''), 2000);
    onAction();
  };

  const activeEmojis = emojiCategories.find(c => c.id === activeCategory)?.emojis || [];

  return (
    <div className="p-4 space-y-6 relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4">
          {toastMessage}
        </div>
      )}

      <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent dark:border-gray-800">
        
        {/* Emoji Preview Box */}
        <div 
          className="w-full rounded-[16px] flex items-center justify-center text-[32px] bg-[#F3F4F6] dark:bg-[#0F172A] dark:text-white"
          style={{ height: '120px' }}
        >
          {generatedEmoji}
        </div>

        {/* Button Row */}
        <div className="flex flex-wrap gap-[12px] mt-[16px]">
          <button
            onClick={generateRandomEmoji}
            className="flex-1 flex items-center justify-center gap-1 font-medium transition-colors text-sm bg-[#25D366] text-white rounded-[20px] py-[10px] px-[18px]"
          >
            <RefreshCw size={16} />
            Random
          </button>
          
          <button
            onClick={generateCombo}
            className="flex-1 flex items-center justify-center gap-1 font-medium transition-colors text-sm bg-[#8B5CF6] text-white rounded-[20px] py-[10px] px-[18px] whitespace-nowrap"
          >
            <Sparkles size={16} />
            Random Emoji Combo
          </button>

          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1 font-medium transition-colors text-sm bg-[#E5E7EB] dark:bg-gray-700 text-[#111827] dark:text-white rounded-[20px] py-[10px] px-[18px]"
          >
            <Copy size={16} />
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>

        {/* Emoji Category Chips */}
        <div className="mt-6">
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
            {emojiCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "whitespace-nowrap font-medium transition-colors rounded-[20px] py-[8px] px-[12px] text-[12px]",
                  activeCategory === category.id 
                    ? "bg-[#25D366] text-white" 
                    : "bg-[#F3F4F6] dark:bg-[#0F172A] text-gray-700 dark:text-gray-300"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div 
            className="grid gap-[10px] mt-[14px]"
            style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}
          >
            {activeEmojis.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => handleTapEmoji(emoji)}
                className="aspect-square flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors active:scale-95 text-[28px]"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
