import { useTranslation } from 'react-i18next';

// Admin-ын dropdown-оос сонгодог хөдөлгүүрийн төрлүүд - хаалттай тогтмол жагсаалт тул орчуулгын толь ашиглана
const FUEL_TYPE_EN = {
  'Бензин': 'Petrol',
  'Дизель': 'Diesel',
  'Хайбрид': 'Hybrid',
  'Цахилгаан': 'Electric',
};

// Admin-аас оруулсан монгол/англи хос талбаруудаас идэвхтэй хэлэнд тохирсныг сонгоно
export function useLocale() {
  const { i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const loc = (mn, en) => (isEn && en) ? en : mn;
  const fuelType = (mn) => (isEn && FUEL_TYPE_EN[mn]) ? FUEL_TYPE_EN[mn] : mn;
  return { isEn, loc, fuelType };
}
