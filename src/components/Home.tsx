import React, { useState } from 'react';
import { MessageCircle, Repeat, Link, QrCode, Type, UserCircle, Quote, Users, History, ScanLine, AlignLeft, Smile, Download, User, Bell, FileText, Hash, Puzzle, Zap, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const tools = [
  { id: 'direct-message', title: 'Direct Message', description: 'Send WhatsApp messages without saving numbers.', category: 'Messaging Tools', icon: MessageCircle, color: 'text-[#25D366]', bg: 'bg-[#25D366]/10' },
  { id: 'text-repeater', title: 'Text Repeater', description: 'Repeat text multiple times instantly.', category: 'Text Tools', icon: Repeat, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10' },
  { id: 'fancy-text', title: 'Fancy Text', description: 'Generate stylish and fancy text fonts.', category: 'Text Tools', icon: Type, color: 'text-[#EC4899]', bg: 'bg-[#EC4899]/10' },
  { id: 'qr-generator', title: 'QR Chat', description: 'Create QR codes for WhatsApp chats.', category: 'QR Tools', icon: QrCode, color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10' },
  { id: 'blank-message', title: 'Blank Message', description: 'Send empty messages to surprise friends.', category: 'Messaging Tools', icon: AlignLeft, color: 'text-[#6366F1]', bg: 'bg-[#6366F1]/10' },
  { id: 'emoji-generator', title: 'Emoji Generator', description: 'Convert text into emoji art.', category: 'Text Tools', icon: Smile, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
  { id: 'link-generator', title: 'Link Generator', description: 'Generate direct WhatsApp chat links.', category: 'Messaging Tools', icon: Link, color: 'text-[#14B8A6]', bg: 'bg-[#14B8A6]/10' },
  { id: 'text-to-emoji', title: 'Text To Emoji', description: 'Translate your text into emojis.', category: 'Text Tools', icon: Smile, color: 'text-[#F97316]', bg: 'bg-[#F97316]/10' },
  { id: 'emoji-combiner', title: 'Emoji Combiner', description: 'Combine two emojis into one.', category: 'Text Tools', icon: Puzzle, color: 'text-[#F43F5E]', bg: 'bg-[#F43F5E]/10' },
  { id: 'whatsapp-cleaner', title: 'WhatsApp Cleaner', description: 'Clean up WhatsApp junk files.', category: 'Utilities', icon: Download, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
  { id: 'chat-shortcut', title: 'Chat Shortcut', description: 'Create home screen shortcuts for chats.', category: 'Utilities', icon: Zap, color: 'text-[#A855F7]', bg: 'bg-[#A855F7]/10' },
  { id: 'bio-generator', title: 'Bio Generator', description: 'Generate cool bios for your profile.', category: 'Text Tools', icon: UserCircle, color: 'text-[#FB7185]', bg: 'bg-[#FB7185]/10' },
  { id: 'group-link-maker', title: 'Group Link Maker', description: 'Create links for WhatsApp groups.', category: 'Messaging Tools', icon: Users, color: 'text-[#06B6D4]', bg: 'bg-[#06B6D4]/10' },
  { id: 'auto-reply', title: 'Auto Reply', description: 'Set up automatic replies for messages.', category: 'Messaging Tools', icon: Bot, color: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/10' },
  { id: 'quote-maker', title: 'Quote Maker', description: 'Create beautiful quote images.', category: 'Text Tools', icon: Quote, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
  { id: 'hashtag-generator', title: 'Hashtag Generator', description: 'Generate trending hashtags.', category: 'Text Tools', icon: Hash, color: 'text-[#22D3EE]', bg: 'bg-[#22D3EE]/10' },
  { id: 'font-preview', title: 'Font Preview', description: 'Preview different font styles.', category: 'Text Tools', icon: Type, color: 'text-[#C084FC]', bg: 'bg-[#C084FC]/10' },
  { id: 'sticker-tools', title: 'Sticker Tools', description: 'Create and manage WhatsApp stickers.', category: 'Utilities', icon: Puzzle, color: 'text-[#34D399]', bg: 'bg-[#34D399]/10' },
  { id: 'qr-scanner', title: 'QR Scanner', description: 'Scan WhatsApp QR codes quickly.', category: 'QR Tools', icon: ScanLine, color: 'text-[#6366F1]', bg: 'bg-[#6366F1]/10' },
];

const trendingIds = ['direct-message', 'text-repeater', 'fancy-text', 'qr-generator'];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 20 } }
};

export function Home({ onSelectTool, searchQuery }: { onSelectTool: (id: string) => void, searchQuery: string }) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Messaging Tools', 'Text Tools', 'QR Tools', 'Utilities']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const filteredTools = tools.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trendingTools = filteredTools.filter(t => trendingIds.includes(t.id));
  const moreTools = filteredTools.filter(t => !trendingIds.includes(t.id));

  const categories = Array.from(new Set(moreTools.map(t => t.category)));

  return (
    <div className="p-[12px] space-y-6 pb-24">
      {trendingTools.length > 0 && (
        <div>
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white mb-3 ml-1 flex items-center gap-1">
            🔥 Trending Tools
          </h2>
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="flex overflow-x-auto no-scrollbar gap-[12px] pb-2"
          >
            {trendingTools.map((tool) => (
              <motion.button
                variants={item}
                whileTap={{ scale: 0.96 }}
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className="flex-shrink-0 flex flex-col items-center justify-center p-[10px] bg-white dark:bg-[#1E293B] rounded-[16px] shadow-[0_3px_10px_rgba(0,0,0,0.05)] text-center border border-transparent dark:border-gray-800 w-[82px] h-[82px] relative overflow-visible group focus:outline-none"
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                  {tool.description}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                </div>
                <div className={cn("mb-1.5 p-1.5 rounded-full transition-transform group-hover:scale-110 group-focus:scale-110", tool.color, tool.bg)}>
                  <tool.icon size={26} strokeWidth={2} />
                </div>
                <h3 className="font-medium text-[10px] text-gray-900 dark:text-white leading-tight">{tool.title}</h3>
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white mb-3 ml-1">All Tools</h2>
          
          {categories.map(category => {
            const categoryTools = moreTools.filter(t => t.category === category);
            const isExpanded = expandedCategories.includes(category);
            
            return (
              <div key={category} className="bg-white dark:bg-[#1E293B] rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:border dark:border-gray-800 overflow-hidden">
                <button 
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 focus:outline-none"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{category}</h3>
                  {isExpanded ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <motion.div 
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-3 gap-[12px] p-4 pt-0"
                      >
                        {categoryTools.map((tool) => (
                          <motion.button
                            variants={item}
                            whileTap={{ scale: 0.96 }}
                            key={tool.id}
                            onClick={() => onSelectTool(tool.id)}
                            className="flex flex-col items-center justify-start p-[10px] bg-gray-50 dark:bg-[#0F172A] rounded-[14px] text-center border border-transparent dark:border-gray-800 h-[85px] focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 group relative overflow-visible"
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                              {tool.description}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                            </div>
                            <div className={cn("p-1.5 rounded-full transition-transform group-hover:scale-110", tool.color, tool.bg)}>
                              <tool.icon size={26} strokeWidth={2} />
                            </div>
                            <h3 className="font-medium text-[12px] text-gray-900 dark:text-white leading-tight mt-[6px]">{tool.title}</h3>
                          </motion.button>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
