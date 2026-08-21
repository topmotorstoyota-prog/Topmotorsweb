import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Car, User, CheckCircle2, ArrowRight, UserCog, PhoneCall, ShoppingBag, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import API_BASE_URL from '../config';

const Booking = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [formData, setFormData] = useState({
    type: 'test_drive',
    serviceType: '',
    serviceDetail: '',
    vehicle: '',
    carNumber: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    downPayment: '',
    paymentCondition: '',
    otherModels: '',
    additionalInfo: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    // Fetch vehicles from API
    fetch(`${API_BASE_URL}/api/vehicles`)
      .then(res => res.json())
      .then(data => {
        setAvailableVehicles(data);
      })
      .catch(err => console.error('Error fetching vehicles:', err));

    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    const serviceType = params.get('serviceType');

    if (type === 'sales') {
      navigate('/sales');
    }

    if (type === 'service') {
      setFormData(prev => ({
        ...prev,
        type: 'service',
        serviceType: serviceType || prev.serviceType
      }));
      if (serviceType) {
        setStep(2);
      }
    }

    if (type === 'test_drive') {
      setFormData(prev => ({
        ...prev,
        type: 'test_drive'
      }));
      setStep(2);
    }

    if (type === 'new_car_order') {
      setFormData(prev => ({
        ...prev,
        type: 'new_car_order'
      }));
      setStep(2);
    }
  }, [location, navigate]);

  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  const prevStep = () => {
    if (step === 'success') {
      setStep(1);
    } else {
      setStep(prev => prev - 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalDescription = formData.serviceDetail || '';

      if (formData.type === 'new_car_order') {
        finalDescription = `
Урьдчилгаа: ${formData.downPayment}
Төлбөрийн нөхцөл: ${formData.paymentCondition}
Өөр сонирхож буй загвар: ${formData.otherModels || 'Байхгүй'}
Нэмэлт хүсэлт: ${formData.additionalInfo || 'Байхгүй'}
        `.trim();
      }

      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          serviceType: formData.serviceType,
          vehicle: formData.vehicle,
          plate: formData.carNumber,
          date: formData.date || new Date().toISOString().split('T')[0],
          time: formData.time || '--:--',
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          description: finalDescription
        })
      });
      if (res.ok) {
        setStep('success');
      } else {
        alert(t('booking.errors.submitFailed'));
      }
    } catch (err) {
      console.error(err);
      alert(t('booking.errors.serverError'));
    }
    setIsSubmitting(false);
  };

  // Анхаар: id болон subItems нь backend рүү шууд илгээгддэг тул монгол хэлээр байлгав
  // (admin panel үргэлж монгол хэлээр харагдана). title/description зөвхөн харуулахад ашиглагддаг тул орчуулав.
  const serviceCategories = [
    {
      id: "Тогтмол засвар үйлчилгээ",
      title: t('booking.services.regular.title'),
      description: t('booking.services.regular.desc'),
      subItems: ["Улирлын тос солих", "Бүх төрлийн шингэн солих", "Хуваарьт болон урсгал засвар"]
    },
    {
      id: "Оношилгоо",
      title: t('booking.services.diagnostics.title'),
      description: t('booking.services.diagnostics.desc'),
      subItems: ["Компьютер оношилгоо", "Хөдөлгүүрийн оношилгоо", "Цахилгааны оношилгоо"]
    },
    {
      id: "Хөдөлгүүр ба агрегатын засвар",
      title: t('booking.services.engine.title'),
      description: t('booking.services.engine.desc'),
      subItems: ["Агрегат засвар", "Хөдөлгүүрийн их засвар", "Хүч дамжуулагчийн их засвар"]
    },
    {
      id: "Дугуй ба явах эд ангийн үйлчилгээ",
      title: t('booking.services.wheels.title'),
      description: t('booking.services.wheels.desc'),
      subItems: ["Тэнхлэг тохиргоо", "Дугуй солих/тэнцвэржүүлэх", "Дугуй хадгалах"]
    },
    {
      id: "Автомашины арчилгаа, хамгаалалт",
      title: t('booking.services.care.title'),
      description: t('booking.services.care.desc'),
      subItems: ["Угаалга", "Хамгаалалтын хуулга", "Гадна өнгөлгөө"]
    },
    {
      id: "Оригинал сэлбэг ба аксессуар",
      title: t('booking.services.parts.title'),
      description: t('booking.services.parts.desc'),
      subItems: ["Сэлбэгийн худалдаа", "Аксессуар суурилуулалт", "Захиалгат сэлбэг"]
    }
  ];


  const timeSlots = [
    "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
  ];

  return (
    <div className="pt-20 md:pt-24 pb-10 md:pb-20 bg-toyota-gray-100 min-h-screen">
      <div className="container-custom py-6 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-6 md:mb-12">
            <h1 className="text-2xl md:text-5xl font-black uppercase tracking-tighter mt-1 md:mt-2 text-toyota-black">{t('booking.headerPlain')} <span className="text-zinc-400">{t('booking.headerRed')}</span></h1>
          </div>

          {/* Stepper Progress */}
          {step <= 4 && (
            <div className="flex items-center justify-center mb-6 md:mb-12">
              {[1, 2, 3, formData.type === 'new_car_order' ? 4 : null].filter(Boolean).map((i, index, arr) => (
                <React.Fragment key={i}>
                  <div className={`w-7 h-7 md:w-10 md:h-10 flex items-center justify-center font-bold text-[10px] md:text-sm transition-all duration-300 ${step >= i ? "bg-toyota-red text-white shadow-lg shadow-toyota-red/20" : "bg-white text-zinc-300 border border-zinc-200"}`}>
                    {i}
                  </div>
                  {index < arr.length - 1 && <div className={`w-6 md:w-16 h-[2px] transition-all duration-500 ${step > i ? "bg-toyota-red" : "bg-zinc-200"}`} />}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="bg-white shadow-xl md:shadow-2xl overflow-hidden border border-zinc-200 rounded-sm">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 md:p-12"
                >
                  <div className="grid grid-cols-3 gap-2 md:gap-6 mb-8 md:mb-12">
                    <button
                      onClick={() => setFormData({...formData, type: 'new_car_order'})}
                      className={`p-3 md:p-8 border-2 transition-all text-center flex flex-col items-center h-full rounded-sm ${formData.type === 'new_car_order' ? "border-toyota-red bg-toyota-red/5" : "border-zinc-100 hover:border-zinc-200"}`}
                    >
                      <ShoppingBag className={formData.type === 'new_car_order' ? "text-toyota-red" : "text-zinc-300 md:text-toyota-black"} size={20} md:size={40} />
                      <h4 className={`font-black uppercase tracking-tighter md:tracking-widest mt-2 md:mt-6 text-[7px] md:text-sm leading-tight ${formData.type === 'new_car_order' ? "text-toyota-red" : "text-toyota-black"}`}>{t('booking.types.newCar.title')}</h4>
                      <p className="hidden md:block text-[11px] text-zinc-800 mt-2 leading-relaxed">{t('booking.types.newCar.desc')}</p>
                    </button>
                    <button
                      onClick={() => setFormData({...formData, type: 'test_drive'})}
                      className={`p-3 md:p-8 border-2 transition-all text-center flex flex-col items-center h-full rounded-sm ${formData.type === 'test_drive' ? "border-toyota-red bg-toyota-red/5" : "border-zinc-100 hover:border-zinc-200"}`}
                    >
                      <Car className={formData.type === 'test_drive' ? "text-toyota-red" : "text-zinc-300 md:text-toyota-black"} size={20} md:size={40} />
                      <h4 className={`font-black uppercase tracking-tighter md:tracking-widest mt-2 md:mt-6 text-[7px] md:text-sm leading-tight ${formData.type === 'test_drive' ? "text-toyota-red" : "text-toyota-black"}`}>{t('booking.types.testDrive.title')}</h4>
                      <p className="hidden md:block text-[11px] text-zinc-800 mt-2 leading-relaxed">{t('booking.types.testDrive.desc')}</p>
                    </button>
                    <button
                      onClick={() => setFormData({...formData, type: 'service'})}
                      className={`p-3 md:p-8 border-2 transition-all text-center flex flex-col items-center h-full rounded-sm ${formData.type === 'service' ? "border-toyota-red bg-toyota-red/5" : "border-zinc-100 hover:border-zinc-200"}`}
                    >
                      <Clock className={formData.type === 'service' ? "text-toyota-red" : "text-zinc-300 md:text-toyota-black"} size={20} md:size={40} />
                      <h4 className={`font-black uppercase tracking-tighter md:tracking-widest mt-2 md:mt-6 text-[7px] md:text-sm leading-tight ${formData.type === 'service' ? "text-toyota-red" : "text-toyota-black"}`}>{t('booking.types.service.title')}</h4>
                      <p className="hidden md:block text-[11px] text-zinc-800 mt-2 leading-relaxed">{t('booking.types.service.desc')}</p>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <Link
                      to="/sales"
                      className="text-[10px] font-black uppercase tracking-widest text-toyota-black hover:text-toyota-red transition-all flex items-center gap-2 group"
                    >
                      <div className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center group-hover:border-toyota-red/20 group-hover:bg-toyota-red/5 transition-all">
                        <UserCog size={14} />
                      </div>
                      <span>{t('booking.contactSalesLink')}</span>
                    </Link>
                    <Button onClick={nextStep} size="lg" className="w-full sm:w-auto uppercase font-black tracking-widest text-[10px]">
                      {t('common.continue')} <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 md:p-12"
                >
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-6 md:mb-8">
                    {formData.type === 'new_car_order' ? t('booking.step2.titleModel') : t('booking.step2.titleModelTime')}
                  </h3>
                  <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                    {formData.type === 'service' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 md:mb-2">{t('booking.step2.serviceTypeLabel')}</label>
                        <select
                          value={formData.serviceType}
                          onChange={(e) => setFormData({...formData, serviceType: e.target.value, serviceDetail: ''})}
                          className="w-full p-3 md:p-4 border border-zinc-200 focus:border-toyota-red focus:outline-none bg-zinc-50 font-bold uppercase text-xs md:text-sm"
                          required={formData.type === 'service'}
                        >
                          <option value="">{t('common.select')}</option>
                          {serviceCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                        </select>
                        {formData.serviceType && (
                          <div className="mt-2 p-3 md:p-4 bg-zinc-50 border border-zinc-100">
                             <p className="text-[9px] md:text-[10px] text-zinc-500 italic mb-3 md:mb-4">
                               {serviceCategories.find(c => c.id === formData.serviceType)?.description}
                             </p>
                             <div className="flex flex-wrap gap-2">
                               {serviceCategories.find(c => c.id === formData.serviceType)?.subItems.map(sub => (
                                 <button
                                   key={sub}
                                   type="button"
                                   onClick={() => setFormData({...formData, serviceDetail: sub})}
                                   className={`text-[8px] md:text-[9px] border px-3 md:px-4 py-2 uppercase font-black tracking-widest transition-all ${
                                     formData.serviceDetail === sub
                                     ? "bg-toyota-red border-toyota-red text-white"
                                     : "bg-white border-zinc-200 text-zinc-400 hover:border-toyota-red"
                                   }`}
                                 >
                                   {sub}
                                 </button>
                               ))}
                             </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                    <div>
                      <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 md:mb-2">{t('booking.step2.vehicleLabel')}</label>
                      {formData.type === 'test_drive' || formData.type === 'new_car_order' ? (
                        <select
                          value={formData.vehicle}
                          onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                          className="w-full p-3 md:p-4 border border-zinc-200 focus:border-toyota-red focus:outline-none bg-zinc-50 font-bold uppercase text-xs md:text-sm"
                          required
                        >
                          <option value="">{t('common.select')}</option>
                          {availableVehicles.map(v => (
                            <option key={v.id} value={v.name}>{v.name}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder={t('booking.step2.vehiclePlaceholder')}
                          value={formData.vehicle}
                          onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                          className="w-full p-3 md:p-4 border border-zinc-200 focus:border-toyota-red focus:outline-none bg-zinc-50 font-bold uppercase text-xs md:text-sm"
                        />
                      )}
                      {formData.type === 'new_car_order' && (
                        <p className="text-[9px] text-zinc-400 mt-2 italic">{t('booking.step2.oneModelOnly')}</p>
                      )}
                    </div>
                    {formData.type === 'service' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 md:mb-2">{t('booking.step2.plateLabel')}</label>
                        <input
                          type="text"
                          placeholder="0000 УБА"
                          value={formData.carNumber}
                          onChange={(e) => setFormData({...formData, carNumber: e.target.value})}
                          className="w-full p-3 md:p-4 border border-zinc-200 focus:border-toyota-red focus:outline-none bg-zinc-50 font-bold uppercase text-xs md:text-sm"
                        />
                      </motion.div>
                    )}
                    {formData.type !== 'new_car_order' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <div>
                          <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 md:mb-2">{t('booking.step2.dateLabel')}</label>
                          <input
                            type="date"
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full p-3 md:p-4 border border-zinc-200 focus:border-toyota-red focus:outline-none bg-zinc-50 font-bold uppercase text-xs md:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 md:mb-2">{t('booking.step2.timeLabel')}</label>
                          <select
                            value={formData.time}
                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                            className="w-full p-3 md:p-4 border border-zinc-200 focus:border-toyota-red focus:outline-none bg-zinc-50 font-bold uppercase text-xs md:text-sm"
                          >
                            <option value="">{t('common.select')}</option>
                            {timeSlots.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <Button variant="ghost" onClick={prevStep} className="order-2 sm:order-1 text-[10px] font-black uppercase tracking-widest">{t('common.back')}</Button>
                    <Button onClick={nextStep} className="order-1 sm:order-2 text-[10px] font-black uppercase tracking-widest">{t('common.continue')} <ArrowRight className="ml-2" size={16} /></Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 md:p-12"
                >
                  <ContactStep
                    formData={formData}
                    setFormData={setFormData}
                    prevStep={prevStep}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    isNextOnly={formData.type === 'new_car_order'}
                    nextStep={nextStep}
                  />
                </motion.div>
              )}

              {step === 4 && formData.type === 'new_car_order' && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 md:p-12"
                >
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-6 md:mb-8">{t('booking.step4.title')}</h3>
                  <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 mb-8 md:mb-12">
                    <div>
                      <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">{t('booking.step4.downPaymentLabel')}</label>
                      {/* Утга нь backend рүү шууд илгээгддэг тул монгол хэлээр байлгав */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['5-10 сая төгрөг', '10-40 сая төгрөг', '40-100 сая төгрөг', '100 сая төгрөгөөс дээш'].map(opt => (
                          <label key={opt} className={`flex items-center p-4 border-2 cursor-pointer transition-all ${formData.downPayment === opt ? "border-toyota-red bg-toyota-red/5" : "border-zinc-100 hover:border-zinc-200"}`}>
                            <input type="radio" name="downPayment" value={opt} checked={formData.downPayment === opt} onChange={(e) => setFormData({...formData, downPayment: e.target.value})} className="hidden" />
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${formData.downPayment === opt ? "border-toyota-red" : "border-zinc-300"}`}>
                              {formData.downPayment === opt && <div className="w-2 h-2 bg-toyota-red rounded-full" />}
                            </div>
                            <span className="text-[10px] md:text-xs font-bold uppercase">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">{t('booking.step4.paymentConditionLabel')}</label>
                      <div className="flex gap-4">
                        {['Бэлэн', 'Зээлээр'].map(opt => (
                          <label key={opt} className={`flex-1 flex items-center p-4 border-2 cursor-pointer transition-all ${formData.paymentCondition === opt ? "border-toyota-red bg-toyota-red/5" : "border-zinc-100 hover:border-zinc-200"}`}>
                            <input type="radio" name="paymentCondition" value={opt} checked={formData.paymentCondition === opt} onChange={(e) => setFormData({...formData, paymentCondition: e.target.value})} className="hidden" />
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${formData.paymentCondition === opt ? "border-toyota-red" : "border-zinc-300"}`}>
                              {formData.paymentCondition === opt && <div className="w-2 h-2 bg-toyota-red rounded-full" />}
                            </div>
                            <span className="text-[10px] md:text-xs font-bold uppercase">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">{t('booking.step4.otherModelsLabel')}</label>
                      <input
                        type="text"
                        value={formData.otherModels}
                        onChange={(e) => setFormData({...formData, otherModels: e.target.value})}
                        placeholder={t('booking.step4.otherModelsPlaceholder')}
                        className="w-full p-4 border border-zinc-200 focus:border-toyota-red focus:outline-none bg-zinc-50 font-bold text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">{t('booking.step4.additionalInfoLabel')}</label>
                      <textarea
                        value={formData.additionalInfo}
                        onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                        className="w-full p-4 border border-zinc-200 focus:border-toyota-red focus:outline-none bg-zinc-50 font-medium text-xs h-32 resize-none"
                        placeholder={t('booking.step4.additionalInfoPlaceholder')}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 md:pt-6">
                      <Button variant="ghost" type="button" onClick={prevStep} className="order-2 sm:order-1 text-[10px] font-black uppercase tracking-widest">{t('common.back')}</Button>
                      <Button variant="primary" type="submit" className="order-1 sm:order-2 px-10 md:px-16 text-[10px] font-black uppercase tracking-widest" disabled={isSubmitting || !formData.downPayment || !formData.paymentCondition}>
                        {isSubmitting ? t('common.submitting') : t('common.confirm')}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 md:p-20 text-center"
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
                    <CheckCircle2 size={32} md:size={48} className="text-white" />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-2 md:mb-4">{t('booking.success.title')}</h3>
                  <p className="text-zinc-500 text-xs md:text-sm mb-8 md:mb-10 max-w-xs md:max-w-sm mx-auto">
                    {t('booking.success.desc')}
                  </p>
                  <Link to="/">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto text-[10px] font-black uppercase tracking-widest">{t('common.back')}</Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactStep = ({ formData, setFormData, prevStep, handleSubmit, isSubmitting, isNextOnly, nextStep }) => {
  const { t } = useTranslation();
  return (
  <>
    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-6 md:mb-8">{t('booking.contact.title')}</h3>
    <form onSubmit={isNextOnly ? (e) => { e.preventDefault(); nextStep(); } : handleSubmit} className="space-y-4 md:space-y-6 mb-8 md:mb-12">
      <div>
        <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 md:mb-2">
          {formData.type === 'new_car_order' ? t('booking.contact.nameOrgLabel') : t('booking.contact.nameLabel')}
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder={t('booking.contact.namePlaceholder')}
          className="w-full p-3 md:p-4 border border-zinc-200 focus:border-toyota-red focus:outline-none bg-zinc-50 font-bold text-xs md:text-sm"
        />
      </div>
      <div className={`grid grid-cols-1 ${formData.type === 'new_car_order' ? '' : 'md:grid-cols-2'} gap-4 md:gap-6`}>
        <div>
          <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 md:mb-2">{t('booking.contact.phoneLabel')}</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+976"
            className="w-full p-3 md:p-4 border border-zinc-200 focus:border-toyota-red focus:outline-none bg-zinc-50 font-bold text-xs md:text-sm"
          />
        </div>
        {formData.type !== 'new_car_order' && (
          <div>
            <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 md:mb-2">{t('booking.contact.emailLabel')}</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="name@example.com"
              className="w-full p-3 md:p-4 border border-zinc-200 focus:border-toyota-red focus:outline-none bg-zinc-50 font-bold text-xs md:text-sm"
            />
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 md:pt-6">
        <Button variant="ghost" type="button" onClick={prevStep} className="order-2 sm:order-1 text-[10px] font-black uppercase tracking-widest">{t('common.back')}</Button>
        <Button variant="primary" type="submit" className="order-1 sm:order-2 px-10 md:px-16 text-[10px] font-black uppercase tracking-widest" disabled={isSubmitting}>
          {isSubmitting ? t('common.submitting') : (isNextOnly ? t('common.continue') : t('common.confirm'))}
        </Button>
      </div>
    </form>
  </>
  );
};

export default Booking;
