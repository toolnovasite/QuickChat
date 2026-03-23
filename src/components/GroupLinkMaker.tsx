import React, { useState } from 'react';
import { Copy, Check, Users } from 'lucide-react';

export function GroupLinkMaker({ onAction }: { onAction: () => void }) {
  const [groupId, setGroupId] = useState('');
  const [copied, setCopied] = useState(false);

  const link = groupId ? `https://chat.whatsapp.com/${groupId}` : '';

  const handleCopy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onAction();
  };

  return (
    <div className="p-[20px] space-y-[16px]">
      <div className="bg-[#FFFFFF] dark:bg-[#171717] rounded-[18px] p-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent dark:border-gray-800">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-[#FFFFFF] flex items-center gap-2">
          <Users size={20} className="text-[#06B6D4]" />
          Group Link Maker
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#6B7280] mb-1 uppercase tracking-wider">Group ID</label>
            <input
              type="text"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full bg-[#F5F6F8] dark:bg-[#1F1F1F] border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-[#FFFFFF] focus:ring-2 focus:ring-[#06B6D4] outline-none transition-all font-medium"
              placeholder="e.g., ABcDeFgHiJkLmNoP"
            />
          </div>

          {link && (
            <div className="bg-[#F5F6F8] dark:bg-[#1F1F1F] rounded-[14px] p-4 text-center break-all text-[#06B6D4] font-medium">
              {link}
            </div>
          )}

          <button
            onClick={handleCopy}
            disabled={!link}
            className="w-full bg-[#06B6D4] hover:bg-[#06B6D4]/90 active:bg-[#06B6D4]/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#06B6D4]/30"
          >
            {!copied && <Copy size={20} />}
            {copied ? 'Copied ✓' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
