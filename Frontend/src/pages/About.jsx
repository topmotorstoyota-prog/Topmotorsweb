import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MapPin,
  Calendar,
  Wrench,
  ShieldCheck,
  Target,
  Award,
  Compass,
  CheckCircle2,
  Car,
  Settings,
  Shield
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import aboutImage from '../assets/common/about.jpg';

const About = () => {
  const { t } = useTranslation();
  const stats = [
    { label: t('about.stats.branches.label'), value: "2", icon: MapPin, desc: t('about.stats.branches.desc') },
    { label: t('about.stats.staff.label'), value: "150+", icon: Users, desc: t('about.stats.staff.desc') },
    { label: t('about.stats.years.label'), value: "5", icon: Calendar, desc: t('about.stats.years.desc') },
    { label: t('about.stats.serviceTypes.label'), value: "3+", icon: Wrench, desc: t('about.stats.serviceTypes.desc') },
  ];

  const services = [
    { title: t('about.services.vehicles.title'), desc: t('about.services.vehicles.desc'), icon: Car },
    { title: t('about.services.warranty.title'), desc: t('about.services.warranty.desc'), icon: Settings },
    { title: t('about.services.parts.title'), desc: t('about.services.parts.desc'), icon: ShieldCheck },
    { title: t('about.services.maintenance.title'), desc: t('about.services.maintenance.desc'), icon: Award }
  ];

  const values = [
    { title: t('about.values.vision.title'), desc: "Mobility Lifestyle Partner", icon: Compass },
    { title: t('about.values.mission.title'), desc: "Together To The Top - Top service, Top spare parts, Top sales, Top company", icon: Target },
    { title: t('about.values.slogan.title'), desc: "TOYOTA IS TOP MOTORS", icon: Award },
    { title: t('about.values.principles.title'), desc: "MASTERY, TEAM SPIRIT, LEADERSHIP, MCS SPIRIT, CREATIVITY, INTEGRITY, SUSTAINABLE DEVELOPMENT", icon: Shield }
  ];

  return (
    <div className="pb-10 font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden bg-white pt-32 md:pt-20">
        <div className="container-custom relative z-10 w-full px-4 pb-12 md:pb-0">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left Content - Clean & Minimal */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 py-6 md:py-12 lg:py-0 lg:w-[35%] lg:pr-10"
            >
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-toyota-black uppercase tracking-tighter leading-[0.9] mb-6 md:mb-10 text-center lg:text-left">
                TOYOTA<br />
                <span className="text-toyota-red">TOP MOTORS</span>
              </h1>

              <div className="max-w-lg relative mx-auto lg:mx-0">
                <div className="absolute -left-4 md:-left-6 top-0 bottom-0 w-[2px] bg-toyota-red/30" />
                <p className="text-xs md:text-base text-zinc-600 font-medium leading-relaxed italic text-justify px-2 md:px-0">
                  {t('about.hero.tagline')}
                </p>
              </div>
            </motion.div>

            {/* Right Image - Original, No Crop/Effects */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative w-full lg:w-[65%]"
            >
              <img
                src={aboutImage}
                alt="Toyota Top Motors Team"
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-24 bg-toyota-gray-100">
        <div className="container-custom px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 md:p-10 border border-zinc-100 shadow-lg flex flex-col items-start text-left group hover:border-toyota-red transition-all duration-500"
              >
                <div className="w-8 h-8 md:w-12 md:h-12 bg-toyota-gray-100 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-toyota-red transition-colors">
                  <stat.icon className="text-toyota-red group-hover:text-white transition-colors" size={16} md:size={24} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl md:text-5xl font-black text-toyota-black tracking-tighter">{stat.value}</span>
                  </div>
                  <span className="text-[8px] md:text-xs font-black uppercase tracking-widest text-toyota-black mb-2 md:mb-4">{stat.label}</span>
                  <p className="text-[10px] md:text-xs text-zinc-500 leading-relaxed font-medium hidden md:block">
                    {stat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Detailed */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container-custom px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
            <div className="lg:col-span-5">
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 md:mb-6 leading-tight">
                {t('about.company.title')}
              </h2>
              <div className="w-12 md:w-16 h-1 bg-toyota-red mb-6 md:mb-10" />
              <p className="text-lg md:text-2xl font-black text-toyota-black mb-4 md:mb-6 leading-tight uppercase">
                {t('about.company.subtitle')}
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="space-y-4 md:space-y-6 text-zinc-600 leading-relaxed text-sm md:text-base text-justify font-medium">
                <p>
                  {t('about.company.para1')}
                </p>
                <p>
                  {t('about.company.para2')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-20 bg-toyota-gray-100">
        <div className="container-custom px-4">
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">{t('about.servicesTitle')}</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-5 md:p-8 border border-zinc-200 hover:border-toyota-red transition-all group shadow-sm"
              >
                <div className="w-10 h-10 md:w-14 md:h-14 bg-toyota-gray-100 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-toyota-red transition-colors">
                  <service.icon className="text-toyota-red group-hover:text-white transition-colors" size={20} md:size={28} />
                </div>
                <h4 className="text-[11px] md:text-lg font-black uppercase tracking-tight mb-2 md:mb-3">{service.title}</h4>
                <p className="text-[9px] md:text-xs text-zinc-500 leading-relaxed line-clamp-3 md:line-clamp-none">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container-custom px-4">
          <div className="mb-10 md:mb-16 text-center">
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">{t('about.valuesTitle')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 md:p-10 border border-zinc-100 bg-white hover:shadow-xl transition-all flex flex-col items-center text-center group"
              >
                <div className="mb-4 md:mb-6 text-toyota-red group-hover:scale-110 transition-transform">
                  <v.icon size={32} md:size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-base md:text-xl font-black uppercase tracking-tight mb-2 md:mb-4 text-toyota-black">{v.title}</h3>
                <p className="text-[11px] md:text-sm text-zinc-800 font-bold leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
