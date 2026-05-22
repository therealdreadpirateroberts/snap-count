const https = require('https');
const fs = require('fs');
const path = require('path');

const fileId = '1elHYFRmtQiI8ERWGRq6hlgyKr5k6umrU';
const url = `https://docs.google.com/uc?export=download&id=${fileId}`;
const assetsDir = path.join(__dirname, '..', 'assets');
const dest = path.join(assetsDir, 'coach_ref.m4a');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

function download(downloadUrl, destPath) {
  https.get(downloadUrl, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log('Redirecting to:', res.headers.location);
      download(res.headers.location, destPath);
      return;
    }
    
    if (res.statusCode !== 200) {
      console.error(`❌ HTTP Error: ${res.statusCode} ${res.statusMessage}`);
      return;
    }

    const file = fs.createWriteStream(destPath);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('✅ File downloaded successfully! Path:', destPath);
      console.log('File size:', fs.statSync(destPath).size, 'bytes');
    });
  }).on('error', (err) => {
    console.error('❌ Network Error:', err.message);
  });
}

console.log('Starting Google Drive download for file ID:', fileId);
download(url, dest);
