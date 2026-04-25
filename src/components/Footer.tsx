import React from 'react';
import { dict, Language } from '../data';

export function Footer({ lang }: { lang: Language }) {
  const t = (key: keyof typeof dict['en']) => dict[lang][key];

  return (
    <footer className="px-6 sm:px-12 py-8 sm:py-6 bg-natural-footer flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-widest font-bold text-natural-text-meta gap-6 border-t border-natural-border mt-auto">
      <span className="text-center sm:text-left">{t('footerCopyright')}</span>
      <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
        <span>Phnom Penh</span>
        <span>Siem Reap</span>
        <span>Battambang</span>
      </div>
    </footer>
  );
}
