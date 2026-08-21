import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Send, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import API_BASE_URL from '../config';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: 'Ерөнхий асуулт',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'message',
          name: formData.name,
          phone: formData.phone,
          vehicle: formData.subject,
          description: formData.message, // Зурвасыг description талбарт хадгалъя
          time: 'N/A',
          date: new Date().toLocaleDateString()
        })
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: '', phone: '', subject: 'Ерөнхий асуулт', message: '' });
      } else {
        alert(t('contact.errors.generic'));
      }
    } catch (err) {
      console.error(err);
      alert(t('contact.errors.server'));
    }
    setIsSubmitting(false);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="pt-20 pb-10">
      <section className="py-8 md:py-16">
        <div className="container-custom px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20">

            {/* Info Column */}
            <div className="lg:col-span-5">
              <div className="space-y-8 md:space-y-12">
                <div>
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-6 md:mb-8">{t('contact.branchesTitle')}</h3>
                  <div className="space-y-6 md:space-y-10">
                    {/* Branch 1 */}
                    <div className="group">
                      <div className="flex items-center gap-3 mb-2 md:mb-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-toyota-gray-100 flex items-center justify-center group-hover:bg-toyota-red transition-colors">
                          <MapPin size={16} md:size={18} className="text-toyota-red group-hover:text-white" />
                        </div>
                        <h4 className="font-bold uppercase tracking-tight text-base md:text-lg">{t('footer.branch1Name')}</h4>
                      </div>
                      <div className="pl-11 md:pl-13 space-y-1 md:space-y-2 text-zinc-600">
                        <p className="text-xs md:text-sm leading-relaxed">{t('contact.branch1AddressDetailed')}</p>
                        <a href="tel:77778090" className="flex items-center gap-2 text-toyota-red font-bold text-xs md:text-sm hover:underline">
                          <Phone size={14} />
                          <span>7777 8090</span>
                        </a>
                      </div>
                    </div>

                    {/* Branch 2 */}
                    <div className="group">
                      <div className="flex items-center gap-3 mb-2 md:mb-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-toyota-gray-100 flex items-center justify-center group-hover:bg-toyota-red transition-colors">
                          <MapPin size={16} md:size={18} className="text-toyota-red group-hover:text-white" />
                        </div>
                        <h4 className="font-bold uppercase tracking-tight text-base md:text-lg">{t('footer.branch2Name')}</h4>
                      </div>
                      <div className="pl-11 md:pl-13 space-y-1 md:space-y-2 text-zinc-600">
                        <p className="text-xs md:text-sm leading-relaxed">{t('footer.branch2Address')}</p>
                        <a href="tel:77778090" className="flex items-center gap-2 text-toyota-red font-bold text-xs md:text-sm hover:underline">
                          <Phone size={14} />
                          <span>7777 8090</span>
                        </a>
                      </div>
                    </div>

                    <div className="pt-4 md:pt-6 border-t border-zinc-100">
                      <div className="flex items-center gap-3 mb-2 md:mb-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-toyota-gray-100 flex items-center justify-center">
                          <Mail size={16} md:size={18} className="text-toyota-red" />
                        </div>
                        <h4 className="font-bold uppercase tracking-tight text-base md:text-lg">{t('footer.emailLabel')}</h4>
                      </div>
                      <div className="pl-11 md:pl-13">
                        <p className="font-black text-toyota-red text-lg md:text-xl">info@topmotors.mn</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-toyota-black mb-4 md:mb-8">{t('contact.followUs')}</h3>
                  <div className="flex space-x-3 md:space-x-4">
                    {[
                      { Icon: Facebook, url: 'https://www.facebook.com/ToyotaTopMotors/' },
                      { Icon: Instagram, url: 'https://www.instagram.com/toyota.topmotors/?hl=en' },
                      { Icon: Youtube, url: 'https://www.youtube.com/@toyotatopmotors' }
                    ].map((social, i) => (
                      <a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 md:w-12 md:h-12 border border-zinc-200 flex items-center justify-center text-zinc-600 hover:border-toyota-red hover:text-toyota-red transition-all bg-white hover:bg-zinc-50"
                      >
                        <social.Icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-white p-6 md:p-12 border border-zinc-100 shadow-xl md:shadow-2xl relative overflow-hidden">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 md:py-20 text-center"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={32} md:size={40} className="text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2 md:mb-4">{t('contact.form.sentTitle')}</h3>
                    <p className="text-zinc-500 text-xs md:text-sm mb-6 md:mb-8">{t('contact.form.sentDesc')}</p>
                    <Button variant="outlineBlack" size="sm" onClick={() => setIsSuccess(false)}>{t('common.back')}</Button>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-6 md:mb-8 text-center md:text-left">{t('contact.form.title')}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <div>
                          <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 md:mb-2">{t('contact.form.nameLabel')}</label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 md:p-4 bg-toyota-gray-100 border-none focus:ring-1 focus:ring-toyota-red focus:outline-none transition-all font-bold text-xs md:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 md:mb-2">{t('contact.form.phoneLabel')}</label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3 md:p-4 bg-toyota-gray-100 border-none focus:ring-1 focus:ring-toyota-red focus:outline-none transition-all font-bold text-xs md:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 md:mb-2">{t('contact.form.subjectLabel')}</label>
                        {/* Утга нь backend рүү шууд илгээгддэг тул монгол хэлээр байлгав */}
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full p-3 md:p-4 bg-toyota-gray-100 border-none focus:ring-1 focus:ring-toyota-red focus:outline-none transition-all font-bold text-[10px] md:text-sm uppercase"
                        >
                          <option>Ерөнхий асуулт</option>
                          <option>Автомашин захиалга</option>
                          <option>Засвар үйлчилгээ</option>
                          <option>Хамтын ажиллагаа</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 md:mb-2">{t('contact.form.messageLabel')}</label>
                        <textarea
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          rows="4"
                          className="w-full p-3 md:p-4 bg-toyota-gray-100 border-none focus:ring-1 focus:ring-toyota-red focus:outline-none transition-all font-bold text-xs md:text-sm"
                        ></textarea>
                      </div>
                      <Button variant="primary" size="lg" className="w-full group h-12 md:h-14 text-[10px] md:text-xs" disabled={isSubmitting}>
                        <span>{isSubmitting ? t('common.submitting') : t('contact.form.sendBtn')}</span>
                        <Send className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} md:size={18} />
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="pb-16 md:pb-24 px-4">
        <div className="container-custom px-0 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* UB Branch Map */}
            <div className="space-y-3">
              <h4 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-toyota-red">{t('footer.branch1Name')}</h4>
              <div className="w-full h-[250px] md:h-[450px] border border-zinc-100 shadow-sm overflow-hidden rounded-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1016.8488239335089!2d106.87393315982861!3d47.91451716545323!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d9693bcb9c58ff5%3A0xa4b3a75a4bd2d6ba!2sTop%20Motors%2C%20Toyota%20Center!5e1!3m2!1sen!2smn!4v1781055776840!5m2!1sen!2smn"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Top Motors Toyota Center Location"
                ></iframe>
              </div>
            </div>

            {/* South Gobi Branch Map */}
            <div className="space-y-3">
              <h4 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-toyota-red">{t('footer.branch2Name')}</h4>
              <div className="w-full h-[250px] md:h-[450px] border border-zinc-100 shadow-sm overflow-hidden rounded-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d99243.95189523026!2d105.40934199726561!3d43.71882979999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x362091000a3f9b2d%3A0xd9dfaa71ee26e66a!2sTop%20Motors%20-%20Tsogttsetsii%20branch!5e1!3m2!1sen!2smn!4v1781077157846!5m2!1sen!2smn"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Top Motors Tsogttsetsii Branch Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
