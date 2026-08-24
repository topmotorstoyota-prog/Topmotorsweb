import { useEffect } from 'react';

const SITE_NAME = 'Toyota Top Motors';
const DEFAULT_DESCRIPTION = 'Toyota Top Motors LLC - Монгол дахь Тоёотагийн албан ёсны дилер. Шинэ автомашин, засвар үйлчилгээ, эх сэлбэг.';

function setMeta(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

// Хуудас бүрт өөрийн гэсэн <title> болон meta description олгож,
// Google-д илэрдэг хайлтын үр дүнг тухайн хуудасны бодит агуулгатай тааруулна.
export function useDocumentTitle(title, description) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const desc = description || DEFAULT_DESCRIPTION;

    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="twitter:title"]', 'content', fullTitle);
    setMeta('meta[property="twitter:description"]', 'content', desc);

    return () => {
      document.title = SITE_NAME;
      setMeta('meta[name="description"]', 'content', DEFAULT_DESCRIPTION);
      setMeta('meta[property="og:title"]', 'content', SITE_NAME);
      setMeta('meta[property="og:description"]', 'content', DEFAULT_DESCRIPTION);
      setMeta('meta[property="twitter:title"]', 'content', SITE_NAME);
      setMeta('meta[property="twitter:description"]', 'content', DEFAULT_DESCRIPTION);
    };
  }, [title, description]);
}
