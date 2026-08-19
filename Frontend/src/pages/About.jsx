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

const About = () => {
  const stats = [
    {
      label: "Салбар",
      value: "2",
      icon: MapPin,
      desc: "Улаанбаатар болон Өмнөговь аймагт байрлах албан ёсны төвүүд."
    },
    {
      label: "Ажилтан",
      value: "150+",
      icon: Users,
      desc: "Тоёотагийн олон улсын стандартаар мэргэшсэн чадварлаг хамт олон."
    },
    {
      label: "Жил",
      value: "5",
      icon: Calendar,
      desc: "2021 оноос хойш Монголын зах зээлд тогтвортой үйл ажиллагаа."
    },
    {
      label: "Үйлчилгээний төрөл",
      value: "4+",
      icon: Wrench,
      desc: "Борлуулалт, засвар, сэлбэг болон санхүүгийн цогц шийдлүүд."
    },
  ];

  const services = [
    {
      title: "Шинэ автомашин",
      desc: "Toyota-ийн албан ёсны дилерээс шинэ автомашины худалдаа. Олон төрлийн загвар, өнгө, комплектацийн сонголт.",
      icon: Car
    },
    {
      title: "Баталгаат засвар",
      desc: "Үйлдвэрийн баталгаат үйлчилгээ, оношилгоо, энгийн болон төлөвлөгөөт засвар үйлчилгээ.",
      icon: Settings
    },
    {
      title: "Оригинал сэлбэг",
      desc: "Toyota-ийн оригинал сэлбэг хэрэгслийн нийлүүлэлт. Чанар баталгаат, хурдан шуурхай.",
      icon: ShieldCheck
    },
    {
      title: "Дараах үйлчилгээ",
      desc: "Хэрэглэгчдийн хэрэгцээ, амьдралын хэв маягт нийцсэн санхүүгийн болон зөвлөх үйлчилгээ.",
      icon: Award
    }
  ];

  const values = [
    {
      title: "Алсын хараа",
      desc: "Mobility Lifestyle Partner",
      icon: Compass
    },
    {
      title: "Эрхэм зорилго",
      desc: "Together To The Top - Top service, Top spare parts, Top sales, Top company",
      icon: Target
    },
    {
      title: "Байгууллагын уриа",
      desc: "TOYOTA IS TOP MOTORS",
      icon: Award
    },
    {
      title: "Үнэт зүйлс",
      desc: "MASTERY, TEAM SPIRIT, LEADERSHIP, MCS SPIRIT, CREATIVITY, INTEGRITY, SUSTAINABLE DEVELOPMENT",
      icon: Shield
    }
  ];

  return (
    <div className="pb-10 font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden bg-toyota-black pt-32 md:pt-20">
        <div className="container-custom relative z-10 w-full px-4 pb-12 md:pb-0">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left Content - Clean & Minimal */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 py-6 md:py-12 lg:py-0 lg:w-[35%] lg:pr-10"
            >
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6 md:mb-10 text-center lg:text-left">
                TOYOTA<br />
                <span className="text-toyota-red">TOP MOTORS</span>
              </h1>

              <div className="max-w-lg relative mx-auto lg:mx-0">
                <div className="absolute -left-4 md:-left-6 top-0 bottom-0 w-[2px] bg-toyota-red/30" />
                <p className="text-xs md:text-base text-zinc-400 font-medium leading-relaxed italic text-justify px-2 md:px-0">
                  "Топ Моторс" ХХК нь 2021 онд үүсгэн байгуулагдсан бөгөөд "ТОЁОТА МОТОР КОРПОРАЦ"-ийн албан ёсны дилер юм.
                </p>
              </div>
            </motion.div>

            {/* Right Image - Full Visibility */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -10, 0]
              }}
              transition={{
                duration: 1.2,
                ease: "circOut",
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="relative h-[300px] md:h-[600px] w-full lg:w-[65%] group"
            >
              {/* Background Decorative Element */}
              <div className="absolute -inset-1 md:-inset-2 border border-toyota-red/10 translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2" />

              {/* Main Image Container */}
              <div className="relative h-full w-full overflow-hidden shadow-2xl transition-all duration-700">
                <img
                  src="/src/assets/common/about.jpg"
                  alt="Toyota Top Motors Team"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
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
                Компанийн тухай
              </h2>
              <div className="w-12 md:w-16 h-1 bg-toyota-red mb-6 md:mb-10" />
              <p className="text-lg md:text-2xl font-black text-toyota-black mb-4 md:mb-6 leading-tight uppercase">
                ТОЁОТА БРЭНДИЙН АЛБАН ЁСНЫ ШИНЭ ДИЛЕР “ТОП МОТОРС”
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="space-y-4 md:space-y-6 text-zinc-600 leading-relaxed text-sm md:text-base text-justify font-medium">
                <p>
                  "Топ Моторс" ХХК нь 2021 онд үүсгэн байгуулагдсан бөгөөд дэлхийд автомашин үйлдвэрлэлээр тэргүүлэгч "ТОЁОТА МОТОР КОРПОРАЦ"-ийн албан ёсны дилер, М-Си-Эс Группийн охин компани юм.
                </p>
                <p>
                  Бид Тоёота брэндийн шинэ болон дугаартай автомашины борлуулалт, засвар үйлчилгээ, сэлбэг эд ангийн худалдаа, дилерийн үйл ажиллагааг ТОЁОТА-ийн олон улсын стандартын дагуу хийж гүйцэтгэн үйлчлүүлэгчдэдээ насан туршийнх нь туслах, зөвлөх байхыг зорин ажиллаж байгаа бөгөөд эрч хүчтэй, чадварлаг, бүтээлч залуучууд гар нийлэн үйлчлүүлэгчдэдээ чанартай бүтээгдэхүүн үйлчилгээг хүргэж байна.
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
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">Манай үйлчилгээ</h2>
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
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">Зорилго & Үнэт зүйлс</h2>
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
