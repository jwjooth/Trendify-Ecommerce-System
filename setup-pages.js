#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');

// Create pages directory if it doesn't exist
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
  console.log('✅ Created pages directory');
}

// Create wrapper pages that re-export from src/app/pages
const pages = [
  '_app',
  '_document',
  'index',
  'product',
  'cart',
  'checkout',
  'order-confirmation',
  'about',
  'contact',
  '404'
];

pages.forEach(page => {
  const filePath = path.join(pagesDir, `${page}.tsx`);
  const content = `// Auto-generated wrapper - re-exports from src/app/pages
export { default } from '../src/app/pages/${page}';
`;
  
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created pages/${page}.tsx`);
  }
});

console.log('✅ Setup complete! Pages directory is ready.');
