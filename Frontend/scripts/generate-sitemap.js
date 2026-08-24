// Build бүрийн өмнө ажилладаг: static хуудсууд болон DB-ийн машин/мэдээ/Toyota-Q/бүтээгдэхүүнүүдийг
// нэгтгэж public/sitemap.xml болон public/robots.txt үүсгэнэ. Ингэснээр Google шинэ хуудсуудыг олж,
// хуучирсан мэдээллийг дахин уншиж шинэчлэх боломжтой болно.
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://toyota-topmotors.mn';
const API_URL = process.env.VITE_API_URL || 'https://api.toyota-topmotors.mn';

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/vehicles', priority: '0.9', changefreq: 'daily' },
  { path: '/compare', priority: '0.4', changefreq: 'weekly' },
  { path: '/booking', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/service', priority: '0.8', changefreq: 'weekly' },
  { path: '/parts', priority: '0.6', changefreq: 'weekly' },
  { path: '/sales', priority: '0.5', changefreq: 'monthly' },
  { path: '/finance', priority: '0.5', changefreq: 'monthly' },
  { path: '/toyota-q', priority: '0.8', changefreq: 'daily' },
  { path: '/faq', priority: '0.5', changefreq: 'monthly' },
  { path: '/news', priority: '0.7', changefreq: 'daily' },
  { path: '/products', priority: '0.6', changefreq: 'weekly' },
  { path: '/wheels', priority: '0.6', changefreq: 'weekly' },
  { path: '/tires', priority: '0.6', changefreq: 'weekly' },
  { path: '/merch', priority: '0.5', changefreq: 'weekly' },
];

async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`[sitemap] Could not fetch ${url}:`, err.message);
    return [];
  }
}

async function main() {
  const [vehicles, toyotaQ, news, products] = await Promise.all([
    fetchJson(`${API_URL}/api/vehicles`),
    fetchJson(`${API_URL}/api/toyota-q`),
    fetchJson(`${API_URL}/api/news`),
    fetchJson(`${API_URL}/api/products`),
  ]);

  const dynamicUrls = [
    ...vehicles.map(v => ({ path: `/vehicles/${v.id}`, priority: '0.8', changefreq: 'weekly', lastmod: v.updatedAt })),
    ...toyotaQ.map(v => ({ path: `/toyota-q/${v.id}`, priority: '0.7', changefreq: 'daily' })),
    ...news.map(n => ({ path: `/news/${n.id}`, priority: '0.6', changefreq: 'monthly' })),
    ...products.map(p => {
      const base = p.category === 'GR Merch' ? '/merch' : (p.category === 'Дугуй' ? '/tires' : '/wheels');
      return { path: `${base}/${p.id}`, priority: '0.5', changefreq: 'monthly' };
    }),
  ];

  const allUrls = [...STATIC_ROUTES, ...dynamicUrls];

  const today = new Date().toISOString().split('T')[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${SITE_URL}${u.path}</loc>
    <lastmod>${u.lastmod ? new Date(u.lastmod).toISOString().split('T')[0] : today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  const publicDir = path.join(__dirname, '..', 'public');
  writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);

  const robots = `User-agent: *
Allow: /
Disallow: /admin-login
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`;
  writeFileSync(path.join(publicDir, 'robots.txt'), robots);

  console.log(`[sitemap] Wrote sitemap.xml with ${allUrls.length} URLs and robots.txt`);
}

main();
