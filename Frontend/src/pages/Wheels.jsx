import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import API_BASE_URL from '../config';
import braidLogo from '../assets/acc/braid logo.png';
import placeholderImage from '../assets/vehicles/hero.jpg';

const Wheels = () => {
  const { t } = useTranslation();
  const { loc } = useLocale();
  useDocumentTitle('BRAID обуд', 'Бартаат замын уралдааны дэлхийн шилдэг BRAID брэндийн хөнгөн цагаан хайлшин обуднууд.');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

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
              className="mb-6 h-16 md:h-32"
            >
              <img
                src={braidLogo}
                alt="BRAID Wheels"
                className="h-full object-contain brightness-0 invert"
              />
            </motion.div>

            <a
              href="tel:+97680077772"
              className="inline-flex items-center gap-2 bg-toyota-red text-white font-black text-[11px] md:text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-lg shadow-toyota-red/20 hover:bg-white hover:text-toyota-black transition-colors mb-8"
            >
              <Phone size={14} />
              Обуд борлуулалтын зөвлөхтэй холбогдох: 8007 7772
            </a>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {products.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group"
              >
                <button
                  type="button"
                  onClick={() => setPreviewImage(item.image || placeholderImage)}
                  className="block w-full text-left"
                >
                  <div className="aspect-square bg-white overflow-hidden relative rounded-none transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(235,10,30,0.15)] border border-transparent group-hover:border-toyota-red/30 cursor-zoom-in">
                    <img
                      src={item.image || placeholderImage}
                      alt={loc(item.name, item.nameEn)}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                    />

                    {item.stock === 'Дууссан' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30">
                        <span className="text-white font-black uppercase tracking-wider text-[8px] md:text-[12px] border border-white px-4 py-2">Дууссан</span>
                      </div>
                    )}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="py-20 text-center text-zinc-800 font-bold uppercase tracking-widest border border-dashed border-zinc-900">{t('products.noProducts')}</div>
        )}
      </div>

      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="fixed top-6 right-6 text-white p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={previewImage}
              alt="Preview"
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full object-contain cursor-default"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wheels;
