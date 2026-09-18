import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, CheckCircle2, Star, Gauge } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import API_BASE_URL from '../config';

const SIDES = ['front', 'back', 'left', 'right'];

const ConsignVehicleModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState({});
  const [coverSide, setCoverSide] = useState(null);
  const [dashboardPhoto, setDashboardPhoto] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePhotoChange = (side, file) => {
    if (!file) return;
    setPhotos(prev => ({ ...prev, [side]: { file, preview: URL.createObjectURL(file) } }));
    if (!coverSide) setCoverSide(side);
  };

  const handleDashboardChange = (file) => {
    if (!file) return;
    setDashboardPhoto({ file, preview: URL.createObjectURL(file) });
  };

  const allPhotosSelected = SIDES.every(side => photos[side]) && !!dashboardPhoto;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allPhotosSelected) { setError(t('consignModal.errors.photos')); return; }
    if (!coverSide) { setError(t('consignModal.errors.cover')); return; }
    if (!name.trim() || !phone.trim()) { setError(t('consignModal.errors.contact')); return; }

    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      SIDES.forEach(side => formData.append('images', photos[side].file));
      formData.append('images', dashboardPhoto.file);

      const uploadRes = await fetch(`${API_BASE_URL}/api/upload-public`, { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || 'upload failed');

      const images = [
        ...SIDES.map((side, idx) => ({ side, url: uploadData.imageUrls[idx], isCover: side === coverSide })),
        { side: 'dashboard', url: uploadData.imageUrls[SIDES.length], isCover: false }
      ];

      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'toyota_q_request',
          name,
          phone,
          images: JSON.stringify(images),
          date: new Date().toLocaleDateString(),
          time: 'N/A'
        })
      });
      if (!res.ok) throw new Error('booking failed');
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError(t('consignModal.errors.generic'));
    }
    setSubmitting(false);
  };

  const handleClose = () => {
    setPhotos({});
    setCoverSide(null);
    setDashboardPhoto(null);
    setName('');
    setPhone('');
    setIsSuccess(false);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-0 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, y: '5%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '5%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative bg-white w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-t-2xl md:rounded-sm shadow-2xl"
        >
          <div className="p-5 md:p-8 border-b border-zinc-100 flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter">
              {t('consignModal.titlePlain')} <span className="text-toyota-red">{t('consignModal.titleRed')}</span>
            </h2>
            <button onClick={handleClose} className="p-2 hover:bg-zinc-100 transition-colors border border-zinc-100 rounded-sm">
              <X size={18} />
            </button>
          </div>

          {isSuccess ? (
            <div className="p-8 md:p-14 flex flex-col items-center text-center">
              <CheckCircle2 size={48} className="text-green-500 mb-4" />
              <h3 className="text-lg md:text-xl font-black uppercase mb-2">{t('consignModal.successTitle')}</h3>
              <p className="text-sm text-zinc-500 mb-6">{t('consignModal.successDesc')}</p>
              <button onClick={handleClose} className="px-8 py-3 bg-toyota-black text-white font-black uppercase tracking-widest text-xs">
                {t('common.confirm')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6">
              <p className="text-xs md:text-sm text-zinc-500">{t('consignModal.desc')}</p>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700 mb-3">{t('consignModal.photosLabel')}</p>
                <div className="grid grid-cols-2 gap-3">
                  {SIDES.map(side => (
                    <label
                      key={side}
                      className={`relative aspect-[4/3] border-2 rounded-sm overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all ${photos[side] ? 'border-zinc-200' : 'border-dashed border-zinc-300 hover:border-toyota-red'}`}
                    >
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoChange(side, e.target.files[0])} />
                      {photos[side] ? (
                        <img src={photos[side].preview} alt={side} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera size={22} className="text-zinc-500 mb-1" />
                          <span className="text-[9px] font-black uppercase text-zinc-700">{t(`consignModal.sides.${side}`)}</span>
                        </>
                      )}
                      {photos[side] && (
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setCoverSide(side); }}
                          className={`absolute top-1.5 right-1.5 p-1.5 rounded-full shadow-md transition-all ${coverSide === side ? 'bg-toyota-red text-white' : 'bg-white/90 text-zinc-400 hover:text-toyota-red'}`}
                          title={t('consignModal.setCover')}
                        >
                          <Star size={12} fill={coverSide === side ? 'currentColor' : 'none'} />
                        </button>
                      )}
                      {photos[side] && (
                        <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm">
                          {t(`consignModal.sides.${side}`)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
                <p className="text-[9px] text-zinc-400 mt-2">{t('consignModal.coverHint')}</p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700 mb-3">{t('consignModal.dashboardLabel')}</p>
                <label
                  className={`relative aspect-[16/9] border-2 rounded-sm overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all max-w-[220px] ${dashboardPhoto ? 'border-zinc-200' : 'border-dashed border-zinc-300 hover:border-toyota-red'}`}
                >
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleDashboardChange(e.target.files[0])} />
                  {dashboardPhoto ? (
                    <img src={dashboardPhoto.preview} alt="dashboard" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Gauge size={22} className="text-zinc-500 mb-1" />
                      <span className="text-[9px] font-black uppercase text-zinc-700 text-center px-2">{t('consignModal.dashboardLabel')}</span>
                    </>
                  )}
                </label>
                <p className="text-[9px] text-zinc-400 mt-2">{t('consignModal.dashboardHint')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('consignModal.namePlaceholder')}
                  className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-sm text-sm focus:outline-none focus:border-toyota-red"
                />
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={t('consignModal.phonePlaceholder')}
                  className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-sm text-sm focus:outline-none focus:border-toyota-red"
                />
              </div>

              {error && <p className="text-xs text-toyota-red font-bold">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-toyota-red text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all disabled:opacity-50"
              >
                {submitting ? t('common.submitting') : t('consignModal.submit')}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConsignVehicleModal;
