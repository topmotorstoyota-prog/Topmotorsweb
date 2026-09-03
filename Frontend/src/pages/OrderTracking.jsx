import React, { useState, useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import { Search, MapPin, Truck, Calendar, Loader2, Palette } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import API_BASE_URL from '../config';

// Тээврийн замын координатууд (Backend-ийн SHIPMENT_LOCATIONS-тай тохирно)
const NAGOYA = { lat: 35.1815, lng: 136.9066 };
const WUHAN = { lat: 30.5928, lng: 114.3055 };
const TIANJIN = { lat: 39.0842, lng: 117.2009 };
const QISUMU = { lat: 41.0283, lng: 113.0922 };
const LUJIACUN = { lat: 43.2560, lng: 112.1470 };
const ERLIAN = { lat: 43.6550, lng: 111.9770 };
const ZU = { lat: 43.6561, lng: 111.8956 };
const UB = { lat: 47.9184, lng: 106.9177 };

// Тээврийн замын эхлэл/төгсгөл/завсрын цэг - хайлтын vр дvнгээс vл хамааран globe дээр байнга харагдана
const FIXED_POINTS = [
  { kind: 'origin', ...NAGOYA, locationName: 'Нагоёа', shortName: 'Нагоёа' },
  { kind: 'destination', ...UB, locationName: 'Улаанбаатар', shortName: 'Улаанбаатар' },
  { kind: 'waypoint', ...WUHAN, locationName: 'Вухан боомт, БНХАУ', shortName: 'Вухан' },
  { kind: 'waypoint', ...TIANJIN, locationName: 'Тяньжин боомт, БНХАУ', shortName: 'Тяньжин' },
  { kind: 'waypoint', ...QISUMU, locationName: 'Жинин (Цисvму) зогсоол, БНХАУ', shortName: 'Жинин' },
  { kind: 'waypoint', ...LUJIACUN, locationName: 'Люжяцун зогсоол, БНХАУ', shortName: 'Люжяцун' },
  { kind: 'waypoint', ...ERLIAN, locationName: 'Эрээн боомт, БНХАУ', shortName: 'Эрээн' },
  { kind: 'waypoint', ...ZU, locationName: 'Замын-Vvд, Монгол', shortName: 'Замын-Vvд' }
];

// 2 vндсэн маршрут: Нагояас Тяньжин/Вуханруу - усан онгоцоор (эргийн шугам дагуу ойролцоолсон);
// vлдсэн хэсэг - төмөр замын бодит коридорыг ойролцоолсон олон цэгт зам (шулуун шугам биш)
const ROUTE_PATHS = [
  // Далайн зам: Нагоя -> Солонгосын хоолой -> Шар тэнгис -> Бохай булан -> Тяньжин
  { type: 'sea', points: [[35.1815, 136.9066], [34.5, 129.5], [36.5, 124.5], [38.0, 120.5], [39.0842, 117.2009]] },
  // Далайн зам: Нагоя -> Зvvн Хятадын тэнгис -> Янцзы мөрний ам -> Янцзыгаар дээшээ -> Вухан
  { type: 'sea', points: [[35.1815, 136.9066], [32.0, 130.0], [31.2, 122.0], [30.8, 118.5], [30.5928, 114.3055]] },
  // Route 1: Тяньжин -> Жанжакоу -> Улаанцаб -> Люжяцун
  { type: 'rail', points: [[39.0842, 117.2009], [40.8, 114.9], [41.0, 113.1], [43.2560, 112.1470]] },
  { type: 'rail', points: [[43.2560, 112.1470], [43.6550, 111.9770]] },
  // Route 2: Вухан -> Жэнжоу -> Шицзячжуан -> Датон -> Жинин (Цисvму)
  { type: 'rail', points: [[30.5928, 114.3055], [34.75, 113.65], [38.05, 114.5], [40.1, 113.3], [41.0283, 113.0922]] },
  { type: 'rail', points: [[41.0283, 113.0922], [42.3, 112.5], [43.6550, 111.9770]] },
  { type: 'rail', points: [[43.6550, 111.9770], [43.6561, 111.8956]] },
  // Төмөр зам: Замын-Vvд -> Сайншанд -> Чойр -> Улаанбаатар (Транс-Монголын төмөр зам)
  { type: 'rail', points: [[43.6561, 111.8956], [44.9, 110.15], [46.35, 108.35], [47.9184, 106.9177]] }
];

// Цэгvvдийг path-тай ижил native WebGL давхаргаар зурснаар globe-ийг эргvvлэхэд шугамаас
// тусардаггvй (HTML overlay markers нь WebGL шугамтай синхрон биш байдаг асуудлыг шийднэ)
const pointColorFor = (d) => {
  if (d.kind === 'current') return '#EB0A1E';
  if (d.kind === 'origin') return '#22c55e';
  if (d.kind === 'destination') return '#EB0A1E';
  return '#38bdf8';
};
const pointRadiusFor = (d) => d.kind === 'waypoint' ? 0.15 : 0.22;

// Одоогийн байршлын улаан "радар" анивчих цэгийн CSS keyframes-ийг нэг удаа тарааж оруулна
if (typeof document !== 'undefined' && !document.getElementById('ot-radar-style')) {
  const style = document.createElement('style');
  style.id = 'ot-radar-style';
  style.textContent = '@keyframes ot-radar-pulse { 0% { transform: scale(0.6); opacity: 0.9; } 100% { transform: scale(2.6); opacity: 0; } }';
  document.head.appendChild(style);
}

// "VH-TM0364" -> "364" (сvvлийн 3 орон хангалттай, бvтэн дугаар шаардлагагvй)
const shortShipment = (num) => {
  const digits = String(num || '').replace(/\D/g, '');
  return digits.slice(-3) || num || '';
};

const OrderTracking = () => {
  const { t } = useTranslation();
  useDocumentTitle('Захиалга хянах', 'Шинэ машины захиалгынхаа тээвэрлэлтийн явцыг VIN дугаараар хянана уу.');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [summary, setSummary] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const globeRef = useRef();
  const containerRef = useRef();
  const resultsSectionRef = useRef();
  const [globeSize, setGlobeSize] = useState({ width: 320, height: 320 });

  useEffect(() => {
    // Улс орнуудын хилийн шугам (GeoJSON) - globe дээр зөвхөн зураас нь харагдана
    fetch('https://raw.githubusercontent.com/vasturiano/three-globe/master/example/country-polygons/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => setCountries(data.features || []))
      .catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/shipment/summary`)
      .then(res => res.json())
      .then(data => setSummary(Array.isArray(data) ? data : []))
      .catch(() => setSummary([]))
      .finally(() => setSummaryLoading(false));
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        // Mobile дээр globe-ийг дэлгэц бvтэн өргөнд нь биш, компакт (app шиг) хэмжээтэй болгоно
        const isMobile = window.innerWidth < 768;
        const size = isMobile ? Math.min(containerRef.current.offsetWidth, 300) : containerRef.current.offsetWidth;
        setGlobeSize({ width: size, height: size });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (results && results.length > 0 && globeRef.current) {
      const first = results.find(r => r.lat && r.lng) || results[0];
      if (first.lat && first.lng) {
        globeRef.current.pointOfView({ lat: first.lat, lng: first.lng, altitude: 0.6 }, 1500);
      }
    }
  }, [results]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const last5 = query.trim().toUpperCase();
    if (!/^[A-Z0-9]{5}$/.test(last5)) {
      setError(t('orderTracking.errorInvalid'));
      setResults(null);
      return;
    }
    setError('');
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/shipment/track/${last5}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || t('orderTracking.errorGeneric'));
      } else if (data.length === 0) {
        setError(t('orderTracking.errorNotFound'));
      } else {
        setResults(data);
        setTimeout(() => {
          resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (err) {
      setError(t('orderTracking.errorNetwork'));
    }
    setLoading(false);
  };

  const currentPoints = (results || []).filter(r => r.lat && r.lng).map(r => ({ ...r, kind: 'current' }));
  const mapPoints = [...FIXED_POINTS, ...currentPoints];

  return (
    <div className="pt-24 md:pt-40 pb-20 bg-white min-h-screen text-toyota-black">
      <div className="container-custom px-4">
        <div className="mb-10 md:mb-16 text-center">
          <p className="text-xl md:text-3xl font-black text-toyota-black max-w-2xl mx-auto leading-tight">
            {t('orderTracking.heroText')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-6xl mx-auto items-stretch">
          {/* Зvvн тал: бvх тээврийн дугаарын одоогийн байршлыг харуулах хvснэгт (mobile дээр хайлттай нэг карт болно) */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-sm overflow-hidden flex flex-col">
            {/* Mobile-д зориулсан компакт хайлт - гарчгаас дээгvvр, зөвхөн lg-ээс доош харагдана */}
            <form onSubmit={handleSearch} className="lg:hidden p-4 border-b border-zinc-200">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('orderTracking.searchPlaceholder')}
                  maxLength={5}
                  className="w-full pl-10 pr-24 py-3.5 bg-white border border-zinc-200 text-toyota-black text-[11px] font-bold uppercase tracking-wide outline-none focus:border-toyota-red rounded-full transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-toyota-red hover:bg-toyota-black text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-colors flex items-center gap-2"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : t('orderTracking.searchBtn')}
                </button>
              </div>
              {error && <p className="text-toyota-red text-xs font-bold mt-3 text-center">{error}</p>}
            </form>
            <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.12em] md:tracking-[0.2em] text-zinc-600 px-4 pt-4 md:px-6 md:pt-6">{t('orderTracking.summaryTitle')}</h3>
            <div className="flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-zinc-600 text-center">{t('orderTracking.shipmentNumberCol')}</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-zinc-600 text-center">{t('orderTracking.detailCol')}</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryLoading ? (
                    <tr><td colSpan="2" className="p-10 text-center text-zinc-600 text-[11px] font-bold uppercase tracking-widest">{t('orderTracking.loading')}</td></tr>
                  ) : summary.length > 0 ? summary.map((s) => (
                    <tr key={s.shipmentNumber} className="border-b border-zinc-200/70 last:border-0">
                      <td className="p-4 text-xs font-bold tracking-wider align-top whitespace-nowrap text-center">{shortShipment(s.shipmentNumber)}</td>
                      <td className="p-4 text-[11px] font-medium text-zinc-700 leading-relaxed">{s.sentence || s.locationName || t('orderTracking.unknown')}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="2" className="p-10 text-center text-zinc-600 text-[11px] font-bold uppercase tracking-widest">{t('orderTracking.noData')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Баруун тал: VIN хайлт (mobile дээр хvснэгттэй нэг карт болсон тул энд зөвхөн lg-ээс дээш харагдана) */}
          <div className="hidden lg:flex bg-zinc-50 border border-zinc-200 rounded-sm p-8 md:p-12 flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-toyota-red/10 flex items-center justify-center mb-6">
              <Search className="text-toyota-red" size={24} />
            </div>
            <h3 className="text-base md:text-lg font-black uppercase tracking-tight mb-2">{t('orderTracking.searchTitle')}</h3>
            <p className="text-zinc-500 text-xs mb-8 max-w-xs leading-relaxed">
              {t('orderTracking.searchDesc')}
            </p>
            <form onSubmit={handleSearch} className="w-full max-w-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('orderTracking.searchPlaceholder')}
                  maxLength={5}
                  className="w-full pl-11 pr-28 py-4 bg-white border border-zinc-200 text-toyota-black text-sm font-bold uppercase tracking-widest outline-none focus:border-toyota-red rounded-full transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-toyota-red hover:bg-toyota-black text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-colors flex items-center gap-2"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : t('orderTracking.searchBtn')}
                </button>
              </div>
              {error && <p className="text-toyota-red text-xs font-bold mt-4 text-center">{error}</p>}
            </form>
          </div>
        </div>

        <div ref={resultsSectionRef} className="max-w-6xl mx-auto mt-10 md:mt-24 scroll-mt-24">
            <div className="grid sm:grid-cols-2 gap-10 items-center">
              <div className="flex flex-col items-center justify-center gap-4 bg-black rounded-2xl border border-white/10 shadow-xl p-4 md:p-6 overflow-hidden">
                <div ref={containerRef} className="w-full flex items-center justify-center">
                <Globe
                  ref={globeRef}
                  width={globeSize.width}
                  height={globeSize.height}
                  globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                  backgroundColor="#000000"
                  pointsData={FIXED_POINTS}
                  pointLat="lat"
                  pointLng="lng"
                  pointColor={pointColorFor}
                  pointRadius={pointRadiusFor}
                  pointAltitude={0.005}
                  pointLabel={(d) => d.locationName || ''}
                  pointResolution={12}
                  htmlElementsData={mapPoints}
                  htmlLat="lat"
                  htmlLng="lng"
                  htmlAltitude={0.006}
                  htmlElement={(d) => {
                    const el = document.createElement('div');
                    el.style.pointerEvents = 'none';
                    if (d.kind === 'current') {
                      // Одоогийн байршлыг улаан "радар" анивчих цэгээр тэмдэглэнэ
                      el.style.width = '18px';
                      el.style.height = '18px';
                      el.style.position = 'relative';
                      el.style.transform = 'translate(-50%, -50%)';
                      el.innerHTML = '<div style="position:absolute;inset:0;border-radius:50%;background:#EB0A1E;animation:ot-radar-pulse 1.6s ease-out infinite;"></div><div style="position:absolute;left:50%;top:50%;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;background:#EB0A1E;box-shadow:0 0 6px rgba(235,10,30,0.9);"></div>';
                    } else {
                      // 3D WebGL текст (troika) кириллийг дэмждэггvй ("?" болж харагддаг) тул
                      // нэрийн шошгыг энгийн HTML-аар зурна (цэг өөрөө pointsData дээр vлддэг)
                      el.textContent = d.shortName;
                      el.style.transform = 'translate(8px, -50%)';
                      el.style.fontSize = '11px';
                      el.style.fontWeight = '800';
                      el.style.color = '#fff';
                      el.style.textShadow = '0 0 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8)';
                      el.style.whiteSpace = 'nowrap';
                    }
                    return el;
                  }}
                  pathsData={ROUTE_PATHS}
                  pathPoints="points"
                  pathPointLat={(p) => p[0]}
                  pathPointLng={(p) => p[1]}
                  pathPointAlt={0.01}
                  pathColor={(d) => d.type === 'sea' ? '#38bdf8' : '#f59e0b'}
                  pathStroke={0.6}
                  pathDashLength={1}
                  pathDashGap={0}
                  pathDashAnimateTime={0}
                  pathTransitionDuration={0}
                  polygonsData={countries}
                  polygonCapColor={() => 'rgba(0,0,0,0)'}
                  polygonSideColor={() => 'rgba(0,0,0,0)'}
                  polygonStrokeColor={() => 'rgba(255,255,255,0.4)'}
                  polygonAltitude={0.001}
                  onGlobeReady={() => {
                    if (globeRef.current) {
                      // Эхлэл (Нагоя) ба төгсгөл (Улаанбаатар) цэгvvдийн голыг чиглэж, холоос аажмаар томруулна
                      globeRef.current.pointOfView({ lat: 41.5, lng: 121.9, altitude: 4 }, 0);
                      setTimeout(() => {
                        if (globeRef.current) {
                          globeRef.current.pointOfView({ lat: 41.5, lng: 121.9, altitude: 2.2 }, 1800);
                        }
                      }, 50);
                    }
                  }}
                />
                </div>
                <div className="w-full flex flex-nowrap items-center justify-center gap-2 md:gap-4 overflow-x-auto no-scrollbar text-[7px] md:text-[9px] font-bold uppercase tracking-wide md:tracking-wider text-zinc-500">
                  <span className="flex items-center gap-1 shrink-0"><span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#22c55e] shrink-0" /> Нагоёа</span>
                  <span className="flex items-center gap-1 shrink-0"><span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#EB0A1E] shrink-0" /> Улаанбаатар</span>
                  <span className="flex items-center gap-1 shrink-0"><span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#38bdf8] shrink-0" /> {t('orderTracking.legendWaypoint')}</span>
                  <span className="flex items-center gap-1 shrink-0"><span className="w-3 h-[2px] bg-[#38bdf8] shrink-0" /> {t('orderTracking.legendSea')}</span>
                  <span className="flex items-center gap-1 shrink-0"><span className="w-3 h-[2px] bg-[#f59e0b] shrink-0" /> {t('orderTracking.legendRail')}</span>
                </div>
              </div>

              {results && results.length > 0 ? (
                <div className="space-y-6">
                  {results.map((r, idx) => (
                    <div key={r.vin || idx} className="bg-zinc-50 border border-zinc-200 rounded-sm p-6 md:p-8">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-200">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{t('orderTracking.vinLabel')}</span>
                        <span className="text-xs font-bold tracking-wider">{r.vin}</span>
                      </div>
                      <div className="space-y-3">
                        {r.modelName && (
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{t('orderTracking.modelLabel')}</span>
                            <span className="text-sm font-black">{r.modelName}</span>
                          </div>
                        )}
                        {r.exteriorColor && (
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-1.5"><Palette size={12} /> {t('orderTracking.exteriorColorLabel')}</span>
                            <span className="text-sm font-bold text-zinc-900">{r.exteriorColor}</span>
                          </div>
                        )}
                        {r.interiorColor && (
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-1.5"><Palette size={12} /> {t('orderTracking.interiorColorLabel')}</span>
                            <span className="text-sm font-bold text-zinc-900">{r.interiorColor}</span>
                          </div>
                        )}
                        {r.manufactureYearMonth && (
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{t('orderTracking.manufacturedLabel')}</span>
                            <span className="text-sm font-bold text-zinc-900">{r.manufactureYearMonth}</span>
                          </div>
                        )}
                        {r.shipmentNumber && (
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-1.5"><Truck size={12} /> {t('orderTracking.shipmentLabel')}</span>
                            <span className="text-sm font-bold text-zinc-900">{shortShipment(r.shipmentNumber)}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 pt-6 border-t border-zinc-200">
                        <div className="flex items-center gap-2 text-toyota-red mb-2">
                          <MapPin size={16} />
                          <span className="text-sm font-black uppercase tracking-wide">{r.locationName || t('orderTracking.unknownLocation')}</span>
                        </div>
                        {r.sentence ? (
                          <p className="text-[12px] font-medium text-zinc-600 leading-relaxed">{r.sentence}</p>
                        ) : r.dateLabel && (
                          <div className="flex items-center gap-2 text-zinc-600">
                            <Calendar size={12} />
                            <span className="text-[11px] font-bold">{r.dateLabel}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-zinc-200 rounded-sm py-16 px-6 text-center text-zinc-600 text-[11px] font-bold uppercase tracking-widest">
                  {t('orderTracking.searchPrompt')}
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
