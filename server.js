const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// SET YOUR PASSWORD HERE (Change this to whatever you want)
const MY_SECRET_PASSWORD = "67"; 

// 1. Password Protection Check
app.use((req, res, next) => {
    // Check if the user put the correct password in the URL (e.g., ?pwd=67)
    const userPassword = req.query.pwd;

    // Allow static files (like CSS/JS inside the proxy) to load if already authenticated
    if (req.path.startsWith('/proxy')) {
        return next();
    }

    // Verify the password
    if (userPassword === MY_SECRET_PASSWORD) {
        next(); // Password is correct, let them through
    } else {
        // If wrong or missing, show a standard 403 Forbidden error page
        res.status(403).send('<h1>403 Forbidden</h1><p>Access Denied: Invalid Security Token.</p>');
    }
});

// 2. Serve the front-end user interface if password matches
app.use(express.static(path.join(__dirname, 'public')));

// 3. Handle the proxy requests
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
