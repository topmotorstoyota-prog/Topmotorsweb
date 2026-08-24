import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  FileCheck,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Award,
  Clock,
  Zap,
  Calendar,
  Gauge,
  ArrowRight
} from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import VehicleCard from '../components/VehicleCard';
import API_BASE_URL from '../config';
import toyotaQHero from '../assets/toyota-q/q.png';
import inspection150 from '../assets/toyota-q/150.jpg';

const ToyotaQ = () => {
  const { t } = useTranslation();
  const { loc, fuelType } = useLocale();
  useDocumentTitle('Toyota-Q баталгаат хэрэглэсэн машин', 'Toyota-гийн албан ёсны дилерээс 150 цэгийн шалгалт хийгдсэн, баталгаат чанарын гэрчилгээтэй хэрэглэсэн Toyota, Lexus автомашин.');
  const [qVehicles, setQVehicles] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    minYear: '',
    maxYear: '',
    minMileage: '',
    maxMileage: '',
    minPrice: '',
    maxPrice: ''
  });
  const vehicleSectionRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/toyota-q`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(v => {
          const formatNum = (num) => {
            if (!num) return '';
            const cleanNum = String(num).replace(/[^0-9]/g, '');
            return new Intl.NumberFormat('en-US').format(cleanNum);
          };

          // Тоон утгуудыг цэвэрлэж авах (харьцуулалт хийхэд зориулж)
          const clean = (val) => parseInt(String(val).replace(/[^0-9]/g, '')) || 0;

          return {
            ...v,
            rawPrice: clean(v.price),
            rawMileage: clean(v.mileage),
            price: formatNum(v.price),
            formattedMileage: formatNum(v.mileage)
          };
        });
        setQVehicles(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Үнэ болон гүйлтийн талбарт мянгатын таслал нэмэх логик
    if (name.includes('Price') || name.includes('Mileage')) {
      const rawValue = value.replace(/[^0-9]/g, '');
      const formattedValue = rawValue ? new Intl.NumberFormat('en-US').format(rawValue) : '';
      setFilters(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const filteredVehicles = qVehicles.filter(vehicle => {
    const nameMatch = !filters.name || loc(vehicle.name, vehicle.nameEn)?.toLowerCase().includes(filters.name.toLowerCase());

    const year = parseInt(vehicle.year) || 0;
    const yearMatch = (!filters.minYear || year >= parseInt(filters.minYear)) &&
                      (!filters.maxYear || year <= parseInt(filters.maxYear));

    // Харьцуулахдаа таслалыг арилгаж тоо болгоно
    const cleanNum = (val) => parseInt(String(val).replace(/[^0-9]/g, '')) || 0;

    const mileage = vehicle.rawMileage || 0;
    const minM = cleanNum(filters.minMileage);
    const maxM = cleanNum(filters.maxMileage);
    const mileageMatch = (!minM || mileage >= minM) &&
                         (!maxM || mileage <= maxM);

    const price = vehicle.rawPrice || 0;
    const minP = cleanNum(filters.minPrice);
    const maxP = cleanNum(filters.maxPrice);
    const priceMatch = (!minP || price >= minP) &&
                       (!maxP || price <= maxP);

    return nameMatch && yearMatch && mileageMatch && priceMatch;
  });

  const scrollToVehicles = () => {
    vehicleSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pb-20 bg-white">
      {/* Hero Section - Background touches navbar, content is pushed down */}
      <section className="relative h-[60vh] md:h-[85vh] flex flex-col md:flex-row overflow-hidden bg-toyota-black">
        {/* Left Side: Solid Background with Text */}
        <div className="w-full md:w-[40%] h-full bg-toyota-black flex items-end justify-start p-6 md:p-16 lg:p-24 pb-12 md:pb-32 pt-[100px] relative order-2 md:order-1 z-10 hidden md:flex">
          {/* Decorative Red Accent */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-toyota-red hidden md:block" />

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl text-white text-left w-full"
          >
  
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-4 md:mb-8">
              TOYOTA- <span className="text-toyota-red">Q</span>
            </h1>
            <p className="text-sm md:text-xl font-bold uppercase tracking-tight mb-4 md:mb-6 leading-tight">
                {t('toyotaQ.heroSubtitle')}
            </p>
            <p className="text-xs md:text-base text-zinc-400 font-medium mb-12 md:mb-24 leading-relaxed max-w-md">
              {t('toyotaQ.heroDesc')}
            </p>
            <div className="flex flex-col sm:flex-row justify-start gap-3">
                <Button
                  variant="white"
                  size="lg"
                  className="group px-8 text-[10px] md:text-xs"
                  onClick={scrollToVehicles}
                >
                    <span>{t('toyotaQ.viewVehicles')} </span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Button>
                <Link to="/contact">
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 backdrop-blur-sm text-[10px] md:text-xs"
                    >
                      {t('toyotaQ.sellVehicle')}
                    </Button>
                </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Image - Pushed down to be fully visible under navbar */}
        <div className="w-full md:w-[60%] h-full relative order-1 md:order-2 pt-[80px] md:pt-0 bg-toyota-black">
          <img
            src={toyotaQHero}
            alt="Toyota Q Certified Pre-owned"
            className="w-full h-full object-contain object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-toyota-black via-transparent to-transparent hidden md:block" />
        </div>
      </section>

      {/* Definition Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 md:mb-8">{t('toyotaQ.whatIsTitle')}</h2>
                <div className="space-y-4 md:space-y-6 text-zinc-600 leading-relaxed text-sm md:text-base">
                    <p>
                        {t('toyotaQ.whatIsDesc')}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
                {[
                    { icon: RefreshCcw, title: "Trade-in", desc: t('toyotaQ.cards.tradeIn') },
                    { icon: Search, title: t('toyotaQ.cards.buyTitle'), desc: t('toyotaQ.cards.buyDesc') },
                    { icon: Award, title: t('toyotaQ.cards.consignTitle'), desc: t('toyotaQ.cards.consignDesc') },
                    { icon: FileCheck, title: t('toyotaQ.cards.points150Title'), desc: t('toyotaQ.cards.points150Desc') }
                ].map((item, i) => (
                    <div key={i} className="p-4 md:p-8 bg-toyota-gray-100 border border-zinc-200 hover:border-toyota-red transition-colors text-center md:text-left">
                        <item.icon className="text-toyota-red mb-3 md:mb-4 mx-auto md:mx-0" size={24} md:size={32} />
                        <h4 className="font-black uppercase text-[10px] md:text-sm mb-1">{item.title}</h4>
                        <p className="text-[8px] md:text-xs text-zinc-500 leading-tight md:leading-normal">{item.desc}</p>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Available Vehicles Section */}
      <section ref={vehicleSectionRef} className="py-12 md:py-16 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16">
            <div>
              <span className="text-toyota-red font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">{t('toyotaQ.currentlyForSale')}</span>
              <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight mt-1 md:mt-2">
                Toyota-Q <span className="text-toyota-red">{t('toyotaQ.vehiclesTitleRed')}</span>
              </h2>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Filter Sidebar */}
            <aside className="w-full lg:w-80 lg:sticky lg:top-28 bg-white p-4 md:p-7 border border-zinc-200 shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-2 mb-4 md:mb-8 pb-2 md:pb-4 border-b border-zinc-100">
                    <Search size={16} className="text-toyota-red md:w-[18px] md:h-[18px]" />
                    <h3 className="font-black uppercase tracking-tight text-[11px] md:text-sm">{t('toyotaQ.filters.title')}</h3>
                </div>

                <div className="space-y-4 md:space-y-7">
                    {/* Нэрээр хайх */}
                    <div className="space-y-1.5 md:space-y-2.5">
                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('toyotaQ.filters.byName')}</label>
                        <input
                            type="text"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            placeholder={t('toyotaQ.filters.searchModel')}
                            className="w-full bg-zinc-50 border border-zinc-200 py-2 md:py-3 px-3 md:px-4 text-[10px] md:text-xs focus:outline-none focus:border-toyota-red transition-colors placeholder:text-zinc-300"
                        />
                    </div>

                    {/* Оноор хайх */}
                    <div className="space-y-1.5 md:space-y-2.5">
                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('toyotaQ.filters.byYear')}</label>
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                            <div className="relative">
                                <input
                                    type="number"
                                    name="minYear"
                                    value={filters.minYear}
                                    onChange={handleFilterChange}
                                    placeholder={t('toyotaQ.filters.min')}
                                    className="w-full bg-zinc-50 border border-zinc-200 py-2 md:py-3 px-2 md:px-3 text-[10px] md:text-[11px] focus:outline-none focus:border-toyota-red transition-colors placeholder:text-zinc-300"
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="maxYear"
                                    value={filters.maxYear}
                                    onChange={handleFilterChange}
                                    placeholder={t('toyotaQ.filters.max')}
                                    className="w-full bg-zinc-50 border border-zinc-200 py-2 md:py-3 px-2 md:px-3 text-[10px] md:text-[11px] focus:outline-none focus:border-toyota-red transition-colors placeholder:text-zinc-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Гүйлт */}
                    <div className="space-y-1.5 md:space-y-2.5">
                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('toyotaQ.filters.byMileage')}</label>
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                            <input
                                type="text"
                                name="minMileage"
                                value={filters.minMileage}
                                onChange={handleFilterChange}
                                placeholder={t('toyotaQ.filters.min')}
                                className="w-full bg-zinc-50 border border-zinc-200 py-2 md:py-3 px-2 md:px-3 text-[10px] md:text-[11px] focus:outline-none focus:border-toyota-red transition-colors placeholder:text-zinc-300"
                            />
                            <input
                                type="text"
                                name="maxMileage"
                                value={filters.maxMileage}
                                onChange={handleFilterChange}
                                placeholder={t('toyotaQ.filters.max')}
                                className="w-full bg-zinc-50 border border-zinc-200 py-2 md:py-3 px-2 md:px-3 text-[10px] md:text-[11px] focus:outline-none focus:border-toyota-red transition-colors placeholder:text-zinc-300"
                            />
                        </div>
                    </div>

                    {/* Үнэ */}
                    <div className="space-y-1.5 md:space-y-2.5">
                        <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('toyotaQ.filters.byPrice')}</label>
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                            <input
                                type="text"
                                name="minPrice"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                placeholder={t('toyotaQ.filters.min')}
                                className="w-full bg-zinc-50 border border-zinc-200 py-2 md:py-3 px-2 md:px-3 text-[10px] md:text-[11px] focus:outline-none focus:border-toyota-red transition-colors placeholder:text-zinc-300"
                            />
                            <input
                                type="text"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                placeholder={t('toyotaQ.filters.max')}
                                className="w-full bg-zinc-50 border border-zinc-200 py-2 md:py-3 px-2 md:px-3 text-[10px] md:text-[11px] focus:outline-none focus:border-toyota-red transition-colors placeholder:text-zinc-300"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setFilters({ name: '', minYear: '', maxYear: '', minMileage: '', maxMileage: '', minPrice: '', maxPrice: '' })}
                        className="w-full pt-2 md:pt-4 py-1 md:py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-toyota-red transition-colors"
                    >
                        {t('toyotaQ.filters.clear')}
                    </button>
                </div>
            </aside>

            {/* Vehicle List */}
            <div className="flex-grow w-full">
                {filteredVehicles.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                        {filteredVehicles.map((vehicle, index) => (
                            <motion.div
                                key={vehicle.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <VehicleCard
                                  {...vehicle}
                                  name={loc(vehicle.name, vehicle.nameEn)}
                                  specs={[
                                    vehicle.year ? `${vehicle.year} ${t('toyotaQ.yearSuffix')}`.trim() : null,
                                    vehicle.mileage ? `${vehicle.formattedMileage} ${t('toyotaQ.kmSuffix')}`.trim() : null,
                                    vehicle.engine ? `${vehicle.engine} ${fuelType(vehicle.engineType) || ''}`.trim() : null
                                  ].filter(Boolean)}
                                  isFixedPrice={true}
                                  link={`/toyota-q/${vehicle.id}`}
                                  isToyotaQ={true}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-white border border-dashed border-zinc-200 w-full">
                        <p className="text-zinc-400 uppercase font-bold text-xs tracking-widest">{t('toyotaQ.filters.noResults')}</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* Diagnostic 150 Points */}
      <section className="py-12 md:py-16 bg-toyota-gray-100 overflow-hidden relative">
        <div className="container-custom px-4">
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-20">
                <div className="w-full lg:w-1/2 relative">
                    <img src={inspection150} alt="150 Points Inspection" className="w-full h-40 md:h-auto object-cover shadow-lg md:shadow-2xl" />
                    <div className="absolute -top-4 md:-top-10 -right-4 md:-right-10 bg-toyota-red p-4 md:p-12 text-white">
                        <span className="text-2xl md:text-6xl font-black block leading-none">150</span>
                        <span className="text-[7px] md:text-xs font-bold uppercase tracking-widest">{t('toyotaQ.inspection.badge')}</span>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <h2 className="text-xl md:text-4xl font-black uppercase tracking-tight mb-3 md:mb-8 text-center md:text-left">{t('toyotaQ.inspection.title')}</h2>
                    <p className="text-zinc-600 mb-6 md:mb-8 leading-relaxed text-[10px] md:text-base text-justify font-medium">
                        {t('toyotaQ.inspection.desc')}
                    </p>
                    <ul className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
                        {t('toyotaQ.inspection.items', { returnObjects: true }).map((li, i) => (
                            <li key={i} className="flex items-center gap-2 md:gap-3 text-[8px] md:text-sm font-bold uppercase tracking-tight">
                                <CheckCircle2 size={12} className="text-toyota-red shrink-0 md:w-4 md:h-4" />
                                {li}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* Exclusions Section */}
      <section className="py-12 md:py-16 bg-zinc-900 text-white">
        <div className="container-custom px-4">
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight mb-8 md:mb-12 flex items-center gap-3">
                <AlertCircle className="text-toyota-red w-5 h-5 md:w-8 md:h-8" />
                {t('toyotaQ.exclusions.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {t('toyotaQ.exclusions.items', { returnObjects: true }).map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 md:p-4 border border-zinc-800 hover:border-zinc-700 transition-colors">
                        <span className="text-toyota-red font-black text-xs md:text-base">/</span>
                        <p className="text-[10px] md:text-sm text-zinc-400 font-medium">{item}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-10 md:py-16 bg-white">
          <div className="container-custom px-4 text-center">
              <div className="max-w-2xl mx-auto border-2 border-toyota-black p-8 md:p-14">
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4 md:mb-6 leading-tight">{t('toyotaQ.finalCta.title')}</h2>
                  <p className="text-zinc-500 text-[10px] md:text-base mb-8 md:mb-10 font-medium px-4">{t('toyotaQ.finalCta.desc')}</p>
                  <div className="flex justify-center">
                      <Link to="/contact" className="w-full sm:w-auto">
                        <Button variant="primary" size="lg" className="w-full sm:px-12 py-3.5 md:py-4 text-[10px] md:text-xs font-black uppercase tracking-widest">{t('nav.contact')}</Button>
                      </Link>
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
};

export default ToyotaQ;
