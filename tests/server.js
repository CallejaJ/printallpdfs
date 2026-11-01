// Minimal static file server for the exported build (`out/`), used by the e2e tests and `npm start`.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'out');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml', '.txt': 'text/plain', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.pdf': 'application/pdf' };

function createServer() {
  return http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let file = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
    if (!path.extname(file) && fs.existsSync(file + '.html')) file += '.html';
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createServer().listen(port, () => console.log(`PrintAllPDFs (build) running at http://localhost:${port}`));
}

module.exports = { createServer };
