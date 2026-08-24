import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageSquare, User, PhoneCall, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Button from '../components/Button';
import API_BASE_URL from '../config';
import reqImage from '../assets/sales/req.png';
import placeholderImage from '../assets/vehicles/hero.jpg';

const Sales = () => {
  const { t } = useTranslation();
  useDocumentTitle('Борлуулалтын ажилчид', 'Toyota Top Motors-ийн туршлагатай борлуулалтын мэргэжилтнүүдтэй танилцаж, шууд холбогдоорой.');
  const [salesStaff, setSalesStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/staff`)
      .then(res => res.json())
      .then(data => {
        setSalesStaff(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-16 lg:pt-20 font-sans bg-white min-h-screen">

      {/* New Vehicle Request Section - Compact Version */}
      <section className="py-6 md:py-9 bg-toyota-gray-100">
        <div className="container-custom px-4">
          <div className="bg-white border-2 border-toyota-red/10 p-5 md:p-10 relative overflow-hidden flex flex-col items-center text-center">

             {/* Background Decoration - Smaller */}
             <div className="absolute -top-10 -right-10 text-toyota-red/5">
                <FileText size={150} md:size={200} strokeWidth={1} />
             </div>

             <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
                <div className="w-full mb-6 md:mb-8 shadow-lg md:shadow-xl rounded-sm overflow-hidden">
                   <img
                     src={reqImage}
                     alt="Toyota Sales Request"
                     className="w-full h-auto"
                   />
                </div>
                <Link
                  to="/booking?type=new_car_order"
                  className="w-full sm:w-auto"
                >
                  <Button variant="primary" size="lg" className="px-10 h-12 md:h-14 uppercase font-black tracking-widest text-[9px] md:text-[10px] shadow-xl shadow-toyota-red/20 group w-full sm:w-auto">
                     <span>{t('sales.sendRequest')}</span>
                     <ChevronRight className="ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" size={14} md:size={16} />
                  </Button>
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* Sales Staff Grid */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container-custom px-4">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 md:mb-16 gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">{t('sales.teamTitlePlain')} <span className="text-toyota-red">{t('sales.teamTitleRed')}</span></h2>
              <p className="text-zinc-500 mt-1 md:mt-2 font-medium text-xs md:text-base">{t('sales.teamDesc')}</p>
            </div>
            <div className="flex items-center gap-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 px-4 py-2.5 border border-zinc-100">
              <PhoneCall size={12} md:size={14} className="text-toyota-red" />
              <span>09:00 - 18:00</span>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center font-black uppercase tracking-widest text-zinc-300">{t('vehicles.list.loading')}</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-5">
              {salesStaff.map((staff, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group cursor-default"
                >
                  <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden mb-2">
                     <img
                       src={staff.image || placeholderImage}
                       alt={staff.name}
                       className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                     />
                     {/* Center Bottom Position Label */}
                     <div className="absolute bottom-0 left-0 right-0 bg-toyota-red/90 h-7 md:h-10 flex items-center justify-center px-1">
                        <p className="text-white text-[6px] md:text-[8px] font-black uppercase tracking-[0.1em] text-center line-clamp-2">
                           {staff.position}
                        </p>
                     </div>
                  </div>

                  <div className="px-0.5">
                     <h3 className="text-[10px] md:text-lg font-black uppercase tracking-tighter text-toyota-black leading-tight mb-1 truncate">
                        {staff.name}
                     </h3>
                     <a
                       href={`tel:${staff.phone.replace('-', '')}`}
                       className="flex items-center gap-1 text-[8px] md:text-xs font-bold text-zinc-900 hover:text-toyota-red transition-colors"
                     >
                        <Phone size={10} md:size={14} className="text-toyota-red shrink-0" />
                        <span>{staff.phone}</span>
                     </a>
                  </div>
                </motion.div>
              ))}
              {salesStaff.length === 0 && (
                <div className="col-span-full py-20 text-center text-zinc-400 font-bold uppercase tracking-widest">{t('sales.noStaff')}</div>
              )}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Sales;
