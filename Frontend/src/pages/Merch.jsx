import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Phone, ArrowRight, PackageSearch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';
import Button from '../components/Button';
import API_BASE_URL from '../config';
import grLogo from '../assets/acc/gr-logo-black.svg';
import grHero from '../assets/acc/toyota-gr-merch-hero.jpg';
import placeholderImage from '../assets/vehicles/hero.jpg';

const formatPrice = (price) => {
  if (!price) return '';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const numericPrice = (p) => parseInt(String(p || '').replace(/[^0-9]/g, ''), 10) || 0;

const Merch = () => {
  const { t } = useTranslation();
  const { loc, stockStatus } = useLocale();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [stockFilter, setStockFilter] = useState('all');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(p => p.category === 'GR Merch');
        setProducts(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = products
    .filter(p => loc(p.name, p.nameEn).toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => stockFilter === 'all' || (p.stock || 'Бэлэн байгаа') === stockFilter)
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return numericPrice(a.price) - numericPrice(b.price);
      if (sortBy === 'priceDesc') return numericPrice(b.price) - numericPrice(a.price);
      return 0;
    });

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <div className="pt-[64px] lg:pt-[80px]">
        <section className="relative h-[62vh] md:h-[75vh] min-h-[440px] w-full overflow-hidden">
          <img
            src={grHero}
            alt="Toyota Gazoo Racing"
            className="absolute inset-0 w-full h-full object-cover object-[30%_center] md:object-center"
          />

          <div className="absolute inset-0 flex items-center">
            <div className="pl-6 sm:pl-10 md:pl-16 lg:pl-24 pr-6 md:pr-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-lg"
              >
                <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
                  <div className="h-9 md:h-12 w-fit shrink-0 drop-shadow-lg">
                    <img src={grLogo} alt="Toyota Gazoo Racing" className="h-full object-contain" />
                  </div>
                  <p className="text-white/90 text-sm md:text-lg leading-relaxed font-medium drop-shadow-lg">
                    {t('products.merch.longDesc')}
                  </p>
                </div>

                <a
                  href="#products"
                  className="inline-flex items-center gap-3 text-white font-black uppercase tracking-widest text-[10px] md:text-xs border-b-2 border-toyota-red pb-2 hover:gap-4 hover:text-toyota-red transition-all"
                >
                  {t('products.merch.browseCta')}
                  <ArrowRight size={14} />
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* Filter Bar */}
      <section id="products" className="border-b border-zinc-900 bg-black sticky top-[64px] lg:top-[80px] z-30 backdrop-blur-md bg-black/95 scroll-mt-[64px] lg:scroll-mt-[80px]">
        <div className="container-custom px-4 py-4 md:py-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-6">
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 shrink-0">
            {loading ? t('vehicles.list.loading') : t('products.merch.itemCount', { count: filteredProducts.length })}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto md:min-w-[560px]">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <input
                type="text"
                value={searchQuery}
                placeholder={t('products.searchPlaceholder')}
                className="pl-10 pr-6 py-2.5 md:py-3 bg-zinc-950 border border-zinc-800 text-white text-xs font-bold outline-none focus:border-toyota-red w-full transition-all placeholder:text-zinc-600 rounded-sm"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-4 py-2.5 md:py-3 bg-zinc-950 border border-zinc-800 text-white text-xs font-bold outline-none focus:border-toyota-red transition-all sm:w-48 rounded-sm cursor-pointer"
            >
              <option value="all">{t('products.stockFilter.all')}</option>
              <option value="Бэлэн байгаа">{stockStatus('Бэлэн байгаа')}</option>
              <option value="Захиалгаар">{stockStatus('Захиалгаар')}</option>
              <option value="Ирж байгаа">{stockStatus('Ирж байгаа')}</option>
              <option value="Дууссан">{stockStatus('Дууссан')}</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 md:py-3 bg-zinc-950 border border-zinc-800 text-white text-xs font-bold outline-none focus:border-toyota-red transition-all sm:w-48 rounded-sm cursor-pointer"
            >
              <option value="default">{t('products.sort.default')}</option>
              <option value="priceAsc">{t('products.sort.priceAsc')}</option>
              <option value="priceDesc">{t('products.sort.priceDesc')}</option>
            </select>
          </div>
        </div>
      </section>

      <div className="container-custom px-4 relative z-10 py-12 md:py-20">
        {loading ? (
          <div className="py-20 text-center font-black uppercase tracking-widest text-zinc-800">{t('vehicles.list.loading')}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: Math.min(idx, 8) * 0.04, duration: 0.5 }}
                className="group"
              >
                <Link to={`/merch/${item.id}`} className="block">
                  <div className="aspect-square bg-white overflow-hidden relative mb-4 md:mb-5 rounded-sm border border-zinc-900 group-hover:border-toyota-red/40 transition-all duration-500 shadow-[0_0_0_rgba(235,10,30,0)] group-hover:shadow-[0_10px_50px_-10px_rgba(235,10,30,0.35)]">
                    <img
                      src={item.image || placeholderImage}
                      alt={loc(item.name, item.nameEn)}
                      className="w-full h-full object-contain p-6 md:p-10 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
                    />

                    {item.stock === 'Дууссан' && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-30">
                        <span className="text-white font-black uppercase tracking-wider text-[8px] md:text-[11px] border border-white px-4 py-2">
                          {stockStatus('Дууссан')}
                        </span>
                      </div>
                    )}

                    {item.stock && item.stock !== 'Дууссан' && item.stock !== 'Бэлэн байгаа' && (
                      <div className="absolute top-2 left-2 z-30">
                        <span className="bg-toyota-black/90 text-white font-black uppercase tracking-wider text-[7px] md:text-[9px] px-2.5 py-1.5 rounded-sm border border-white/10">
                          {stockStatus(item.stock)}
                        </span>
                      </div>
                    )}

                    {/* Quick view hint */}
                    <div className="absolute bottom-0 left-0 right-0 bg-toyota-black/90 text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] py-2.5 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {t('products.viewDetails')} <ArrowRight size={11} />
                    </div>
                  </div>

                  <div className="space-y-1.5 px-0.5">
                    <span className="text-toyota-red font-black text-[8px] md:text-[9px] uppercase tracking-[0.25em]">GR Merch</span>
                    <h4 className="font-bold uppercase text-[11px] md:text-sm tracking-tight text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
                      {loc(item.name, item.nameEn)}
                    </h4>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-white font-black text-lg md:text-2xl tracking-tighter">{formatPrice(item.price)}</span>
                      <span className="text-white font-black text-base md:text-xl">₮</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="py-24 text-center flex flex-col items-center">
            <PackageSearch size={40} className="text-zinc-800 mb-4" />
            <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">
              {products.length === 0 ? t('products.noProducts') : t('products.noResults')}
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <section className="border-t border-zinc-900 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.03] translate-x-1/4 -translate-y-1/4 pointer-events-none text-[150px] md:text-[260px] font-black text-white whitespace-nowrap select-none">GR</div>
        <div className="container-custom px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-center md:text-left">
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-white leading-[1.1]">
                {t('products.merch.ctaTitlePlain')} <span className="text-toyota-red">{t('products.merch.ctaTitleRed')}</span>
              </h3>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">{t('products.merch.ctaDesc')}</p>
            </div>
            <a href="tel:77778090" className="w-full md:w-auto shrink-0">
              <Button variant="primary" className="w-full md:w-auto px-10 py-4 md:py-5 flex items-center justify-center gap-3 text-[10px] md:text-xs">
                <Phone size={16} />
                <span>7777 8090</span>
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Merch;
