const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('./')); // เปลี่ยนจาก __dirname เป็น './'

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Upload setup
const upload = multer({ dest: 'uploads/' });

// Routes - ส่ง HTML แทน JSON
app.get('/', (req, res) => {
    const html = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vocabulary Game</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; }
        .container { background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); max-width: 600px; width: 90%; text-align: center; }
        h1 { color: #333; margin-bottom: 1.5rem; }
        .upload-area { border: 3px dashed #667eea; border-radius: 10px; padding: 2rem; margin: 1.5rem 0; background: #f8f9ff; cursor: pointer; }
        input[type="file"] { display: none; }
        .btn { background: #667eea; color: white; border: none; padding: 12px 30px; border-radius: 25px; cursor: pointer; margin: 10px; }
        .game-area { display: none; }
        .word-card { background: #f8f9ff; border: 1px solid #e0e6ff; border-radius: 10px; padding: 1.5rem; margin: 1rem 0; }
        .word { font-size: 1.8rem; font-weight: bold; }
        .phonetic { font-size: 1.2rem; color: #666; font-style: italic; }
        .meaning { font-size: 1.1rem; color: #555; display: none; }
        .status { padding: 1rem; border-radius: 5px; margin: 1rem 0; }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Vocabulary Game</h1>
        
        <div id="uploadSection">
            <div class="upload-area" onclick="document.getElementById('fileInput').click()">
                <h3>📁 อัปโหลดไฟล์คำศัพท์</h3>
                <p>คลิกที่นี่เพื่อเลือกไฟล์</p>
                <p><small>รองรับไฟล์ .csv และ .txt</small></p>
                <input type="file" id="fileInput" accept=".csv,.txt" onchange="handleFile(this.files[0])">
            </div>
            <div id="status"></div>
        </div>

        <div id="gameSection" class="game-area">
            <div>คะแนน: <span id="score">0</span> / <span id="total">0</span></div>
            
            <div class="word-card">
                <div class="word" id="currentWord">word</div>
                <div class="phonetic" id="currentPhonetic">/phonetic/</div>
                <div class="meaning" id="currentMeaning">meaning</div>
            </div>

            <div>
                <button class="btn" onclick="showMeaning()">💡 ดูความหมาย</button>
                <button class="btn" onclick="nextWord(true)">✅ รู้</button>
                <button class="btn" onclick="nextWord(false)">❌ ไม่รู้</button>
                <button class="btn" onclick="resetGame()">🔄 เริ่มใหม่</button>
            </div>
        </div>
    </div>

    <script>
        let vocabulary = [];
        let currentIndex = 0;
        let score = 0;

        function showStatus(message, type) {
            document.getElementById('status').innerHTML = '<div class="' + type + '">' + message + '</div>';
        }

        async function handleFile(file) {
            if (!file) return;
            
            const formData = new FormData();
            formData.append('vocabFile', file);
            
            showStatus('🔄 กำลังประมวลผลไฟล์...', 'success');

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                
                if (response.ok && result.success) {
                    vocabulary = result.vocabulary;
                    showStatus('✅ โหลดคำศัพท์สำเร็จ ' + result.count + ' คำ', 'success');
                    startGame();
                } else {
                    showStatus('❌ ' + (result.error || 'เกิดข้อผิดพลาด'), 'error');
                }
            } catch (error) {
                showStatus('❌ ไม่สามารถเชื่อมต่อได้', 'error');
            }
        }

        function startGame() {
            currentIndex = 0;
            score = 0;
            document.getElementById('uploadSection').style.display = 'none';
            document.getElementById('gameSection').style.display = 'block';
            showCurrentWord();
        }

        function showCurrentWord() {
            if (currentIndex >= vocabulary.length) {
                alert('เกมจบแล้ว! คะแนน: ' + score + '/' + vocabulary.length);
                resetGame();
                return;
            }

            const word = vocabulary[currentIndex];
            document.getElementById('currentWord').textContent = word.word;
            document.getElementById('currentPhonetic').textContent = word.phonetic;
            document.getElementById('currentMeaning').textContent = word.meaning;
            document.getElementById('currentMeaning').style.display = 'none';
            
            document.getElementById('score').textContent = score;
            document.getElementById('total').textContent = vocabulary.length;
        }

        function showMeaning() {
            document.getElementById('currentMeaning').style.display = 'block';
        }

        function nextWord(correct) {
            if (correct) score++;
            currentIndex++;
            showCurrentWord();
        }

        function resetGame() {
            document.getElementById('uploadSection').style.display = 'block';
            document.getElementById('gameSection').style.display = 'none';
            vocabulary = [];
        }
    </script>
</body>
</html>`;
    res.send(html);
});

// API endpoint
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
    const lines = content.split('\\n').filter(line => line.trim());
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
