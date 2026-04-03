const fs = require('fs');
const path = require('path');

// Files to delete
const filesToDelete = [
  path.join(__dirname, 'src/app/routes.ts'),
  path.join(__dirname, 'src/app/App.tsx'),
  path.join(__dirname, 'src/app/pages/CartPage.tsx'),
  path.join(__dirname, 'src/app/pages/ProductDetailPage.tsx'),
  path.join(__dirname, 'src/app/pages/ProductsPage.tsx'),
  path.join(__dirname, 'src/app/pages/CheckoutPage.tsx'),
  path.join(__dirname, 'src/app/pages/OrderConfirmationPage.tsx'),
  path.join(__dirname, 'src/app/pages/NotFoundPage.tsx'),
  path.join(__dirname, 'src/app/pages/AboutPage.tsx'),
  path.join(__dirname, 'src/app/pages/ContactPage.tsx'),
];

filesToDelete.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`✓ Deleted: ${path.basename(file)}`);
    }
  } catch (err) {
    console.error(`✗ Error deleting ${file}:`, err.message);
  }
});

console.log('\nCleanup complete!');
