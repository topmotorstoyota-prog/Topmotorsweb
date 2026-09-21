import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare, User, PhoneCall, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import API_BASE_URL from '../config';
import placeholderImage from '../assets/vehicles/hero.jpg';

const Sales = () => {
  const { t } = useTranslation();
  useDocumentTitle(t('sales.pageTitle'), t('sales.pageDescription'));
  const [salesStaff, setSalesStaff] = useState([]);
  const [positionRanks, setPositionRanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/staff`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/staff-positions`).then(res => res.json())
    ])
      .then(([staffData, positionData]) => {
        setSalesStaff(Array.isArray(staffData) ? staffData : []);
        setPositionRanks(Array.isArray(positionData) ? positionData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-16 lg:pt-20 font-sans bg-white min-h-screen">

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
          ) : salesStaff.length === 0 ? (
            <div className="py-20 text-center text-zinc-400 font-bold uppercase tracking-widest">{t('sales.noStaff')}</div>
          ) : (
            <div className="space-y-10 md:space-y-16">
              {Object.values(salesStaff.reduce((acc, staff) => {
                const key = staff.position || t('sales.noPosition');
                if (!acc[key]) acc[key] = { position: key, members: [] };
                acc[key].members.push(staff);
                return acc;
              }, {}))
                .map(group => ({
                  ...group,
                  order: positionRanks.find(r => r.name === group.position)?.order ?? 9999,
                  members: [...group.members].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
                }))
                .sort((a, b) => a.order - b.order)
                .map((group, gi) => (
                <div key={group.position}>
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <h3 className="text-sm md:text-xl font-black uppercase tracking-tight text-toyota-black">{group.position}</h3>
                    <div className="flex-1 h-px bg-zinc-200" />
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-5">
                    {group.members.map((staff, i) => (
                      <motion.div
                        key={staff.id || i}
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
                             className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                           />
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Sales;
