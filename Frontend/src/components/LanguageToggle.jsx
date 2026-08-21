import React from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

const MongoliaFlag = ({ className }) => (
  <svg viewBox="0 0 60 40" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="40" fill="#0066b3" />
    <rect width="20" height="40" fill="#c4272f" />
    <rect x="40" width="20" height="40" fill="#c4272f" />
    <g fill="#f7c500">
      <rect x="7" y="6" width="6" height="3" />
      <rect x="7" y="31" width="6" height="3" />
      <circle cx="10" cy="14" r="2.6" />
      <path d="M6.6 20.5a3.4 3.4 0 1 0 4.6-4.6 4.4 4.4 0 1 1 -4.6 4.6z" />
      <rect x="7.2" y="23" width="1.4" height="6" />
      <rect x="11.4" y="23" width="1.4" height="6" />
      <path d="M6 12 L10 9 L14 12 Z" />
    </g>
  </svg>
);

const UKFlag = ({ className }) => (
  <svg viewBox="0 0 60 40" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="40" fill="#00247d" />
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#cf142b" strokeWidth="3" />
    <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="13" />
    <path d="M30,0 V40 M0,20 H60" stroke="#cf142b" strokeWidth="8" />
  </svg>
);

const LanguageToggle = ({ isWhiteNav = true, isBlackNav = false, className = '' }) => {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('en') ? 'en' : 'mn';

  const switchTo = (lng) => {
    if (lng !== current) i18n.changeLanguage(lng);
  };

  return (
    <div
      className={clsx(
        "flex items-center rounded-full border p-0.5 select-none",
        isBlackNav ? "border-zinc-700" : (isWhiteNav ? "border-zinc-300" : "border-white/40"),
        className
      )}
    >
      <button
        type="button"
        onClick={() => switchTo('mn')}
        title="Монгол"
        aria-label="Монгол"
        className={clsx(
          "flex items-center justify-center w-7 h-6 md:w-8 md:h-6 rounded-full overflow-hidden transition-all",
          current === 'mn' ? "ring-2 ring-toyota-red scale-105" : "opacity-40 hover:opacity-80"
        )}
      >
        <MongoliaFlag className="w-full h-full object-cover" />
      </button>
      <button
        type="button"
        onClick={() => switchTo('en')}
        title="English"
        aria-label="English"
        className={clsx(
          "flex items-center justify-center w-7 h-6 md:w-8 md:h-6 rounded-full overflow-hidden transition-all",
          current === 'en' ? "ring-2 ring-toyota-red scale-105" : "opacity-40 hover:opacity-80"
        )}
      >
        <UKFlag className="w-full h-full object-cover" />
      </button>
    </div>
  );
};

export default LanguageToggle;
