import React from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

const MongoliaFlag = ({ className }) => (
  <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="20" fill="#c4272f" />
    <rect x="10" width="10" height="20" fill="#0066b3" />
    <g fill="#f7c500">
      <rect x="3.2" y="2.6" width="3.6" height="1.6" />
      <rect x="3.2" y="15.8" width="3.6" height="1.6" />
      <circle cx="5" cy="7.1" r="1.5" />
      <path d="M3 10.7a2 2 0 1 0 2.7-2.7 2.6 2.6 0 1 1 -2.7 2.7z" />
      <rect x="3.7" y="12.2" width="0.85" height="3" />
      <rect x="5.7" y="12.2" width="0.85" height="3" />
      <path d="M2.7 5.6 L5 4 L7.3 5.6 Z" />
    </g>
  </svg>
);

const UKFlag = ({ className }) => (
  <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="20" fill="#00247d" />
    <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fff" strokeWidth="4" />
    <path d="M0,0 L30,20 M30,0 L0,20" stroke="#cf142b" strokeWidth="1.6" />
    <path d="M15,0 V20 M0,10 H30" stroke="#fff" strokeWidth="6.5" />
    <path d="M15,0 V20 M0,10 H30" stroke="#cf142b" strokeWidth="4" />
  </svg>
);

const LanguageToggle = ({ isWhiteNav = true, isBlackNav = false, className = '' }) => {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('en') ? 'en' : 'mn';

  const switchTo = (lng) => {
    if (lng !== current) i18n.changeLanguage(lng);
  };

  const dim = isBlackNav || !isWhiteNav;

  return (
    <div className={clsx("flex items-center gap-2 select-none", className)}>
      <button
        type="button"
        onClick={() => switchTo('mn')}
        title="Монгол"
        aria-label="Монгол"
        className={clsx(
          "block w-7 h-5 md:w-8 md:h-[22px] rounded-[3px] overflow-hidden shadow-sm ring-1 transition-all duration-200",
          current === 'mn'
            ? "ring-toyota-red opacity-100"
            : clsx("ring-black/10", dim ? "opacity-50 hover:opacity-80" : "opacity-60 hover:opacity-90")
        )}
      >
        <MongoliaFlag className="w-full h-full block" />
      </button>
      <button
        type="button"
        onClick={() => switchTo('en')}
        title="English"
        aria-label="English"
        className={clsx(
          "block w-7 h-5 md:w-8 md:h-[22px] rounded-[3px] overflow-hidden shadow-sm ring-1 transition-all duration-200",
          current === 'en'
            ? "ring-toyota-red opacity-100"
            : clsx("ring-black/10", dim ? "opacity-50 hover:opacity-80" : "opacity-60 hover:opacity-90")
        )}
      >
        <UKFlag className="w-full h-full block" />
      </button>
    </div>
  );
};

export default LanguageToggle;
