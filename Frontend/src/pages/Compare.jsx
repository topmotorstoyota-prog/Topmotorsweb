import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Info, CheckCircle2, ChevronDown, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';
import API_BASE_URL from '../config';

const Compare = () => {
  const { t } = useTranslation();
  const { loc } = useLocale();
  const [searchParams] = useSearchParams();
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const ids = searchParams.getAll('ids');

  const [openSections, setOpenSections] = useState({
    PERFORMANCE: false,
    INTERIOR: false,
    EXTERIOR: false,
    SAFETY: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/vehicles`)
      .then(res => res.json())
      .then(data => {
        const models = data.map(v => ({
          ...v,
          variants: typeof v.variants === 'string' ? JSON.parse(v.variants || '[]') : (v.variants || [])
        }));

        const results = ids.map(id => {
          for (const model of models) {
            const variant = model.variants.find(v => {
              const variantId = `${model.id}-${v.series}-${v.engineType}`.replace(/\s+/g, '-').toLowerCase();
              return variantId === id;
            });
            if (variant) {
              const variantColors = typeof variant.colors === 'string' ? JSON.parse(variant.colors || '[]') : (variant.colors || []);
              const colorWith360 = variantColors.find(c => c.images360 && c.images360.length > 0);
              const last360 = colorWith360?.images360[colorWith360.images360.length - 1];

              const mergedFeatures = {};
              (variant.features || []).forEach(f => {
                const cat = f.category?.toUpperCase() || 'БУСАД';
                if (!mergedFeatures[cat]) mergedFeatures[cat] = { category: cat, items: [] };
                mergedFeatures[cat].items = [...mergedFeatures[cat].items, ...(f.items || [])];
              });

              return {
                ...variant,
                id,
                modelName: model.name,
                modelNameEn: model.nameEn,
                modelImage: model.image,
                displayImage: last360 || variant.image || model.image,
                features: Object.values(mergedFeatures)
              };
            }
          }
          return null;
        }).filter(Boolean);

        setSelectedVariants(results);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [searchParams]);

  const formatPrice = (p) => {
    if (!p) return '';
    return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const CATEGORIES = [
    { id: 'PERFORMANCE', title: t('vehicles.detail.featureCategories.performance') },
    { id: 'INTERIOR', title: t('vehicles.detail.featureCategories.interior') },
    { id: 'EXTERIOR', title: t('vehicles.detail.featureCategories.exterior') },
    { id: 'SAFETY', title: t('vehicles.detail.featureCategories.safety') }
  ];

  const basicSpecs = [
    { label: t('compare.basicSpecs.engine'), key: 'engine_spec' },
    { label: t('compare.basicSpecs.transmission'), key: 'trans_spec' },
    { label: t('compare.basicSpecs.drive'), key: 'drive_spec' },
    { label: t('compare.basicSpecs.horsepower'), key: 'hp_spec' },
    { label: t('compare.basicSpecs.torque'), key: 'torque_spec' },
    { label: t('compare.basicSpecs.fuelTank'), key: 'fuel_spec' },
    { label: t('compare.basicSpecs.extra'), key: 'extra_spec' },
  ];

  if (loading) return <div className="pt-40 text-center font-black uppercase tracking-widest text-zinc-300">{t('vehicles.list.loading')}</div>;

  return (
    <div className="pt-20 lg:pt-25 pb-20 bg-white font-sans text-black">
      <div className="container-custom px-2 md:px-6">
        <Link to="/vehicles" className="inline-flex items-center text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-toyota-red transition-colors mb-6 md:mb-10">
          <ChevronLeft size={16} className="mr-1" />
          <span>{t('common.back')}</span>
        </Link>

        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-6 md:mb-10 leading-none text-black">
          {t('compare.titlePlain')} <span className="text-toyota-red">{t('compare.titleRed')}</span>
        </h1>

        {selectedVariants.length > 0 ? (
          <div className="relative shadow-2xl border border-zinc-200 rounded-sm bg-white overflow-x-auto no-scrollbar md:overflow-visible">
            <table className="w-full border-separate border-spacing-0 min-w-[320px]">
              <thead>
                {/* 1. Машины зураг (Sticky биш) */}
                <tr className="bg-white">
                  <th className="p-2 md:p-6 text-left w-[20%] md:w-1/4 border-b border-zinc-100 bg-white">
              
                  </th>
                  {selectedVariants.map(variant => (
                    <th key={`img-${variant.id}`} className="p-2 md:p-6 text-center border-b border-zinc-100 min-w-[80px] md:min-w-[300px] bg-white">
                      <div className="h-16 md:h-32 flex items-center justify-center">
                        <img src={variant.displayImage} alt={loc(variant.modelName, variant.modelNameEn)} className="h-full object-contain mix-blend-multiply" />
                      </div>
                    </th>
                  ))}
                </tr>

                {/* 2. Машины нэр, үнэ (STICKY) */}
                <tr className="sticky top-[64px] lg:top-[80px] z-[100] bg-white">
                  <th className="p-2 md:p-8 text-left w-[20%] md:w-1/4 sticky left-0 top-0 z-[110] border-b-2 md:border-b-4 border-toyota-red bg-white shadow-[4px_0_15px_rgba(0,0,0,0.05)]">
                    <span className="text-[10px] md:text-xl font-black uppercase tracking-tighter text-black">{t('compare.tableHeader')}</span>
                  </th>
                  {selectedVariants.map(variant => (
                    <th key={`title-${variant.id}`} className="p-2 md:p-6 text-center border-b-2 md:border-b-4 border-zinc-100 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
                      <div className="flex flex-col items-center">
                        <h3 className="text-[9px] md:text-base font-black uppercase tracking-tight leading-none mb-0.5 md:mb-1 text-black line-clamp-1">{loc(variant.modelName, variant.modelNameEn)}</h3>
                        <p className="text-[7px] md:text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 md:mb-2 line-clamp-1">{variant.series}</p>
                        <p className="text-toyota-red font-black text-[9px] md:text-lg leading-none">₮{formatPrice(variant.price)}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="relative z-10">
                {CATEGORIES.map((cat, cIdx) => {
                  const isOpen = openSections[cat.id];
                  const itemsToRender = cat.id === 'PERFORMANCE' ? basicSpecs :
                    [...new Set(selectedVariants.flatMap(v => (v.features || []).find(f => f.category === cat.id)?.items.map(i => i.label) || []))];

                  if (itemsToRender.length === 0 && cat.id !== 'PERFORMANCE') return null;

                  return (
                    <React.Fragment key={cat.id}>
                      {/* Category Header */}
                      <tr
                        className={`cursor-pointer transition-all duration-300 border-l-4 md:border-l-[10px] border-black ${isOpen ? 'bg-zinc-100' : 'bg-white'} border-t border-t-zinc-200`}
                        onClick={() => toggleSection(cat.id)}
                      >
                        <td colSpan={selectedVariants.length + 1} className="px-4 md:px-10 py-3 md:py-6 sticky left-0 z-[60] bg-inherit">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] md:text-[13px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-black">{cat.title}</span>
                            <div className={`p-1 md:p-1.5 rounded-full border md:border-2 transition-all duration-500 ${isOpen ? 'bg-black border-black text-white rotate-180' : 'bg-white border-black text-black'}`}>
                               <ChevronDown size={12} className="md:w-4 md:h-4" strokeWidth={3} />
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Content Rows */}
                      {isOpen && itemsToRender.map((rowOrLabel, idx) => {
                        const label = cat.id === 'PERFORMANCE' ? rowOrLabel.label : rowOrLabel;
                        const key = cat.id === 'PERFORMANCE' ? rowOrLabel.key : null;

                        return (
                          <tr key={`${cat.id}-${idx}`} className="hover:bg-zinc-50 transition-colors border-l-4 md:border-l-[10px] border-black group">
                            <td className="p-2 md:p-5 border-b border-zinc-200 sticky left-0 bg-white z-[30] shadow-[2px_0_10px_rgba(0,0,0,0.03)]">
                              <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-black transition-colors">{label}</span>
                            </td>
                            {selectedVariants.map(variant => {
                              if (cat.id === 'PERFORMANCE') {
                                return (
                                  <td key={`${variant.id}-${key}`} className="p-2 md:p-5 text-center border-b border-zinc-200 min-w-[80px] md:min-w-[300px]">
                                    <span className="text-[8px] md:text-[11px] font-black uppercase text-black">{loc(variant[key], variant[`${key}_en`]) || '-'}</span>
                                  </td>
                                );
                              } else {
                                const featureItem = (variant.features || [])
                                  .find(f => f.category === cat.id)
                                  ?.items.find(i => i.label === label);

                                const val = featureItem?.value?.toLowerCase();
                                const isYes = val === 'тийм' || val === 'yes' || val === 'бэлэн';
                                const isNo = val === 'үгүй' || val === 'no' || val === 'байхгүй' || val === 'n/a';

                                return (
                                  <td key={`${variant.id}-${label}`} className="p-2 md:p-5 text-center border-b border-zinc-200 min-w-[80px] md:min-w-[300px]">
                                    {featureItem ? (
                                      <div className="flex flex-col items-center gap-1">
                                        <span className={`text-[8px] md:text-[10px] font-black uppercase ${isYes ? 'text-green-600' : isNo ? 'text-red-500' : 'text-black'}`}>
                                          {featureItem.value}
                                        </span>
                                        {isYes && <CheckCircle2 size={12} className="md:w-4 md:h-4 text-green-600" strokeWidth={3} />}
                                        {isNo && <XCircle size={12} className="md:w-4 md:h-4 text-red-500" strokeWidth={3} />}
                                      </div>
                                    ) : (
                                      <span className="text-zinc-300 font-bold">-</span>
                                    )}
                                  </td>
                                );
                              }
                            })}
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-40 text-center">
            <Info size={48} className="mx-auto text-zinc-200 mb-6" />
            <h3 className="text-2xl font-black text-zinc-300 uppercase tracking-tighter">{t('compare.noneSelected')}</h3>
            <Link to="/vehicles">
                <button className="mt-8 px-12 py-5 bg-toyota-red text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all shadow-xl shadow-toyota-red/20 active:scale-95">{t('compare.viewModels')}</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
