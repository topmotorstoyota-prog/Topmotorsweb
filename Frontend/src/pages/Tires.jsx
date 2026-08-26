import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import API_BASE_URL from '../config';
import yokohamaLogo from '../assets/acc/yokohama logo.png';
import placeholderImage from '../assets/vehicles/hero.jpg';

const formatPrice = (price) => {
  if (!price) return '';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// "285/60/R18" эсвэл хуучин "265/65R17" хэлбэрээс радиусын тоог гаргаж авна
const extractDiameter = (size) => {
  const match = String(size || '').match(/R\s*(\d+)/i);
  return match ? match[1] : null;
};

const Tires = () => {
  const { t } = useTranslation();
  const { loc } = useLocale();
  useDocumentTitle('Yokohama дугуй', 'Японы алдарт Yokohama брэндийн бүх төрлийн замын нөхцөлд тохирсон өндөр чанартай дугуйнууд.');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDiameter, setActiveDiameter] = useState('all');
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(p => p.category === 'Дугуй' || p.category === 'GR Tyres');
        setProducts(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Бүтээгдэхүүн бүрийн хэмжээ тус бүрийг тусдаа карт болгож дэлгэнэ
  const tiles = useMemo(() => {
    return products.flatMap(item => {
      const variants = typeof item.variants === 'string' ? JSON.parse(item.variants || '[]') : (item.variants || []);
      if (variants.length > 0) {
        return variants.map((v, i) => ({
          key: `${item.id}-${i}`,
          productId: item.id,
          name: loc(item.name, item.nameEn),
          image: item.image,
          size: v.size,
          price: v.price,
          purpose: item.purpose,
          stock: item.stock
        }));
      }
      // Хуучин өгөгдөл (variants-гүй) - нэг л карт
      return [{
        key: `${item.id}`,
        productId: item.id,
        name: loc(item.name, item.nameEn),
        image: item.image,
        size: item.size,
        price: item.price,
        purpose: item.purpose,
        stock: item.stock
      }];
    });
  }, [products, loc]);

  const diameters = useMemo(() => {
    const set = new Set(tiles.map(t => extractDiameter(t.size)).filter(Boolean));
    return [...set].sort((a, b) => Number(a) - Number(b));
  }, [tiles]);

  const filteredTiles = activeDiameter === 'all' ? tiles : tiles.filter(t => extractDiameter(t.size) === activeDiameter);

  // Нэр ижилхэн бол нэг мөрөнд, өөр нэртэй бол доор нь шинэ мөр болгож бүлэглэнэ
  const groups = useMemo(() => {
    const map = new Map();
    filteredTiles.forEach(tile => {
      if (!map.has(tile.name)) map.set(tile.name, []);
      map.get(tile.name).push(tile);
    });
    return [...map.entries()].map(([name, items]) => ({ name, items }));
  }, [filteredTiles]);

  return (
    <div className="pt-24 md:pt-40 pb-20 bg-white min-h-screen relative overflow-hidden">
      <div className="container-custom px-4 relative z-10">
        {/* Centered Header Section */}
        <div className="mb-12 md:mb-20 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 h-16 md:h-24"
            >
              <img
                src={yokohamaLogo}
                alt="Yokohama Tires"
                className="h-full object-contain"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-500 max-w-xl text-sm md:text-lg leading-relaxed font-medium"
            >
              {t('products.tires.longDesc')}
            </motion.p>

            <div className="w-12 h-1 bg-toyota-red mt-10" />
        </div>

        {!loading && tiles.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12 md:mb-16">
            <button
              onClick={() => setActiveDiameter('all')}
              className={`px-5 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeDiameter === 'all' ? 'bg-toyota-black text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
            >
              Бүгд
            </button>
            {diameters.map(d => (
              <button
                key={d}
                onClick={() => setActiveDiameter(d)}
                className={`px-5 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeDiameter === d ? 'bg-toyota-black text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
              >
                Хэмжээ {d}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center font-black uppercase tracking-widest text-zinc-300">{t('vehicles.list.loading')}</div>
        ) : (
          <div className="space-y-10 md:space-y-14">
            {groups.map((group, gIdx) => (
              <div key={group.name || gIdx}>
                {group.name && (
                  <h3 className="text-base md:text-xl font-bold text-toyota-black mb-4 md:mb-6 pb-2 border-b border-zinc-100">{group.name}</h3>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
                  {group.items.map((tile, idx) => (
                    <motion.div
                      key={tile.key}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(idx, 10) * 0.04 }}
                      className="group"
                    >
                      <button
                        type="button"
                        onClick={() => setPreviewImage(tile.image || placeholderImage)}
                        className="block w-full text-left"
                      >
                        <div className="aspect-square bg-zinc-50 overflow-hidden relative mb-4 md:mb-6 rounded-sm border border-zinc-100 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(235,10,30,0.1)] group-hover:border-toyota-red/30 cursor-zoom-in">
                          <img
                            src={tile.image || placeholderImage}
                            alt={tile.name}
                            className="w-full h-full object-contain p-6 md:p-10 group-hover:scale-105 transition-transform duration-700"
                          />

                          {tile.stock === 'Дууссан' && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30">
                              <span className="text-white font-black uppercase tracking-wider text-[8px] md:text-[12px] border border-white px-4 py-2">Дууссан</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          {tile.size && <p className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-wider">{tile.size}</p>}
                          {tile.purpose && (
                            <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Зориулалт: <span className="text-toyota-red">{tile.purpose}</span></p>
                          )}
                          <div className="flex items-center gap-1.5 pt-1">
                            <span className="text-toyota-black font-black text-lg md:text-2xl tracking-tighter">{formatPrice(tile.price)}</span>
                            <span className="text-toyota-black font-black text-base md:text-xl">₮</span>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tiles.length === 0 && !loading && (
          <div className="py-20 text-center text-zinc-300 font-bold uppercase tracking-widest border border-dashed border-zinc-200">{t('products.noProducts')}</div>
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

export default Tires;
