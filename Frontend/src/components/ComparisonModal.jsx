import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../hooks/useLocale';

const ComparisonModal = ({ isOpen, onClose, vehicles, selectedVehicles, onSelectVehicle, onRemoveVehicle }) => {
  const { t } = useTranslation();
  const { loc } = useLocale();
  const navigate = useNavigate();
  if (!isOpen) return null;

  // Flatten all variants from all models into a single list for selection
  const allVariants = vehicles.flatMap(model =>
    (model.variants || []).map((variant, idx) => {
      const variantId = `${model.id}-${variant.series}-${variant.engineType}`.replace(/\s+/g, '-').toLowerCase();

      const variantColors = typeof variant.colors === 'string' ? JSON.parse(variant.colors || '[]') : (variant.colors || []);
      const colorWith360 = variantColors.find(c => c.images360 && c.images360.length > 0);
      const last360 = colorWith360?.images360[colorWith360.images360.length - 1];
      const localizedModelName = loc(model.name, model.nameEn);

      return {
        ...variant,
        id: variantId,
        modelName: localizedModelName,
        modelId: model.id,
        category: model.category,
        fullName: `${localizedModelName} - ${variant.series} (${variant.engineType})`,
        displayImage: last360 || variant.image || model.image,
        modelFeatures: model.features || [] // Model-ийн үзүүлэлтүүдийг авна
      };
    })
  );

  const handleDetailedCompare = () => {
    // Pass variant IDs to the compare page (each as its own param, since IDs can contain commas)
    const params = new URLSearchParams();
    selectedVehicles.forEach(v => params.append('ids', v.id));
    navigate(`/compare?${params.toString()}`);
    onClose();
  };

  const formatPrice = (p) => {
    if (!p) return '';
    return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, y: "100%", scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: "100%", scale: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative bg-white w-full max-w-6xl h-full md:h-auto md:max-h-[95vh] overflow-hidden flex flex-col shadow-2xl rounded-t-2xl md:rounded-none"
        >
          {/* Header */}
          <div className="p-4 md:p-8 border-b border-zinc-100 flex justify-between items-center bg-white z-10">
            <div>
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter">{t('compareModal.titlePlain')} <span className="text-toyota-red">{t('compareModal.titleRed')}</span></h2>
              <p className="text-[8px] md:text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">
                {t('compareModal.selectedCount', { count: selectedVehicles.length })}
              </p>
            </div>
            <button onClick={onClose} className="p-2 md:p-3 hover:bg-zinc-100 transition-colors border border-zinc-100 rounded-sm">
              <X size={18} className="md:w-6 md:h-6" />
            </button>
          </div>

          {/* Comparison Content */}
          <div className="flex-grow overflow-y-auto p-2 md:p-10 bg-toyota-gray-100/30">
            <div className="grid grid-cols-3 gap-1.5 md:gap-6 w-full h-full min-h-[400px]">
              {[0, 1, 2].map((index) => {
                const variant = selectedVehicles[index];

                return (
                  <div key={index} className="flex flex-col border border-zinc-200 bg-white p-2 md:p-8 relative shadow-sm min-h-full">
                    {variant ? (
                      <>
                        <button
                          onClick={() => onRemoveVehicle(variant.id)}
                          className="absolute top-1 right-1 p-1 bg-white shadow-sm text-zinc-400 hover:text-toyota-red transition-colors z-10 border border-zinc-100"
                        >
                          <X size={10} />
                        </button>

                        <div className="aspect-square md:aspect-[16/10] overflow-hidden mb-2 md:mb-8 flex items-center justify-center bg-toyota-gray-100/50 rounded-sm">
                          <img
                            src={variant.displayImage}
                            alt={variant.fullName}
                            className="w-full h-full object-contain p-1 md:p-4 mix-blend-multiply"
                          />
                        </div>

                        <div className="mb-2 md:mb-6">
                            <span className="text-[6px] md:text-[10px] font-black uppercase text-toyota-red tracking-wider block mb-0.5 md:mb-2">{variant.engineType}</span>
                            <h3 className="text-[9px] md:text-xl font-black uppercase tracking-tight leading-tight mb-0.5 md:mb-2 line-clamp-2">{variant.modelName}</h3>
                            <p className="text-[7px] md:text-xs font-bold text-zinc-500 uppercase line-clamp-1">{variant.series}</p>
                        </div>

                        <p className="text-[10px] md:text-2xl font-black text-toyota-black mb-2 md:mb-8 border-t border-zinc-100 pt-2 md:pt-6">₮{formatPrice(variant.price)}</p>

                        <div className="space-y-1.5 md:space-y-4 mb-1">
                          <div className="flex flex-col border-b border-zinc-50 pb-1 md:pb-2">
                            <span className="text-[6px] md:text-[9px] text-zinc-400 uppercase font-black tracking-widest">{t('vehicles.detail.quickFeatures.engine')}</span>
                            <span className="text-[8px] md:text-[11px] font-bold uppercase text-toyota-black truncate">{loc(variant.engine_spec, variant.engine_spec_en) || '-'}</span>
                          </div>
                          <div className="flex flex-col border-b border-zinc-50 pb-1 md:pb-2">
                            <span className="text-[6px] md:text-[9px] text-zinc-400 uppercase font-black tracking-widest">{t('compareModal.hpShort')}</span>
                            <span className="text-[8px] md:text-[11px] font-bold uppercase text-toyota-black">{loc(variant.hp_spec, variant.hp_spec_en) || '-'}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center py-4 md:py-20 border-2 border-dashed border-zinc-200 bg-zinc-50/30">
                        <div className="mb-2 md:mb-8 bg-white p-2 md:p-6 rounded-full shadow-sm text-zinc-300">
                          <Plus size={16} md:size={40} strokeWidth={1} />
                        </div>

                        <div className="w-full px-1 md:px-6">
                            <p className="text-[6px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center mb-2">{t('common.select')}</p>
                            <div className="relative">
                                <select
                                  className="w-full bg-white border border-zinc-300 px-1 py-2 text-[7px] md:text-[11px] font-black uppercase tracking-tighter focus:outline-none focus:border-toyota-red appearance-none cursor-pointer pr-4"
                                  onChange={(e) => {
                                    const v = allVariants.find(v => v.id === e.target.value);
                                    if (v) onSelectVehicle(v);
                                  }}
                                  value=""
                                >
                                  <option value="">...</option>
                                  {allVariants
                                    .filter(v => !selectedVehicles.find(sv => sv.id === v.id))
                                    .map(v => (
                                      <option key={v.id} value={v.id}>{v.fullName}</option>
                                    ))
                                  }
                                </select>
                                <ArrowRight className="absolute right-1 top-1/2 -translate-y-1/2 rotate-90 text-zinc-400 pointer-events-none" size={8} />
                            </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 md:p-8 border-t border-zinc-100 bg-white flex flex-col md:flex-row items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex md:hidden gap-1.5">
               {[0, 1, 2].map(i => (
                 <div key={i} className={`w-1 h-1 rounded-full ${i < selectedVehicles.length ? 'bg-toyota-red' : 'bg-zinc-200'}`} />
               ))}
            </div>
            <button
              disabled={selectedVehicles.length < 2}
              onClick={handleDetailedCompare}
              className="w-full md:w-auto px-10 md:px-12 py-3.5 md:py-5 bg-toyota-black text-white font-black uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-[9px] md:text-xs shadow-xl active:scale-95"
            >
              <span>{t('compare.titlePlain')} {t('compare.titleRed')}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ComparisonModal;
