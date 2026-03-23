import React from 'react';

export function AdPlaceholder({ type }: { type: 'banner' | 'native' | 'interstitial' }) {
  // @ts-ignore
  if (typeof window !== 'undefined' && window.Android) {
    // Hide web ad placeholders if running inside the native Android wrapper
    // because the native app handles its own banner/interstitial ads.
    return null;
  }

  if (type === 'banner') {
    return (
      <div className="w-[320px] h-[50px] flex flex-col items-center justify-center text-xs text-gray-400 font-medium text-center bg-gray-100 dark:bg-gray-800 rounded-md">
        <span>Banner Test Ad</span>
        <span className="text-[10px] opacity-70 mt-0.5">ca-app-pub-3940256099942544/6300978111</span>
      </div>
    );
  }

  if (type === 'native') {
    return (
      <div className="w-full p-4 bg-white dark:bg-card-dark rounded-[18px] shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center min-h-[100px] my-4">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-2">Advertisement</span>
        <div className="w-full h-[60px] bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center text-sm text-gray-500">
          <span className="font-semibold">Native Test Ad</span>
          <span className="text-[10px] opacity-70 mt-0.5">ca-app-pub-3940256099942544/2247696110</span>
        </div>
      </div>
    );
  }

  if (type === 'interstitial') {
    return (
      <div className="w-64 h-64 bg-gray-800 rounded-2xl flex flex-col items-center justify-center text-gray-400 p-4 text-center">
        <span className="font-semibold text-white mb-2">Interstitial Test Ad</span>
        <span className="text-xs opacity-70">ca-app-pub-3940256099942544/1033173712</span>
      </div>
    );
  }

  return null;
}
