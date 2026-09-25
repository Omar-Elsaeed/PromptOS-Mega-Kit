import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = process.env.APP_URL || 'https://ais-pre-mub4stqcpyqz5vshkt77y6-191782561593.europe-west2.run.app';
const today = new Date().toISOString().split('T')[0];

const SITEMAP_ROUTES = [
  { path: '', changefreq: 'daily', priority: '1.0' },
  { path: 'library', changefreq: 'daily', priority: '0.9' },
  { path: 'fable5', changefreq: 'weekly', priority: '0.9' },
  { path: 'builder', changefreq: 'weekly', priority: '0.9' },
  { path: 'bedrock', changefreq: 'weekly', priority: '0.8' },
  { path: 'langchain', changefreq: 'weekly', priority: '0.8' },
  { path: 'crewai', changefreq: 'weekly', priority: '0.8' },
  { path: 'evals', changefreq: 'weekly', priority: '0.8' },
  { path: 'finetuning', changefreq: 'weekly', priority: '0.8' },
  { path: 'automation', changefreq: 'weekly', priority: '0.8' },
  { path: 'agents', changefreq: 'weekly', priority: '0.8' },
  { path: 'skills', changefreq: 'weekly', priority: '0.8' },
  { path: 'compare', changefreq: 'weekly', priority: '0.8' },
  { path: 'playground', changefreq: 'weekly', priority: '0.8' },
  { path: 'knowledge', changefreq: 'weekly', priority: '0.8' },
  { path: 'community', changefreq: 'weekly', priority: '0.7' },
  { path: 'store', changefreq: 'weekly', priority: '0.7' },
  { path: 'blueprint', changefreq: 'weekly', priority: '0.7' },
];

function generateSitemapXML(baseUrl) {
  const urls = SITEMAP_ROUTES.map((route) => {
    const loc = route.path ? `${baseUrl}/${route.path}` : `${baseUrl}/`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>
`;
}

const sitemapContent = generateSitemapXML(BASE_URL);

// Ensure public directory exists
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write to public/sitemap.xml and root sitemap.xml
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf-8');
fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapContent, 'utf-8');

console.log(`[sitemap] Generated sitemap.xml with ${SITEMAP_ROUTES.length} routes for ${BASE_URL} (date: ${today})`);
