import React from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

const LanguageToggle = ({ isWhiteNav = true, isBlackNav = false, className = '' }) => {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('en') ? 'en' : 'mn';

  const switchTo = (lng) => {
    if (lng === current) return;
    window.dispatchEvent(new CustomEvent('lang-transition'));
    setTimeout(() => i18n.changeLanguage(lng), 180);
  };

  return (
    <div
      className={clsx(
        "flex items-center rounded-full border p-0.5 text-[10px] font-black uppercase tracking-widest select-none",
        isBlackNav ? "border-zinc-700" : (isWhiteNav ? "border-zinc-300" : "border-white/40"),
        className
      )}
    >
      <button
        type="button"
        onClick={() => switchTo('mn')}
        className={clsx(
          "px-2.5 py-1 rounded-full transition-all",
          current === 'mn'
            ? "bg-toyota-black text-white"
            : (isBlackNav || !isWhiteNav ? "text-white/70 hover:text-white" : "text-zinc-400 hover:text-toyota-black")
        )}
      >
        MN
      </button>
      <button
        type="button"
        onClick={() => switchTo('en')}
        className={clsx(
          "px-2.5 py-1 rounded-full transition-all",
          current === 'en'
            ? "bg-toyota-black text-white"
            : (isBlackNav || !isWhiteNav ? "text-white/70 hover:text-white" : "text-zinc-400 hover:text-toyota-black")
        )}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
