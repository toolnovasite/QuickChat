import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { generateFancyText } from './fancyFonts';
export type { FancyStyle } from './fancyFonts';

export const toolsList = [
  { id: 'direct-message', title: 'Direct Message', description: 'Message without saving number', icon: 'MessageCircle' },
  { id: 'text-repeater', title: 'Text Repeater', description: 'Repeat text multiple times', icon: 'Repeat' },
  { id: 'fancy-text', title: 'Fancy Text', description: 'Stylish text generator', icon: 'Type' },
  { id: 'qr-generator', title: 'QR Chat', description: 'Generate WhatsApp QR codes', icon: 'QrCode' },
  { id: 'blank-message', title: 'Blank Message', description: 'Send empty messages', icon: 'AlignLeft' },
  { id: 'emoji-generator', title: 'Emoji Generator', description: 'Text to emoji letters', icon: 'Smile' },
  { id: 'link-generator', title: 'Link Generator', description: 'Create click-to-chat links', icon: 'Link' },
  { id: 'text-to-emoji', title: 'Text To Emoji', description: 'Convert letters to emoji', icon: 'Smile' },
  { id: 'emoji-combiner', title: 'Emoji Combiner', description: 'Combine emojis', icon: 'Puzzle' },
  { id: 'whatsapp-cleaner', title: 'WhatsApp Cleaner', description: 'Clean junk files', icon: 'Trash2' },
  { id: 'chat-shortcut', title: 'Chat Shortcut', description: 'Create home screen shortcut', icon: 'Zap' },
  { id: 'bio-generator', title: 'Bio Generator', description: 'Ideas for WhatsApp bio', icon: 'UserCircle' },
  { id: 'group-link-maker', title: 'Group Link Maker', description: 'Create group invite links', icon: 'Users' },
  { id: 'auto-reply', title: 'Auto Reply', description: 'Auto send reply messages', icon: 'Bot' },
  { id: 'quote-maker', title: 'Quote Maker', description: 'Generate motivational quotes', icon: 'Quote' },
  { id: 'hashtag-generator', title: 'Hashtag Generator', description: 'Generate trending hashtags', icon: 'Hash' },
  { id: 'font-preview', title: 'Font Preview', description: 'Preview text in multiple fonts', icon: 'Type' },
  { id: 'sticker-tools', title: 'Sticker Tools', description: 'Convert images to stickers', icon: 'Puzzle' },
  { id: 'qr-scanner', title: 'QR Scanner', description: 'Scan QR to Chat', icon: 'ScanLine' },
];
