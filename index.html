const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // เพิ่มบรรทัดนี้

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Upload setup
const upload = multer({ dest: 'uploads/' });

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // เพิ่มบรรทัดนี้
});

app.post('/api/upload', upload.single('vocabFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error processing file' });
        }

        const vocabulary = parseFile(data, fileName);
        
        fs.unlink(filePath, () => {});

        if (vocabulary.length === 0) {
            return res.status(400).json({ error: 'No valid vocabulary found' });
        }

        res.json({ success: true, count: vocabulary.length, vocabulary });
    });
});

function parseFile(content, fileName) {
    const lines = content.split('\n').filter(line => line.trim());
    const words = [];

    lines.forEach((line, index) => {
        let word = '', phonetic = '', meaning = '';

        if (fileName.endsWith('.csv')) {
            const parts = line.split(',');
            if (parts.length >= 3) {
                word = parts[0].trim().replace(/"/g, '');
                phonetic = parts[1].trim().replace(/"/g, '');
                meaning = parts.slice(2).join(',').trim().replace(/"/g, '');
            }
        } else {
            const parts = line.split(' - ');
            if (parts.length >= 3) {
                word = parts[0].trim();
                phonetic = parts[1].trim();
                meaning = parts.slice(2).join(' - ').trim();
            }
        }

        if (word && phonetic && meaning) {
            words.push({ id: Date.now() + index, word, phonetic, meaning });
        }
    });

    return words;
}

app.listen(port, () => {
    console.log('Server running on port', port);
});
