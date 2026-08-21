import { useTranslation } from 'react-i18next';

// Admin-аас оруулсан монгол/англи хос талбаруудаас идэвхтэй хэлэнд тохирсныг сонгоно
export function useLocale() {
  const { i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const loc = (mn, en) => (isEn && en) ? en : mn;
  return { isEn, loc };
}
