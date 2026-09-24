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

const PhotoSlot = ({ label, preview, onSelect, isCover, onSetCover }) => {
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  return (
    <div
      className={`relative border-2 rounded-sm overflow-hidden flex flex-col items-center justify-center transition-all bg-zinc-50 aspect-square ${preview ? 'border-zinc-200' : 'border-dashed border-zinc-300'}`}
    >
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onSelect(e.target.files[0])} />
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={(e) => onSelect(e.target.files[0])} />

      {preview ? (
        <img src={preview} alt={label} className="w-full h-full object-contain" />
      ) : (
        <>
          <span className="text-[6px] xs:text-[7px] sm:text-[9px] font-black uppercase text-zinc-700 text-center px-1 mb-1 leading-tight">{label}</span>
          <div className="flex gap-1 sm:gap-2">
            <button type="button" onClick={() => cameraRef.current?.click()} className="p-1 sm:p-2.5 bg-white border border-zinc-200 rounded-full text-zinc-600 hover:text-toyota-red hover:border-toyota-red transition-colors" title="Камер">
              <Camera size={12} className="sm:w-4 sm:h-4" />
            </button>
            <button type="button" onClick={() => galleryRef.current?.click()} className="p-1 sm:p-2.5 bg-white border border-zinc-200 rounded-full text-zinc-600 hover:text-toyota-red hover:border-toyota-red transition-colors" title="Галерей">
              <ImageIcon size={12} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </>
      )}

      {preview && onSetCover && (
        <button
          type="button"
          onClick={onSetCover}
          className={`absolute top-1 right-1 p-1 rounded-full shadow-md transition-all ${isCover ? 'bg-toyota-red text-white' : 'bg-white/90 text-zinc-400 hover:text-toyota-red'}`}
        >
          <Star size={10} fill={isCover ? 'currentColor' : 'none'} />
        </button>
      )}
      {preview && (
        <span className="absolute bottom-0.5 left-0.5 bg-black/60 text-white text-[6px] sm:text-[8px] font-black uppercase px-1 py-0.5 rounded-sm leading-none">
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
  const [certificatePhoto, setCertificatePhoto] = useState(null);
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

  const handleCertificateChange = async (file) => {
    if (!file) return;
    setCertificatePhoto({ file, preview: URL.createObjectURL(file) });
  };

  const allPhotosSelected = SIDES.every(side => photos[side]) && !!dashboardPhoto && !!certificatePhoto;

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
        compressImage(dashboardPhoto.file),
        compressImage(certificatePhoto.file)
      ]);

      const formData = new FormData();
      compressed.forEach(f => formData.append('images', f));

      const uploadData = await uploadWithProgress(`${API_BASE_URL}/api/upload-public`, formData, setProgress);

      const images = [
        ...SIDES.map((side, idx) => ({ side, url: uploadData.imageUrls[idx], isCover: side === coverSide })),
        { side: 'dashboard', url: uploadData.imageUrls[SIDES.length], isCover: false },
        { side: 'certificate', url: uploadData.imageUrls[SIDES.length + 1], isCover: false }
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
    setCertificatePhoto(null);
    setName('');
    setPhone('');
    setIsSuccess(false);
    setError('');
    setProgress(0);
    onClose();
  };

  const gridSlots = [
    ...SIDES.map(side => ({
      key: side,
      label: t(`consignModal.sides.${side}`),
      preview: photos[side]?.preview,
      onSelect: (file) => handlePhotoChange(side, file),
      isCover: coverSide === side,
      onSetCover: () => setCoverSide(side),
    })),
    {
      key: 'dashboard',
      label: t('consignModal.dashboardShortLabel'),
      preview: dashboardPhoto?.preview,
      onSelect: handleDashboardChange,
    },
    {
      key: 'certificate',
      label: t('consignModal.certificateShortLabel'),
      preview: certificatePhoto?.preview,
      onSelect: handleCertificateChange,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-0 md:p-4">
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
          className="relative bg-white w-full h-[100dvh] md:h-auto md:max-h-[92vh] md:max-w-md flex flex-col md:rounded-sm shadow-2xl overflow-hidden"
        >
          <div className="px-4 py-3 md:p-5 border-b border-zinc-100 flex justify-between items-center shrink-0">
            <h2 className="text-base md:text-xl font-black uppercase tracking-tighter">
              {t('consignModal.titlePlain')} <span className="text-toyota-red">{t('consignModal.titleRed')}</span>
            </h2>
            <button onClick={handleClose} className="p-1.5 hover:bg-zinc-100 transition-colors border border-zinc-100 rounded-sm">
              <X size={16} />
            </button>
          </div>

          {isSuccess ? (
            <div className="p-8 md:p-14 flex-1 flex flex-col items-center justify-center text-center">
              <CheckCircle2 size={48} className="text-green-500 mb-4" />
              <h3 className="text-lg md:text-xl font-black uppercase mb-2">{t('consignModal.successTitle')}</h3>
              <p className="text-sm text-zinc-500 mb-6">{t('consignModal.successDesc')}</p>
              <button onClick={handleClose} className="px-8 py-3 bg-toyota-black text-white font-black uppercase tracking-widest text-xs">
                {t('common.confirm')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-y-auto px-4 py-3 md:p-5 gap-2.5">
              <p className="hidden xs:block text-[9px] sm:text-[11px] text-zinc-400 leading-snug">{t('consignModal.desc')}</p>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {gridSlots.map(slot => (
                  <PhotoSlot
                    key={slot.key}
                    label={slot.label}
                    preview={slot.preview}
                    onSelect={slot.onSelect}
                    isCover={slot.isCover}
                    onSetCover={slot.onSetCover}
                  />
                ))}
              </div>
              <p className="text-[8px] sm:text-[9px] text-zinc-400">{t('consignModal.gridHint')}</p>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('consignModal.namePlaceholder')}
                  className="w-full p-2.5 sm:p-3 bg-zinc-50 border border-zinc-200 rounded-sm text-xs sm:text-sm focus:outline-none focus:border-toyota-red"
                />
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={t('consignModal.phonePlaceholder')}
                  className="w-full p-2.5 sm:p-3 bg-zinc-50 border border-zinc-200 rounded-sm text-xs sm:text-sm focus:outline-none focus:border-toyota-red"
                />
              </div>

              {error && <p className="text-[10px] sm:text-xs text-toyota-red font-bold">{error}</p>}

              <div className="mt-auto pt-2 shrink-0">
                {submitting ? (
                  <div className="space-y-1.5">
                    <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-toyota-red transition-all duration-200" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">{progress}%</p>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3 sm:py-3.5 bg-toyota-red text-white font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs hover:bg-black transition-all"
                  >
                    {t('consignModal.submit')}
                  </button>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConsignVehicleModal;
