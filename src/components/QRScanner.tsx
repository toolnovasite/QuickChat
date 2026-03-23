import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ScanLine, AlertCircle } from 'lucide-react';

export function QRScanner({ onAction }: { onAction: () => void }) {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        setScanResult(decodedText);
        scanner.clear();
        
        // Vibrate if supported
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }

        // Check if it's a WhatsApp link
        if (decodedText.includes('wa.me/') || decodedText.includes('whatsapp.com/')) {
          onAction();
          window.open(decodedText, '_blank');
        } else {
          setError("This doesn't look like a valid WhatsApp QR code. Please make sure you are scanning a QR code that contains a 'wa.me' or 'whatsapp.com' chat link.");
        }
      },
      (err) => {
        // Ignore normal scanning errors
      }
    );

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [onAction]);

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white dark:bg-card-dark rounded-[18px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <ScanLine size={20} className="text-primary" />
          Scan QR to Chat
        </h2>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Point your camera at a WhatsApp QR code to instantly open the chat.
          </p>

          <div className="rounded-[14px] overflow-hidden relative">
            <div className="absolute inset-0 border-2 border-primary pointer-events-none z-10 rounded-[14px] shadow-[0_0_15px_rgba(37,211,102,0.5),inset_0_0_15px_rgba(37,211,102,0.5)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
            <div id="reader" className="w-full bg-black"></div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-[10px] text-sm flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {scanResult && !error && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-[10px] text-sm break-all">
              <strong>Scanned:</strong> {scanResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
