const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'public', 'images');
const categories = ['apartments', 'restaurant', 'wellness'];
const extensions = ['.jpg', '.jpeg', '.png', '.webp'];

const outputFilePath = path.join(__dirname, 'src', 'app', 'pages', 'gallery', 'gallery-images.ts');

let outputContent = `// OVO JE AUTOMATSKI GENERISAN FAJL. NE MENJATI RUČNO!
// Generisano od strane: generate-gallery.js
import { GalleryItem } from './gallery';

`;

categories.forEach(category => {
  const catPath = path.join(baseDir, category);
  let files = [];
  
  if (fs.existsSync(catPath)) {
    files = fs.readdirSync(catPath).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return extensions.includes(ext);
    });
  }

  outputContent += `export const ${category}Images: GalleryItem[] = [\n`;
  files.forEach((file, index) => {
    // Escape quotes if needed
    const safeFile = file.replace(/'/g, "\\'");
    outputContent += `  { src: '/images/${category}/${safeFile}' }${index < files.length - 1 ? ',' : ''}\n`;
  });
  outputContent += `];\n\n`;
});

fs.writeFileSync(outputFilePath, outputContent, 'utf8');
console.log('✅ gallery-images.ts has been successfully generated!');
