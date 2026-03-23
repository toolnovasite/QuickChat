import React, { useState, useEffect } from 'react';
import { Copy, Type, Check, Star, Share2, Search, Wand2, Sparkles } from 'lucide-react';
import { generateFancyText, FancyStyle } from '../lib/utils';
import { fancyAlphabets } from '../lib/fancyFonts';

const allStyles = Object.keys(fancyAlphabets) as FancyStyle[];

const CATEGORIES: Record<string, FancyStyle[]> = {
  'All': allStyles,
  'Stylish': ['bold', 'italic', 'boldItalic', 'script', 'boldScript', 'fraktur', 'boldFraktur', 'doubleStruck', 'sansSerif', 'sansSerifBold', 'sansSerifItalic', 'sansSerifBoldItalic', 'monospace', 'smallCaps', 'caps'] as FancyStyle[],
  'Decorative': ['bubble', 'magic', 'knight', 'antropos', 'hacker', 'cyrillic', 'greek', 'math', 'wide', 'boldWide', 'italicWide', 'boldItalicWide'] as FancyStyle[],
  'Symbols': ['boxed', 'circle', 'square', 'currency', 'block', 'bracket', 'emoji', 'stars', 'sparkles', 'diamonds', 'arrows'] as FancyStyle[],
  'Glitch': ['zalgo', 'inverted', 'reversed', 'upsideDown'] as FancyStyle[],
  'Minimal': ['normal', 'raised', 'subscript', 'wavy', 'strikethrough', 'underline', 'slashThrough', 'doubleUnderline', 'crossAboveBelow'] as FancyStyle[]
};

const EFFECTS = [
  { id: 'none', label: 'None' },
  { id: 'underline', label: 'Underline' },
  { id: 'strikethrough', label: 'Strike' },
  { id: 'wavy', label: 'Wavy' },
  { id: 'slashThrough', label: 'Slash' },
  { id: 'doubleUnderline', label: 'Double' },
  { id: 'crossAboveBelow', label: 'Cross' }
];

const DECORATIONS = [
  { id: 'none', label: 'None' },
  { id: 'stars', label: '★ Stars' },
  { id: 'sparkles', label: '✨ Sparkles' },
  { id: 'diamonds', label: '♦ Diamonds' },
  { id: 'arrows', label: '➳ Arrows' },
  { id: 'flowers', label: '✿ Flowers' },
  { id: 'hearts', label: '♥ Hearts' },
  { id: 'music', label: '♫ Music' },
  { id: 'brackets', label: '【 Brackets 】' }
];

