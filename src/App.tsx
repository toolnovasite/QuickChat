import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { AdPlaceholder } from './components/AdPlaceholder';
import { toolsList } from './lib/utils';
import { Loader2 } from 'lucide-react';

const DirectMessage = lazy(() => import('./components/DirectMessage').then(m => ({ default: m.DirectMessage })));
const TextRepeater = lazy(() => import('./components/TextRepeater').then(m => ({ default: m.TextRepeater })));
const LinkGenerator = lazy(() => import('./components/LinkGenerator').then(m => ({ default: m.LinkGenerator })));
const QRGenerator = lazy(() => import('./components/QRGenerator').then(m => ({ default: m.QRGenerator })));
const QRScanner = lazy(() => import('./components/QRScanner').then(m => ({ default: m.QRScanner })));
const FancyText = lazy(() => import('./components/FancyText').then(m => ({ default: m.FancyText })));
const BioGenerator = lazy(() => import('./components/BioGenerator').then(m => ({ default: m.BioGenerator })));
const BlankMessage = lazy(() => import('./components/BlankMessage').then(m => ({ default: m.BlankMessage })));
const EmojiGenerator = lazy(() => import('./components/EmojiGenerator').then(m => ({ default: m.EmojiGenerator })));
const TextToEmoji = lazy(() => import('./components/TextToEmoji').then(m => ({ default: m.TextToEmoji })));
const EmojiCombiner = lazy(() => import('./components/EmojiCombiner').then(m => ({ default: m.EmojiCombiner })));
const WhatsAppCleaner = lazy(() => import('./components/WhatsAppCleaner').then(m => ({ default: m.WhatsAppCleaner })));
const ChatShortcut = lazy(() => import('./components/ChatShortcut').then(m => ({ default: m.ChatShortcut })));
const GroupLinkMaker = lazy(() => import('./components/GroupLinkMaker').then(m => ({ default: m.GroupLinkMaker })));
const AutoReply = lazy(() => import('./components/AutoReply').then(m => ({ default: m.AutoReply })));
const QuoteMaker = lazy(() => import('./components/QuoteMaker').then(m => ({ default: m.QuoteMaker })));
const HashtagGenerator = lazy(() => import('./components/HashtagGenerator').then(m => ({ default: m.HashtagGenerator })));
const FontPreview = lazy(() => import('./components/FontPreview').then(m => ({ default: m.FontPreview })));
const StickerTools = lazy(() => import('./components/StickerTools').then(m => ({ default: m.StickerTools })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 text-[#25D366] animate-spin" />
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInterstitial, setShowInterstitial] = useState(false);

  const [showGrowthPopup, setShowGrowthPopup] = useState(false);

  // Track actions for growth loop and ads
  const handleAction = () => {
    const count = parseInt(localStorage.getItem('actionCount') || '0', 10);
    const newCount = count + 1;
    localStorage.setItem('actionCount', newCount.toString());
    
    // Show interstitial ad randomly (e.g., 30% chance)
    if (Math.random() < 0.3) {
      // @ts-ignore
      if (window.Android && window.Android.showInterstitialAd) {
        // @ts-ignore
        window.Android.showInterstitialAd();
      } else {
        setShowInterstitial(true);
        setTimeout(() => setShowInterstitial(false), 3000); // Simulate ad closing after 3s
      }
    }

    // Show growth popup after every 3 successful actions if not rated
    if (newCount % 3 === 0 && !localStorage.getItem('hasRated')) {
      setShowGrowthPopup(true);
    }
  };

  const currentTool = toolsList.find(t => t.id === activeTab);
  const title = currentTool ? currentTool.title : 'QuickChat';
  const showBack = activeTab !== 'home';

  const renderContent = () => {
    let content = null;
    switch (activeTab) {
      case 'home':
        return (
          <>
            <Home onSelectTool={setActiveTab} searchQuery={searchQuery} />
            <div className="px-4 pb-4">
              <AdPlaceholder type="native" />
            </div>
          </>
        );
      case 'direct-message':
        content = <DirectMessage onAction={handleAction} />;
        break;
      case 'text-repeater':
        content = <TextRepeater onAction={handleAction} />;
        break;
      case 'link-generator':
        content = <LinkGenerator onAction={handleAction} />;
        break;
      case 'qr-generator':
        content = <QRGenerator onAction={handleAction} />;
        break;
      case 'qr-scanner':
        content = <QRScanner onAction={handleAction} />;
        break;
      case 'fancy-text':
        content = <FancyText onAction={handleAction} onBack={() => setActiveTab('home')} />;
        break;
      case 'bio-generator':
        content = <BioGenerator onAction={handleAction} />;
        break;
      case 'blank-message':
        content = <BlankMessage onAction={handleAction} />;
        break;
      case 'emoji-generator':
        content = <EmojiGenerator onAction={handleAction} />;
        break;
      case 'text-to-emoji':
        content = <TextToEmoji onAction={handleAction} />;
        break;
      case 'emoji-combiner':
        content = <EmojiCombiner onAction={handleAction} />;
        break;
      case 'whatsapp-cleaner':
        content = <WhatsAppCleaner onAction={handleAction} />;
        break;
      case 'chat-shortcut':
        content = <ChatShortcut onAction={handleAction} />;
        break;
      case 'group-link-maker':
        content = <GroupLinkMaker onAction={handleAction} />;
        break;
      case 'auto-reply':
        content = <AutoReply onAction={handleAction} />;
        break;
      case 'quote-maker':
        content = <QuoteMaker onAction={handleAction} />;
        break;
      case 'hashtag-generator':
        content = <HashtagGenerator onAction={handleAction} onBack={() => setActiveTab('home')} />;
        break;
      case 'font-preview':
        content = <FontPreview onAction={handleAction} />;
        break;
      case 'sticker-tools':
        content = <StickerTools onAction={handleAction} />;
        break;
      default:
        return <Home onSelectTool={setActiveTab} searchQuery={searchQuery} />;
    }

    return (
      <Suspense fallback={<LoadingFallback />}>
        {content}
      </Suspense>
    );
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        title={title}
        showBack={showBack}
        onBack={() => setActiveTab('home')}
        searchQuery={activeTab === 'home' ? searchQuery : undefined}
        setSearchQuery={activeTab === 'home' ? setSearchQuery : undefined}
        showGrowthPopup={showGrowthPopup}
        setShowGrowthPopup={setShowGrowthPopup}
      >
        {renderContent()}
      </Layout>

      {/* Interstitial Ad Overlay */}
      {showInterstitial && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center text-white">
          <div className="absolute top-4 right-4">
            <button onClick={() => setShowInterstitial(false)} className="text-gray-400 hover:text-white p-2">
              Close (X)
            </button>
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Advertisement</p>
          <AdPlaceholder type="interstitial" />
        </div>
      )}
    </>
  );
}
