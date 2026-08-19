import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, FileText, CheckCircle2, Info, Building2, User } from 'lucide-react';
import Button from '../components/Button';

const Finance = () => {
  const [price, setPrice] = useState(150000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [months, setMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(1.5);

  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    const principal = price * (1 - downPaymentPercent / 100);
    const monthlyRate = interestRate / 100;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    setMonthlyPayment(Math.round(payment));
  }, [price, downPaymentPercent, months, interestRate]);

  return (
    <div className="pt-28 md:pt-32 pb-20">
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Calculator Column */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 p-8 md:p-12 shadow-2xl">
              <div className="flex items-center gap-4 mb-10 border-b border-zinc-100 pb-6">
                <Calculator className="text-toyota-red" size={32} />
                <h3 className="text-2xl font-black uppercase tracking-tight">Төлбөр тооцох</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Автомашины үнэ (₮)</label>
                    <span className="font-black text-toyota-black">{price.toLocaleString()}₮</span>
                  </div>
                  <input
                    type="range" min="10000000" max="500000000" step="1000000"
                    value={price} onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-toyota-red"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Урьдчилгаа төлбөр (%)</label>
                      <span className="font-black text-toyota-black">{downPaymentPercent}%</span>
                    </div>
                    <input
                      type="range" min="10" max="50" step="5"
                      value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-toyota-red"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Зээлийн хугацаа (Сар)</label>
                      <span className="font-black text-toyota-black">{months} сар</span>
                    </div>
                    <select
                      value={months} onChange={(e) => setMonths(Number(e.target.value))}
                      className="w-full p-3 border border-zinc-200 font-bold focus:outline-none focus:border-toyota-red"
                    >
                      <option value={12}>12 сар (1 жил)</option>
                      <option value={24}>24 сар (2 жил)</option>
                      <option value={36}>36 сар (3 жил)</option>
                      <option value={48}>48 сар (4 жил)</option>
                      <option value={60}>60 сар (5 жил)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-toyota-black p-10 text-center relative overflow-hidden">
                   <div className="relative z-10">
                      <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">Сарын төлбөр</span>
                      <h4 className="text-white text-4xl md:text-5xl font-black tracking-tighter">{monthlyPayment.toLocaleString()}₮</h4>
                   </div>
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Calculator size={80} className="text-white" />
                   </div>
                </div>

                <p className="text-[10px] text-zinc-400 italic">* Энэхүү тооцоолол нь зөвхөн баримжаа бөгөөд банкны хүү болон бусад нөхцөлөөс хамааран өөрчлөгдөх боломжтой.</p>
              </div>
            </div>

            {/* Documents Column */}
            <div className="lg:col-span-5">
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <FileText className="text-toyota-red" size={28} />
                  <h3 className="text-xl font-black uppercase tracking-tight">Бүрдүүлэх материал</h3>
                </div>

                <div className="space-y-8">
                  <div className="p-6 border border-zinc-100 bg-zinc-50">
                    <div className="flex items-center gap-3 mb-4">
                      <User size={18} className="text-toyota-red" />
                      <h4 className="font-bold uppercase text-sm tracking-widest">Хувь хүн</h4>
                    </div>
                    <ul className="space-y-3">
                      {["Иргэний үнэмлэх", "Нийгмийн даатгалын лавлагаа", "Дансны хуулга (Сүүлийн 6 сар)", "Бусад орлого батлах бичиг баримт"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-zinc-600">
                          <CheckCircle2 size={14} className="text-green-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 border border-zinc-100 bg-zinc-50">
                    <div className="flex items-center gap-3 mb-4">
                      <Building2 size={18} className="text-toyota-red" />
                      <h4 className="font-bold uppercase text-sm tracking-widest">Байгууллага</h4>
                    </div>
                    <ul className="space-y-3">
                      {["Аж ахуйн нэгжийн гэрчилгээ", "Санхүүгийн тайлан", "Дансны хуулга", "Удирдах зөвлөлийн шийдвэр"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-zinc-600">
                          <CheckCircle2 size={14} className="text-green-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-toyota-red/5 p-8 border-l-4 border-toyota-red">
                <div className="flex gap-4">
                  <Info className="text-toyota-red shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold uppercase text-xs tracking-widest mb-2">Зөвлөгөө</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed">Та манай борлуулалтын зөвлөхүүдтэй холбогдож банк болон ББСБ-ын хамгийн сүүлийн үеийн хүүгийн мэдээллийг аваарай.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Finance;
