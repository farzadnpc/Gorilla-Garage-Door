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

// 2. Your standard pages
const staticPages = [
  { url: '/', title: 'Home' },
  { url: 'about', title: 'About Us' },
  { url: 'services', title: 'All Services' },
  { url: 'garage-door-installation', title: 'Garage Door Installation' },
  { url: 'garage-door-repairs', title: 'Garage Door Repairs' },
  { url: 'residential-maintenance', title: 'Residential Maintenance' },
  { url: 'panel-door-repairs', title: 'Panel Door Repairs' },
  { url: 'roller-door-repairs', title: 'Roller Door Repairs' },
  { url: 'areas', title: 'Service Areas' },
  { url: 'gallery', title: 'Gallery' },
  { url: 'contact', title: 'Contact Us' }
];

let staticLinksHtml = '';
staticPages.forEach(page => {
  staticLinksHtml += `        <li><a href="${page.url}">${page.title}</a></li>\n`;
});

// 3. Group suburbs by council
const groupedByCouncil = {};

suburbs.forEach(data => {
  if (!data.url_slug) return;
  // Fallback if council is empty
  const councilName = data.council || 'Other Areas'; 
  
  if (!groupedByCouncil[councilName]) {
    groupedByCouncil[councilName] = [];
  }
  groupedByCouncil[councilName].push(data);
});

// 4. Build the HTML for each council section alphabetically
let councilSectionsHtml = '';
const sortedCouncils = Object.keys(groupedByCouncil).sort();

sortedCouncils.forEach(council => {
  // Sort suburbs alphabetically within the council
  const councilSuburbs = groupedByCouncil[council].sort((a, b) => a.suburb.localeCompare(b.suburb));
  
  councilSectionsHtml += `
    <div class="sitemap-council-group">
      <h3>${council}</h3>
      <ul class="sitemap-list">
`;
  councilSuburbs.forEach(sub => {
    councilSectionsHtml += `        <li><a href="${sub.url_slug}">${sub.suburb}</a></li>\n`;
  });
  councilSectionsHtml += `      </ul>\n    </div>\n`;
});

// 5. Build the complete HTML page
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Site Map | Gorilla Garage Door</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:wght@400;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<style>
  .page-hero { min-height: 40vh; display: flex; align-items: flex-end; padding: 120px 60px 60px; position: relative; overflow: hidden; background: var(--black); }
  .page-hero-grid { position: absolute; inset: 0; background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 80px 80px; }
  .page-hero-content { position: relative; z-index: 2; }
  .page-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(60px, 9vw, 120px); line-height: 0.9; }
  .page-title span { color: var(--yellow); }
  
  .sitemap-container { padding: 80px 60px; max-width: 1200px; margin: 0 auto; }
  .sitemap-section { margin-bottom: 60px; }
  .sitemap-section > h2 { font-family: 'Bebas Neue', sans-serif; font-size: 42px; color: var(--yellow); margin-bottom: 32px; border-bottom: 1px solid #333; padding-bottom: 12px; }
  
  .sitemap-council-group { margin-bottom: 40px; }
  .sitemap-council-group h3 { font-family: 'Barlow Condensed', sans-serif; font-size: 26px; color: var(--white); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; border-left: 4px solid var(--yellow); padding-left: 12px; }
  
  .sitemap-list { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
  .sitemap-list a { color: var(--gray); text-decoration: none; font-size: 16px; transition: color 0.2s; display: flex; align-items: center; }
  .sitemap-list a::before { content: '>'; color: var(--yellow); font-weight: bold; margin-right: 8px; font-family: 'Bebas Neue'; }
  .sitemap-list a:hover { color: var(--white); }
  
  @media (max-width: 768px) { .sitemap-container { padding: 60px 24px; } }
</style>
</head>
<body>

<nav id="navbar">
  <a href="/" class="nav-logo">
    <img src="images/gorilla-logo.jpeg" alt="Gorilla Garage Door" class="logo-icon">
    <div class="logo-text"><span>GORILLA</span> GARAGE DOOR</div>
  </a>
  <ul class="nav-links" id="navLinks">
    <li><a href="/">Home</a></li>
    <li><a href="about">About Us</a></li>
    <li><a href="services">Services</a></li>
    <li><a href="areas">Area</a></li>
    <li><a href="gallery">Gallery</a></li>
    <li><a href="contact">Contact</a></li>
    <li><a href="contact.html#quote" class="nav-cta">Free Quote</a></li>
  </ul>
  <button class="hamburger" id="hamburger" aria-label="Open menu"><span></span><span></span><span></span></button>
</nav>
<div class="mobile-overlay" id="mobileOverlay"></div>

<section class="page-hero">
  <div class="page-hero-grid"></div>
  <div class="page-hero-content">
    <h1 class="page-title">SITE <span>MAP</span></h1>
  </div>
</section>

<div class="sitemap-container">
  <div class="sitemap-section">
    <h2>Main Pages</h2>
    <ul class="sitemap-list">
${staticLinksHtml}
    </ul>
  </div>
  
  <div class="sitemap-section">
    <h2>Service Areas by Council</h2>
${councilSectionsHtml}
  </div>
</div>

<footer>
  <div class="footer-bottom" style="text-align:center; padding: 40px;">
    <p>© 2026 Gorilla Garage Door. All rights reserved. Licensed &amp; Insured.</p>
  </div>
</footer>

<script src="script.js"></script>
</body>
</html>`;

// 6. Save the generated HTML file
const outputPath = path.join(__dirname, 'sitemap.html');
fs.writeFileSync(outputPath, htmlContent, 'utf8');

console.log(`✅ sitemap.html successfully generated! Suburbs are nicely grouped by council.`);