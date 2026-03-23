import React, { useState, useEffect, useMemo } from 'react';
import { Hash, Copy, Check, Search, ArrowLeft, Star, TrendingUp, BarChart2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const SUGGESTIONS = ['travel', 'food', 'fitness', 'fashion', 'quotes', 'motivation', 'technology', 'photography', 'gaming', 'business'];
const TRENDING = ['reels', 'shorts', 'viral', 'ai', 'startup', 'crypto', 'digitalmarketing', 'photography', 'fitness', 'travel'];

interface HashtagSet {
  trending: string[];
  popular: string[];
  niche: string[];
}

interface SavedSet {
  id: string;
  keyword: string;
  hashtags: HashtagSet;
  date: number;
}

export function HashtagGenerator({ onAction, onBack }: { onAction: () => void, onBack?: () => void }) {
  const [keyword, setKeyword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<HashtagSet | null>(null);
  const [hashtagCount, setHashtagCount] = useState<15 | 30 | 50>(30);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedSets, setSavedSets] = useState<SavedSet[]>([]);
  const [activeTab, setActiveTab] = useState<'generate' | 'favorites'>('generate');

  useEffect(() => {
    const saved = localStorage.getItem('hashtag_saved_sets');
    if (saved) {
      try { setSavedSets(JSON.parse(saved)); } catch (e) {}
    }
    const recent = localStorage.getItem('hashtag_recent_searches');
    if (recent) {
      try { setRecentSearches(JSON.parse(recent)); } catch (e) {}
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('hashtag_recent_searches', JSON.stringify(updated));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleGenerate = () => {
    if (!keyword.trim()) return;
    setIsFocused(false);
    setIsGenerating(true);
    saveRecentSearch(keyword.trim().toLowerCase());
    
    setTimeout(() => {
      const base = keyword.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      
      const TRENDING_SUFFIXES = ['reels', 'viral', 'trend', 'video', 'challenge', 'foryou', 'fyp', 'explore', 'trending', 'now', 'magic', 'moments'];
      const POPULAR_SUFFIXES = ['', 'life', 'love', 'goals', 'style', 'vibes', 'daily', 'photography', 'art', 'world', 'time', 'day', 'mood', 'inspiration'];
      const NICHE_SUFFIXES = ['tips', 'hacks', 'community', 'expert', 'pro', 'guide', '101', 'tricks', 'secrets', 'masterclass', 'journey', 'diaries', 'story', 'lessons'];
      
      const shuffle = (arr: string[]) => [...arr].sort(() => 0.5 - Math.random());
      
      const generateTags = (suffixes: string[], count: number) => {
        const shuffled = shuffle(suffixes);
        const tags = [];
        for (let i = 0; i < count; i++) {
          if (i < shuffled.length) {
            tags.push(`#${base}${shuffled[i]}`);
          } else {
            tags.push(`#${base}${shuffled[i % shuffled.length]}${Math.floor(i / shuffled.length) + 1}`);
          }
        }
        return tags;
      };

      const perCategory = Math.floor(hashtagCount / 3);
      const nicheCount = hashtagCount - (perCategory * 2);
      
      setResults({
        trending: generateTags(TRENDING_SUFFIXES, perCategory),
        popular: generateTags(POPULAR_SUFFIXES, perCategory),
        niche: generateTags(NICHE_SUFFIXES, nicheCount)
      });
      setIsGenerating(false);
      onAction();
    }, 800);
  };

  const handleCopy = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    showToast('Hashtag copied');
    onAction();
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleCopyAll = () => {
    if (!results) return;
    const allTags = [...results.trending, ...results.popular, ...results.niche].join(' ');
    navigator.clipboard.writeText(allTags);
    showToast('All hashtags copied');
    onAction();
  };

  const handleSaveSet = () => {
    if (!results || !keyword) return;
    const newSet: SavedSet = {
      id: Date.now().toString(),
      keyword: keyword.trim(),
      hashtags: results,
      date: Date.now()
    };
    const updated = [newSet, ...savedSets];
    setSavedSets(updated);
    localStorage.setItem('hashtag_saved_sets', JSON.stringify(updated));
    showToast('Hashtag set saved');
    onAction();
  };

  const renderHashtagGrid = (tags: string[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => handleCopy(tag)}
          className="relative overflow-hidden bg-white dark:bg-[#2A2A2A] border border-gray-100 dark:border-gray-800 rounded-xl py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-[#22D3EE] hover:text-[#22D3EE] transition-all active:scale-95 text-left truncate"
        >
          {tag}
          {copiedTag === tag && (
            <div className="absolute inset-0 bg-[#22D3EE] text-white flex items-center justify-center">
              <Check size={16} />
            </div>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] dark:bg-[#121212] relative pb-24">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50 whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-[#171717] p-4 shadow-sm z-10">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-300">
            <ArrowLeft size={24} />
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-[#22D3EE]/10 flex items-center justify-center text-[#22D3EE]">
          <Hash size={24} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hashtag Generator</h2>
          <p className="text-xs text-gray-500">Smart social media assistant</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-2 bg-white dark:bg-[#171717] border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('generate')}
          className={cn(
            "flex-1 py-2 text-sm font-semibold rounded-lg transition-colors",
            activeTab === 'generate' ? "bg-[#22D3EE]/10 text-[#22D3EE]" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
          )}
        >
          Generate
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={cn(
            "flex-1 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2",
            activeTab === 'favorites' ? "bg-[#22D3EE]/10 text-[#22D3EE]" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
          )}
        >
          <Star size={16} /> Favorites
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'generate' ? (
          <>
            {/* Input Section */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Enter topic (example: travel, fitness, food)"
                  className="w-full bg-white dark:bg-[#1F1F1F] border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent outline-none transition-all shadow-sm font-medium text-lg"
                />
              </div>

              {/* Suggestions */}
              <AnimatePresence>
                {isFocused && !keyword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 space-y-3">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Smart Suggestions</p>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTIONS.map(s => (
                          <button
                            key={s}
                            onClick={() => { setKeyword(s); setIsFocused(false); }}
                            className="bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-[#22D3EE] hover:text-[#22D3EE] transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Count Selector */}
              <div className="flex items-center justify-between bg-white dark:bg-[#1F1F1F] p-1 rounded-xl border border-gray-100 dark:border-gray-800">
                {[15, 30, 50].map(count => (
                  <button
                    key={count}
                    onClick={() => setHashtagCount(count as any)}
                    className={cn(
                      "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                      hashtagCount === count 
                        ? "bg-gray-100 dark:bg-[#2A2A2A] text-gray-900 dark:text-white shadow-sm" 
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                  >
                    {count} tags
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={!keyword.trim() || isGenerating}
                className="w-full bg-[#22D3EE] hover:bg-[#06B6D4] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#22D3EE]/25 active:scale-[0.98]"
              >
                {isGenerating ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Generate Hashtags</>
                )}
              </button>
            </div>

            {/* Trending Keywords Scroll */}
            {!results && !isGenerating && (
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 px-1">
                  <TrendingUp size={16} className="text-[#22D3EE]" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Trending Topics</h3>
                </div>
                <div className="flex overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar gap-3">
                  {TRENDING.map(topic => (
                    <button
                      key={topic}
                      onClick={() => { setKeyword(topic); handleGenerate(); }}
                      className="flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1F1F1F] dark:to-[#2A2A2A] border border-gray-200 dark:border-gray-800 rounded-xl px-5 py-3 text-sm font-bold text-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md transition-all"
                    >
                      #{topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!results && !isGenerating && recentSearches.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Clock size={16} className="text-gray-400" />
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Recent Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(search => (
                    <button
                      key={search}
                      onClick={() => { setKeyword(search); handleGenerate(); }}
                      className="bg-white dark:bg-[#1F1F1F] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#22D3EE] hover:border-[#22D3EE] transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {isGenerating && (
              <div className="space-y-6 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map(j => (
                        <div key={j} className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {results && !isGenerating && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Analytics */}
                <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex items-center justify-around shadow-sm">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 font-medium mb-1">Total Generated</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{hashtagCount}</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 font-medium mb-1">Reach Level</p>
                    <div className="flex items-center gap-1 text-[#22D3EE] font-bold text-lg">
                      <BarChart2 size={18} /> High
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
                      <TrendingUp size={16} className="text-rose-500" /> Trending Hashtags
                    </h3>
                    {renderHashtagGrid(results.trending)}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
                      <Star size={16} className="text-yellow-500" /> Popular Hashtags
                    </h3>
                    {renderHashtagGrid(results.popular)}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
                      <Hash size={16} className="text-[#22D3EE]" /> Niche Hashtags
                    </h3>
                    {renderHashtagGrid(results.niche)}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          /* Favorites Tab */
          <div className="space-y-4">
            {savedSets.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Star size={48} className="mx-auto mb-4 opacity-20" />
                <p>No saved hashtag sets yet.</p>
              </div>
            ) : (
              savedSets.map(set => (
                <div key={set.id} className="bg-white dark:bg-[#1F1F1F] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white capitalize">{set.keyword}</h3>
                    <span className="text-xs text-gray-500">{new Date(set.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-[#22D3EE] font-medium line-clamp-2 leading-relaxed">
                    {[...set.hashtags.trending, ...set.hashtags.popular, ...set.hashtags.niche].join(' ')}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText([...set.hashtags.trending, ...set.hashtags.popular, ...set.hashtags.niche].join(' '));
                        showToast('Saved set copied');
                      }}
                      className="flex-1 bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#333] text-gray-800 dark:text-gray-200 py-2 rounded-xl text-sm font-bold transition-colors"
                    >
                      Copy All
                    </button>
                    <button
                      onClick={() => {
                        const updated = savedSets.filter(s => s.id !== set.id);
                        setSavedSets(updated);
                        localStorage.setItem('hashtag_saved_sets', JSON.stringify(updated));
                      }}
                      className="px-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      {activeTab === 'generate' && results && !isGenerating && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-20">
          <div className="flex gap-3 max-w-md mx-auto">
            <button
              onClick={handleSaveSet}
              className="flex-1 bg-white dark:bg-[#1F1F1F] border-2 border-gray-200 dark:border-gray-700 hover:border-[#22D3EE] dark:hover:border-[#22D3EE] text-gray-700 dark:text-gray-200 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <Star size={20} /> Save Set
            </button>
            <button
              onClick={handleCopyAll}
              className="flex-[2] bg-[#22D3EE] hover:bg-[#06B6D4] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#22D3EE]/25 active:scale-[0.98]"
            >
              <Copy size={20} /> Copy All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
