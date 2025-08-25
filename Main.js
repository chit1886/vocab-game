// main.js
// Import necessary modules
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file uploads
// We'll store uploaded files in a directory named 'uploads'
const upload = multer({ dest: 'uploads/' });

// Serve static files from the 'public' directory
// We'll place your index.html inside a 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

/**
 * API endpoint to upload a vocabulary file.
 * It accepts a single file with the field name 'vocabFile'.
 */
app.post('/api/upload', upload.single('vocabFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

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

        // Send the parsed vocabulary back to the client
        res.json({ vocabulary });
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
            words.push({ id: Date.now() + index, word, phonetic, meaning });
        }
    });

    return words;
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});