const https = require('https');
const fs = require('fs');
const path = require('path');

const files = [
  { id: '1wGlcPMu-QdrqmuRcgaUzgB7QokQhefk1', name: 'inspiration_1.png' },
  { id: '1Q9B64HrcojJsUmdsh0pNeeAKJhG4Sl_F', name: 'inspiration_2.png' },
  { id: '12FF1pFDZmZIiJQNaRZT9qNjtv4zms1jF', name: 'inspiration_3.png' }
];

const assetsDir = path.join(__dirname, '..', 'assets', 'images');

// Ensure assets/images directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

function downloadDriveFile(id, filename) {
  const destPath = path.join(assetsDir, filename);
  const url = `https://docs.google.com/uc?export=download&id=${id}`;
  
  function request(targetUrl) {
    https.get(targetUrl, (res) => {
      // Handle redirect
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        request(res.headers.location);
        return;
      }
      
      const contentType = res.headers['content-type'] || '';
      if (contentType.includes('text/html')) {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          const match = body.match(/href="([^"]+confirm=[^"]+)"/) || body.match(/confirm=([a-zA-Z0-9_\-]+)/);
          if (match) {
            let confirmUrl = '';
            if (match[1]) {
              confirmUrl = match[1].replace(/&amp;/g, '&');
              if (!confirmUrl.startsWith('http')) {
                confirmUrl = 'https://docs.google.com' + confirmUrl;
              }
            } else if (match[0]) {
              const confirmToken = match[1] || match[0].split('=')[1];
              confirmUrl = `https://docs.google.com/uc?export=download&confirm=${confirmToken}&id=${id}`;
            }
            
            if (confirmUrl) {
              request(confirmUrl);
              return;
            }
          }
          console.error(`❌ Failed to download ${filename}: Received HTML page but could not find confirmation token.`);
        });
        return;
      }

      if (res.statusCode !== 200) {
        console.error(`❌ HTTP Error for ${filename}: ${res.statusCode} ${res.statusMessage}`);
        return;
      }

      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ ${filename} downloaded successfully!`);
      });
    }).on('error', (err) => {
      console.error(`❌ Network Error for ${filename}:`, err.message);
    });
  }

  console.log(`Starting download for ${filename} (ID: ${id})...`);
  request(url);
}

files.forEach(f => downloadDriveFile(f.id, f.name));
