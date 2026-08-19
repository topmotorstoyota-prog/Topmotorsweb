import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccordionGallery = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate();

  const items = [
    {
      title: 'ДУГУЙ',
      subtitle: 'YOKOHAMA',
      desc: 'Японы алдарт Yokohama брэндийн бүх төрлийн замын нөхцөлд тохирсон өндөр чанартай дугуйнууд.',
      img: '/src/assets/acc/yokohama gallery.png',
      logo: '/src/assets/acc/yokohama logo.png',
      path: '/tires'
    },
    {
      title: 'ОБУД',
      subtitle: 'BRAID',
      desc: 'Бартаат замын уралдааны дэлхийн шилдэг BRAID брэндийн хөнгөн цагаан хайлшин обуднууд.',
      img: '/src/assets/acc/Braid Gallery.jpg',
      logo: '/src/assets/acc/braid logo.png',
      path: '/wheels'
    },
    {
      title: 'GR MERCH',
      subtitle: 'GAZOO RACING',
      desc: 'Toyota Gazoo Racing-ийн албан ёсны хувцас, хэрэглэл болон аксессуарууд.',
      img: '/src/assets/acc/GR Gallery.webp',
      logo: '/src/assets/acc/GR logo.jpg',
      path: '/merch'
    }
  ];

  return (
    <div
      className="flex flex-col md:flex-row w-full h-[80vh] md:h-[85vh] bg-black overflow-hidden border-b border-zinc-900"
      onMouseLeave={() => setExpandedIndex(null)}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="relative flex-1 h-full cursor-pointer overflow-hidden border-b md:border-b-0 md:border-r border-white/10 last:border-0"
          animate={{
            flex: expandedIndex === null ? 1 : (expandedIndex === index ? 1.5 : 0.75),
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setExpandedIndex(index)}
          onClick={() => navigate(item.path)}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>

          {/* Content Wrapper */}
          <div className="absolute inset-0 p-6 md:p-12 pb-12 md:pb-24 flex flex-col justify-end items-center text-center">
             {/* 1. Text Content (Top of the stack) */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{
                 opacity: expandedIndex === index ? 1 : 0,
                 y: expandedIndex === index ? 0 : 20
               }}
               transition={{ duration: 0.5 }}
               className="mb-6 md:mb-8 max-w-xl"
             >
                <p className="text-zinc-200 text-sm md:text-xl leading-relaxed font-medium">
                  {item.desc}
                </p>
             </motion.div>

             {/* 2. Button (Middle) */}
             <AnimatePresence mode="wait">
                {expandedIndex === index && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); navigate(item.path); }}
                    className="bg-toyota-red text-white font-black uppercase text-[10px] md:text-[12px] tracking-[0.2em] px-8 py-3.5 md:px-10 md:py-4 flex items-center gap-3 shadow-2xl mb-6 md:mb-10 hover:bg-white hover:text-toyota-red transition-colors duration-300"
                  >
                     <span>Дэлгэрэнгүй үзэх</span>
                     <ChevronRight size={16} />
                  </motion.button>
                )}
             </AnimatePresence>

             {/* 3. Logo (Bottom) */}
             <motion.div
                initial={{ opacity: 1 }}
                animate={{
                  scale: expandedIndex === index ? 1.1 : 1,
                  opacity: (expandedIndex === null || expandedIndex === index) ? 1 : 0.3
                }}
                transition={{ duration: 0.4 }}
                className="transition-all duration-500 mt-auto md:mt-0"
             >
                <div className="h-8 md:h-12 flex items-center justify-center">
                   <img
                     src={item.logo}
                     alt={item.subtitle}
                     className={`h-full max-w-full object-contain transition-all duration-500 ${['YOKOHAMA', 'BRAID'].includes(item.subtitle) ? 'brightness-0 invert' : ''}`}
                   />
                </div>
                {/* Mobile Only label */}
                <div className="md:hidden mt-3 opacity-100">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white bg-toyota-red/80 px-3 py-1 rounded-sm shadow-lg">Дэлгэрэнгүй үзэх</span>
                </div>
             </motion.div>
          </div>

          {/* Vertical Title (when collapsed or equal) */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${expandedIndex === index ? 'opacity-0' : 'opacity-100'}`}>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Products = () => {
  return (
    <div className="pt-20 md:pt-28 pb-0 bg-black">
      {/* Horizontal Accordion Gallery */}
      <AccordionGallery />
    </div>
  );
};

export default Products;
