import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import VehicleCard from '../components/VehicleCard';
import ComparisonModal from '../components/ComparisonModal';
import API_BASE_URL from '../config';
import { Link } from 'react-router-dom';
import hiluxImage from '../assets/vehicles/hilux.png';

// id нь vehicle.category-той тохирдог өгөгдлийн утга тул монгол хэвээр байлгав; labelKey нь зөвхөн харуулах орчуулга
const categories = [
  { id: 'Бүх загварууд', labelKey: 'vehicles.categories.all' },
  { id: 'SUV', labelKey: null },
  { id: 'Седан', labelKey: 'vehicles.categories.sedan' },
  { id: 'Пикап', labelKey: 'vehicles.categories.pickup' },
  { id: 'VAN', labelKey: null },
  { id: 'MPV', labelKey: null }
];

const VehicleList = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('Бүх загварууд');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/vehicles`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(v => ({
          ...v,
          colors: typeof v.colors === 'string' ? JSON.parse(v.colors) : v.colors,
          variants: typeof v.variants === 'string' ? JSON.parse(v.variants) : v.variants
        }));
        setVehicles(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredVehicles = vehicles.filter(v => {
    const matchesCategory = activeCategory === 'Бүх загварууд' ? true : v.category === activeCategory; // v.category нь өгөгдлийн сангийн монгол утгатай таарна
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectVehicle = (vehicle) => {
    if (selectedVehicles.length < 3 && !selectedVehicles.find(v => v.id === vehicle.id)) {
      setSelectedVehicles([...selectedVehicles, vehicle]);
    }
  };

  const handleRemoveVehicle = (vehicleId) => {
    setSelectedVehicles(selectedVehicles.filter(v => v.id !== vehicleId));
  };

  return (
    <div className="pt-20 lg:pt-24 bg-[#F7F7F7] min-h-screen">
      {/* 1. Breadcrumbs & Title */}
      <section className="bg-white border-b border-zinc-100 py-8 md:py-12">
        <div className="container-custom px-4 md:px-6">
            <div className="flex items-center space-x-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4 md:mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link to="/" className="hover:text-toyota-red transition-colors">{t('nav.homeShort')}</Link>
                <ChevronRight size={10} className="shrink-0" />
                <span className="text-toyota-black">{t('nav.newVehicles')}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-toyota-black uppercase leading-tight md:leading-none">
                        {t('vehicles.list.titlePlain')} <span className="text-toyota-red">{t('vehicles.list.titleRed')}</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setIsCompareOpen(true)}
                        className="w-full md:w-auto group flex items-center justify-center bg-white border border-zinc-200 px-6 py-3.5 hover:border-toyota-red transition-all shadow-sm active:scale-95 relative"
                    >
                        <SlidersHorizontal size={16} className="text-zinc-400 group-hover:text-toyota-red transition-colors mr-3" />
                        <span className="font-black uppercase tracking-widest text-[9px] md:text-[10px] text-zinc-600 group-hover:text-toyota-black">{t('vehicles.list.compareBtn')}</span>

                        <div className={`ml-4 min-w-[20px] h-5 md:min-w-[24px] md:h-6 px-1.5 rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-black transition-all duration-500 ${
                            selectedVehicles.length > 0
                            ? 'bg-toyota-red text-white shadow-lg shadow-red-500/30 scale-110'
                            : 'bg-zinc-100 text-zinc-400'
                        }`}>
                            {selectedVehicles.length}
                        </div>
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* 2. Advanced Filter Bar */}
      <section className="bg-white border-b border-zinc-200 sticky top-[64px] md:top-[80px] z-30 shadow-sm">
        <div className="container-custom px-0 md:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between">
                {/* Category Tabs */}
                <div className="flex overflow-x-auto no-scrollbar w-full lg:w-auto border-b lg:border-none border-zinc-100 px-4 md:px-0">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 md:px-6 py-4 md:py-5 text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap relative ${
                                activeCategory === cat.id
                                ? "text-toyota-red"
                                : "text-zinc-400 hover:text-toyota-black"
                            }`}
                        >
                            {cat.labelKey ? t(cat.labelKey) : cat.id}
                            {activeCategory === cat.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-toyota-red"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Search Field */}
                <div className="py-3 md:py-4 lg:py-0 w-full lg:w-auto flex items-center gap-4 px-4 md:px-0">
                    <div className="relative w-full lg:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                        <input
                            type="text"
                            placeholder={t('vehicles.list.searchPlaceholder')}
                            className="pl-10 pr-6 py-2.5 md:py-3 bg-zinc-50 border border-zinc-100 text-zinc-700 text-xs font-bold outline-none focus:border-toyota-red focus:bg-white w-full transition-all"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 3. Vehicle Grid */}
      <section className="py-12 md:py-24">
        <div className="container-custom px-4 md:px-6">
          {loading ? (
            <div className="text-center py-40">
                <div className="inline-block w-8 h-8 border-4 border-toyota-red border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-black uppercase tracking-widest text-zinc-300 text-xs">{t('vehicles.list.loading')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
              {filteredVehicles.map(vehicle => {
                const variants = vehicle.variants || [];

                // Хамгийн бага үнийг олох
                let minPrice = vehicle.price;
                if (variants.length > 0) {
                  const prices = variants
                    .map(varnt => varnt.price ? parseInt(varnt.price.replace(/,/g, '')) : Infinity)
                    .filter(p => !isNaN(p) && p !== Infinity);
                  if (prices.length > 0) {
                    minPrice = Math.min(...prices).toString();
                  }
                }

                const firstVariant = variants[0] || {};
                const specs = [
                  firstVariant.engine_spec,
                  firstVariant.trans_spec,
                  firstVariant.drive_spec
                ].filter(Boolean);

                return (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <VehicleCard
                        id={vehicle.id}
                        name={vehicle.name}
                        price={minPrice}
                        image={vehicle.image}
                        specs={specs}
                        isFixedPrice={variants.length <= 1}
                    />
                  </motion.div>
                );
              })}
              {filteredVehicles.length === 0 && (
                <div className="col-span-full text-center py-40 bg-white border border-dashed border-zinc-200">
                    <p className="text-zinc-400 font-black uppercase text-xs tracking-widest">{t('vehicles.list.noResults')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 4. Comparison CTA Banner */}
      <section className="container-custom px-4 md:px-6 pb-24">
        <div className="bg-toyota-black p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 relative overflow-hidden group shadow-2xl">
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-30 grayscale group-hover:grayscale-0 transition-all duration-1000 hidden md:block pointer-events-none">
              <img src={hiluxImage} alt="Comparison" className="w-full h-full object-contain object-right translate-x-12 scale-125" />
            </div>
            <div className="text-white relative z-10 max-w-lg text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 leading-tight">{t('vehicles.list.ctaTitleLine1')} <br />{t('vehicles.list.ctaTitleLine2')}</h3>
                <p className="text-zinc-400 text-xs md:text-base leading-relaxed">{t('vehicles.list.ctaDesc')}</p>
            </div>
            <button
              onClick={() => setIsCompareOpen(true)}
              className="w-full md:w-auto relative z-10 px-10 md:px-12 py-4 md:py-5 bg-toyota-red text-white font-black uppercase tracking-widest hover:bg-white hover:text-toyota-black transition-all shadow-xl active:scale-95 text-[10px] md:text-[11px]"
            >
                {t('vehicles.list.compareBtn')}
            </button>
        </div>
      </section>

      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        vehicles={vehicles}
        selectedVehicles={selectedVehicles}
        onSelectVehicle={handleSelectVehicle}
        onRemoveVehicle={handleRemoveVehicle}
      />
    </div>
  );
};

export default VehicleList;
