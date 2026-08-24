import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown, HelpCircle, Car, Settings, Wrench, CreditCard, ShieldCheck, History } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const categoryIcons = {
  sales: <Car size={18} />,
  service: <Settings size={18} />,
  parts: <Wrench size={18} />,
  finance: <CreditCard size={18} />,
  warranty: <ShieldCheck size={18} />,
  toyotaq: <History size={18} />
};

const FAQ = () => {
  const { t } = useTranslation();
  useDocumentTitle('Түгээмэл асуулт хариулт', 'Автомашин худалдан авах, засвар үйлчилгээ, баталгаа, санхүүжилтийн талаарх түгээмэл асуултын хариулт.');
  const faqCategories = ['sales', 'service', 'parts', 'finance', 'warranty', 'toyotaq'].map(id => ({
    id,
    title: t(`faq.categories.${id}.title`),
    icon: categoryIcons[id],
    questions: t(`faq.categories.${id}.questions`, { returnObjects: true })
  }));
  const [activeTab, setActiveTab] = useState(faqCategories[0].id);
  const [openIdx, setOpenIdx] = useState(null);

  const currentCategory = faqCategories.find(cat => cat.id === activeTab);

  if (!currentCategory) return null;

  return (
    <div className="pt-32 pb-20 bg-[#F7F7F7] min-h-screen font-['Toyota_Type']">
      <div className="container-custom max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-toyota-red mb-3">
            <HelpCircle size={20} />
            <span className="font-bold text-[10px] uppercase tracking-[0.3em]">{t('faq.helpLabel')}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#1A1A1A]">
            {t('faq.titlePlain')} <span className="text-toyota-red">{t('faq.titleRed')}</span>
          </h1>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-zinc-200 border border-zinc-200 mb-12 max-w-5xl mx-auto overflow-hidden">
          {faqCategories.map((category) => {
            const isActive = activeTab === category.id;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveTab(category.id);
                  setOpenIdx(null);
                }}
                className={`flex items-center gap-4 px-6 h-[72px] transition-all duration-300 text-left ${
                  isActive
                    ? 'bg-toyota-red text-white'
                    : 'bg-white text-[#2C3E50] hover:bg-zinc-50'
                }`}
              >
                <div className={`${isActive ? 'text-white' : 'text-toyota-red'} shrink-0`}>
                  {category.icon}
                </div>
                <span className="font-bold text-[12px] uppercase tracking-wider leading-snug">
                  {category.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Questions List */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3 max-w-4xl mx-auto"
        >
          <div className="mb-6 flex items-center gap-3 px-4">
             <div className="h-6 w-1 bg-toyota-red"></div>
             <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
               {currentCategory.title}
             </h2>
          </div>

          <div className="px-4 space-y-3">
            {currentCategory.questions.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="bg-white border border-zinc-200 rounded-none overflow-hidden transition-all duration-300 shadow-sm">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-zinc-50/50 transition-colors"
                  >
                    <span className="font-bold text-[#2C3E50] uppercase tracking-tight text-sm md:text-base leading-snug">
                      {faq.q}
                    </span>
                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-toyota-red' : 'text-zinc-400'}`}>
                      <ChevronDown size={20} />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="p-6 pt-0 border-t border-zinc-50 text-[#555] leading-relaxed font-medium text-sm md:text-base text-justify whitespace-pre-line">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
