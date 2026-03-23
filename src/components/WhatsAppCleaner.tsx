import React, { useState } from 'react';
import { Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

export function WhatsAppCleaner({ onAction }: { onAction: () => void }) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [cleaned, setCleaned] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 2000);
  };

  const handleClean = () => {
    setCleaning(true);
    setTimeout(() => {
      setCleaning(false);
      setCleaned(true);
      onAction();
    }, 1500);
  };

  return (
    <div className="p-[20px] space-y-[16px]">
      <div className="bg-[#FFFFFF] dark:bg-[#171717] rounded-[18px] p-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent dark:border-gray-800 text-center">
        <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-[#FFFFFF]">WhatsApp Cleaner</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Identify and delete junk files to free up space.</p>
        
        {!scanned && !cleaned && (
          <div className="py-8">
            <div className="w-24 h-24 mx-auto bg-[#10B981]/10 rounded-full flex items-center justify-center mb-6">
              <Trash2 size={40} className="text-[#10B981]" />
            </div>
            <button
              onClick={handleScan}
              disabled={scanning}
              className="w-full bg-[#10B981] hover:bg-[#10B981]/90 active:bg-[#10B981]/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#10B981]/30"
            >
              {scanning ? 'Scanning...' : 'Scan Junk Files'}
            </button>
          </div>
        )}

        {scanned && !cleaned && (
          <div className="py-6">
            <div className="w-24 h-24 mx-auto bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={40} className="text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">1.2 GB</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Junk files found (Images, Videos, Audio)</p>
            <button
              onClick={handleClean}
              disabled={cleaning}
              className="w-full bg-[#10B981] hover:bg-[#10B981]/90 active:bg-[#10B981]/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#10B981]/30"
            >
              {cleaning ? 'Cleaning...' : 'Clean Now'}
            </button>
          </div>
        )}

        {cleaned && (
          <div className="py-8">
            <div className="w-24 h-24 mx-auto bg-[#25D366]/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={40} className="text-[#25D366]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Cleaned Successfully!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">1.2 GB of space has been freed up.</p>
            <button
              onClick={() => { setScanned(false); setCleaned(false); }}
              className="w-full bg-[#F5F6F8] hover:bg-gray-200 dark:bg-[#1F1F1F] dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold py-4 rounded-[14px] flex items-center justify-center transition-colors"
            >
              Scan Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
