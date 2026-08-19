import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Settings,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Phone,
  Users,
  Search,
  Zap,
  Disc,
  ArrowRight,
  Info,
  Layers,
  Shield,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

import cafeImg from '../assets/service/00.jpg';
import togloomImg from '../assets/service/huuhed.jpg';
import tanhimImg from '../assets/service/Tanhim.jpg';
import zogsoolImg from '../assets/service/zogsol.jpg';
import serviceHeroImg from '../assets/service/service.jpg';

const Service = () => {
  const servicesRef = useRef(null);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const advantages = [
    "Toyota болон Lexus брэндийн бүх загварт нээлттэй үйлчилгээ",
    "Үйлдвэрлэгчийн стандартын дагуу засвар үйлчилгээ",
    "Оригинал сэлбэг хэрэгсэл, аксессуарын нийлүүлэлт",
    "Мэргэшсэн инженер, техникийн баг",
    "Ил тод үнийн бодлого",
    "Засварын явцыг хянах боломж",
    "Тав тухтай хүлээлгийн танхим",
    "70+ автомашины зогсоол",
    "La Parisienne кофе шоп болон хүүхдийн тоглоомын булан",
    "Даваа-Ням гарагт тогтмол үйлчилгээ"
  ];

  const serviceCategories = [
    {
      title: "Тогтмол засвар үйлчилгээ",
      desc: "Автомашины найдвартай ажиллагааг хангахын тулд үйлдвэрлэгчийн зөвлөсөн хугацаанд тос, шингэн болон хэрэглээний эд ангиудыг солих үйлчилгээ.",
      icon: Clock,
      items: ["Улирлын тос солих", "Бүх төрлийн шингэн солих", "Хуваарьт болон урсгал засвар үйлчилгээ"]
    },
    {
      title: "Оношилгоо",
      desc: "Орчин үеийн компьютер тоног төхөөрөмж ашиглан автомашины бүх системд нарийвчилсан оношилгоо хийнэ.",
      icon: Search,
      items: ["Компьютер оношилгоо", "Хөдөлгүүрийн оношилгоо", "Хүч дамжуулах системийн оношилгоо", "Цахилгааны оношилгоо", "Явах эд ангийн оношилгоо"]
    },
    {
      title: "Хөдөлгүүр ба агрегатын засвар",
      desc: "Мэргэшсэн инженерүүд хөдөлгүүр болон хүч дамжуулах системийн гэмтлийг үйлдвэрлэгчийн стандартын дагуу засварлана.",
      icon: Settings,
      items: ["Агрегат засвар", "Хөдөлгүүрийн их засвар", "Хүч дамжуулагчийн их засвар"]
    },
    {
      title: "Дугуй ба явах эд ангийн үйлчилгээ",
      desc: "Жолоодлогын тогтвортой байдал, аюулгүй ажиллагааг хангах мэргэжлийн үйлчилгээ.",
      icon: Disc,
      items: ["Тэнхлэг тохиргоо", "Дугуй тэнцвэржүүлэх", "Дугуй солих", "Дугуй хадгалах үйлчилгээ", "Гэрэл тохиргоо"]
    },
    {
      title: "Автомашины арчилгаа, хамгаалалт",
      desc: "Таны автомашины өнгө үзэмж, үнэ цэнийг урт хугацаанд хадгалахад чиглэсэн үйлчилгээ болон кузов засварын цогц үйлчилгээ.",
      icon: Shield,
      items: ["Автомат болон гар угаалга", "Хамгаалалтын хуулга (бүтэн болон хэсэгчилсэн)", "Гадна өнгөлгөө, арчилгаа", "Кузов ба будаг засвар"]
    },
    {
      title: "Оригинал сэлбэг ба аксессуар",
      desc: "Автомашины аюулгүй байдал, найдвартай ажиллагааг хангахын тулд үйлдвэрлэгчийн баталгаат оригинал сэлбэг, аксессуарыг санал болгож байна.",
      icon: Layers,
      items: ["Оригинал сэлбэгийн худалдаа, зөвлөгөө", "Аксессуар суурилуулалт", "Захиалгат сэлбэг нийлүүлэлт"]
    }
  ];

  const facilityFeatures = [
    { title: "70 гаруй зогсоол", image: zogsoolImg },
    { title: "Тохилог ариун цэврийн өрөө", image: cafeImg },
    { title: "Хүүхдийн тоглоомын булан", image: togloomImg },
    { title: "Тав тухтай хүлээлгийн танхим", image: tanhimImg }
  ];

  return (
    <div className="pt-[104px] lg:pt-[120px] font-sans bg-white min-h-screen">
      {/* Intro Section with Image */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container-custom px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-toyota-black mb-4 md:mb-6 leading-tight">
                Засвар Үйлчилгээ
              </h1>
        
              <div className="space-y-4 md:space-y-6 text-zinc-600 leading-relaxed text-sm md:text-base font-medium text-justify mb-8 md:mb-10">
                <p>
                  Тоёота автомашин бүр инженерчлэлийн өндөр стандарт, бат бөх чанар, найдвартай ажиллагаагаараа дэлхийд танигдсан. Энэхүү чанарыг ашиглалтын бүхий л хугацаанд нь хадгалах хамгийн зөв сонголт бол үйлдвэрлэгчийн стандартын дагуу мэргэжлийн засвар үйлчилгээ авах юм.
                </p>
                <p className="hidden md:block">
                  Тоёота Топ Моторс нь Toyota Motor Corporation-ийн албан ёсны дилерийн хувьд Toyota болон Lexus брэндийн бүх загварын автомашинд олон улсын стандартын дагуу засвар үйлчилгээ үзүүлж байна. Манай төв нь орчин үеийн оношилгоо, засварын тоног төхөөрөмжөөр бүрэн тоноглогдсон бөгөөд нэгэн зэрэг 20 хүртэл автомашинд үйлчилгээ үзүүлэх хүчин чадалтай.
                </p>
              </div>

              <Link to="/booking?type=service">
                <Button variant="primary" size="lg" className="px-10 md:px-12 uppercase tracking-widest font-black text-[10px] md:text-[11px] h-12 md:h-14 shadow-xl shadow-toyota-red/20 w-full sm:w-auto">
                  Цаг захиалах
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-video md:aspect-[4/3] rounded-sm overflow-hidden shadow-xl md:shadow-2xl z-10">
                <img
                  src={serviceHeroImg}
                  alt="Toyota Service Center"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 md:-bottom-4 -right-2 md:-right-4 w-full h-full border-2 border-toyota-red/10 -z-0" />
            </motion.div>
          </div>

          {/* Scroll Down Button */}
          <div className="flex justify-center mt-8 md:mt-12">
            <motion.button
              onClick={scrollToServices}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center gap-1 md:gap-2 group cursor-pointer"
            >
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-400 group-hover:text-toyota-red transition-colors">Үйлчилгээ үзэх</span>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-zinc-200 flex items-center justify-center group-hover:border-toyota-red group-hover:bg-toyota-red group-hover:text-white transition-all duration-300">
                <ChevronDown size={16} md:size={20} />
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Advantages Checkmark List */}
      <section className="py-10 md:py-16 bg-toyota-gray-100">
        <div className="container-custom px-4 md:px-6 lg:px-8">
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-4xl font-black uppercase tracking-tighter text-center">Бидний <span className="text-toyota-red">давуу тал</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-x-4 md:gap-x-12 gap-y-3 md:gap-y-6 max-w-5xl mx-auto">
            {advantages.map((adv, i) => (
              <div key={i} className="flex items-start gap-2 md:gap-4 group">
                <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-white flex items-center justify-center text-toyota-red shadow-sm shrink-0 mt-0.5">
                  <CheckCircle2 size={10} md:size={14} />
                </div>
                <span className="text-[8px] md:text-[11px] font-black uppercase tracking-wider text-zinc-600 leading-tight">{adv}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Features */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container-custom px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-xl md:text-4xl font-black uppercase tracking-tighter">Тав тухтай <span className="text-toyota-red">орчин</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {facilityFeatures.map((f, i) => (
              <div key={i} className="group bg-white rounded-sm overflow-hidden shadow-sm md:shadow-md">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={f.image} alt={f.title} className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110" />
                </div>
                <div className="p-2 md:p-4 text-center border-t border-zinc-50">
                  <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-toyota-black group-hover:text-toyota-red transition-colors line-clamp-1">{f.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Services Section */}
      <section ref={servicesRef} className="py-12 md:py-24 bg-toyota-black text-white overflow-hidden relative scroll-mt-20 md:scroll-mt-28">
        <div className="absolute top-0 right-0 opacity-[0.02] -translate-y-1/4 translate-x-1/4 pointer-events-none">
          <Wrench size={400} md:size={600} strokeWidth={1} />
        </div>

        <div className="container-custom px-4 md:px-6 lg:px-8 relative z-10">
           <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter">Манай <span className="text-toyota-red">үйлчилгээ</span></h2>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-6">
              {serviceCategories.map((cat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group relative bg-zinc-900/40 border border-white/5 p-4 md:p-8 rounded-sm overflow-hidden md:hover:border-toyota-red/50 transition-all duration-500 flex flex-col min-h-[140px] md:min-h-[180px] md:hover:min-h-[320px]"
                >
                    {/* Background Icon Decoration */}
                    <div className="absolute -bottom-6 -right-6 text-white/5 group-hover:text-toyota-red/10 transition-colors duration-500">
                       <cat.icon size={120} strokeWidth={1} />
                    </div>

                    <div className="relative z-10 flex-grow flex flex-col h-full">
                        <div className="w-8 h-8 md:w-14 md:h-14 bg-white/5 border border-white/10 flex items-center justify-center text-toyota-red md:group-hover:bg-toyota-red md:group-hover:text-white transition-all duration-500 rounded-sm mb-3 md:mb-6 shadow-xl shadow-black/20">
                           <cat.icon size={18} md:size={28} />
                        </div>

                        <h3 className="text-[10px] md:text-xl font-black uppercase tracking-widest leading-tight mb-2 md:group-hover:text-toyota-red transition-colors duration-300">
                           {cat.title}
                        </h3>

                        {/* Mobile: Minimal text, Desktop: Full desc + items on hover */}
                        <div className="md:max-h-0 md:opacity-0 md:group-hover:max-h-[500px] md:group-hover:opacity-100 transition-all duration-700 ease-in-out overflow-hidden flex-grow flex flex-col">
                            <p className="text-zinc-400 text-[8px] md:text-sm leading-relaxed font-medium mt-1 md:mt-4 mb-4 md:mb-6 text-justify line-clamp-2 md:line-clamp-none">
                                {cat.desc}
                            </p>
                            <div className="hidden md:block pt-6 border-t border-white/10 space-y-3">
                               {cat.items.map((item, idx) => (
                                 <div key={idx} className="flex items-center gap-3 group/item">
                                    <div className="w-1.5 h-1.5 bg-toyota-red rounded-full opacity-50 group-hover/item:opacity-100 transition-opacity" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover/item:text-white transition-colors">
                                      {item}
                                    </span>
                                 </div>
                               ))}
                            </div>

                            <Link to={`/booking?type=service&serviceType=${encodeURIComponent(cat.title)}`} className="mt-auto md:mt-8">
                                <Button variant="primary" size="sm" className="w-full text-[7px] md:text-[9px] h-8 md:h-11 tracking-widest md:tracking-[0.2em] font-black uppercase shadow-lg shadow-toyota-red/20">
                                   Цаг авах
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Interactive indicator for hover (Desktop only) */}
                    <div className="hidden md:flex mt-4 items-center gap-2 text-toyota-red text-[10px] font-black uppercase tracking-[0.2em] group-hover:opacity-0 transition-opacity duration-300">
                        <div className="w-2 h-2 bg-toyota-red animate-pulse rounded-full" />
                        <span>Дэлгэрэнгүй</span>
                    </div>

                    {/* Bottom Progress Line */}
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-toyota-red group-hover:w-full transition-all duration-700 ease-out" />
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Body Repair Section */}
      <section className="py-24 bg-white border-t border-zinc-100">
        <div className="container-custom">
          <div className="text-center mb-16">
           
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-toyota-black">
              КУЗОВ <span className="text-toyota-red">ЗАСВАР</span>
            </h2>
        
          </div>

          <div className="max-w-5xl mx-auto shadow-2xl rounded-sm overflow-hidden border border-zinc-200">
            <div className="aspect-video relative">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/tkIp8nVUeEI"
                title="Кузов засвар"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Bar */}
      <section className="py-12 bg-toyota-red text-white">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <Phone size={40} strokeWidth={1} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Засварын лавлах утас</p>
              <p className="text-3xl font-black tracking-tight">77778090</p>
            </div>
          </div>
          <Link to="/booking?type=service">
            <button className="px-12 py-5 bg-white text-toyota-black font-black uppercase tracking-[0.2em] text-[11px] hover:bg-black hover:text-white transition-all shadow-xl active:scale-95">
              Одоо цаг авах
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Service;
