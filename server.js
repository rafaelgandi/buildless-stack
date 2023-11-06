// Run this to develop locally. //


if (typeof Bun !== 'undefined' && Bun?.file) {
    const BASE_PATH = "./public";
    const server = Bun.serve({
        port: 8000,
        fetch(req) {
            const pathname = new URL(req.url).pathname ?? '';
            const filePath = BASE_PATH + ((pathname.trim().replace('/', '') !== '') ? pathname : '/index.html');
            const file = Bun.file(filePath);
            return new Response(file);
        },
    });
    console.log(`🌈 Listening on localhost: ${server.port}`);
}
else {
    const http = require('http');
    const fs = require('fs');
    const path = require('path');
    const mime = require('mime');

    const BASE_PATH = "./public";
    const PORT = 8000;

    const server = http.createServer((req, res) => {
        const { pathname } = new URL(req.url, `http://${req.headers.host}`);
        const filePath = path.join(BASE_PATH, pathname === '/' ? 'index.html' : pathname);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not found');
            } else {
                const contentType = mime.getType(filePath) || 'text/plain';
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    });

    server.listen(PORT, () => {
        console.log(`🌈 Listening on localhost:${PORT}`);
    });
}




