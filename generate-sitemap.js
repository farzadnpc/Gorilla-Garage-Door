const fs = require('fs');
const path = require('path');

// 1. Read your suburb list
const jsonPath = path.join(__dirname, 'suburb-list.json');
let suburbs = [];
try {
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  suburbs = JSON.parse(rawData);
} catch (err) {
  console.error('Error: Could not find or parse suburb-list.json.');
  process.exit(1);
}

// 2. Base URL of your website
const baseUrl = 'https://www.gorillagaragedoor.com.au';

// 3. Your standard pages
const staticPages = [
  '', // Homepage
  '/about',
  '/services',
  '/garage-door-installation',
  '/garage-door-repairs',
  '/residential-maintenance',
  '/panel-door-repairs',
  '/roller-door-repairs',
  '/areas',
  '/gallery',
  '/contact'
];

// Start building the XML
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add static pages
staticPages.forEach(page => {
  sitemapXml += `  <url>\n    <loc>${baseUrl}${page}</loc>\n  </url>\n`;
});

// Add suburb pages
let suburbCount = 0;
suburbs.forEach((data) => {
  if (data.url_slug) {
    sitemapXml += `  <url>\n    <loc>${baseUrl}/${data.url_slug}</loc>\n  </url>\n`;
    suburbCount++;
  }
});

sitemapXml += `</urlset>`;

// Save the file
const sitemapPath = path.join(__dirname, 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');

console.log(`✅ sitemap.xml successfully generated! Included ${staticPages.length} main pages and ${suburbCount} suburb pages.`);