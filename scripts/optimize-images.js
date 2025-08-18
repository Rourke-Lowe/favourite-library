const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/images';
const supportedExtensions = ['.jpg', '.jpeg', '.png'];

async function optimizeImage(inputPath, outputPath) {
  try {
    const stats = fs.statSync(inputPath);
    const fileSizeMB = stats.size / (1024 * 1024);
    
    console.log(`Processing: ${inputPath} (${fileSizeMB.toFixed(2)}MB)`);
    
    // Get image info
    const metadata = await sharp(inputPath).metadata();
    
    let pipeline = sharp(inputPath);
    
    // Resize if too large
    if (metadata.width > 1920) {
      pipeline = pipeline.resize(1920, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    // Determine output format and quality based on input
    const ext = path.extname(inputPath).toLowerCase();
    const tempPath = outputPath + '.tmp';
    
    if (ext === '.png') {
      // For PNGs, try JPEG first (better compression), fallback to optimized PNG
      const jpegPath = outputPath.replace(/\.png$/i, '.jpg');
      
      try {
        await pipeline
          .jpeg({ 
            quality: 85, 
            progressive: true,
            mozjpeg: true 
          })
          .toFile(jpegPath + '.tmp');
        
        // Check if JPEG is significantly smaller
        const jpegStats = fs.statSync(jpegPath + '.tmp');
        const jpegSizeMB = jpegStats.size / (1024 * 1024);
        
        if (jpegSizeMB < fileSizeMB * 0.7) { // If JPEG is 30% smaller, use it
          fs.renameSync(jpegPath + '.tmp', jpegPath);
          fs.unlinkSync(inputPath); // Remove original PNG
          console.log(`  → Converted to JPEG: ${jpegSizeMB.toFixed(2)}MB (${((1 - jpegSizeMB/fileSizeMB) * 100).toFixed(1)}% reduction)`);
          return jpegPath;
        } else {
          // Remove JPEG temp and use optimized PNG
          fs.unlinkSync(jpegPath + '.tmp');
          await pipeline
            .png({ 
              quality: 85, 
              compressionLevel: 9,
              progressive: true 
            })
            .toFile(tempPath);
        }
      } catch (error) {
        // Fallback to optimized PNG
        await pipeline
          .png({ 
            quality: 85, 
            compressionLevel: 9,
            progressive: true 
          })
          .toFile(tempPath);
      }
    } else {
      // For JPEG, optimize to temp file first
      await pipeline
        .jpeg({ 
          quality: 85, 
          progressive: true,
          mozjpeg: true 
        })
        .toFile(tempPath);
    }
    
    // Replace original with optimized version
    if (fs.existsSync(tempPath)) {
      fs.renameSync(tempPath, outputPath);
      
      const outputStats = fs.statSync(outputPath);
      const outputSizeMB = outputStats.size / (1024 * 1024);
      
      console.log(`  → Optimized: ${outputSizeMB.toFixed(2)}MB (${((1 - outputSizeMB/fileSizeMB) * 100).toFixed(1)}% reduction)`);
    }
    
    return outputPath;
    
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message);
    return null;
  }
}

async function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      
      if (supportedExtensions.includes(ext)) {
        // Create backup with .original extension if it doesn't exist
        const backupPath = fullPath + '.original';
        if (!fs.existsSync(backupPath)) {
          fs.copyFileSync(fullPath, backupPath);
        }
        
        // Optimize the image
        await optimizeImage(fullPath, fullPath);
      }
    }
  }
}

async function main() {
  console.log('Starting image optimization...');
  console.log('Creating backups with .original extension...');
  
  if (!fs.existsSync(inputDir)) {
    console.error(`Input directory ${inputDir} does not exist`);
    process.exit(1);
  }
  
  await processDirectory(inputDir);
  
  console.log('\nOptimization complete!');
  console.log('Original files backed up with .original extension');
}

main().catch(console.error);