import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Gauge,
  Zap,
  CheckCircle2,
  Phone,
  MessageSquare,
  Info,
  Download,
  Calculator
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Button from '../components/Button';
import API_BASE_URL from '../config';

const ToyotaQDetail = () => {
  const { t } = useTranslation();
  const { loc, fuelType } = useLocale();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  useDocumentTitle(
    vehicle ? loc(vehicle.name, vehicle.nameEn) : null,
    vehicle ? `Toyota-Q баталгаат хэрэглэсэн машин: ${loc(vehicle.name, vehicle.nameEn)}. ${vehicle.year || ''} он, ${vehicle.mileage || ''} км.` : undefined
  );
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/toyota-q`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(v => v.id.toString() === id);
        if (found) {
          setVehicle(found);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="pt-40 pb-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-toyota-red border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black uppercase tracking-widest text-zinc-400">{t('vehicles.list.loading')}</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="pt-40 pb-20 text-center">
        <Info size={48} className="mx-auto text-zinc-200 mb-4" />
        <h2 className="text-2xl font-black uppercase mb-4">{t('toyotaQ.detail.notFound')}</h2>
        <Link to="/toyota-q">
          <Button variant="outlineBlack">{t('common.back')}</Button>
        </Link>
      </div>
    );
  }

  const formatNum = (num) => {
    if (!num) return '';
    const cleanNum = String(num).replace(/[^0-9]/g, '');
    return new Intl.NumberFormat('en-US').format(Number(cleanNum) || 0);
  };

  const detailImages = vehicle.images ? JSON.parse(vehicle.images) : [];
  const allImages = [vehicle.image, ...detailImages].filter(Boolean);

  const nextImg = () => {
    setCurrentImgIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImg = () => {
    setCurrentImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="pt-[80px] lg:pt-[120px] pb-10 md:pb-20 bg-white">
      {/* Breadcrumbs */}
      <div className="bg-toyota-gray-100 py-4 border-b border-zinc-200">
        <div className="container-custom flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <Link to="/" className="hover:text-toyota-black transition-colors">{t('nav.homeShort')}</Link>
          <ChevronRight size={10} />
          <Link to="/toyota-q" className="hover:text-toyota-black transition-colors">Toyota-Q</Link>
          <ChevronRight size={10} />
          <span className="text-toyota-black">{loc(vehicle.name, vehicle.nameEn)}</span>
        </div>
      </div>

      <section className="py-6 md:py-12">
        <div className="container-custom px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Gallery / Image Slider */}
            <div className="lg:col-span-8 order-1">
              <div className="relative aspect-[16/9] bg-zinc-100 overflow-hidden shadow-sm group rounded-sm">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImgIndex}
                    src={allImages[currentImgIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white flex items-center justify-center rounded-full shadow-lg transition-all z-10"
                    >
                      <ChevronLeft size={20} className="md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white flex items-center justify-center rounded-full shadow-lg transition-all z-10"
                    >
                      <ChevronRight size={20} className="md:w-6 md:h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImgIndex(i)}
                          className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${currentImgIndex === i ? 'bg-toyota-red w-3 md:w-4' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Desktop Only Description - Fixed gap issue */}
              <div className="hidden lg:block mt-12">
                <h3 className="text-sm md:text-xl font-black uppercase tracking-tight mb-4 border-l-4 border-toyota-red pl-3 md:pl-4">{t('toyotaQ.detail.descriptionTitle')}</h3>
                <div className="text-zinc-600 leading-relaxed whitespace-pre-wrap text-[11px] md:text-base font-medium">
                  {loc(vehicle.description, vehicle.descriptionEn) || t('toyotaQ.detail.defaultDescription')}
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-4 order-2">
              <div className="space-y-6 md:space-y-8">
                <div>
                  <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-2 leading-tight">{loc(vehicle.name, vehicle.nameEn)}</h1>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl md:text-3xl font-black text-toyota-red">₮{formatNum(vehicle.price)}</span>
                    </div>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('open-calculator', { detail: { price: vehicle.price } }))}
                      className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-toyota-red transition-colors w-fit mt-1"
                    >
                      <Calculator size={12} className="md:w-[14px] md:h-[14px]" />
                      <span className="border-b border-zinc-200 pb-0.5">{t('toyotaQ.detail.leaseCalculator')}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  <div className="p-3 md:p-5 bg-toyota-gray-100 border border-zinc-100 rounded-sm">
                    <Calendar className="text-toyota-red mb-2 md:mb-3 w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase block tracking-widest leading-none mb-1">{t('toyotaQ.detail.yearMade')}</span>
                    <span className="text-xs md:text-sm font-black uppercase">{vehicle.year} {t('toyotaQ.yearSuffix')}</span>
                  </div>
                  <div className="p-3 md:p-5 bg-toyota-gray-100 border border-zinc-100 rounded-sm">
                    <Gauge className="text-toyota-red mb-2 md:mb-3 w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase block tracking-widest leading-none mb-1">{t('toyotaQ.detail.mileage')}</span>
                    <span className="text-xs md:text-sm font-black uppercase">{formatNum(vehicle.mileage)} {t('toyotaQ.kmSuffix')}</span>
                  </div>
                  <div className="p-3 md:p-5 bg-toyota-gray-100 border border-zinc-100 rounded-sm">
                    <Zap className="text-toyota-red mb-2 md:mb-3 w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase block tracking-widest leading-none mb-1">{t('toyotaQ.detail.engine')}</span>
                    <span className="text-xs md:text-sm font-black uppercase">{vehicle.engine} {fuelType(vehicle.engineType)}</span>
                  </div>
                  {vehicle.serviceHistory ? (
                    <button
                      onClick={() => window.open(vehicle.serviceHistory, '_blank')}
                      className="p-3 md:p-5 bg-toyota-red text-white border border-toyota-red hover:bg-black hover:border-black transition-all group text-left flex flex-col justify-between rounded-sm"
                    >
                      <Download className="text-white mb-2 md:mb-3 group-hover:translate-y-1 transition-transform w-4 h-4 md:w-5 md:h-5" />
                      <div>
                        <span className="text-[8px] md:text-[10px] font-bold text-white/80 uppercase block tracking-widest leading-none mb-1">{t('toyotaQ.detail.serviceHistory')}</span>
                        <span className="text-xs md:text-sm font-black uppercase">{t('toyotaQ.detail.download')}</span>
                      </div>
                    </button>
                  ) : (
                    <div className="p-3 md:p-5 bg-zinc-50 border border-zinc-100 opacity-50 cursor-not-allowed rounded-sm">
                      <Download className="text-zinc-300 mb-2 md:mb-3 w-4 h-4 md:w-5 md:h-5" />
                      <div>
                        <span className="text-[8px] md:text-[10px] font-bold text-zinc-300 uppercase block tracking-widest leading-none mb-1">{t('toyotaQ.detail.serviceHistory')}</span>
                        <span className="text-xs md:text-sm font-black uppercase text-zinc-300">{t('toyotaQ.detail.none')}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Link to="/booking?type=sales">
                    <Button variant="primary" className="w-full py-4 md:py-5 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-toyota-red/10">
                      <span>{t('nav.contact')}</span>
                    </Button>
                  </Link>
                </div>

                <div className="p-4 md:p-6 bg-toyota-red/5 border border-toyota-red/10 rounded-sm">
                  <h4 className="font-black uppercase text-[10px] md:text-xs tracking-widest mb-3 md:mb-4 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-toyota-red md:w-4 md:h-4" />
                    {t('toyotaQ.detail.advantagesTitle')}
                  </h4>
                  <ul className="text-[8px] md:text-[10px] font-bold uppercase tracking-tight space-y-2 text-zinc-600">
                    {t('toyotaQ.detail.advantages', { returnObjects: true }).map((adv, i) => (
                      <li key={i}>• {adv}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Mobile Only Description - Stays in old position for mobile flow */}
            <div className="lg:hidden lg:col-span-8 order-3 mt-4">
              <h3 className="text-sm md:text-xl font-black uppercase tracking-tight mb-4 border-l-4 border-toyota-red pl-3 md:pl-4">Тайлбар</h3>
              <div className="text-zinc-600 leading-relaxed whitespace-pre-wrap text-[11px] md:text-base font-medium">
                {loc(vehicle.description, vehicle.descriptionEn) || t('toyotaQ.detail.defaultDescription')}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToyotaQDetail;
