import React, { useState, useEffect } from 'react';
import { Bot, Save, Info, Plus, Trash2, X, Settings } from 'lucide-react';

interface Rule {
  id: string;
  keyword: string;
  reply: string;
}

export function AutoReply({ onAction }: { onAction: () => void }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [showAddRule, setShowAddRule] = useState(false);
  
  const [keyword, setKeyword] = useState('');
  const [reply, setReply] = useState('');

  useEffect(() => {
    const savedRules = localStorage.getItem('autoReplyRules');
    if (savedRules) {
      setRules(JSON.parse(savedRules));
    }
    const savedEnabled = localStorage.getItem('autoReplyEnabled');
    if (savedEnabled) {
      setIsEnabled(savedEnabled === 'true');
    }
    const hasSeenHelp = localStorage.getItem('autoReplyHelpSeen');
    if (!hasSeenHelp) {
      setShowHelp(true);
    }
  }, []);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem('autoReplyEnabled', String(newState));
    // @ts-ignore
    if (window.Android && window.Android.toggleAutoReply) {
      // @ts-ignore
      window.Android.toggleAutoReply(newState);
    }
    onAction();
  };

  const handleSaveRule = () => {
    if (!keyword || !reply) return;
    const newRule = { id: Date.now().toString(), keyword, reply };
    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    localStorage.setItem('autoReplyRules', JSON.stringify(updatedRules));
    
    // @ts-ignore
    if (window.Android && window.Android.updateAutoReplyRules) {
      // @ts-ignore
      window.Android.updateAutoReplyRules(JSON.stringify(updatedRules));
    }

    setKeyword('');
    setReply('');
    setShowAddRule(false);
    onAction();
  };

  const handleDeleteRule = (id: string) => {
    const updatedRules = rules.filter(r => r.id !== id);
    setRules(updatedRules);
    localStorage.setItem('autoReplyRules', JSON.stringify(updatedRules));
    
    // @ts-ignore
    if (window.Android && window.Android.updateAutoReplyRules) {
      // @ts-ignore
      window.Android.updateAutoReplyRules(JSON.stringify(updatedRules));
    }
    onAction();
  };

  const handleCloseHelp = () => {
    if (dontShowAgain) {
      localStorage.setItem('autoReplyHelpSeen', 'true');
    }
    setShowHelp(false);
  };

  const openNotificationSettings = () => {
    // @ts-ignore
    if (window.Android && window.Android.openNotificationSettings) {
      // @ts-ignore
      window.Android.openNotificationSettings();
    } else {
      alert("Please open your phone's Settings > Notifications > Device & app notifications to allow access.");
    }
  };

  return (
    <div className="p-4 space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-[#1E293B] rounded-[20px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Auto Reply</h2>
            <p className="text-xs text-gray-500">Reply to messages automatically</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowHelp(true)} className="text-gray-400 hover:text-[#25D366] transition-colors">
            <Info size={24} />
          </button>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={isEnabled} onChange={handleToggle} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#25D366]"></div>
          </label>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Your Rules</h3>
          <button 
            onClick={() => setShowAddRule(true)}
            className="text-[#25D366] text-sm font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <Plus size={16} /> Add Rule
          </button>
        </div>

        {rules.length === 0 && !showAddRule ? (
          <div className="bg-white dark:bg-[#1E293B] rounded-[16px] p-8 text-center shadow-sm border border-transparent dark:border-gray-800">
            <Bot size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No rules added yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Tap "Add Rule" to create your first auto reply.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map(rule => (
              <div key={rule.id} className="bg-white dark:bg-[#1E293B] rounded-[16px] p-4 shadow-sm border border-transparent dark:border-gray-800 relative group">
                <button 
                  onClick={() => handleDeleteRule(rule.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <div className="pr-8">
                  <div className="text-xs font-bold text-[#25D366] uppercase tracking-wider mb-1">Keyword</div>
                  <div className="text-gray-900 dark:text-white font-medium mb-3">{rule.keyword}</div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Reply</div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">{rule.reply}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Rule Modal */}
      {showAddRule && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Rule</h3>
              <button onClick={() => setShowAddRule(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">When I receive:</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-[#F5F6F8] dark:bg-[#0F172A] border-none rounded-[16px] py-4 px-5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#25D366] outline-none transition-all font-medium"
                  placeholder="e.g., hello"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Auto reply with:</label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                  className="w-full bg-[#F5F6F8] dark:bg-[#0F172A] border-none rounded-[16px] py-4 px-5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#25D366] outline-none transition-all resize-none font-medium"
                  placeholder="e.g., Hi! I will reply soon."
                />
              </div>
              <button
                onClick={handleSaveRule}
                disabled={!keyword || !reply}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-[16px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#25D366]/20"
              >
                <Save size={20} />
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Popup */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-[24px] w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white dark:bg-[#1E293B] p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">How Auto Reply Works</h3>
              <button onClick={handleCloseHelp} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[16px] p-4">
                <p className="text-sm font-bold text-amber-800 dark:text-amber-500 mb-1">Important:</p>
                <p className="text-sm text-amber-700 dark:text-amber-400">Auto Reply works using WhatsApp notifications. Your phone must allow Notification Access for this feature.</p>
              </div>

              <div className="space-y-3">
                <div className="bg-[#F5F6F8] dark:bg-[#0F172A] rounded-[16px] p-4">
                  <div className="font-bold text-[#25D366] mb-1">Step 1</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Enable Auto Reply using the toggle switch.</p>
                </div>
                <div className="bg-[#F5F6F8] dark:bg-[#0F172A] rounded-[16px] p-4">
                  <div className="font-bold text-[#25D366] mb-1">Step 2</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Tap "Add Rule" to create reply rules.</p>
                  <div className="mt-2 bg-white dark:bg-[#1E293B] p-2 rounded-lg text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                    <span className="font-bold">hello</span> → Hi! I will reply soon.
                  </div>
                </div>
                <div className="bg-[#F5F6F8] dark:bg-[#0F172A] rounded-[16px] p-4">
                  <div className="font-bold text-[#25D366] mb-1">Step 3</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Allow Notification Access permission.</p>
                </div>
                <div className="bg-[#F5F6F8] dark:bg-[#0F172A] rounded-[16px] p-4">
                  <div className="font-bold text-[#25D366] mb-1">Step 4</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">When someone sends you a WhatsApp message, the app reads the notification.</p>
                </div>
                <div className="bg-[#F5F6F8] dark:bg-[#0F172A] rounded-[16px] p-4">
                  <div className="font-bold text-[#25D366] mb-1">Step 5</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">If the message matches a rule, the app sends an automatic reply.</p>
                </div>
              </div>

              <button
                onClick={openNotificationSettings}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-[16px] flex items-center justify-center gap-2 transition-colors shadow-lg mt-6"
              >
                <Settings size={20} />
                Open Notification Settings
              </button>

              <label className="flex items-center gap-2 mt-4 cursor-pointer justify-center">
                <input 
                  type="checkbox" 
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 text-[#25D366] rounded border-gray-300 focus:ring-[#25D366]" 
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Don't show again</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
