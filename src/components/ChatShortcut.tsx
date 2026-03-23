import React, { useState } from 'react';
import { Zap, PlusCircle, Check } from 'lucide-react';

export function ChatShortcut({ onAction }: { onAction: () => void }) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [created, setCreated] = useState(false);

  const handleCreate = () => {
    if (!phone || !name) return;
    setCreated(true);
    setTimeout(() => setCreated(false), 3000);
    onAction();
  };

  return (
    <div className="p-[20px] space-y-[16px]">
      <div className="bg-[#FFFFFF] dark:bg-[#171717] rounded-[18px] p-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent dark:border-gray-800">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-[#FFFFFF] flex items-center gap-2">
          <Zap size={20} className="text-[#A855F7]" />
          Chat Shortcut
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#6B7280] mb-1 uppercase tracking-wider">Contact Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F5F6F8] dark:bg-[#1F1F1F] border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-[#FFFFFF] focus:ring-2 focus:ring-[#A855F7] outline-none transition-all font-medium"
              placeholder="e.g., Mom"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#6B7280] mb-1 uppercase tracking-wider">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#F5F6F8] dark:bg-[#1F1F1F] border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-[#FFFFFF] focus:ring-2 focus:ring-[#A855F7] outline-none transition-all font-medium"
              placeholder="+1234567890"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={!phone || !name}
            className="w-full bg-[#A855F7] hover:bg-[#A855F7]/90 active:bg-[#A855F7]/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#A855F7]/30"
          >
            {!created && <PlusCircle size={20} />}
            {created ? 'Shortcut Created ✓' : 'Create Shortcut'}
          </button>
        </div>
      </div>
    </div>
  );
}
