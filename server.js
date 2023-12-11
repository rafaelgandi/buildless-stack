// Run this to develop locally. //

// From AI
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const mime = require('mime');

const server = http.createServer(async (req, res) => {
    // Get the file path of the requested resource
    const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    try {
        // Read the file
        const data = await fs.readFile(filePath);

        // Determine the content type based on the file extension
        const contentType = mime.getType(filePath) || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);

        res.statusCode = 200;
        res.end(data);
    } catch (err) {
        // Send the index.html file for any non-existing routes
        if (err.code === 'ENOENT') {
            try {
                const data = await fs.readFile(path.join(__dirname, 'public', 'index.html'));

                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(data);
            } catch (err) {
                res.statusCode = 500;
                res.end('Internal server error');
            }
        } else {
            res.statusCode = 500;
            res.end('Internal server error');
        }
    }
});

const port = 8000;
server.listen(port, () => {
    console.log(`🌈 Server running on port ${port}`);
});