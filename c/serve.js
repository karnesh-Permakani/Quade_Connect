const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const BASE_DIR = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS & No-Cache Headers for smooth live testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlPath = req.url.split('?')[0];

  // Prevent favicon 404 noise
  if (urlPath === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  let relPath = urlPath === '/' ? 'QuadeConnect_Full_Project_View_Demo.html' : decodeURIComponent(urlPath.replace(/^\//, ''));
  let filePath = path.join(BASE_DIR, relPath);

  // Security check: ensure path stays within BASE_DIR
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If directory, check for index.html or fallback to full demo
      if (stats && stats.isDirectory()) {
        const idxPath = path.join(filePath, 'index.html');
        if (fs.existsSync(idxPath)) {
          filePath = idxPath;
        } else {
          filePath = path.join(BASE_DIR, 'QuadeConnect_Full_Project_View_Demo.html');
        }
      } else {
        filePath = path.join(BASE_DIR, 'QuadeConnect_Full_Project_View_Demo.html');
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(PORT, HOST, () => {
  console.log(`=======================================================`);
  console.log(` QuadeConnect Architectural Millwork Full Project ERP  `);
  console.log(` Running at: http://localhost:${PORT}/                 `);
  console.log(` Serving: ${BASE_DIR}                                  `);
  console.log(`=======================================================`);
});

