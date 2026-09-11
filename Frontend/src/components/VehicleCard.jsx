import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VehicleCard = ({ id, name, series, price, image, specs, isFixedPrice, link, isToyotaQ }) => {
  const { t } = useTranslation();
  const detailLink = link || `/vehicles/${id}`;

  const formatPrice = (p) => {
    if (!p) return '';
    return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Link to={detailLink} className="group bg-white border border-zinc-900 hover:shadow-2xl transition-all duration-500 rounded-none overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-white">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* Content */}
      <div className="p-3 md:p-6 flex flex-col flex-grow">
        <div className="mb-2 md:mb-4">
          <h3 className="text-[13px] md:text-[17px] font-black uppercase tracking-tight leading-tight mb-1.5 md:mb-2 text-toyota-black line-clamp-2 h-8 md:h-auto group-hover:text-toyota-red transition-colors duration-300">{name}</h3>
          <div className="w-6 md:w-8 h-[3px] bg-toyota-red" />
          {isToyotaQ && (
            <p className="text-[12px] md:text-xl font-black text-toyota-red mt-2 md:mt-3">
              ₮{formatPrice(price)}
            </p>
          )}
        </div>

        {isToyotaQ && specs && specs.length > 0 && (
          <div className="space-y-1 md:space-y-3 mb-3 md:mb-8 pt-2 md:pt-6 border-t border-zinc-100">
            <div className="grid grid-cols-2 gap-2 md:gap-4">
               {specs[0] && (
                 <div className="flex flex-col gap-0">
                   <span className="text-[7px] md:text-[8px] font-black text-zinc-400 uppercase tracking-widest">{t('vehicleCard.year')}</span>
                   <span className="text-[9px] md:text-[11px] font-bold text-toyota-black uppercase">{specs[0]}</span>
                 </div>
               )}
               {specs[1] && (
                 <div className="flex flex-col gap-0 border-l border-zinc-100 pl-2 md:pl-4">
                   <span className="text-[7px] md:text-[8px] font-black text-zinc-400 uppercase tracking-widest">{t('toyotaQ.detail.mileage')}</span>
                   <span className="text-[9px] md:text-[11px] font-bold text-toyota-black uppercase">{specs[1]}</span>
                 </div>
               )}
            </div>
          </div>
        )}

      </div>

      <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-5 bg-toyota-black">
        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-wider md:tracking-[0.25em] text-white group-hover:text-toyota-red transition-colors duration-300">
          <span className="hidden sm:inline">{t('products.viewDetails')}</span>
          <span className="sm:hidden">{t('news.more')}</span>
        </span>
        <div className="w-7 h-7 md:w-9 md:h-9 shrink-0 rounded-full border border-white/25 flex items-center justify-center group-hover:bg-toyota-red group-hover:border-toyota-red transition-all duration-300">
          <ChevronRight size={14} className="text-white group-hover:translate-x-0.5 transition-all duration-300" />
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
