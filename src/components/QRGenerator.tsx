import React, { useState, useRef } from 'react';
import { QrCode, Download, Share } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function QRGenerator({ onAction }: { onAction: () => void }) {
  const [countryCode, setCountryCode] = useState('1');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [qrData, setQrData] = useState('');
  const qrRef = useRef<SVGSVGElement>(null);

  const handleGenerate = () => {
    if (!phone) return;
    
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanCode = countryCode.replace(/\D/g, '');
    const fullNumber = `${cleanCode}${cleanPhone}`;
    const encodedMessage = encodeURIComponent(message);
    
    setQrData(`https://wa.me/${fullNumber}?text=${encodedMessage}`);
    onAction();
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `whatsapp-qr-${Date.now()}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleShare = async () => {
    if (!qrRef.current) return;
    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(async (blob) => {
          if (blob && navigator.share) {
            const file = new File([blob], 'whatsapp-qr.png', { type: 'image/png' });
            try {
              await navigator.share({
                title: 'WhatsApp QR Code',
                text: 'Scan to chat with me on WhatsApp',
                files: [file],
              });
            } catch (error) {
              console.error('Error sharing', error);
            }
          }
        });
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white dark:bg-card-dark rounded-[18px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">QR Chat Generator</h2>
        
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

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full bg-bg-light dark:bg-input-dark border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              placeholder="Pre-filled message..."
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!phone}
            aria-label="Generate QR Code"
            className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/30"
          >
            <QrCode size={20} />
            Generate QR Code
          </button>
        </div>
      </div>

      {qrData && (
        <div className="bg-white dark:bg-card-dark rounded-[18px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-800 flex flex-col items-center">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 w-full text-left">Your QR Code</h3>
          
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6 inline-block">
            <QRCodeSVG
              value={qrData}
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"M"}
              includeMargin={false}
              ref={qrRef}
            />
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={handleDownload}
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-3 rounded-[14px] flex items-center justify-center gap-2 transition-colors"
            >
              <Download size={18} />
              Save
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
