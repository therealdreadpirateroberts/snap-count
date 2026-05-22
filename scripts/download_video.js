const https = require('https');
const fs = require('fs');
const path = require('path');

const fileId = '1fwKuu7DL0akKg9T2i2MXvDOjnhyZBW3u';
const assetsDir = path.join(__dirname, '..', 'assets');
const dest = path.join(assetsDir, 'video.mp4');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

function downloadDriveFile(id, destPath) {
  const url = `https://docs.google.com/uc?export=download&id=${id}`;
  
  function request(targetUrl) {
    https.get(targetUrl, (res) => {
      // Handle redirect
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log('Redirecting to:', res.headers.location);
        request(res.headers.location);
        return;
      }
      
      // If we got HTML, it might be the virus scan warning page
      const contentType = res.headers['content-type'] || '';
      if (contentType.includes('text/html')) {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          // Look for confirmation token
          const match = body.match(/href="([^"]+confirm=[^"]+)"/) || body.match(/confirm=([a-zA-Z0-9_\-]+)/);
          if (match) {
            let confirmUrl = '';
            if (match[1]) {
              // It's a full URL or relative link
              confirmUrl = match[1].replace(/&amp;/g, '&');
              if (!confirmUrl.startsWith('http')) {
                confirmUrl = 'https://docs.google.com' + confirmUrl;
              }
            } else if (match[0]) {
              const confirmToken = match[1] || match[0].split('=')[1];
              confirmUrl = `https://docs.google.com/uc?export=download&confirm=${confirmToken}&id=${id}`;
            }
            
            if (confirmUrl) {
              console.log('Detected virus scan warning page. Resending request with confirmation...');
              request(confirmUrl);
              return;
            }
          }
          console.error('❌ Failed to download: Received HTML page but could not find confirmation token.');
          console.log('HTML Snippet:', body.slice(0, 1000));
        });
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

  console.log('Starting Google Drive download for file ID:', id);
  request(url);
}

downloadDriveFile(fileId, dest);
