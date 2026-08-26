import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Cog, Award, MapPin, Zap, ChevronDown, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Button from '../components/Button';
import VehicleCard from '../components/VehicleCard';
import API_BASE_URL from '../config';
import background1 from '../assets/home/background-1.jpg';
import background2 from '../assets/home/background-2.jpg';
import background3 from '../assets/home/background-3.jpg';
import serviceImage from '../assets/home/service.jpg';
import chiglelImage from '../assets/home/top.jpg';
import placeholderImage from '../assets/vehicles/hero.jpg';
import tiresImage from '../assets/acc/yokohama gallery.png';
import wheelsImage from '../assets/acc/Braid Gallery.jpg';
import merchImage from '../assets/acc/GR Gallery.webp';

const Home = () => {
  const { t } = useTranslation();
  useDocumentTitle(null, 'Toyota Top Motors LLC - Монгол дахь Тоёотагийн албан ёсны дилер. Шинэ Toyota автомашин, Toyota-Q баталгаат хэрэглэсэн машин, засвар үйлчилгээ, эх сэлбэг.');
  const { loc } = useLocale();
  const slides = [
    { id: 1, image: background1, title: t('home.hero.slide1.title'), titleRed: t('home.hero.slide1.titleRed'), desc: t('home.hero.slide1.desc') },
    { id: 2, image: background2, title: t('home.hero.slide2.title'), titleRed: t('home.hero.slide2.titleRed'), desc: t('home.hero.slide2.desc') },
    { id: 3, image: background3, title: t('home.hero.slide3.title'), titleRed: t('home.hero.slide3.titleRed'), desc: t('home.hero.slide3.desc') }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [latestNews, setLatestNews] = useState([]);
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [homeBanner, setHomeBanner] = useState(null);
  const trustImage = serviceImage;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  useEffect(() => {
    // Баннер авах
    fetch(`${API_BASE_URL}/api/home-banner`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setHomeBanner(data[0].image);
        }
      })
      .catch(err => console.error('Banner fetch error:', err));

    // Хамгийн сүүлийн 3 мэдээг авах
    fetch(`${API_BASE_URL}/api/news`)
      .then(res => res.json())
      .then(data => {
        setLatestNews(data.slice(0, 3));
      })
      .catch(err => console.error('News fetch error:', err));

    // Онцлох загваруудыг авах
    fetch(`${API_BASE_URL}/api/vehicles`)
      .then(res => res.json())
      .then(data => {
        const featured = data.filter(v => v.isFeatured).map(v => {
          const variants = typeof v.variants === 'string' ? JSON.parse(v.variants || '[]') : (v.variants || []);

          // Хамгийн бага үнийг олох
          let minPrice = v.price;
          if (variants.length > 0) {
            const prices = variants
              .map(varnt => varnt.price ? parseInt(varnt.price.replace(/,/g, '')) : Infinity)
              .filter(p => !isNaN(p) && p !== Infinity);
            if (prices.length > 0) {
              minPrice = Math.min(...prices).toString();
            }
          }

          const firstVariant = variants[0] || {};
          return {
            id: v.id,
            name: v.name,
            nameEn: v.nameEn,
            price: minPrice,
            image: v.image,
            engine_spec: firstVariant.engine_spec,
            engine_spec_en: firstVariant.engine_spec_en,
            trans_spec: firstVariant.trans_spec,
            trans_spec_en: firstVariant.trans_spec_en,
            drive_spec: firstVariant.drive_spec,
            drive_spec_en: firstVariant.drive_spec_en
          };
        });
        setFeaturedVehicles(featured);
      })
      .catch(err => console.error('Vehicles fetch error:', err));
  }, []);

  return (
    <div className="overflow-hidden font-sans">
      {/* Hero Section - Slider */}
      <section className="relative h-[75vh] md:h-screen bg-zinc-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10" />
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: "linear" }}
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover brightness-[0.85]"
            />
          </motion.div>
        </AnimatePresence>

        <div className="container-custom relative z-20 h-full flex items-end pb-12 md:pb-32 pt-20">
          <div className="max-w-4xl px-4 md:px-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="text-white"
              >
                <h1 className="text-3xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-3 md:mb-6">
                  {slides[currentSlide].title} <br />
                  <span className="text-toyota-red">{slides[currentSlide].titleRed}</span>
                </h1>
                <p className="text-[10px] md:text-base text-zinc-300 font-medium leading-relaxed mb-6 md:mb-10 max-w-xs md:max-w-lg border-l-2 border-toyota-red pl-3 md:pl-6 text-justify">
                  {slides[currentSlide].desc}
                </p>
                <div className="flex flex-row gap-2 md:gap-4">
                  <Link to="/vehicles" className="flex-1 sm:flex-none">
                    <Button variant="white" size="lg" className="group px-4 md:px-10 h-11 md:h-14 text-[9px] md:text-xs w-full">
                      <span>{t('home.hero.showroomBtn')}</span>
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform hidden sm:inline" size={14} />
                    </Button>
                  </Link>
                  <Link to="/booking?type=test_drive" className="flex-1 sm:flex-none">
                    <Button variant="outline" size="lg" className="px-4 md:px-10 h-11 md:h-14 backdrop-blur-sm text-[9px] md:text-xs w-full">{t('home.hero.testDriveBtn')}</Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3 md:gap-4">
            {slides.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 md:h-2.5 w-1.5 md:w-2.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'bg-toyota-red scale-125' : 'bg-white/40 hover:bg-white/60'}`} />
            ))}
        </div>
      </section>

      {/* Featured Vehicles */}
      <section id="featured-vehicles" className="pt-12 pb-0 md:pt-24 md:pb-0 bg-white">
        <div className="container-custom px-4 md:px-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16">
            <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight">{t('home.featured.titlePlain')} <span className="text-toyota-red">{t('home.featured.titleRed')}</span></h2>
            <Link to="/vehicles" className="group flex items-center text-[10px] md:text-sm font-bold uppercase tracking-widest mt-3 md:mt-0 text-toyota-black">
              {t('home.featured.viewAll')} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform text-toyota-red" size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {featuredVehicles.map((vehicle, index) => (
              <div key={vehicle.id}>
                <VehicleCard
                  {...vehicle}
                  name={loc(vehicle.name, vehicle.nameEn)}
                  specs={[
                    loc(vehicle.engine_spec, vehicle.engine_spec_en),
                    loc(vehicle.trans_spec, vehicle.trans_spec_en),
                    loc(vehicle.drive_spec, vehicle.drive_spec_en)
                  ].filter(Boolean)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Width Home Banner */}
      <section className="bg-white pt-10 pb-0 md:pt-20 md:pb-0">
        <div className="container-custom px-4 md:px-0">
          <div className="w-full relative overflow-hidden rounded-sm shadow-2xl">
             <img
               src={homeBanner || serviceImage}
               className="w-full h-auto block"
               alt="Toyota Banner"
             />
          </div>
        </div>
      </section>

      {/* Dynamic News Section */}
      <section className="pt-8 pb-12 md:pt-12 md:pb-24 bg-white">
        <div className="container-custom px-4 md:px-0">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 md:mb-16 gap-3">
            <div>
              <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight mt-2">{t('home.news.titlePlain')} <span className="text-toyota-red">{t('home.news.titleRed')}</span></h2>
            </div>
            <Link to="/news" className="group flex items-center text-[10px] md:text-sm font-bold uppercase tracking-widest text-toyota-black">
              {t('home.news.viewAll')} <ArrowRight className="ml-2 group-hover:translate-x-1 text-toyota-red transition-transform" size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8">
            {latestNews.map((news, idx) => (
              <motion.div key={news.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="group">
                <Link to={`/news/${news.id}`}>
                  <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden mb-2 md:mb-6 bg-zinc-100">
                    <img src={news.image || placeholderImage} alt={loc(news.title, news.titleEn)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <span className="text-zinc-400 text-[6px] md:text-xs font-medium uppercase tracking-widest">{news.date}</span>
                  <h3 className="text-[9px] md:text-xl font-bold mt-1 group-hover:text-toyota-red transition-colors line-clamp-2 uppercase tracking-tight leading-tight h-7 md:h-auto">{loc(news.title, news.titleEn)}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-12 md:py-24 bg-white border-t border-zinc-100">
        <div className="container-custom px-4 md:px-0">
          <div className="mb-8 md:mb-16">
            <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight mt-2">{t('home.products.titlePlain')} <span className="text-toyota-red">{t('home.products.titleRed')}</span></h2>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-8">
            {[
              { to: '/tires', image: tiresImage, label: t('home.products.tires') },
              { to: '/wheels', image: wheelsImage, label: t('home.products.wheels') },
              { to: '/merch', image: merchImage, label: t('home.products.merch') }
            ].map((item, idx) => (
              <motion.div key={item.to} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="group">
                <Link to={item.to}>
                  <div className="relative aspect-square overflow-hidden mb-2 md:mb-6 bg-zinc-100">
                    <img src={item.image} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <h3 className="text-[9px] md:text-xl font-bold uppercase tracking-tight group-hover:text-toyota-red transition-colors flex items-center justify-center md:justify-start gap-1 text-center md:text-left">
                    {item.label}
                    <ArrowRight className="hidden md:inline group-hover:translate-x-1 transition-transform" size={16} />
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="py-12 md:py-24 bg-toyota-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4 pointer-events-none"><span className="text-[100px] md:text-[200px] font-black tracking-tighter leading-none">TOYOTA</span></div>
        <div className="container-custom relative z-10 px-4 md:px-0">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight mb-3 md:mb-6">{t('home.service.title')}</h2>
            <p className="text-zinc-400 text-xs md:text-base px-2">{t('home.service.desc')}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {t('home.service.items', { returnObjects: true }).map((service, i) => (
              <div key={i} className="group border border-zinc-800 p-4 md:p-8 hover:bg-white hover:text-toyota-black transition-all duration-300">
                <h4 className="font-bold uppercase tracking-widest text-[9px] md:text-sm mb-2 md:mb-4">{service}</h4>
                <div className="w-6 h-[2px] bg-toyota-red group-hover:w-12 transition-all" />
              </div>
            ))}
          </div>
          <div className="mt-10 md:mt-16 text-center"><Link to="/booking"><Button variant="white" size="lg" className="px-10 md:px-12 w-full sm:w-auto text-[10px]">{t('home.service.bookNow')}</Button></Link></div>
        </div>
      </section>

      {/* Map Banner Section */}
      <section className="bg-white">
        <div className="flex flex-col lg:flex-row min-h-[400px]">
          {/* Left Side: Image (60%) */}
          <div className="lg:w-[60%] h-[180px] md:h-[400px] lg:h-auto relative overflow-hidden">
            <img
              src={chiglelImage}
              alt="Toyota Showroom"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side: Content (40%) */}
          <div className="lg:w-[40%] flex items-center justify-center p-6 md:p-12 lg:p-20 bg-zinc-50">
            <div className="text-center lg:text-left max-w-md lg:max-w-lg">
              <h3 className="text-xl lg:text-4xl font-black uppercase tracking-tight mb-3 lg:mb-8 leading-tight text-toyota-black">
                {t('home.visit.titleLine1')} <br className="hidden lg:block" /> {t('home.visit.titleLine2')}
              </h3>
              <p className="text-zinc-600 mb-4 lg:mb-10 leading-relaxed text-[11px] lg:text-lg px-2 lg:px-0">
                {t('home.visit.desc')}
              </p>
              <a href="https://www.google.com/maps/dir/?api=1&destination=47.914517,106.873933" target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto px-4 lg:px-0">
                <Button variant="outlineBlack" className="px-8 lg:px-14 w-full py-3.5 lg:py-5 text-[10px] lg:text-sm font-black uppercase tracking-widest">
                  {t('home.visit.directionsBtn')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
