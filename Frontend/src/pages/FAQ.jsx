import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Car, Settings, Wrench, CreditCard, ShieldCheck, History } from 'lucide-react';

const faqCategories = [
  {
    id: 'sales',
    title: 'Худалдан авалт болон Автомашинууд',
    icon: <Car size={18} />,
    questions: [
      {
        q: "Автомашин захиалах боломжтой юу?",
        a: "Тийм. Таны сонирхож буй автомашины өнгө загвар бэлэн байхгүй бол та урьдчилсан захиалгын гэрээ хийж захиалга өгөх боломжтой. Борлуулалтын ажилтантай холбогдох утасны дугаар: 8888-9041 8888-9042 8888-9043 8888-9045"
      },
      {
        q: "Автомашины туршилтын жолоодлого хийж болох уу?",
        a: "Та манай үзэсгэлэнгийн танхимд хүрэлцэн ирж, туршилтын жолоодлогод зориулсан загваруудаас сонгон жолоодож үзэх боломжтой."
      },
      {
        q: "Ажиллах цаг болон байршил?",
        a: "Салбар 1: Улаанбаатар хот, Баянгол дүүрэг, 6-р хороо, 10 дугаар хороолол, И мартын зүүн талд. Утас: 7777-8090. Ажиллах цаг: 09:00-18:00\n\nСалбар 2: Өмнөговь аймаг, Цогтцэций сум, Өгөөмөр IV баг. Утас: 7777-8090. Ажиллах цаг: 09:00-18:00"
      }
    ]
  },
  {
    id: 'service',
    title: 'Засвар үйлчилгээ',
    icon: <Settings size={18} />,
    questions: [
      {
        q: "Засвар, үйлчилгээнд хэрхэн цаг авах вэ?",
        a: "Та 7777-8090 дугаарт холбогдон үйлчилгээний цаг захиалах боломжтой."
      },
      {
        q: "Засвар, үйлчилгээ хэр удаан үргэлжлэх вэ?",
        a: "Үйлчилгээний төрөл, автомашины оношилгооны үр дүн болон сэлбэгийн бэлэн байдлаас хамаарна. Үйлчилгээний зөвлөх урьдчилсан хугацааг мэдээлнэ."
      },
      {
        q: "Засварын үнийн санал урьдчилан авах боломжтой юу?",
        a: "Тийм. Анхан шатны үзлэг, оношилгооны дараа хийх ажил, шаардлагатай сэлбэг, нийт зардлын тооцоог танилцуулна. Нэмэлт ажил шаардлагатай бол таны зөвшөөрлийг авсны дараа засварын ажлыг гүйцэтгэнэ."
      }
    ]
  },
  {
    id: 'parts',
    title: 'Сэлбэг хэрэгсэл',
    icon: <Wrench size={18} />,
    questions: [
      {
        q: "Оригинал сэлбэгийг хэрхэн захиалах вэ?",
        a: "Автомашины арлын дугаараар шаардлагатай сэлбэгийн мэдээллийг өгч үнийн санал, бэлэн байдлыг шалгуулна."
      },
      {
        q: "Сэлбэг бэлэн байхгүй тохиолдолд захиалж болох уу?",
        a: "Болно. Урьдчилан захиалах боломжтой бөгөөд нийлүүлэлтийн хугацааг сэлбэгийн ажилтан мэдээлнэ."
      },
      {
        q: "Оригинал сэлбэг ямар давуу талтай вэ?",
        a: "Гарал үүсэл нь тодорхойгүй сэлбэг, эд ангийг хэрэглэх нь таны автомашины бусад эд анги болон үзүүлэлтэд сөргөөр нөлөөлөх, засварын ажил үр дүнгүй болох, оригинал бус сэлбэгийн эдэлгээний хугацаа богино байх эрсдэлтэй байдаг тул та автомашиндаа албан ёсны үйлдвэрээс нийлүүлэгдсэн баталгаат сэлбэгийг суурилуулах хэрэгтэй."
      }
    ]
  },
  {
    id: 'finance',
    title: 'Санхүүжилт болон Лизинг',
    icon: <CreditCard size={18} />,
    questions: [
      {
        q: "Зээлийн нөхцөл байгаа юу?",
        a: "Тийм. Хамтран ажилладаг банк, санхүүгийн байгууллагуудын автомашины зээлийн бүтээгдэхүүнээс сонгох боломжтой."
      },
      {
        q: "НӨАТ баримт өгөх үү?",
        a: "НӨАТ баримт олгоно."
      },
      {
        q: "НӨАТ буцаан олголт хэзээ орох вэ?",
        a: "Та худалдан авалт хийсэн автомашины И баримтыг өөрийн И баримт апп-д бүртгүүлэн баталгаажсан сарын дараагийн улирлын 20-ний өдрөөс хойш буцаан олголт хийгддэг."
      }
    ]
  },
  {
    id: 'warranty',
    title: 'Баталгаат хугацаа',
    icon: <ShieldCheck size={18} />,
    questions: [
      {
        q: "Шинэ автомашинд ямар баталгаа олгох вэ?",
        a: "Шинэ автомашинд хэвийн ашиглалтын явцад үүссэн 'Баталгаат засвар үйлчилгээнд хамаарахгүй зүйлс' хэсэгт зааснаас бусад аливаа гэмтэл, доголдол бүхий сэлбэгийг Тоёота компанийн зүгээс 3 жил эсвэл 100.000 км -н аль түрүүлж дуусах нөхцөлийн хүрээнд үнэгүй засварлах үүргийг хүлээнэ."
      },
      {
        q: "Шинэ автомашинд дагалдах үйлчилгээнд юу багтах вэ?",
        a: "Шинэ автомашинд 6 удаагийн тосны багц үйлчилгээ болон, 3 удаагийн хөдөлгүүрийн агаар шүүгч дагалдана."
      }
    ]
  },
  {
    id: 'toyotaq',
    title: 'Toyota Q (Used Cars)',
    icon: <History size={18} />,
    questions: [
      {
        q: "Toyota Q үйлчилгээний шаардлага",
        a: "Сүүлийн 7 жил дотор үйлдвэрлэгдсэн, 100,000 км-аас доош ашиглагдсан, албан ёсны дилерээс худалдан авсан автомашин хамаарна."
      }
    ]
  }
];

