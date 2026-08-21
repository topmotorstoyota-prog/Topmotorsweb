import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Shield, Wrench, Fuel, Users, Settings, Zap, CheckCircle2, SlidersHorizontal, Calendar, ArrowRight, ImageIcon, RotateCcw, Gauge, Droplets, Info, ChevronDown, Calculator, Rocket, RefreshCcw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import ComparisonModal from '../components/ComparisonModal';
import API_BASE_URL from '../config';

const MIN_360_IMAGES = 16;

const VehicleDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicleModel, setVehicleModel] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedEngine, setSelectedEngine] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);

  // 360 Rotation State
  const [rotationIndex, setRotationIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_BASE_URL}/api/vehicles`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(v => ({
          ...v,
          colors: typeof v.colors === 'string' ? JSON.parse(v.colors || '[]') : (v.colors || []),
          variants: typeof v.variants === 'string' ? JSON.parse(v.variants || '[]') : (v.variants || []),
          images: typeof v.images === 'string' ? JSON.parse(v.images || '[]') : (v.images || []),
          images360: typeof v.images360 === 'string' ? JSON.parse(v.images360 || '[]') : (v.images360 || []),
          features: typeof v.features === 'string' ? JSON.parse(v.features || '[]') : (v.features || [])
        }));
        setAllVehicles(formatted);

        const current = formatted.find(v => v.id.toLowerCase() === id.toLowerCase());
        if (!current) { setLoading(false); return; }

        setVehicleModel(current);

        // Initial Selection Logic
        const seriesList = [...new Set(current.variants.map(v => v.series))];
        if (seriesList.length > 0) {
            const firstSeries = seriesList[0];
            const firstVariant = current.variants.find(v => v.series === firstSeries);

            setSelectedVariant(firstVariant);
            setSelectedEngine(firstVariant.engineType);

            if (firstVariant?.colors?.length > 0) {
              setSelectedColor(firstVariant.colors[0]);
            }

            // Setup initial comparison with the first variant
            const variantId = `${current.id}-${firstVariant.series}-${firstVariant.engineType}`.replace(/\s+/g, '-').toLowerCase();

            const variantColors = typeof firstVariant.colors === 'string' ? JSON.parse(firstVariant.colors || '[]') : (firstVariant.colors || []);
            const colorWith360 = variantColors.find(c => c.images360 && c.images360.length > 0);
            const last360 = colorWith360?.images360[colorWith360.images360.length - 1];

            const formattedVariant = {
              ...firstVariant,
              id: variantId,
              modelName: current.name,
              modelId: current.id,
              category: current.category,
              fullName: `${current.name} - ${firstVariant.series} (${firstVariant.engineType})`,
              displayImage: last360 || firstVariant.image || current.image,
              features: firstVariant.features || []
            };
            setSelectedVehicles([formattedVariant]);
        } else if (current.colors?.length > 0) {
            setSelectedColor(current.colors[0]);
        }

        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  const handleSeriesChange = (series) => {
    const variantsForSeries = vehicleModel.variants.filter(v => v.series === series);
    const sameEngineVariant = variantsForSeries.find(v => v.engineType === selectedEngine);

    const targetVariant = sameEngineVariant || variantsForSeries[0];
    setSelectedEngine(targetVariant.engineType);
    handleVariantChange(targetVariant);
  };

  const handleEngineChange = (engine) => {
    const targetVariant = vehicleModel.variants.find(v => v.series === selectedVariant.series && v.engineType === engine);
    if (targetVariant) {
      setSelectedEngine(engine);
      handleVariantChange(targetVariant);
    }
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    if (variant?.colors?.length > 0) {
      const sameColor = variant.colors.find(c => c.name === selectedColor?.name);
      setSelectedColor(sameColor || variant.colors[0]);
    }
    setRotationIndex(0);

    if (vehicleModel && variant) {
      const variantId = `${vehicleModel.id}-${variant.series}-${variant.engineType}`.replace(/\s+/g, '-').toLowerCase();

      const variantColors = typeof variant.colors === 'string' ? JSON.parse(variant.colors || '[]') : (variant.colors || []);
      const colorWith360 = variantColors.find(c => c.images360 && c.images360.length > 0);
      const last360 = colorWith360?.images360[colorWith360.images360.length - 1];

      const formattedVariant = {
        ...variant,
        id: variantId,
        modelName: vehicleModel.name,
        modelId: vehicleModel.id,
        category: vehicleModel.category,
        fullName: `${vehicleModel.name} - ${variant.series} (${variant.engineType})`,
        displayImage: last360 || variant.image || vehicleModel.image,
        features: variant.features || []
      };
      setSelectedVehicles(prev => {
        const others = prev.filter(v => v.modelId !== vehicleModel.id);
        return [formattedVariant, ...others].slice(0, 3);
      });
    }
  };

  const handleRotationStart = (e) => {
    if (e.cancelable) e.preventDefault();
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    setStartX(clientX);
  };

  const handleRotationMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const diff = startX - currentX;
    const sensitivity = 8;
    if (Math.abs(diff) > sensitivity) {
      const step = diff > 0 ? -1 : 1;
      if (images360.length >= MIN_360_IMAGES) {
        setRotationIndex((prev) => (prev + step + images360.length) % images360.length);
        setStartX(currentX);
      }
    }
  };

  const handleRotationEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => { if (isDragging) setIsDragging(false); };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!selectedVariant?.interior360) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    script.async = true;
    script.onload = () => {
      if (window.pannellum) {
        window.pannellum.viewer('interior-panorama', {
          "type": "equirectangular",
          "panorama": selectedVariant.interior360,
          "autoLoad": true,
          "autoRotate": 0,
          "compass": false,
          "showZoomCtrl": true,
          "mouseZoom": false,
          "hfov": 110,
          "minPitch": -45,
          "maxPitch": 45,
          "minHfov": 50,
          "maxHfov": 130,
          "backgroundColor": [0, 0, 0]
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      try {
        if (document.head.contains(link)) document.head.removeChild(link);
        if (document.body.contains(script)) document.body.removeChild(script);
      } catch (e) {}
    };
  }, [selectedVariant?.interior360]);

  if (loading) return <div className="pt-40 text-center font-black uppercase tracking-widest text-zinc-300 font-sans">{t('vehicles.list.loading')}</div>;
  if (!vehicleModel) return <div className="pt-40 pb-20 text-center font-sans"><h2 className="text-2xl font-black uppercase mb-4 text-zinc-400">{t('vehicles.detail.notFound')}</h2><Link to="/vehicles"><Button variant="outlineBlack">{t('vehicles.detail.backToVehicles')}</Button></Link></div>;

  const formatPrice = (price) => {
    if (!price) return t('vehicles.detail.priceUnknown');
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const variantColor = selectedVariant?.colors?.find(c => c.name === selectedColor?.name);
  const images360 = variantColor?.images360 || [];
  const has360 = images360.length >= MIN_360_IMAGES;

  const displayImage = has360
    ? images360[rotationIndex % images360.length]
    : (images360[0] || selectedColor?.image || selectedVariant?.image || vehicleModel.image);

  const galleryImages = selectedVariant?.images?.length > 0 ? selectedVariant.images : (vehicleModel.images || []);

  const quickFeatures = selectedVariant ? [
    { icon: Zap, label: t('vehicles.detail.quickFeatures.engine'), value: selectedVariant.engine_spec || 'N/A' },
    { icon: Settings, label: t('vehicles.detail.quickFeatures.transmission'), value: selectedVariant.trans_spec || 'N/A' },
    { icon: Rocket, label: t('vehicles.detail.quickFeatures.horsepower'), value: selectedVariant.hp_spec || 'N/A' },
    { icon: RefreshCcw, label: t('vehicles.detail.quickFeatures.torque'), value: selectedVariant.torque_spec || 'N/A' }
  ] : [];

  // Үзүүлэлтүүдийг ангиллаар нь нэгтгэх функц
  const getMergedFeatures = () => {
    const rawFeatures = selectedVariant?.features || [];
    const merged = {};

    const categoryTranslations = {
      'INTERIOR': t('vehicles.detail.featureCategories.interior'),
      'EXTERIOR': t('vehicles.detail.featureCategories.exterior'),
      'SAFETY': t('vehicles.detail.featureCategories.safety'),
      'PERFORMANCE': t('vehicles.detail.featureCategories.performance'),
      'DIMENSIONS': t('vehicles.detail.featureCategories.dimensions'),
      'WHEELS': t('vehicles.detail.featureCategories.wheels')
    };

    rawFeatures.forEach(feat => {
      let catKey = feat.category?.toUpperCase() || 'БУСАД';
      const catLabel = categoryTranslations[catKey] || catKey;

      if (!merged[catLabel]) {
        merged[catLabel] = { category: catLabel, items: [] };
      }
      merged[catLabel].items = [...merged[catLabel].items, ...(feat.items || [])];
    });

    return Object.values(merged);
  };

  const featureCategories = getMergedFeatures();

  return (
    <div className="pt-20 lg:pt-28 pb-10 bg-white font-sans">
      <div className="bg-toyota-gray-100 py-2 md:py-4 border-b border-zinc-200">
        <div className="container-custom flex items-center space-x-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 overflow-x-auto no-scrollbar whitespace-nowrap px-4 lg:px-8">
          <Link to="/" className="hover:text-toyota-black transition-colors">{t('nav.homeShort')}</Link>
          <ChevronRight size={10} className="shrink-0" />
          <Link to="/vehicles" className="hover:text-toyota-black transition-colors">{t('nav.vehiclesShort')}</Link>
          <ChevronRight size={10} className="shrink-0" />
          <span className="text-toyota-black truncate">{vehicleModel.name}</span>
        </div>
      </div>

      <section className="py-4 lg:py-16 overflow-hidden">
        <div className="max-w-[95rem] mx-auto px-4 lg:px-8 w-full">
          <div className="flex flex-col gap-2 md:gap-4 mb-6 md:mb-12 items-center text-center">
              <h1 className="text-2xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-toyota-black leading-none mb-2 md:mb-4 w-full">{vehicleModel.name}</h1>

              {/* New Capsule Variant Selector */}
              <div className="inline-flex p-1 bg-zinc-100/50 rounded-full border border-zinc-200 backdrop-blur-sm shadow-inner">
                {[...new Set(vehicleModel.variants.map(v => v.series))].map((series) => (
                    <button
                      key={series}
                      onClick={() => handleSeriesChange(series)}
                      className={`px-6 md:px-12 py-2 md:py-3.5 rounded-full text-[8px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${selectedVariant.series === series ? "bg-toyota-black text-white shadow-xl scale-[1.03]" : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50"}`}
                    >
                      {series}
                    </button>
                ))}
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">

            {/* Left Column: Basic Features (List) - Moved down on mobile */}
            <div className="lg:col-span-3 order-3 lg:order-1 mt-6 lg:mt-0">
                <div className="mb-6 md:mb-10">
                  <div className="flex flex-col items-center lg:items-start mb-4 md:mb-8">
                    <h3 className="text-[9px] md:text-lg font-black uppercase tracking-[0.2em] text-toyota-black">{t('vehicles.detail.basicSpecs')}</h3>
                    <div className="w-6 md:w-12 h-[2px] bg-toyota-red mt-1.5 md:mt-2" />
                  </div>
                  <div className="grid grid-cols-2 md:flex md:flex-col gap-1.5 md:gap-3">
                    <AnimatePresence>
                      {quickFeatures.map((f, i) => (
                        <motion.div
                          key={`${f.label}-${selectedVariant?.id}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          className="flex items-center gap-2 md:gap-5 p-2.5 md:p-5 bg-white border border-zinc-100 rounded-lg md:rounded-2xl shadow-sm md:shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group"
                        >
                          <div className="text-toyota-red shrink-0 group-hover:scale-110 transition-transform">
                             <f.icon className="w-3.5 h-3.5 md:w-5 md:h-5" strokeWidth={2.5} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[6px] md:text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1 md:mb-1.5">{f.label}</span>
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={f.value}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="text-[8px] md:text-[11px] font-black uppercase text-toyota-black leading-tight truncate md:whitespace-nowrap"
                              >
                                {f.value}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
            </div>

            {/* Center Column: Visual Viewer (Centered) */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div
                className={`relative aspect-[16/9] bg-[#F6F6F6] overflow-hidden mb-6 md:mb-8 rounded-sm shadow-inner group ${has360 ? 'cursor-grab active:cursor-grabbing' : ''}`}
                onMouseDown={has360 ? handleRotationStart : undefined}
                onMouseMove={has360 ? handleRotationMove : undefined}
                onMouseUp={has360 ? handleRotationEnd : undefined}
                onMouseLeave={has360 ? handleRotationEnd : undefined}
                onTouchStart={has360 ? handleRotationStart : undefined}
                onTouchMove={has360 ? handleRotationMove : undefined}
                onTouchEnd={has360 ? handleRotationEnd : undefined}
              >
                {has360 ? (
                  <img src={displayImage} alt={vehicleModel.name} className="w-full h-full object-contain p-4 md:p-10 mix-blend-multiply pointer-events-none select-none" />
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.img key={displayImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} src={displayImage} alt={vehicleModel.name} className="w-full h-full object-contain p-4 md:p-10 mix-blend-multiply pointer-events-none select-none" />
                  </AnimatePresence>
                )}
                <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 bg-black/5 px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none flex items-center gap-1.5 md:gap-2">
                   {has360 ? (
                     <>
                        <RotateCcw size={10} className="text-zinc-400 animate-pulse" />
                        <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">{t('vehicles.detail.view360')}</p>
                     </>
                   ) : (
                     <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">{selectedColor?.name || t('vehicles.detail.defaultColor')}</p>
                   )}
                </div>
              </div>

                    {selectedVariant.colors?.length > 0 && (
                      <div className="mb-8 md:mb-10 flex flex-col items-center">
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 md:mb-4">{t('vehicles.detail.chooseColor')}</p>
                        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                          {selectedVariant.colors.map((color, i) => (
                            <button key={i} onClick={() => { setSelectedColor(color); setRotationIndex(0); }} className={`w-7 h-7 md:w-10 md:h-10 rounded-full border-2 transition-all flex items-center justify-center p-0.5 ${selectedColor?.name === color.name ? 'border-toyota-red scale-110 shadow-lg' : 'border-transparent'}`} title={color.name}>
                              <div className="w-full h-full rounded-full shadow-inner border border-black/10" style={{ backgroundColor: color.hex }} />
                            </button>
                          ))}
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={selectedColor?.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="text-[8px] md:text-[10px] font-bold text-zinc-500 mt-2 md:mt-3 uppercase tracking-widest italic"
                          >
                            {selectedColor?.name}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    )}
            </div>

            {/* Right Column: Price, Calculator, Engines, Order Button - Moved up on mobile */}
            <div className="lg:col-span-3 order-2 lg:order-3">
                <div className="mb-6 md:mb-8 text-center md:text-left">
                  <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 block mb-2 md:mb-3 border-l-2 border-toyota-red pl-2 md:pl-3 w-fit mx-auto md:mx-0">{t('vehicles.detail.totalPrice')}</span>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedVariant?.price}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-baseline justify-center md:justify-start gap-1 mb-2 md:mb-4"
                    >
                      <span className="text-2xl md:text-4xl lg:text-5xl font-black text-toyota-red tracking-tighter leading-none whitespace-nowrap">
                        {formatPrice(selectedVariant?.price || vehicleModel.price)}
                      </span>
                      <span className="text-lg font-black text-toyota-red">₮</span>
                    </motion.div>
                  </AnimatePresence>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-calculator', { detail: { price: selectedVariant?.price || vehicleModel.price } }))}
                    className="flex items-center justify-center md:justify-start gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-toyota-black/60 hover:text-toyota-red transition-all w-full md:w-fit group mt-1"
                  >
                    <Calculator size={14} className="group-hover:rotate-12 transition-transform" />
                    <span className="border-b border-zinc-200 group-hover:border-toyota-red pb-0.5">{t('vehicles.detail.calculator')}</span>
                  </button>
                </div>

                {selectedVariant && (
                  <div className="mb-8 md:mb-10 px-2">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-3 md:mb-4 text-center md:text-left">{t('vehicles.detail.quickFeatures.engine')}</p>
                    <div className="flex flex-col gap-1.5 md:gap-2" key={selectedVariant.series}>
                      <AnimatePresence>
                        {vehicleModel.variants.filter(v => v.series === selectedVariant.series).map(v => v.engineType).filter((v, i, a) => a.indexOf(v) === i).map((engine) => (
                            <motion.button
                              key={engine}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              onClick={() => handleEngineChange(engine)}
                              className={`w-full px-4 md:px-5 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] border transition-all duration-300 relative text-left flex justify-between items-center ${selectedEngine === engine ? "bg-toyota-black border-toyota-black text-white shadow-lg" : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400"}`}
                            >
                              {engine}
                              {selectedEngine === engine && <motion.div layoutId="engineDot" className="w-1 md:w-1.5 h-1 md:h-1.5 bg-toyota-red rounded-full" />}
                            </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                <div className="hidden lg:block">
                  <Link to="/booking?type=sales">
                    <Button variant="primary" className="w-full py-5 uppercase font-black tracking-[0.2em] text-[10px] md:text-xs shadow-xl shadow-toyota-red/10 hover:shadow-toyota-red/20 transition-all active:scale-[0.98]">
                      {t('nav.orderButton')}
                    </Button>
                  </Link>
                </div>
            </div>
          </div>

          {/* Description Section */}
          {(selectedVariant?.description || vehicleModel.description) && (
            <motion.div
              key={selectedVariant?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-10 md:mt-24 pt-8 border-t border-zinc-100"
            >
              <div className="max-w-7xl mx-auto">
                <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter mb-6 md:mb-8 text-toyota-black text-center">{t('vehicles.detail.aboutTitlePlain')} <span className="text-toyota-red">{t('vehicles.detail.aboutTitleRed')}</span></h3>
                <div className="bg-[#F9F9F9] p-6 md:p-12 rounded-sm border-l-4 border-toyota-red shadow-sm">
                  <p className="text-zinc-500 leading-relaxed text-[10px] md:text-sm whitespace-pre-wrap font-bold uppercase tracking-widest mb-4 md:mb-6 italic">
                    {selectedVariant?.series} {selectedEngine} {t('vehicles.detail.variantSuffix')}
                  </p>
                  <p className="text-zinc-600 leading-relaxed text-[11px] md:text-base whitespace-pre-wrap font-medium text-justify">
                    {selectedVariant?.description || vehicleModel.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>



      {/* Panorama Section */}
      {selectedVariant?.interior360 && (
        <section className="py-12 md:py-20 bg-black overflow-hidden relative border-t border-white/5">
           <div className="container-custom px-4 mb-8 md:mb-12">
              <div className="flex flex-col items-center text-center">
                  <span className="text-toyota-red font-black text-[9px] md:text-xs uppercase tracking-[0.4em] mb-3 md:mb-4 block leading-none">Interior</span>
                  <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter mb-3 md:mb-4 text-white leading-none">{t('vehicles.detail.salon')} <span className="text-toyota-red text-shadow-glow">360°</span></h2>
                  <div className="w-12 md:w-20 h-1 bg-toyota-red mt-3 md:mt-6" />
              </div>
           </div>

           <div className="container-custom px-4">
             <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2.5/1] bg-zinc-900 relative group rounded-sm overflow-hidden shadow-2xl border border-white/5">
                <div id="interior-panorama" className="w-full h-full" />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/20" />

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 px-5 py-2 rounded-full backdrop-blur-md border border-white/10 pointer-events-none">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/90 flex items-center justify-center gap-2">
                    <RotateCcw size={10} className="animate-spin shrink-0" />
                    {t('vehicles.detail.dragToRotate')}
                  </span>
                </div>
             </div>
           </div>
        </section>
      )}

  {/* Gallery Section */}
      <section className="py-12 md:py-24 bg-[#f8f9fa] overflow-hidden border-t border-zinc-100">
        <div className="container-custom px-4">
            <div className="flex flex-col items-center text-center mb-8 md:mb-16">
                <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter mb-3 md:mb-4 text-toyota-black leading-none">{t('vehicles.detail.galleryTitlePlain')} <span className="text-toyota-red">{t('vehicles.detail.galleryTitleRed')}</span></h2>
                <div className="w-12 md:w-20 h-1 bg-toyota-red mt-3 md:mt-6" />
            </div>
            {galleryImages.length > 0 ? (
              <div className="space-y-4 md:space-y-12 max-w-5xl mx-auto">
                  {galleryImages.map((img, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="w-full aspect-video relative overflow-hidden shadow-lg md:shadow-2xl rounded-sm bg-white border border-zinc-200">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                      </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-20 bg-white border-2 border-dashed border-zinc-100 rounded-sm">
                <ImageIcon size={32} className="mx-auto text-zinc-200 mb-2 md:mb-4" />
                <p className="font-black uppercase tracking-widest text-zinc-300 text-[8px] md:text-[10px]">{t('vehicles.detail.galleryEmpty')}</p>
              </div>
            )}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 md:py-24 bg-toyota-black text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-[0.03] translate-x-1/4 -translate-y-1/4 pointer-events-none text-[150px] md:text-[300px] font-black">TOYOTA</div>
        <div className="container-custom relative z-10 px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-center md:text-left">
                <div className="max-w-2xl">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-6 leading-[1.1]">{t('vehicles.list.ctaTitleLine1')} <br/><span className="text-toyota-red">{t('vehicles.list.ctaTitleLine2')}</span></h3>
                    <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                      {t('vehicles.detail.compareDesc', { name: vehicleModel.name, series: selectedVariant?.series || '' })}
                    </p>
                </div>
                <button onClick={() => setIsCompareOpen(true)} className="w-full md:w-auto px-10 md:px-12 py-4 md:py-5 bg-toyota-red text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-all shadow-xl shadow-toyota-red/20 active:scale-95 flex items-center justify-center gap-4 shrink-0">
                    <SlidersHorizontal size={18} />
                    <span>{t('vehicles.list.compareBtn')}</span>
                </button>
            </div>
        </div>
      </section>

      <ComparisonModal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} vehicles={allVehicles} selectedVehicles={selectedVehicles} onSelectVehicle={(v) => { if(selectedVehicles.length < 3) setSelectedVehicles([...selectedVehicles, v]); }} onRemoveVehicle={(vid) => setSelectedVehicles(selectedVehicles.filter(v => v.id !== vid))} />

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-[65px] left-0 right-0 bg-white border-t border-zinc-200 p-3 z-40 flex gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => setIsCompareOpen(true)}
          className="p-3.5 bg-zinc-100 text-zinc-900 rounded-sm"
          title={t('vehicles.list.compareBtn')}
        >
          <SlidersHorizontal size={18} />
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-calculator', { detail: { price: selectedVariant?.price || vehicleModel.price } }))}
          className="flex-1 py-3.5 bg-zinc-900 text-white font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 rounded-sm"
        >
          <Calculator size={14} />
          {t('vehicles.detail.calculator')}
        </button>
        <Link to="/booking?type=new_car_order" className="flex-[1.2]">
          <Button variant="primary" className="w-full py-3.5 text-[9px] font-black uppercase tracking-widest rounded-sm">
            {t('nav.orderButton')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VehicleDetail;
