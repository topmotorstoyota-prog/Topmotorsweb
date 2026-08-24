import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Disc, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Button from '../components/Button';
import API_BASE_URL from '../config';
import braidLogo from '../assets/acc/braid logo.png';
import placeholderImage from '../assets/vehicles/hero.jpg';

const formatPrice = (price) => {
  if (!price) return '';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Wheels = () => {
  const { t } = useTranslation();
  const { loc } = useLocale();
  useDocumentTitle('BRAID обуд', 'Бартаат замын уралдааны дэлхийн шилдэг BRAID брэндийн хөнгөн цагаан хайлшин обуднууд.');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(p => p.category === 'Обуд');
        setProducts(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 md:pt-40 pb-20 bg-black min-h-screen relative overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-[80px] md:text-[200px] font-black text-white/[0.02] whitespace-nowrap select-none pointer-events-none uppercase tracking-tighter">
        Braid
      </div>

      <div className="container-custom px-4 relative z-10">
        {/* Centered Header Section */}
        <div className="mb-16 md:mb-32 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 h-16 md:h-32"
            >
              <img
                src={braidLogo}
                alt="BRAID Wheels"
                className="h-full object-contain brightness-0 invert"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 max-w-xl text-sm md:text-lg leading-relaxed font-medium"
            >
              {t('products.wheels.longDesc')}
            </motion.p>

            <div className="w-12 h-1 bg-toyota-red mt-10" />
        </div>

        {loading ? (
          <div className="py-20 text-center font-black uppercase tracking-widest text-zinc-800">{t('vehicles.list.loading')}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
            {products.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group"
              >
                <Link to={`/wheels/${item.id}`}>
                  <div className="aspect-square bg-white overflow-hidden relative mb-4 md:mb-6 rounded-none transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(235,10,30,0.15)] border border-transparent group-hover:border-toyota-red/30">
                    <img
                      src={item.image || placeholderImage}
                      alt={loc(item.name, item.nameEn)}
                      className="w-full h-full object-contain p-4 md:p-8 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
                    />

                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-toyota-red translate-x-4 -translate-y-4 rotate-45 transition-transform group-hover:translate-x-3 group-hover:-translate-y-3" />

                    {item.stock === 'Дууссан' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30">
                        <span className="text-white font-black uppercase tracking-wider text-[8px] md:text-[12px] border border-white px-4 py-2">Дууссан</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium uppercase text-[10px] md:text-xs tracking-[0.15em] text-zinc-400 group-hover:text-white transition-colors line-clamp-1">{loc(item.name, item.nameEn)}</h4>
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-black text-lg md:text-2xl tracking-tighter">{formatPrice(item.price)}</span>
                      <span className="text-white font-black text-base md:text-xl">₮</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="py-20 text-center text-zinc-800 font-bold uppercase tracking-widest border border-dashed border-zinc-900">{t('products.noProducts')}</div>
        )}
      </div>
    </div>
  );
};

export default Wheels;
