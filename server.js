const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the classroom-style front end without requiring a URL password.
// The 67 code is a playful client-side reveal, not a security boundary.
app.use(express.static(path.join(__dirname, 'public')));

// Do not expose an unrestricted URL proxy. It can be abused to access internal
// services or bypass network controls, so return a clear message instead.
app.use('/proxy', (req, res) => {
    res.status(403).send('Proxy access is disabled. Use tools approved by your network administrator.');
});

app.listen(PORT, () => {
    console.log(`Study Hall is running on port ${PORT}`);
});
