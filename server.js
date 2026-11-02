const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/proxy', (req, res, next) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Error: Missing target URL parameter.');
    }

    createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        followRedirects: true,
        pathRewrite: {
            '^/proxy': '', 
        },
        onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        },
        onError: (err, req, res) => {
            res.status(500).send('Proxy Error: Could not reach the requested website.');
        }
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
