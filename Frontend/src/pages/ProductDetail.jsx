import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Phone,
  MessageSquare,
  Info,
  CheckCircle2,
  Package,
  ShieldCheck,
  Tag,
  MapPin,
  Layers
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Button from '../components/Button';
import API_BASE_URL from '../config';

const ProductDetail = () => {
  const { t } = useTranslation();
  const { loc } = useLocale();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  useDocumentTitle(product ? loc(product.name, product.nameEn) : null, product ? loc(product.description, product.descriptionEn) : undefined);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find(p => p.id.toString() === id);
          if (found) {
            setProduct(found);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="pt-40 pb-20 text-center font-sans bg-black min-h-screen">
        <div className="inline-block w-8 h-8 border-4 border-toyota-red border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black uppercase tracking-widest text-zinc-500">{t('vehicles.list.loading')}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-40 pb-20 text-center font-sans bg-black min-h-screen">
        <Info size={48} className="mx-auto text-zinc-700 mb-4" />
        <h2 className="text-2xl font-black uppercase mb-4 text-zinc-500">{t('products.noProducts')}</h2>
        <Link to="/products">
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">{t('common.back')}</Button>
        </Link>
      </div>
    );
  }

  const formatPrice = (price) => {
    if (!price) return t('vehicles.detail.priceUnknown');
    const cleanNum = String(price).replace(/[^0-9]/g, '');
    return new Intl.NumberFormat('en-US').format(Number(cleanNum) || 0);
  };

  const getImages = () => {
    try {
      if (!product.images) return [];
      const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const categoryPath = (product.category === 'Дугуй' || product.category === 'GR Tyres') ? '/tires' :
                       product.category === 'Обуд' ? '/wheels' :
                       product.category === 'GR Merch' ? '/merch' : '/products';

  const categoryName = (product.category === 'Дугуй' || product.category === 'GR Tyres') ? t('products.tires.title') :
                       product.category === 'Обуд' ? t('products.wheels.title') :
                       product.category === 'GR Merch' ? 'GR Merch' : t('nav.products');

  const allImages = [product.image, ...getImages()].filter(Boolean);

  // Split by comma or any whitespace to handle "265/15R18 265/15R19" properly
  const sizes = product.size ? product.size.split(/[,\s]+/).filter(s => s.trim() !== '') : [];

  const contactPhone = (product.category === 'Дугуй' || product.category === 'GR Tyres' || product.category === 'Обуд')
    ? '80077772'
    : '77778090';

  return (
    <div className="pt-24 lg:pt-[120px] pb-20 bg-black font-sans min-h-screen">
      <div className="bg-zinc-900 py-3 lg:py-4 border-b border-zinc-800">
        <div className="container-custom flex items-center space-x-2 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-zinc-500 overflow-x-auto no-scrollbar whitespace-nowrap px-4 lg:px-8">
          <Link to="/" className="hover:text-white transition-colors">{t('nav.homeShort')}</Link>
          <ChevronRight size={10} className="shrink-0" />
          <Link to={categoryPath} className="hover:text-white transition-colors">{categoryName}</Link>
          <ChevronRight size={10} className="shrink-0" />
          <span className="text-white truncate">{loc(product.name, product.nameEn)}</span>
        </div>
      </div>

      <section className="py-8 lg:py-12">
        <div className="container-custom px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="relative aspect-square bg-[#F6F6F6] overflow-hidden rounded-sm border border-zinc-100 group shadow-inner">
                {allImages.length > 0 ? (
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImgIndex}
                      src={allImages[currentImgIndex]}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-contain p-6 lg:p-12 mix-blend-multiply"
                    />
                  </AnimatePresence>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300"><Package size={64} /></div>
                )}
                {allImages.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length)} className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-8 lg:w-10 h-8 lg:h-10 bg-white/90 rounded-full shadow-lg z-10 flex items-center justify-center"><ChevronLeft size={18} /></button>
                    <button onClick={() => setCurrentImgIndex((prev) => (prev + 1) % allImages.length)} className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-8 lg:w-10 h-8 lg:h-10 bg-white/90 rounded-full shadow-lg z-10 flex items-center justify-center"><ChevronRight size={18} /></button>
                  </>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 lg:gap-4 mt-4 lg:mt-6 overflow-x-auto pb-2 no-scrollbar">
                  {allImages.map((img, i) => (
                    <button key={i} onClick={() => setCurrentImgIndex(i)} className={`w-16 lg:w-20 h-16 lg:h-20 shrink-0 border-2 rounded-sm bg-zinc-50 overflow-hidden ${currentImgIndex === i ? 'border-toyota-red' : 'border-transparent'}`}><img src={img} className="w-full h-full object-contain p-1 lg:p-2 mix-blend-multiply" /></button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <span className="text-toyota-red font-black text-[9px] lg:text-[11px] uppercase tracking-[0.4em] mb-2 lg:mb-4 block">{product.category}</span>
                <h1 className="text-2xl lg:text-5xl font-black uppercase tracking-tighter mb-4 lg:mb-6 text-white">{loc(product.name, product.nameEn)}</h1>

                <div className="mb-6 lg:mb-8 bg-zinc-900 p-6 lg:p-8 border-l-4 border-toyota-red shadow-sm">
                  <p className="text-[10px] font-black uppercase text-toyota-red mb-1 lg:mb-2">{t('productDetail.priceLabel')}</p>
                  <p className="text-3xl lg:text-4xl font-black text-white">₮{formatPrice(product.price)}</p>
                </div>

                {sizes.length > 0 && (
                  <div className="mb-6 lg:mb-8">
                    <p className="text-[10px] font-black uppercase text-zinc-500 mb-3 tracking-widest flex items-center gap-2">
                      <Layers size={12}/>
                      {product.category === 'Дугуй' ? t('productDetail.availableSizes') :
                       product.category === 'Обуд' ? t('productDetail.radius') : t('productDetail.sizeLabel')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((s, idx) => (
                        <span key={idx} className="px-3 lg:px-4 py-1.5 lg:py-2 bg-zinc-800 border border-zinc-700 text-[10px] lg:text-xs font-black text-zinc-300 rounded-sm uppercase tracking-wider">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4 mb-8 lg:mb-10">
                  <div className={`px-3 py-1.5 text-[9px] lg:text-[10px] font-black uppercase tracking-widest inline-block rounded-sm ${product.stock === 'Дууссан' ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>{product.stock || 'Бэлэн байгаа'}</div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center rounded-sm shrink-0 text-toyota-red"><ShieldCheck size={20}/></div>
                    <p className="text-[11px] lg:text-xs text-zinc-400 leading-relaxed font-medium">{t('productDetail.warrantyNote')}</p>
                  </div>
                </div>

                <div className="hidden lg:grid grid-cols-2 gap-4 mt-4">
                  <a href={`tel:${contactPhone}`}><Button variant="outline" className="w-full py-4 text-[10px] font-red uppercase tracking-widest border-white text-white hover:bg-white hover:text-black">{t('nav.contact')}</Button></a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-20 pt-8 lg:pt-16 border-t border-zinc-800 mb-20 lg:mb-0">
            <div className="max-w-3xl">
              <h3 className="text-lg lg:text-xl font-black uppercase tracking-tight mb-4 lg:mb-6 flex items-center gap-3 text-white"><Tag size={20} className="text-toyota-red"/> {t('productDetail.detailedDesc')}</h3>
              <div className="text-zinc-300 lg:text-zinc-400 leading-relaxed text-sm lg:text-base whitespace-pre-wrap font-medium text-left lg:text-justify">{loc(product.description, product.descriptionEn) || t('productDetail.noDescription')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-[68px] left-0 right-0 bg-black/80 backdrop-blur-md border-t border-zinc-800 p-4 z-50 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <a href={`tel:+976${contactPhone}`} className="flex-1">
          <Button variant="primary" className="w-full py-4 text-[11px] font-black uppercase tracking-widest">
            <Phone size={16} className="mr-2" />
            {t('nav.contact')}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default ProductDetail;
