const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Vocab Game Backend is running!',
        timestamp: new Date().toISOString(),
        status: 'OK',
        version: '1.0.0',
        endpoints: {
            health: 'GET /',
            upload: 'POST /api/upload'
        }
    });
});

// API endpoint to upload a vocabulary file
app.post('/api/upload', upload.single('vocabFile'), (req, res) => {
    console.log('Upload request received');
    
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    
    console.log(`Processing file: ${fileName}`);

    // Read the uploaded file content
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Error processing file.' });
        }

        // Parse the file content into a vocabulary list
        const vocabulary = parseFile(data, fileName);

        // Clean up the uploaded file after processing
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Error deleting temp file:', unlinkErr);
            }
        });

        if (vocabulary.length === 0) {
            return res.status(400).json({ error: 'No valid vocabulary found in the file.' });
        }

        console.log(`Parsed ${vocabulary.length} vocabulary items`);

        // Send the parsed vocabulary back to the client
        res.json({ 
            success: true,
            count: vocabulary.length,
            vocabulary 
        });
    });
});

// API endpoint to get server info
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Vocab Game Backend',
        version: '1.0.0',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        env: process.env.NODE_ENV || 'development'
    });
});

/**
 * Parses the content of a CSV or TXT file to extract vocabulary words.
 * @param {string} content - The content of the file.
 * @param {string} fileName - The name of the file.
 * @returns {Array<Object>} An array of vocabulary objects.
 */
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message 
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        availableRoutes: ['GET /', 'POST /api/upload', 'GET /api/info']
    });
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📝 Health check: http://localhost:${port}/`);
    console.log(`📤 Upload API: http://localhost:${port}/api/upload`);
});
