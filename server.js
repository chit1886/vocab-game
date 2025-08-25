<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>เกมคำศัพท์สุ่ม</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
        }
    </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
    <div class="text-center py-8">
        <h1 class="text-4xl font-bold text-red-800 mb-2">เกมคำศัพท์สุ่ม</h1>
        <p class="text-gray-600">อัปโหลดคำศัพท์ของคุณและเริ่มเรียนรู้!</p>
    </div>

    <div class="max-w-4xl mx-auto px-4">
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div class="border-2 border-dashed border-gray-300 hover:border-red-400 rounded-lg p-8 text-center transition-colors duration-200">
                <div class="text-6xl mb-4">📁</div>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">อัปโหลดไฟล์คำศัพท์</h3>
                <p class="text-sm text-gray-500 mb-4">
                    รองรับไฟล์ .csv และ .txt<br>
                    <strong>CSV:</strong> คำศัพท์,การออกเสียง,ความหมาย<br>
                    <strong>TXT:</strong> คำศัพท์ - การออกเสียง - ความหมาย
                </p>
                <input type="file" accept=".csv,.txt" id="fileInput" class="hidden">
                <label for="fileInput" class="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors">
                    เลือกไฟล์
                </label>
            </div>
            
            <div id="fileStatus" class="mt-4 text-center text-gray-600">
                ยังไม่ได้อัปโหลดไฟล์
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-8 text-center mb-6">
            <h2 class="text-2xl font-bold text-red-800 mb-6">เกมคำศัพท์</h2>
            
            <div class="mb-6">
                <button id="startBtn" class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold">
                    เริ่มเกม
                </button>
            </div>

            <div id="gameContent">
                <div id="noVocab" class="text-gray-500 py-8">
                    <p class="text-xl">กรุณาอัปโหลดไฟล์คำศัพท์ก่อนเริ่มเกม</p>
                </div>

                <div id="gamePlay" class="hidden">
                    <div id="wordDisplay" class="bg-gradient-to-r from-red-600 to-rose-600 text-white p-8 rounded-2xl cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-200 mb-6">
                        <div id="word" class="text-4xl font-bold mb-2">Hello</div>
                        <div id="phonetic" class="text-xl font-mono mb-4 opacity-90">[hələʊ]</div>
                        <div class="text-lg opacity-80">คลิกเพื่อดูความหมาย</div>
                    </div>

                    <div id="meaningDisplay" class="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6 hidden">
                        <div id="meaning" class="text-2xl font-semibold text-red-800">สวัสดี</div>
                    </div>

                    <div class="space-x-4 mb-4">
                        <button id="nextBtn" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            คำถัดไป
                        </button>
                        <button id="showMeaningBtn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            แสดงความหมาย
                        </button>
                        <button id="resetBtn" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                            เริ่มใหม่
                        </button>
                    </div>

                    <div id="wordStatus"></div>
                </div>
            </div>
        </div>

        <div id="wordList" class="bg-white rounded-xl shadow-lg p-6 mb-6 hidden">
            <h3 class="text-lg font-semibold text-red-800 mb-4">รายการคำศัพท์</h3>
            <div id="wordListContent" class="space-y-2 max-h-60 overflow-y-auto">
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 text-center text-gray-600 mb-6">
            <h3 class="text-lg font-semibold mb-3">วิธีการใช้งาน</h3>
            <ol class="text-left space-y-2 max-w-md mx-auto">
                <li>1. อัปโหลดไฟล์คำศัพท์ (.csv หรือ .txt)</li>
                <li>2. กดปุ่ม "เริ่มเกม" เพื่อสุ่มคำศัพท์</li>
                <li>3. ดูการออกเสียง (Phonetic) ของคำศัพท์</li>
                <li>4. คลิกที่คำศัพท์เพื่อดูความหมาย</li>
                <li>5. กดปุ่ม "คำถัดไป" เพื่อทบทวนคำต่อไป</li>
                <li>6. คำที่ทบทวนแล้วจะไม่ซ้ำจนกว่าจะครบรอบ</li>
            </ol>
        </div>

        <div class="text-center mb-8">
            <div class="bg-white rounded-lg shadow-md p-4 inline-block">
                <div class="text-sm text-gray-600">
                    <p class="font-semibold text-red-800">พัฒนาโดย</p>
                    <p class="text-red-700 font-medium">ดร.ชูชิต ชายทวีป</p>
                    <p class="text-gray-600">คณะรัฐศาสตร์ มหาวิทยาลัยกรุงเทพธนบุรี</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        var vocabulary = [];
        var usedWords = [];
        var availableWords = [];
        var currentWordIndex = 0;
        var meaningVisible = false;

        var sampleVocab = [
            { word: "Hello", phonetic: "hələʊ", meaning: "สวัสดี" },
            { word: "Goodbye", phonetic: "ɡʊdbaɪ", meaning: "ลาก่อน" },
            { word: "Thank you", phonetic: "θæŋk juː", meaning: "ขอบคุณ" },
            { word: "Please", phonetic: "pliːz", meaning: "กรุณา" },
            { word: "Sorry", phonetic: "sɒri", meaning: "ขอโทษ" },
            { word: "Yes", phonetic: "jes", meaning: "ใช่" },
            { word: "No", phonetic: "nəʊ", meaning: "ไม่" }
        ];

        var fileInput = document.getElementById('fileInput');
        var fileStatus = document.getElementById('fileStatus');
        var startBtn = document.getElementById('startBtn');
        var noVocab = document.getElementById('noVocab');
        var gamePlay = document.getElementById('gamePlay');
        var wordDisplay = document.getElementById('wordDisplay');
        var word = document.getElementById('word');
        var phonetic = document.getElementById('phonetic');
        var meaningDisplay = document.getElementById('meaningDisplay');
        var meaning = document.getElementById('meaning');
        var nextBtn = document.getElementById('nextBtn');
        var showMeaningBtn = document.getElementById('showMeaningBtn');
        var resetBtn = document.getElementById('resetBtn');
        var wordList = document.getElementById('wordList');
        var wordListContent = document.getElementById('wordListContent');

        fileInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        var content = e.target.result;
                        vocabulary = parseFile(content, file.name);
                        if (vocabulary.length > 0) {
                            resetWordPool();
                            fileStatus.textContent = 'โหลดคำศัพท์สำเร็จ: ' + vocabulary.length + ' คำ';
                            fileStatus.className = 'mt-4 text-center text-green-600';
                            showWordList();
                        } else {
                            fileStatus.textContent = 'ไม่พบคำศัพท์ในไฟล์';
                            fileStatus.className = 'mt-4 text-center text-red-600';
                        }
                    } catch (error) {
                        fileStatus.textContent = 'เกิดข้อผิดพลาดในการอ่านไฟล์';
                        fileStatus.className = 'mt-4 text-center text-red-600';
                    }
                };
                reader.readAsText(file, 'UTF-8');
            }
        });

        function parseFile(content, fileName) {
            var lines = content.split('\n').filter(function(line) {
                return line.trim();
            });
            var words = [];

            lines.forEach(function(line, index) {
                var wordText = '';
                var phoneticText = '';
                var meaningText = '';

                if (fileName.endsWith('.csv')) {
                    var parts = line.split(',');
                    if (parts.length >= 3) {
                        wordText = parts[0].trim().replace(/"/g, '');
                        phoneticText = parts[1].trim().replace(/"/g, '');
                        meaningText = parts.slice(2).join(',').trim().replace(/"/g, '');
                    }
                } else {
                    var parts = line.split(' - ');
                    if (parts.length >= 3) {
                        wordText = parts[0].trim();
                        phoneticText = parts[1].trim();
                        meaningText = parts.slice(2).join(' - ').trim();
                    }
                }

                if (wordText && phoneticText && meaningText) {
                    words.push({ 
                        word: wordText, 
                        phonetic: phoneticText, 
                        meaning: meaningText 
                    });
                }
            });

            return words;
        }

        startBtn.addEventListener('click', function() {
            if (vocabulary.length === 0) {
                vocabulary = sampleVocab.slice();
                fileStatus.textContent = 'ใช้ข้อมูลตัวอย่างสำหรับทดสอบ';
                fileStatus.className = 'mt-4 text-center text-blue-600';
                showWordList();
            }
            
            resetWordPool();
            noVocab.classList.add('hidden');
            gamePlay.classList.remove('hidden');
            showRandomWord();
        });

        function showRandomWord() {
            if (availableWords.length === 0) {
                if (usedWords.length > 0) {
                    alert('คุณได้ทบทวนคำศัพท์ครบทุกคำแล้ว! เริ่มรอบใหม่');
                    resetWordPool();
                } else {
                    alert('ไม่มีคำศัพท์ให้แสดง');
                    return;
                }
            }
            
            var randomIndex = Math.floor(Math.random() * availableWords.length);
            var currentWord = availableWords[randomIndex];
            
            word.textContent = currentWord.word;
            phonetic.textContent = '[' + currentWord.phonetic + ']';
            meaning.textContent = currentWord.meaning;
            
            usedWords.push(currentWord);
            availableWords.splice(randomIndex, 1);
            
            updateWordStatus();
            meaningDisplay.classList.add('hidden');
            meaningVisible = false;
            showMeaningBtn.textContent = 'แสดงความหมาย';
        }

        function resetWordPool() {
            availableWords = vocabulary.slice();
            usedWords = [];
            updateWordStatus();
        }

        function updateWordStatus() {
            var statusDiv = document.getElementById('wordStatus');
            var total = vocabulary.length;
            var used = usedWords.length;
            var remaining = availableWords.length;
            
            var statusText = 'สถานะ: ทบทวนแล้ว ' + used + ' คำ | เหลืออีก ' + remaining + ' คำ | รวม ' + total + ' คำ';
            if (remaining === 0 && total > 0) {
                statusText += ' (ทบทวนครบแล้ว!)';
            }
            
            statusDiv.innerHTML = '<div class="text-sm text-gray-600 mt-4 p-3 bg-gray-100 rounded-lg">' + statusText + '</div>';
        }

        wordDisplay.addEventListener('click', function() {
            toggleMeaning();
        });

        showMeaningBtn.addEventListener('click', function() {
            toggleMeaning();
        });

        function toggleMeaning() {
            if (meaningVisible) {
                meaningDisplay.classList.add('hidden');
                showMeaningBtn.textContent = 'แสดงความหมาย';
            } else {
                meaningDisplay.classList.remove('hidden');
                showMeaningBtn.textContent = 'ซ่อนความหมาย';
            }
            meaningVisible = !meaningVisible;
        }

        nextBtn.addEventListener('click', function() {
            showRandomWord();
        });

        resetBtn.addEventListener('click', function() {
            if (confirm('ต้องการเริ่มทบทวนคำศัพท์ใหม่ทั้งหมดหรือไม่?')) {
                resetWordPool();
                showRandomWord();
            }
        });

        function showWordList() {
            if (vocabulary.length > 0) {
                wordList.classList.remove('hidden');
                wordListContent.innerHTML = '';
                
                vocabulary.forEach(function(item, index) {
                    var div = document.createElement('div');
                    div.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg';
                    div.innerHTML = '<div><span class="font-medium text-gray-800">' + item.word + '</span><span class="text-red-600 ml-2 text-sm font-mono">[' + item.phonetic + ']</span><span class="text-gray-500 ml-3">- ' + item.meaning + '</span></div>';
                    wordListContent.appendChild(div);
                });
            }
        }

        window.addEventListener('load', function() {
            vocabulary = sampleVocab.slice();
            resetWordPool();
            showWordList();
            fileStatus.textContent = 'แสดงข้อมูลตัวอย่าง - คุณสามารถอัปโหลดไฟล์ของคุณเองได้';
            fileStatus.className = 'mt-4 text-center text-blue-600';
        });
    </script>
</body>
</html>
