import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import panoramaImage from '../assets/360/360.jpg';

const Viewer360 = () => {
  const viewerRef = useRef(null);

  useEffect(() => {
    // 1. Pannellum CSS нэмэх
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
    document.head.appendChild(link);

    // 2. Pannellum JS нэмэх
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    script.async = true;
    script.onload = () => {
      if (window.pannellum) {
        window.pannellum.viewer('panorama-container', {
          "type": "equirectangular",
          "panorama": panoramaImage,
          "autoLoad": true,
          "autoRotate": -1,
          "compass": false,
          "showZoomCtrl": true,
          "mouseZoom": true,
          "hfov": 110,
          "minPitch": -45, // Доошоо харах хязгаар (Хар нүхийг нуух)
          "maxPitch": 45,  // Дээшээ харах хязгаар (Хар нүхийг нуух)
          "minHfov": 50,   // Zoom-ийн хязгаар
          "maxHfov": 130,
          "backgroundColor": [0, 0, 0]
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col font-sans overflow-hidden">
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none" />

      <div className="absolute top-8 left-8 z-30 flex items-center gap-4">
        <div className="w-1.5 h-10 bg-toyota-red" />
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">Toyota VR Studio</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em] mt-1">Powered by Pannellum</p>
        </div>
      </div>

      {/* Close Button */}
      <div className="absolute top-8 right-8 z-30">
        <button
          onClick={() => window.history.back()}
          className="bg-white/10 hover:bg-toyota-red text-white p-5 border border-white/10 backdrop-blur-xl transition-all group rounded-sm shadow-2xl"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      {/* Pannellum Container */}
      <div id="panorama-container" className="w-full h-full" />

      {/* Footer Info */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 bg-black/40 px-8 py-3 rounded-full backdrop-blur-xl border border-white/10 pointer-events-none">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
          Scroll to zoom • Drag to explore
        </span>
      </div>
    </div>
  );
};

export default Viewer360;
