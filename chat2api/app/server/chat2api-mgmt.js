#!/usr/bin/env node
/**
 * Chat2API Management UI Server
 * Serves web UI on port 8081, proxies API to main server on port 8080.
 * Zero npm dependencies - uses only Node.js built-in modules.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const MGMT_PORT = parseInt(process.env.MGMT_PORT || '8081', 10);
const API_PORT = parseInt(process.env.API_PORT || '8080', 10);
const PUBLIC_DIR = '/usr/local/apps/@appcenter/chat2api/server/public';
const API_HOST = '127.0.0.1';

const MIME_TYPES = {
  '.html': 'text/html;charset=utf-8',
  '.js':   'application/javascript;charset=utf-8',
  '.css':  'text/css;charset=utf-8',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.json': 'application/json;charset=utf-8',
  '.woff2':'font/woff2',
};

// Proxy API requests to the main server
function proxyRequest(req, res) {
  const options = {
    hostname: API_HOST,
    port: API_PORT,
    path: req.url,
    method: req.method,
    headers: Object.assign({}, req.headers),
  };
  // Remove host header to avoid conflicts
  delete options.headers.host;

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', (err) => {
    console.error('[proxy error]', err.message);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'API unavailable' }));
    }
  });
  req.pipe(proxyReq);
}

function serveStatic(req, res) {
  const url = req.url;
  let filePath = url === '/' ? '/index.html' : url.split('?')[0];
  filePath = path.join(PUBLIC_DIR, filePath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback: serve index.html for all non-file routes
      fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (err2, data2) => {
        if (err2) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        res.end(data2);
      });
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = req.url;
  // API requests -> proxy
  if (url.startsWith('/v0/') || url.startsWith('/v1/')) {
    return proxyRequest(req, res);
  }
  // Static files
  serveStatic(req, res);
});

server.listen(MGMT_PORT, '0.0.0.0', () => {
  console.log('[Mgmt UI] http://0.0.0.0:' + MGMT_PORT + ' (API -> ' + API_HOST + ':' + API_PORT + ')');
});
