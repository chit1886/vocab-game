const express = require('express');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Upload setup
const upload = multer({ dest: 'uploads/' });

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'Vocab Backend Working!',
        time: new Date().toISOString()
    });
});

app.post('/api/upload', upload.single('vocabFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file' });
    }
    res.json({ message: 'File uploaded successfully!' });
});

app.listen(port, () => {
    console.log('Server running on port', port);
});
