import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, FileText, CheckCircle2, Info, Building2, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';

const Finance = () => {
  const { t } = useTranslation();
  const personalDocs = t('finance.personalDocs', { returnObjects: true });
  const orgDocs = t('finance.orgDocs', { returnObjects: true });
  const [price, setPrice] = useState(150000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [months, setMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(1.5);

  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    const principal = price * (1 - downPaymentPercent / 100);
    const monthlyRate = interestRate / 100;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    setMonthlyPayment(Math.round(payment));
  }, [price, downPaymentPercent, months, interestRate]);

  return (
    <div className="pt-28 md:pt-32 pb-20">
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Calculator Column */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 p-8 md:p-12 shadow-2xl">
              <div className="flex items-center gap-4 mb-10 border-b border-zinc-100 pb-6">
                <Calculator className="text-toyota-red" size={32} />
                <h3 className="text-2xl font-black uppercase tracking-tight">{t('finance.calcTitle')}</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{t('finance.priceLabel')}</label>
                    <span className="font-black text-toyota-black">{price.toLocaleString()}₮</span>
                  </div>
                  <input
                    type="range" min="10000000" max="500000000" step="1000000"
                    value={price} onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-toyota-red"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{t('finance.downPaymentLabel')}</label>
                      <span className="font-black text-toyota-black">{downPaymentPercent}%</span>
                    </div>
                    <input
                      type="range" min="10" max="50" step="5"
                      value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-toyota-red"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{t('finance.termLabel')}</label>
                      <span className="font-black text-toyota-black">{months} {t('finance.monthsUnit')}</span>
                    </div>
                    <select
                      value={months} onChange={(e) => setMonths(Number(e.target.value))}
                      className="w-full p-3 border border-zinc-200 font-bold focus:outline-none focus:border-toyota-red"
                    >
                      <option value={12}>{t('finance.termOptions.y1')}</option>
                      <option value={24}>{t('finance.termOptions.y2')}</option>
                      <option value={36}>{t('finance.termOptions.y3')}</option>
                      <option value={48}>{t('finance.termOptions.y4')}</option>
                      <option value={60}>{t('finance.termOptions.y5')}</option>
                    </select>
                  </div>
                </div>

                <div className="bg-toyota-black p-10 text-center relative overflow-hidden">
                   <div className="relative z-10">
                      <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">{t('finance.monthlyPaymentLabel')}</span>
                      <h4 className="text-white text-4xl md:text-5xl font-black tracking-tighter">{monthlyPayment.toLocaleString()}₮</h4>
                   </div>
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Calculator size={80} className="text-white" />
                   </div>
                </div>

                <p className="text-[10px] text-zinc-400 italic">{t('finance.disclaimer')}</p>
              </div>
            </div>

            {/* Documents Column */}
            <div className="lg:col-span-5">
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <FileText className="text-toyota-red" size={28} />
                  <h3 className="text-xl font-black uppercase tracking-tight">{t('finance.documentsTitle')}</h3>
                </div>

                <div className="space-y-8">
                  <div className="p-6 border border-zinc-100 bg-zinc-50">
                    <div className="flex items-center gap-3 mb-4">
                      <User size={18} className="text-toyota-red" />
                      <h4 className="font-bold uppercase text-sm tracking-widest">{t('finance.personalTitle')}</h4>
                    </div>
                    <ul className="space-y-3">
                      {personalDocs.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-zinc-600">
                          <CheckCircle2 size={14} className="text-green-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 border border-zinc-100 bg-zinc-50">
                    <div className="flex items-center gap-3 mb-4">
                      <Building2 size={18} className="text-toyota-red" />
                      <h4 className="font-bold uppercase text-sm tracking-widest">{t('finance.orgTitle')}</h4>
                    </div>
                    <ul className="space-y-3">
                      {orgDocs.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-zinc-600">
                          <CheckCircle2 size={14} className="text-green-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-toyota-red/5 p-8 border-l-4 border-toyota-red">
                <div className="flex gap-4">
                  <Info className="text-toyota-red shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold uppercase text-xs tracking-widest mb-2">{t('finance.tipTitle')}</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed">{t('finance.tipDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Finance;