const FAQ = () => {
  const [activeTab, setActiveTab] = useState(faqCategories[0].id);
  const [openIdx, setOpenIdx] = useState(null);

  const currentCategory = faqCategories.find(cat => cat.id === activeTab);

  if (!currentCategory) return null;

  return (
    <div className="pt-32 pb-20 bg-[#F7F7F7] min-h-screen font-['Toyota_Type']">
      <div className="container-custom max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-toyota-red mb-3">
            <HelpCircle size={20} />
            <span className="font-bold text-[10px] uppercase tracking-[0.3em]">Тусламж</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#1A1A1A]">
            Түгээмэл асуулт <span className="text-toyota-red">хариулт</span>
          </h1>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-zinc-200 border border-zinc-200 mb-12 max-w-5xl mx-auto overflow-hidden">
          {faqCategories.map((category) => {
            const isActive = activeTab === category.id;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveTab(category.id);
                  setOpenIdx(null);
                }}
                className={`flex items-center gap-4 px-6 h-[72px] transition-all duration-300 text-left ${
                  isActive
                    ? 'bg-toyota-red text-white'
                    : 'bg-white text-[#2C3E50] hover:bg-zinc-50'
                }`}
              >
                <div className={`${isActive ? 'text-white' : 'text-toyota-red'} shrink-0`}>
                  {category.icon}
                </div>
                <span className="font-bold text-[12px] uppercase tracking-wider leading-snug">
                  {category.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Questions List */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3 max-w-4xl mx-auto"
        >
          <div className="mb-6 flex items-center gap-3 px-4">
             <div className="h-6 w-1 bg-toyota-red"></div>
             <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
               {currentCategory.title}
             </h2>
          </div>

          <div className="px-4 space-y-3">
            {currentCategory.questions.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="bg-white border border-zinc-200 rounded-none overflow-hidden transition-all duration-300 shadow-sm">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-zinc-50/50 transition-colors"
                  >
                    <span className="font-bold text-[#2C3E50] uppercase tracking-tight text-sm md:text-base leading-snug">
                      {faq.q}
                    </span>
                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-toyota-red' : 'text-zinc-400'}`}>
                      <ChevronDown size={20} />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="p-6 pt-0 border-t border-zinc-50 text-[#555] leading-relaxed font-medium text-sm md:text-base text-justify whitespace-pre-line">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
