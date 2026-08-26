import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronLeft, ChevronRight, Phone, MoveHorizontal } from 'lucide-react';
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

const TireCard = ({ tile, idx, onPreview, fixedWidth, t }) => {
  const Wrapper = fixedWidth ? 'div' : motion.div;
  const wrapperProps = fixedWidth
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { delay: Math.min(idx, 10) * 0.04 }
      };
  return (
  <Wrapper
    {...wrapperProps}
    className={`group ${fixedWidth ? 'w-[29vw] sm:w-[calc((100%-2.25rem)/4)] md:w-[calc((100%-4.5rem)/4)] shrink-0 snap-align-none md:snap-start' : ''}`}
  >
    <button
      type="button"
      onClick={() => onPreview(tile.image || placeholderImage)}
      className="block w-full text-left"
    >
      <div className="aspect-square bg-zinc-50 overflow-hidden relative mb-2 md:mb-6 rounded-sm border border-zinc-100 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(235,10,30,0.1)] group-hover:border-toyota-red/30 cursor-zoom-in">
        <img
          src={tile.image || placeholderImage}
          alt={tile.name}
          className="w-full h-full object-contain p-2 md:p-10 group-hover:scale-105 transition-transform duration-700"
        />

        {tile.stock === 'Дууссан' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30">
            <span className="text-white font-black uppercase tracking-wider text-[8px] md:text-[12px] border border-white px-4 py-2">{t('products.soldOut')}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        {!fixedWidth && <p className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-wider line-clamp-1">{tile.name}</p>}
        {tile.size && <p className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-wider">{tile.size}</p>}
        {tile.purpose && (
          <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('products.purposeLabel')}: <span className="text-toyota-red">{tile.purpose}</span></p>
        )}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-toyota-black font-black text-lg md:text-2xl tracking-tighter">{formatPrice(tile.price)}</span>
          <span className="text-toyota-black font-black text-base md:text-xl">₮</span>
        </div>
      </div>
    </button>
  </Wrapper>
  );
};

const TireRow = ({ name, items, onPreview, t }) => {
  const scrollRef = useRef(null);
  const useCarousel = items.length > 4;

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <div>
      {(name || useCarousel) && (
        <div className={`flex items-center justify-between mb-4 md:mb-6 ${name ? 'pb-2 border-b border-zinc-100' : ''}`}>
          {name ? <h3 className="text-base md:text-xl font-bold text-toyota-black">{name}</h3> : <span />}
          {useCarousel && (
            <motion.div
              className="flex md:hidden items-center gap-1 text-zinc-400 text-[9px] font-bold uppercase tracking-wider shrink-0"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {t('products.swipeHint')} <MoveHorizontal size={12} />
            </motion.div>
          )}
        </div>
      )}
      {useCarousel ? (
        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="hidden md:flex absolute md:-left-5 top-[35%] -translate-y-1/2 w-10 h-10 rounded-full bg-toyota-black text-white shadow-xl items-center justify-center z-10 hover:bg-toyota-red transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div ref={scrollRef} className="flex gap-3 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-none md:snap-x md:snap-mandatory pb-2">
            {items.map((tile, idx) => (
              <TireCard key={tile.key} tile={tile} idx={idx} onPreview={onPreview} fixedWidth t={t} />
            ))}
          </div>
          <button
            onClick={() => scroll(1)}
            className="hidden md:flex absolute md:-right-5 top-[35%] -translate-y-1/2 w-10 h-10 rounded-full bg-toyota-black text-white shadow-xl items-center justify-center z-10 hover:bg-toyota-red transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-10">
          {items.map((tile, idx) => (
            <TireCard key={tile.key} tile={tile} idx={idx} onPreview={onPreview} t={t} />
          ))}
        </div>
      )}
    </div>
  );
};

