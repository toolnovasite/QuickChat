import React, { useState, useEffect } from 'react';
import { Home, MessageCircle, Repeat, History, Search, ArrowLeft, Star, Share, Sun, Moon, Type, Smile } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { AdPlaceholder } from './AdPlaceholder';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  showGrowthPopup?: boolean;
  setShowGrowthPopup?: (show: boolean) => void;
}

export function Layout({ children, activeTab, setActiveTab, title, showBack, onBack, searchQuery, setSearchQuery, showGrowthPopup, setShowGrowthPopup }: LayoutProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Theme detection
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    // Show rating prompt only once after 5 successful uses
    // This logic is now handled in App.tsx
  }, [activeTab]);

  const handleRate = () => {
    localStorage.setItem('hasRated', 'true');
    if (setShowGrowthPopup) {
      setShowGrowthPopup(false);
    }
    // In a real app, this would link to the app store
  };

  const handleShare = () => {
    const text = encodeURIComponent('Made with QuickChat 🚀\nDownload the app here: ' + window.location.href);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-screen bg-bg-light dark:bg-bg-dark overflow-hidden transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-b from-[#25D366] to-[#128C7E] text-white p-[18px] rounded-b-[22px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex-shrink-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <button onClick={onBack} className="p-1 hover:bg-white/20 rounded-full transition-colors active:bg-white/30">
                <ArrowLeft size={24} />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
              {!showBack && <p className="text-[13px] opacity-90 font-medium">WhatsApp Productivity Tools</p>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleShare} 
              className="p-2 hover:bg-white/20 rounded-full transition-colors active:bg-white/30"
              title="Share to WhatsApp"
            >
              <Share size={20} />
            </button>
            <button onClick={toggleTheme} className="p-2 hover:bg-white/20 rounded-full transition-colors active:bg-white/30">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
        
        {!showBack && setSearchQuery && (
          <div className="relative mt-[10px]">
            <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[42px] bg-[#F3F4F6] dark:bg-[#334155] border-none rounded-[22px] py-2 pl-[40px] pr-4 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none transition-colors text-[15px]"
            />
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-6 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: showBack ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: showBack ? -20 : 20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Ad Container */}
      <div className="h-[50px] flex justify-center items-center bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)] m-[10px] rounded-[10px] flex-shrink-0">
        <AdPlaceholder type="banner" />
      </div>

      {/* Bottom Navigation */}
      <nav className="h-[60px] bg-white dark:bg-[#1E293B] border-t border-[#eee] dark:border-transparent z-20 transition-colors duration-300 flex-shrink-0">
        <div className="flex justify-around items-center h-full px-2">
          <NavItem icon={<Home size={24} strokeWidth={2} />} label="Home" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<Type size={24} strokeWidth={2} />} label="Fancy Text" isActive={activeTab === 'fancy-text'} onClick={() => setActiveTab('fancy-text')} />
          <NavItem icon={<Smile size={24} strokeWidth={2} />} label="Emoji" isActive={activeTab === 'emoji-generator'} onClick={() => setActiveTab('emoji-generator')} />
          <NavItem icon={<Share size={24} strokeWidth={2} />} label="Share App" isActive={false} onClick={handleShare} />
        </div>
      </nav>

      {/* Growth Loop Popup */}
      <AnimatePresence>
        {showGrowthPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Enjoying QuickChat?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Help us grow by rating the app or sharing it with friends!</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleRate} className="w-full py-3 bg-[#25D366] hover:bg-[#25D366]/90 active:bg-[#25D366]/80 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                  <Star size={20} className="fill-current" /> Rate App
                </button>
                <button onClick={() => {
                  handleShare();
                  if (setShowGrowthPopup) {
                    setShowGrowthPopup(false);
                  }
                }} className="w-full py-3 bg-[#128C7E] hover:bg-[#128C7E]/90 active:bg-[#128C7E]/80 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                  <Share size={20} /> Share to WhatsApp
                </button>
                <button onClick={() => setShowGrowthPopup && setShowGrowthPopup(false)} className="mt-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  Maybe later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-300 relative",
        isActive ? "text-[#25D366]" : "text-[#9CA3AF] hover:text-gray-900 dark:hover:text-gray-200"
      )}
    >
      <div className={cn("p-1.5 rounded-full transition-all duration-300", isActive && "bg-[#25D366]/10 text-[#25D366]")}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
