const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for frontend access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Vocab Game Backend is running!',
        status: 'OK',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: 'GET /',
            upload: 'POST /api/upload',
            test: 'GET /test'
        }
    });
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Test route works!' });
});

// Upload vocabulary file endpoint
app.post('/api/upload', upload.single('vocabFile'), (req, res) => {
    console.log('Upload request received');
    
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    
    console.log(`Processing file: ${fileName}`);

    // Read the uploaded file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Error processing file.' });
        }

        // Parse the vocabulary
        const vocabulary = parseFile(data, fileName);

        // Clean up temp file
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Error deleting temp file:', unlinkErr);
            }
        });

        if (vocabulary.length === 0) {
            return res.status(400).json({ error: 'No valid vocabulary found in the file.' });
        }

        console.log(`Parsed ${vocabulary.length} vocabulary items`);

        res.json({ 
            success: true,
            count: vocabulary.length,
            vocabulary 
        });
    });
});

// Parse vocabulary file content
function parseFile(content, fileName) {
    const lines = content.split('\n').filter(line => line.trim());
    const words = [];

    lines.forEach((line, index) => {
        let word = '';
        let phonetic = '';
        let meaning = '';

        if (fileName.endsWith('.csv')) {
            // CSV format: word,phonetic,meaning
            const parts = line.split(',');
            if (parts.length >= 3) {
                word = parts[0].trim().replace(/"/g, '');
                phonetic = parts[1].trim().replace(/"/g, '');
                meaning = parts.slice(2).join(',').trim().replace(/"/g, '');
            }
        } else {
            // TXT format: word - phonetic - meaning
            const parts = line.split(' - ');
            if (parts.length >= 3) {
                word = parts[0].trim();
                phonetic = parts[1].trim();
                meaning = parts.slice(2).join(' - ').trim();
            }
        }

        if (word && phonetic && meaning) {
            words.push({ 
                id: Date.now() + index, 
                word, 
                phonetic, 
                meaning 
            });
        }
    });

    return words;
}

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message 
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📝 Health check: http://localhost:${port}/`);
    console.log(`📤 Upload API: http://localhost:${port}/api/upload`);
});
