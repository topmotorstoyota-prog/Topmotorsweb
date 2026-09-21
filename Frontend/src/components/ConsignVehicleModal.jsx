import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Image as ImageIcon, CheckCircle2, Star, Gauge } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import API_BASE_URL from '../config';

const SIDES = ['front', 'back', 'left', 'right'];
const TARGET_KB = 500;
const MAX_DIM = 1600;

// Зургийг canvas ашиглан ойролцоогоор TARGET_KB хэмжээ хvртэл шахна (chanar шат шатаар бууруулж)
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width >= height) { height = Math.round((height * MAX_DIM) / width); width = MAX_DIM; }
        else { width = Math.round((width * MAX_DIM) / height); height = MAX_DIM; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);

      const attempt = (quality) => {
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error('compress failed')); return; }
          if (blob.size / 1024 <= TARGET_KB || quality <= 0.4) {
            resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }));
          } else {
            attempt(quality - 0.15);
          }
        }, 'image/jpeg', quality);
      };
      attempt(0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('image load failed')); };
    img.src = objectUrl;
  });
}

// Файлуудыг тохирсон FormData-руу оруулаад upload progress-тойгоор илгээнэ (fetch-д progress байдаггvй тул XHR ашиглав)
function uploadWithProgress(url, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(new Error(data.message || 'upload failed'));
      } catch (err) { reject(err); }
    };
    xhr.onerror = () => reject(new Error('network error'));
    xhr.send(formData);
  });
}

const PhotoSlot = ({ label, preview, onSelect, isCover, onSetCover, small }) => {
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  return (
    <div
      className={`relative border-2 rounded-sm overflow-hidden flex flex-col items-center justify-center transition-all bg-zinc-50 ${small ? 'aspect-[16/9] max-w-[220px]' : 'aspect-[4/3]'} ${preview ? 'border-zinc-200' : 'border-dashed border-zinc-300'}`}
    >
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onSelect(e.target.files[0])} />
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={(e) => onSelect(e.target.files[0])} />

      {preview ? (
        <img src={preview} alt={label} className="w-full h-full object-contain" />
      ) : (
        <>
          <span className="text-[9px] font-black uppercase text-zinc-700 text-center px-2 mb-2">{label}</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => cameraRef.current?.click()} className="p-2.5 bg-white border border-zinc-200 rounded-full text-zinc-600 hover:text-toyota-red hover:border-toyota-red transition-colors" title="Камер">
              <Camera size={16} />
            </button>
            <button type="button" onClick={() => galleryRef.current?.click()} className="p-2.5 bg-white border border-zinc-200 rounded-full text-zinc-600 hover:text-toyota-red hover:border-toyota-red transition-colors" title="Галерей">
              <ImageIcon size={16} />
            </button>
          </div>
        </>
      )}

      {preview && onSetCover && (
        <button
          type="button"
          onClick={onSetCover}
          className={`absolute top-1.5 right-1.5 p-1.5 rounded-full shadow-md transition-all ${isCover ? 'bg-toyota-red text-white' : 'bg-white/90 text-zinc-400 hover:text-toyota-red'}`}
        >
          <Star size={12} fill={isCover ? 'currentColor' : 'none'} />
        </button>
      )}
      {preview && (
        <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm">
          {label}
        </span>
      )}
    </div>
  );
};

const ConsignVehicleModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState({});
  const [coverSide, setCoverSide] = useState(null);
  const [dashboardPhoto, setDashboardPhoto] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePhotoChange = async (side, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setPhotos(prev => ({ ...prev, [side]: { file, preview } }));
    if (!coverSide) setCoverSide(side);
  };

  const handleDashboardChange = async (file) => {
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
    setProgress(0);
    try {
      // Илгээхийн өмнө бvх зургийг ~500KB хvртэл шахна
      const compressed = await Promise.all([
        ...SIDES.map(side => compressImage(photos[side].file)),
        compressImage(dashboardPhoto.file)
      ]);

      const formData = new FormData();
      compressed.forEach(f => formData.append('images', f));

      const uploadData = await uploadWithProgress(`${API_BASE_URL}/api/upload-public`, formData, setProgress);

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
    setProgress(0);
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
                    <PhotoSlot
                      key={side}
                      label={t(`consignModal.sides.${side}`)}
                      preview={photos[side]?.preview}
                      onSelect={(file) => handlePhotoChange(side, file)}
                      isCover={coverSide === side}
                      onSetCover={() => setCoverSide(side)}
                    />
                  ))}
                </div>
                <p className="text-[9px] text-zinc-400 mt-2">{t('consignModal.coverHint')}</p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700 mb-3">{t('consignModal.dashboardLabel')}</p>
                <PhotoSlot
                  label={t('consignModal.dashboardLabel')}
                  preview={dashboardPhoto?.preview}
                  onSelect={handleDashboardChange}
                  small
                />
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

              {submitting ? (
                <div className="space-y-2">
                  <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-toyota-red transition-all duration-200" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">{progress}%</p>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-4 bg-toyota-red text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all"
                >
                  {t('consignModal.submit')}
                </button>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConsignVehicleModal;
