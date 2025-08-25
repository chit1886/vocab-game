const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());

// Root route - MUST be defined
app.get('/', (req, res) => {
    res.json({ 
        message: 'Vocab Game Backend is running!',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Test route works!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