export function FancyText({ onAction, onBack }: { onAction: () => void, onBack?: () => void }) {
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<FancyStyle[]>([]);
  const [previewStyle, setPreviewStyle] = useState<FancyStyle>('bold');
  const [toastMessage, setToastMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeEffect, setActiveEffect] = useState<any>('none');
  const [activeDecoration, setActiveDecoration] = useState<any>('none');

  useEffect(() => {
    const savedFavs = localStorage.getItem('fancyTextFavorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {}
    }
  }, []);

  const toggleFavorite = (style: FancyStyle) => {
    let newFavs;
    if (favorites.includes(style)) {
      newFavs = favorites.filter(f => f !== style);
    } else {
      newFavs = [...favorites, style];
    }
    setFavorites(newFavs);
    localStorage.setItem('fancyTextFavorites', JSON.stringify(newFavs));
  };

  const handleCopy = (styleText: string, styleId: string) => {
    if (!styleText) return;
    navigator.clipboard.writeText(styleText);
    setCopiedIndex(styleId);
    showToast('Text copied.');
    onAction();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleShare = async (styleText: string) => {
    if (!styleText) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Fancy Text',
          text: styleText,
        });
      } else {
        handleCopy(styleText, 'share');
      }
    } catch (e) {
      console.error('Error sharing', e);
    }
    onAction();
  };

  const filteredStyles = (CATEGORIES[activeCategory] || allStyles).filter(style => 
    style.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatStyleName = (style: string) => {
    return style.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  };

  const renderFontCard = (style: FancyStyle) => {
    const result = generateFancyText(text || 'Hello World', style, { effect: activeEffect, decoration: activeDecoration });
    const isFav = favorites.includes(style);

    return (
      <div 
        key={style} 
        className="bg-white dark:bg-[#171717] rounded-[16px] p-4 shadow-sm border border-transparent dark:border-gray-800 flex flex-col gap-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 group"
        onClick={() => setPreviewStyle(style)}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 font-semibold">{formatStyleName(style)}</p>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(style); }}
            className={`p-1.5 rounded-full transition-colors ${isFav ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Star size={16} fill={isFav ? "currentColor" : "none"} />
          </button>
        </div>
        
        <div className="overflow-x-auto no-scrollbar pb-1">
          <p className="text-gray-900 dark:text-white font-medium text-xl whitespace-nowrap">
            {result}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={(e) => { e.stopPropagation(); handleCopy(result, style); }}
            className="flex-1 py-2 bg-[#F5F6F8] hover:bg-[#E5E7EB] dark:bg-[#1F1F1F] dark:hover:bg-[#2A2A2A] rounded-[12px] transition-all active:scale-95 text-gray-900 dark:text-white font-medium text-sm flex items-center justify-center gap-2"
          >
            {copiedIndex === style ? (
              <span className="text-[#25D366] flex items-center gap-1"><Check size={16} /> Copied</span>
            ) : (
              <><Copy size={16} /> Copy</>
            )}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleShare(result); }}
            className="p-2 bg-[#F5F6F8] hover:bg-[#E5E7EB] dark:bg-[#1F1F1F] dark:hover:bg-[#2A2A2A] rounded-[12px] transition-all active:scale-95 text-gray-900 dark:text-white"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6 relative pb-24">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4">
          {toastMessage}
        </div>
      )}

      {/* Input Section */}
      <div className="bg-white dark:bg-[#171717] rounded-[18px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent dark:border-gray-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Your Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            className="w-full bg-[#F5F6F8] dark:bg-[#1F1F1F] border-none rounded-[14px] py-4 px-5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#EC4899] outline-none transition-all resize-none font-medium text-lg"
            placeholder="Type your text here..."
          />
        </div>

        {/* Live Preview */}
        <div className="bg-[#F5F6F8] dark:bg-[#1F1F1F] rounded-[14px] p-4 flex items-center justify-center min-h-[80px] overflow-x-auto no-scrollbar">
          <p className="text-2xl text-center text-gray-900 dark:text-white whitespace-nowrap">
            {generateFancyText(text || 'Hello World', previewStyle, { effect: activeEffect, decoration: activeDecoration })}
          </p>
        </div>
      </div>

      {/* Effects & Decorations */}
      <div className="bg-white dark:bg-[#171717] rounded-[18px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent dark:border-gray-800 space-y-5">
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
            <Wand2 size={14} /> Text Effects
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {EFFECTS.map(effect => (
              <button
                key={effect.id}
                onClick={() => setActiveEffect(effect.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeEffect === effect.id 
                    ? 'bg-[#EC4899] text-white shadow-md' 
                    : 'bg-[#F5F6F8] text-gray-700 hover:bg-[#E5E7EB] dark:bg-[#1F1F1F] dark:text-gray-300 dark:hover:bg-[#2A2A2A]'
                }`}
              >
                {effect.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
            <Sparkles size={14} /> Decoration Generator
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {DECORATIONS.map(dec => (
              <button
                key={dec.id}
                onClick={() => setActiveDecoration(dec.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeDecoration === dec.id 
                    ? 'bg-[#EC4899] text-white shadow-md' 
                    : 'bg-[#F5F6F8] text-gray-700 hover:bg-[#E5E7EB] dark:bg-[#1F1F1F] dark:text-gray-300 dark:hover:bg-[#2A2A2A]'
                }`}
              >
                {dec.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {Object.keys(CATEGORIES).map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === category 
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-[#171717] dark:text-gray-400 dark:hover:bg-[#1F1F1F] border border-gray-200 dark:border-gray-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search font styles (e.g., script, bold)..."
          className="w-full bg-white dark:bg-[#171717] border-none rounded-[16px] py-3.5 pl-11 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#EC4899] outline-none transition-all shadow-sm font-medium"
        />
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && !searchQuery && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
            <Star size={16} className="text-yellow-500" fill="currentColor" />
            Favorites
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favorites.map(style => renderFontCard(style))}
          </div>
        </div>
      )}

      {/* All Fonts Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider px-1">
          {searchQuery ? 'Search Results' : 'All Fonts'}
        </h3>
        {filteredStyles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No fonts found matching "{searchQuery}"</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredStyles.map(style => renderFontCard(style))}
          </div>
        )}
      </div>
    </div>
  );
}
