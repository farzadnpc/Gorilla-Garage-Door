const fs = require('fs');
const path = require('path');

// 1. Read the HTML template
const templatePath = path.join(__dirname, 'template.html');
let templateHtml = '';
try {
  templateHtml = fs.readFileSync(templatePath, 'utf8');
} catch (err) {
  console.error('Error: Could not find template.html. Make sure it is saved in the same folder.');
  process.exit(1);
}

// 2. Read the JSON data
const jsonPath = path.join(__dirname, 'suburb-list.json');
let suburbs = [];
try {
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  suburbs = JSON.parse(rawData);
} catch (err) {
  console.error('Error: Could not find or parse suburb-list.json.');
  process.exit(1);
}

// 3. Loop through each suburb and generate a page
let successCount = 0;

suburbs.forEach((data) => {
  if (!data.url_slug) {
    console.warn('Skipping a row: Missing url_slug');
    return;
  }

  let pageHtml = templateHtml;

  // Replace all {{variables}} dynamically based on JSON keys
  for (const [key, value] of Object.entries(data)) {
    // Uses a regular expression to replace ALL instances of the variable (case-insensitive)
    const regex = new RegExp(`{{${key}}}`, 'gi');
    pageHtml = pageHtml.replace(regex, value);
  }

  // 4. Save the new HTML file
  const outputPath = path.join(__dirname, `${data.url_slug}.html`);
  fs.writeFileSync(outputPath, pageHtml, 'utf8');
  
  console.log(`Created: ${data.url_slug}.html`);
  successCount++;
});

console.log(`\n✅ Build complete! Successfully generated ${successCount} suburb pages.`);