const Tires = () => {
  const { t } = useTranslation();
  const { loc } = useLocale();
  useDocumentTitle('Yokohama дугуй', 'Японы алдарт Yokohama брэндийн бүх төрлийн замын нөхцөлд тохирсон өндөр чанартай дугуйнууд.');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDiameter, setActiveDiameter] = useState('all');
  const [activePurpose, setActivePurpose] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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

  const purposes = useMemo(() => {
    return [...new Set(tiles.map(t => t.purpose).filter(Boolean))];
  }, [tiles]);

  const filteredTiles = tiles
    .filter(t => activeDiameter === 'all' || extractDiameter(t.size) === activeDiameter)
    .filter(t => activePurpose === 'all' || t.purpose === activePurpose)
    .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Хэмжээгээр шүүж байгаа үед нэрээр бүлэглэхгүй, шууд бүгдийг харуулна.
  // "Бүгд" үед нэр ижилхэн бол нэг мөрөнд, өөр нэртэй бол шинэ мөр болгож бүлэглэнэ
  const groups = useMemo(() => {
    if (activeDiameter !== 'all') {
      return filteredTiles.length > 0 ? [{ name: null, items: filteredTiles }] : [];
    }
    const map = new Map();
    filteredTiles.forEach(tile => {
      if (!map.has(tile.name)) map.set(tile.name, []);
      map.get(tile.name).push(tile);
    });
    const diameterOf = (tile) => Number(extractDiameter(tile.size)) || 0;
    return [...map.entries()]
      .map(([name, items]) => ({ name, items: [...items].sort((a, b) => diameterOf(b) - diameterOf(a)) }))
      .sort((a, b) => b.items.length - a.items.length);
  }, [filteredTiles, activeDiameter]);

  return (
    <div className="pt-24 md:pt-40 pb-20 bg-white min-h-screen relative overflow-hidden">
      <div className="container-custom px-4 relative z-10">
        {/* Centered Header Section */}
        <div className="mb-12 md:mb-16 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 h-16 md:h-24"
            >
              <img
                src={yokohamaLogo}
                alt="Yokohama Tires"
                className="h-full object-contain"
              />
            </motion.div>

            <a
              href="tel:+97680077772"
              className="inline-flex items-center gap-2 bg-toyota-red text-white font-black text-[11px] md:text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-lg shadow-toyota-red/20 hover:bg-toyota-black transition-colors mb-8"
            >
              <Phone size={14} />
              {t('products.tires.ctaLabel')}: 8007 7772
            </a>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="hidden md:block text-zinc-500 max-w-xl text-sm md:text-lg leading-relaxed font-medium"
            >
              {t('products.tires.longDesc')}
            </motion.p>

            <div className="w-12 h-1 bg-toyota-red mt-10" />
        </div>

        {!loading && tiles.length > 0 && (
          <div className="flex flex-col items-center gap-5 mb-12 md:mb-16">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('products.tires.searchPlaceholder')}
                className="pl-10 pr-6 py-2.5 md:py-3 bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-bold outline-none focus:border-toyota-red w-full transition-all rounded-full"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              <button
                onClick={() => setActiveDiameter('all')}
                className={`px-5 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeDiameter === 'all' ? 'bg-toyota-black text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
              >
                {t('products.tires.allSizes')}
              </button>
              {diameters.map(d => (
                <button
                  key={d}
                  onClick={() => setActiveDiameter(d)}
                  className={`px-5 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeDiameter === d ? 'bg-toyota-black text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                >
                  {t('products.tires.sizeLabel')} {d}
                </button>
              ))}
            </div>

            {purposes.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                <button
                  onClick={() => setActivePurpose('all')}
                  className={`px-5 py-2 rounded-full text-[9px] md:text-[11px] font-bold uppercase tracking-widest transition-all border ${activePurpose === 'all' ? 'bg-toyota-red text-white border-toyota-red' : 'bg-white text-zinc-500 border-zinc-200 hover:border-toyota-red hover:text-toyota-red'}`}
                >
                  {t('products.tires.allPurposes')}
                </button>
                {purposes.map(p => (
                  <button
                    key={p}
                    onClick={() => setActivePurpose(p)}
                    className={`px-5 py-2 rounded-full text-[9px] md:text-[11px] font-bold uppercase tracking-widest transition-all border ${activePurpose === p ? 'bg-toyota-red text-white border-toyota-red' : 'bg-white text-zinc-500 border-zinc-200 hover:border-toyota-red hover:text-toyota-red'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center font-black uppercase tracking-widest text-zinc-300">{t('vehicles.list.loading')}</div>
        ) : (
          <div className="space-y-10 md:space-y-14">
            {groups.map((group, gIdx) => (
              <TireRow key={group.name || gIdx} name={group.name} items={group.items} onPreview={setPreviewImage} t={t} />
            ))}
          </div>
        )}

        {groups.length === 0 && !loading && (
          <div className="py-20 text-center text-zinc-300 font-bold uppercase tracking-widest border border-dashed border-zinc-200">
            {tiles.length === 0 ? t('products.noProducts') : t('products.noResults')}
          </div>
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
              alt={t('products.previewAlt')}
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
