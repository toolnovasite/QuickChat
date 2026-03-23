import React, { useState } from 'react';
import { Link, Copy, Share, Check } from 'lucide-react';

export function LinkGenerator({ onAction }: { onAction: () => void }) {
  const [countryCode, setCountryCode] = useState('1');
  const [phone, setPhone] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!phone) return;
    
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanCode = countryCode.replace(/\D/g, '');
    const fullNumber = `${cleanCode}${cleanPhone}`;
    
    setGeneratedLink(`https://wa.me/${fullNumber}`);
    onAction();
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!generatedLink) return;
    if (navigator.share) {
      navigator.share({
        title: 'WhatsApp Chat Link',
        text: 'Click to chat with me on WhatsApp',
        url: generatedLink,
      });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white dark:bg-card-dark rounded-[18px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Click-to-Chat Link</h2>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-1/3">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Code</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+</span>
                <input
                  type="tel"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full bg-bg-light dark:bg-input-dark border-none rounded-[14px] py-3 pl-8 pr-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                  placeholder="1"
                />
              </div>
            </div>
            <div className="w-2/3">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-bg-light dark:bg-input-dark border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                placeholder="Enter number"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!phone}
            className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/30"
          >
            <Link size={20} />
            Generate Link
          </button>
        </div>
      </div>

      {generatedLink && (
        <div className="bg-white dark:bg-card-dark rounded-[18px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Your Link</h3>
          
          <div className="bg-bg-light dark:bg-input-dark rounded-[14px] p-4 mb-4 flex items-center justify-between">
            <span className="text-gray-900 dark:text-white font-medium truncate mr-2">{generatedLink}</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-3 rounded-[14px] flex items-center justify-center gap-2 transition-colors"
            >
              {!copied && <Copy size={18} />}
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-[14px] flex items-center justify-center gap-2 transition-colors"
            >
              <Share size={18} />
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
