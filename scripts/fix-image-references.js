const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = './public';
const DATA_DIR = path.join(PUBLIC_DIR, 'data');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

function getActualImageFiles() {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const actualFiles = new Map();
  
  function scanDirectory(dir, basePath = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath, path.join(basePath, item));
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (imageExtensions.includes(ext) && !item.includes('.original')) {
          // Map the path without extension to the actual file with extension
          const nameWithoutExt = path.join(basePath, path.basename(item, ext));
          const webPath = '/' + path.join('images', basePath, item).replace(/\\/g, '/');
          actualFiles.set(nameWithoutExt, webPath);
        }
      }
    }
  }
  
  scanDirectory(IMAGES_DIR);
  return actualFiles;
}

function updateJsonFile(filePath, actualFiles) {
  console.log(`\nUpdating ${filePath}...`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  let jsonData = JSON.parse(content);
  let changesMade = 0;
  
  function updateImagePaths(obj) {
    if (typeof obj !== 'object' || obj === null) return;
    
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        // Handle full image paths (starting with /images/)
        if (obj[key].startsWith('/images/')) {
          const imagePath = obj[key];
          
          // Extract the path without extension
          const parsedPath = path.parse(imagePath);
          const dirPath = parsedPath.dir.replace('/images/', '');
          const nameWithoutExt = path.join(dirPath, parsedPath.name);
          
          // Check if we have the actual file
          if (actualFiles.has(nameWithoutExt)) {
            const correctPath = actualFiles.get(nameWithoutExt);
            if (correctPath !== imagePath) {
              console.log(`  ${imagePath} → ${correctPath}`);
              obj[key] = correctPath;
              changesMade++;
            }
          } else {
            console.log(`  ⚠️  Missing file: ${imagePath}`);
          }
        }
        // Handle artworkPath fields (just filename)
        else if (key === 'artworkPath' && obj[key] && obj[key] !== 'None') {
          const fileName = obj[key];
          
          // Extract the filename without extension
          const parsedFile = path.parse(fileName);
          const nameWithoutExt = path.join('releases', parsedFile.name);
          
          // Check if we have the actual file
          if (actualFiles.has(nameWithoutExt)) {
            const correctPath = actualFiles.get(nameWithoutExt);
            const correctFileName = path.basename(correctPath);
            if (correctFileName !== fileName) {
              console.log(`  artworkPath: ${fileName} → ${correctFileName}`);
              obj[key] = correctFileName;
              changesMade++;
            }
          } else {
            console.log(`  ⚠️  Missing artwork file: ${fileName}`);
          }
        }
      } else if (typeof obj[key] === 'object') {
        updateImagePaths(obj[key]);
      }
    }
  }
  
  updateImagePaths(jsonData);
  
  if (changesMade > 0) {
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    console.log(`  ✅ Updated ${changesMade} image reference(s)`);
  } else {
    console.log(`  ✅ No changes needed`);
  }
  
  return changesMade;
}

function main() {
  console.log('🔍 Scanning for actual image files...');
  const actualFiles = getActualImageFiles();
  
  console.log(`\n📁 Found ${actualFiles.size} image files:`);
  for (const [key, value] of actualFiles) {
    if (key.includes('artist') || key.includes('release')) {
      console.log(`  ${key} → ${value}`);
    }
  }
  
  console.log('\n🔧 Updating JSON files...');
  
  const jsonFiles = [
    path.join(DATA_DIR, 'en', 'artists.json'),
    path.join(DATA_DIR, 'en', 'releases.json'),
    path.join(DATA_DIR, 'en', 'shows.json'),
    path.join(DATA_DIR, 'fr', 'artists.json'),
    path.join(DATA_DIR, 'fr', 'releases.json'),
    path.join(DATA_DIR, 'fr', 'shows.json')
  ];
  
  let totalChanges = 0;
  
  for (const jsonFile of jsonFiles) {
    if (fs.existsSync(jsonFile)) {
      totalChanges += updateJsonFile(jsonFile, actualFiles);
    } else {
      console.log(`⚠️  File not found: ${jsonFile}`);
    }
  }
  
  console.log(`\n✅ Complete! Updated ${totalChanges} image references total.`);
  
  // Verify some key files exist
  console.log('\n🔍 Verifying key image files:');
  const keyImages = [
    '/images/artists/edwin-raphael.jpg',
    '/images/artists/nicholas-cangiano.jpg',
    '/images/artists/anna-justen.jpg'
  ];
  
  for (const img of keyImages) {
    const filePath = path.join(PUBLIC_DIR, img);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${img}`);
    } else {
      console.log(`  ❌ ${img} - MISSING!`);
    }
  }
}

main();