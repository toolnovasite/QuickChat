import React, { useState } from 'react';
import { Send, History, ChevronDown } from 'lucide-react';

const countries = [
  { code: '1', name: 'United States / Canada' },
  { code: '44', name: 'United Kingdom' },
  { code: '91', name: 'India' },
  { code: '61', name: 'Australia' },
  { code: '49', name: 'Germany' },
  { code: '33', name: 'France' },
  { code: '81', name: 'Japan' },
  { code: '86', name: 'China' },
  { code: '55', name: 'Brazil' },
  { code: '52', name: 'Mexico' },
  { code: '27', name: 'South Africa' },
  { code: '971', name: 'UAE' },
  { code: '92', name: 'Pakistan' },
  { code: '880', name: 'Bangladesh' },
  { code: '62', name: 'Indonesia' },
  { code: '60', name: 'Malaysia' },
  { code: '65', name: 'Singapore' },
  { code: '63', name: 'Philippines' },
  { code: '234', name: 'Nigeria' },
  { code: '254', name: 'Kenya' },
];

export function DirectMessage({ onAction }: { onAction: () => void }) {
  const [countryCode, setCountryCode] = useState('1');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!phone) return;
    
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanCode = countryCode.replace(/\D/g, '');
    const fullNumber = `${cleanCode}${cleanPhone}`;
    const encodedMessage = encodeURIComponent(message);
    
    // Save to history
    const history = JSON.parse(localStorage.getItem('recentHistory') || '[]');
    history.unshift({
      id: Date.now().toString(),
      type: 'direct-message',
      number: fullNumber,
      message,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('recentHistory', JSON.stringify(history.slice(0, 50)));

    onAction();
    window.open(`https://api.whatsapp.com/send?phone=${fullNumber}&text=${encodedMessage}&app_absent=0`, '_blank');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white dark:bg-card-dark rounded-[18px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Send Direct Message</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Country</label>
            <div className="relative">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full bg-bg-light dark:bg-input-dark border-none rounded-[14px] py-3 pl-4 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all font-medium appearance-none"
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.name} (+{c.code})</option>
                ))}
                <option value="other">Other...</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
            </div>
          </div>

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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Message (Optional)</label>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full bg-bg-light dark:bg-input-dark border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              placeholder="Type your message here..."
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <button 
                onClick={() => setMessage(prev => prev ? prev + " Hello!" : "Hello!")}
                className="text-[11px] font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
              >
                + Hello
              </button>
              <button 
                onClick={() => setMessage(prev => prev ? prev + " How are you?" : "How are you?")}
                className="text-[11px] font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
              >
                + How are you?
              </button>
              <button 
                onClick={() => setMessage(prev => prev ? prev + " Please call me back." : "Please call me back.")}
                className="text-[11px] font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
              >
                + Call me
              </button>
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={!phone}
            className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/30"
          >
            <Send size={20} />
            Open in WhatsApp
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-card-dark rounded-[18px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-500">
            <History size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Numbers</h3>
            <p className="text-xs text-gray-500">Quickly message recent contacts</p>
          </div>
        </div>
        <button className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors">View All</button>
      </div>
    </div>
  );
}
