import React, { useState, useEffect } from 'react';
import { Calculator, X, Calendar, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './FloatingCalculator.css';

export const WheelIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Outer Tread Pattern (Teeth) */}
    <circle cx="12" cy="12" r="10.5" strokeDasharray="1.5 2" strokeWidth="3" className="opacity-40" />

    {/* Tire Sidewall */}
    <circle cx="12" cy="12" r="9" strokeWidth="3" />

    {/* Rim/Alloy */}
    <circle cx="12" cy="12" r="4.5" strokeWidth="1" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />

    {/* Sporty Spokes */}
    <path d="M12 4.5v3" />
    <path d="M12 16.5v3" />
    <path d="M4.5 12h3" />
    <path d="M16.5 12h3" />
    <path d="m17.3 6.7-2.1 2.1" />
    <path d="m8.8 15.2-2.1 2.1" />
    <path d="m6.7 6.7 2.1 2.1" />
    <path d="m15.2 15.2 2.1 2.1" />
  </svg>
);

const FloatingCalculator = ({ vehiclePrice = 150000000 }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = (e) => {
      if (e.detail && e.detail.price) {
        const cleanPrice = String(e.detail.price).replace(/[^0-9.]/g, '');
        const numericPrice = parseFloat(cleanPrice);
        if (!isNaN(numericPrice)) {
          setPrice(numericPrice);
        }
      }
      setIsOpen(true);
    };
    window.addEventListener('open-calculator', handleOpen);
    return () => window.removeEventListener('open-calculator', handleOpen);
  }, []);

  const [price, setPrice] = useState(vehiclePrice);

  useEffect(() => {
    setPrice(vehiclePrice);
  }, [vehiclePrice]);

  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [months, setMonths] = useState(60);
  const [interestRate, setInterestRate] = useState(1.5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    // Ensure all values are numeric
    const p = Number(price) || 0;
    const d = Number(downPaymentPercent) || 0;
    const m = Number(months) || 1;
    const r = Number(interestRate) || 0;

    const principal = p * (1 - d / 100);

    if (principal <= 0 || m <= 0) {
        setMonthlyPayment(0);
        return;
    }

    const monthlyRate = r / 100;

    if (monthlyRate === 0) {
        setMonthlyPayment(Math.round(principal / m));
    } else {
        const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, m)) / (Math.pow(1 + monthlyRate, m) - 1);
        setMonthlyPayment(isNaN(payment) ? 0 : Math.round(payment));
    }
  }, [price, downPaymentPercent, months, interestRate]);

  return (
    <>
      {/* Visualizer Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="hidden lg:block fixed bottom-[104px] right-8 z-[60]"
      >
        <a
          href="https://topmotors.kt.mn/try"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-zinc-900 text-white h-16 w-16 hover:w-72 rounded-full shadow-2xl hover:bg-black transition-all duration-500 group overflow-hidden relative"
        >
          <div className="flex items-center justify-center w-16 h-16 shrink-0">
            <div className="bg-white/10 p-2.5 rounded-full transition-transform group-hover:scale-110">
              <WheelIcon className="w-6 h-6 animate-spin-slow" />
            </div>
          </div>
          <div className="absolute left-16 flex flex-col items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pr-8">
             <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1">{t('calculator.tryOnLabel1')}</span>
             <span className="text-sm font-black uppercase tracking-tighter leading-none">{t('calculator.tryOnLabel2')}</span>
          </div>
        </a>
      </motion.div>

      {/* Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="hidden lg:block fixed bottom-8 right-8 z-[60]"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center bg-toyota-red text-white h-16 w-16 hover:w-56 rounded-full shadow-2xl hover:bg-black transition-all duration-500 group overflow-hidden relative"
        >
          <div className="flex items-center justify-center w-16 h-16 shrink-0">
            <div className="bg-white/20 p-2.5 rounded-full transition-transform group-hover:scale-110">
              <Calculator size={24} />
            </div>
          </div>
          <div className="absolute left-16 flex flex-col items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pr-8">
             <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1">{t('calculator.buttonLabel1')}</span>
             <span className="text-sm font-black uppercase tracking-tighter leading-none">{t('calculator.buttonLabel2')}</span>
          </div>
        </button>
      </motion.div>

      {/* Side Drawer Overlay & Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="calc-overlay"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="calc-drawer"
            >
              <div className="calc-header">
                <div className="calc-header-title">
                  <Calculator size={20} color="#eb0a1e" />
                  <h3>{t('calculator.title')}</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="calc-close-btn">
                  <X size={18} />
                </button>
              </div>

              <div className="calc-content">
                <div className="calc-field-group">
                  <div className="calc-price-header">
                    <label className="calc-field-label">{t('calculator.vehiclePrice')}</label>
                    <div className="calc-price-input-container">
                      <input
                        type="text"
                        value={price.toLocaleString()}
                        onChange={(e) => {
                           const val = e.target.value.replace(/[^0-9]/g, '');
                           if (val.length <= 12) setPrice(Number(val));
                        }}
                        onFocus={(e) => e.target.select()}
                        className="calc-price-input"
                      />
                      <span className="calc-currency">₮</span>
                    </div>
                  </div>
                  <input
                    type="range" min="10000000" max="600000000" step="1000000"
                    value={price} onChange={(e) => setPrice(Number(e.target.value))}
                    className="calc-range"
                  />
                </div>

                <div className="calc-field-group">
                  <div className="calc-price-header">
                    <label className="calc-field-label"><Calendar size={10} /> {t('calculator.term')}</label>
                    <div className="calc-price-input-container">
                      <input
                        type="text"
                        value={months}
                        onChange={(e) => {
                           const val = e.target.value.replace(/[^0-9]/g, '');
                           if (val.length <= 3) setMonths(Number(val));
                        }}
                        onFocus={(e) => e.target.select()}
                        className="calc-price-input"
                        style={{ width: '3rem' }}
                      />
                      <span className="calc-currency" style={{ fontSize: '0.9rem' }}>{t('calculator.months')}</span>
                    </div>
                  </div>
                  <input
                    type="range" min="1" max="96" step="1"
                    value={months} onChange={(e) => setMonths(Number(e.target.value))}
                    className="calc-range"
                  />
                </div>

                <div className="calc-field-group">
                  <div className="calc-price-header">
                    <label className="calc-field-label">{t('calculator.downPayment')}</label>
                    <div className="flex flex-col items-end">
                      <div className="calc-price-input-container">
                        <input
                          type="text"
                          value={(price * (downPaymentPercent / 100)).toLocaleString()}
                          onChange={(e) => {
                             const val = e.target.value.replace(/[^0-9]/g, '');
                             const amount = Number(val);
                             if (price > 0) {
                               const percent = (amount / price) * 100;
                               setDownPaymentPercent(Math.min(100, Math.max(0, percent)));
                             }
                          }}
                          onFocus={(e) => e.target.select()}
                          className="calc-price-input"
                          style={{ width: '10rem' }}
                        />
                        <span className="calc-currency">₮</span>
                      </div>
                      <div className="calc-field-sub-value mt-1">
                        {Math.round(downPaymentPercent)}%
                      </div>
                    </div>
                  </div>
                  <input
                    type="range" min="0" max="90" step="5"
                    value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="calc-range"
                  />
                </div>

                <div className="calc-field-group">
                  <div className="calc-price-header">
                    <label className="calc-field-label">{t('calculator.monthlyRate')}</label>
                    <div className="calc-price-input-container">
                      <input
                        type="text"
                        value={interestRate}
                        onChange={(e) => {
                           const val = e.target.value.replace(/[^0-9.]/g, '');
                           if (val.split('.').length <= 2) setInterestRate(val);
                        }}
                        onBlur={() => setInterestRate(Number(interestRate) || 0)}
                        onFocus={(e) => e.target.select()}
                        className="calc-price-input"
                        style={{ width: '4rem' }}
                      />
                      <span className="calc-currency">%</span>
                    </div>
                  </div>
                  <input
                    type="range" min="0.5" max="5.0" step="0.05"
                    value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="calc-range"
                  />
                </div>

                <div className="calc-result-card">
                   <span className="calc-result-label">{t('calculator.monthlyPayment')}</span>
                   <h4 className="calc-result-value">{monthlyPayment.toLocaleString()}<span>₮</span></h4>

                   <div className="calc-result-details">
                     <div className="calc-result-item">
                       <span className="calc-result-item-label">{t('calculator.borrowAmount')}</span>
                       <span className="calc-result-item-value">{(price * (1 - downPaymentPercent/100)).toLocaleString()}<span>₮</span></span>
                     </div>
                     <div className="calc-result-item">
                       <span className="calc-result-item-label">{t('calculator.downPayment')} ({Math.round(downPaymentPercent)}%)</span>
                       <span className="calc-result-item-value">{(price * (downPaymentPercent/100)).toLocaleString()}<span>₮</span></span>
                     </div>
                   </div>
                </div>

                <div className="calc-note">
                  {t('calculator.note')}
                </div>
              </div>

              <div className="calc-footer">
                <button
                   onClick={() => setIsOpen(false)}
                   className="calc-close-cta"
                >
                  {t('calculator.close')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingCalculator;
