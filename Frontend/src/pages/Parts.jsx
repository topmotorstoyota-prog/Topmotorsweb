import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Settings,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MapPin,
  Calendar,
  Package,
  Wrench,
  Award,
  Layers,
  HelpCircle,
  Globe,
  Cpu,
  Info
} from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import filterImage from '../assets/parts/filter.jpg';
import aisinImage from '../assets/parts/aisin.webp';

const Parts = () => {
  const { t } = useTranslation();
  useDocumentTitle('Эх сэлбэг', 'Toyota-гийн эх сэлбэг, лац наалт, чанарын баталгаа. AISIN болон бусад OEM нийлүүлэгчдийн бүтээгдэхүүн.');
  const responsibilities = [
    { title: t('parts.responsibilities.usage.title'), desc: t('parts.responsibilities.usage.desc'), icon: FileText },
    { title: t('parts.responsibilities.dealer.title'), desc: t('parts.responsibilities.dealer.desc'), icon: MapPin },
    { title: t('parts.responsibilities.regular.title'), desc: t('parts.responsibilities.regular.desc'), icon: Calendar },
    { title: t('parts.responsibilities.issues.title'), desc: t('parts.responsibilities.issues.desc'), icon: AlertTriangle },
    { title: t('parts.responsibilities.records.title'), desc: t('parts.responsibilities.records.desc'), icon: FileText }
  ];

  const videos = [
    { id: 'cqFmOFrTz6M', titleKey: 'brakePad1' },
    { id: 'YVq8pen7E2E', titleKey: 'brakePad2' },
    { id: 'Vt-05sD2UG4', titleKey: 'airFilter' },
    { id: 'HxPbfPW-Fbg', titleKey: 'sparkPlug' },
    { id: 'lEe6JZ0WZAY', titleKey: 'saveMoney' },
    { id: 'U5vgSyLB4jw', titleKey: 'safety' },
    { id: 'EKI8fXfEbvI', titleKey: 'enginePower' },
    { id: 'JuHYZtBIHtk', titleKey: 'oilFilter' },
    { id: '35FbTCKAqbE', titleKey: 'injectorCleaner' }
  ];



  return (
    <div className="pt-24 lg:pt-[120px] font-sans bg-white min-h-screen">
      {/* Intro Section */}
      <section className="py-12 lg:py-16">
        <div className="container-custom px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-toyota-black mb-6 lg:mb-8 leading-tight">
                {t('parts.heroTitleLine1')} <br /><span className="text-toyota-red">{t('parts.heroTitleLine2')}</span>
              </h1>
              <div className="space-y-4 lg:space-y-6 text-zinc-600 leading-relaxed text-sm lg:text-base font-medium text-left lg:text-justify">
                <p>
                  {t('parts.heroPara1')}
                </p>
                <p className="hidden md:block">
                  {t('parts.heroPara2')}
                </p>
                <p className="font-bold text-toyota-black border-l-4 border-toyota-red pl-4 lg:pl-6 italic text-[13px] lg:text-base">
                  {t('parts.heroQuote')}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-2xl relative z-10">
                <img
                  src={filterImage}
                  alt="Toyota Genuine Parts"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 lg:-bottom-6 -left-4 lg:-left-6 w-full h-full border-2 border-toyota-red/10 -z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Original Parts Videos */}
      <section className="py-16 lg:py-24 bg-toyota-gray-100">
        <div className="container-custom px-4 lg:px-8">
          <div className="text-center mb-10 lg:mb-16">
            <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-toyota-black">
              {t('parts.tipsTitlePlain')} <span className="text-toyota-red">{t('parts.tipsTitleRed')}</span>
            </h2>
            <div className="w-16 lg:w-20 h-1 bg-toyota-red mx-auto mt-4 lg:mt-6" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8">
            {videos.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-sm overflow-hidden shadow-lg lg:shadow-xl border border-zinc-200 group"
              >
                <div className="aspect-video relative">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={t(`parts.videos.${video.titleKey}`)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-2 lg:p-5 border-t border-zinc-50 flex items-center justify-between">
                  <h3 className="font-black uppercase tracking-tight text-[8px] lg:text-xs text-toyota-black truncate">{t(`parts.videos.${video.titleKey}`)}</h3>
                  <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-toyota-red rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     

      {/* AISIN Section */}
      <section className="py-16 lg:py-24 bg-white overflow-hidden border-t border-zinc-100">
        <div className="container-custom px-4 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              {/* AISIN Image/Brand Area */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                 <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                 >
                    <div className="aspect-video bg-zinc-100 rounded-sm overflow-hidden border border-zinc-200 shadow-lg lg:shadow-xl group mb-4 lg:mb-6">
                       <img
                          src={aisinImage}
                          alt="AISIN Manufacturing"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                       />
                    </div>
                    <div className="flex flex-col items-center">
                       <img
                          src="/src/assets/common/aisin_logo.png"
                          alt="AISIN"
                          className="h-4 lg:h-6 mb-2 lg:mb-3 opacity-90"
                          onError={(e) => e.target.style.display='none'}
                       />

                    </div>
                    <div className="absolute -top-4 -right-4 w-16 lg:w-24 h-16 lg:h-24 bg-toyota-red/5 -z-10 rounded-full blur-2xl" />
                 </motion.div>
              </div>

              {/* AISIN Info */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                 <div className="max-w-2xl text-center lg:text-left">
              
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 lg:mb-8 leading-[0.9]">
                       AISIN <span className="text-toyota-red">CORPORATION</span>
                    </h2>

                    <div className="space-y-4 lg:space-y-6 text-zinc-600 font-medium leading-relaxed mb-0 lg:mb-10 text-left lg:text-justify text-sm lg:text-base">
                       <p>
                          {t('parts.aisin.para1')}
                       </p>
                       <p className="hidden md:block">
                          {t('parts.aisin.para2')}
                       </p>
                    </div>


                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Owner Responsibility */}
      <section className="py-16 lg:py-20 bg-white border-t border-zinc-100">
        <div className="container-custom px-4 lg:px-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-12 gap-4 lg:gap-6">
              <div className="text-left lg:text-left">
                 <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                    {t('parts.responsibilitiesTitlePlain')} <span className="text-toyota-red">{t('parts.responsibilitiesTitleRed')}</span>
                 </h2>
              </div>
              <p className="text-zinc-600 font-medium text-[11px] lg:text-xs max-w-sm leading-relaxed text-left">
                {t('parts.responsibilitiesDesc')}
              </p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
              {responsibilities.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="p-5 lg:p-6 bg-zinc-50 border border-zinc-100 hover:bg-white hover:border-toyota-red hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300 group rounded-sm flex flex-col h-full"
                  >
                     <div className="flex items-start justify-between mb-4 lg:mb-6">
                        <div className="w-8 h-8 lg:w-9 lg:h-9 bg-white border border-zinc-200 flex items-center justify-center text-toyota-red group-hover:bg-toyota-red group-hover:text-white group-hover:border-toyota-red transition-all">
                           <Icon size={14} className="lg:size-16" />
                        </div>
                        <span className="text-lg lg:text-xl font-black text-zinc-200 group-hover:text-zinc-100 italic transition-colors leading-none">0{i + 1}</span>
                     </div>
                     <h3 className="font-black uppercase tracking-widest text-[9px] mb-2 lg:mb-3 text-toyota-black leading-tight min-h-[2.5em] flex items-center">{item.title}</h3>
                     <p className="text-zinc-500 text-[10px] leading-relaxed font-medium">{item.desc}</p>
                  </motion.div>
                );
              })}
           </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="py-12 lg:py-16 bg-toyota-red text-white">
        <div className="container-custom px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
            <Settings className="w-10 h-10 lg:w-12 lg:h-12 animate-spin-slow" />
            <div>
              <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">{t('parts.ctaLabel')}</p>
              <h3 className="text-xl lg:text-2xl font-black uppercase tracking-tighter">{t('parts.ctaTitle')}</h3>
            </div>
          </div>
          <Link to="/sales" className="w-full lg:w-auto">
            <button className="w-full lg:w-auto px-10 lg:px-12 py-4 lg:py-5 bg-white text-toyota-black font-black uppercase tracking-[0.2em] text-[10px] lg:text-[11px] hover:bg-black hover:text-white transition-all shadow-xl active:scale-95">
              {t('nav.contact')}
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Parts;
