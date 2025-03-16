const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 20;
const INITIAL_SCORE = 20;

let secretCode = [];
let currentAttempt = [];
let attempts = [];
let currentRow = 0;
let score = INITIAL_SCORE;
let gameOver = false;
let backgroundMusic;

// Start background music
try {
    backgroundMusic = new Audio('/background-music.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    // Start music on first user interaction
    document.addEventListener('click', () => {
        backgroundMusic.play().catch(() => {
            console.log('Failed to play background music');
        });
    }, { once: true });
} catch (error) {
    console.log('Background music not supported');
}

function generateSecretCode() {
    const code = [];
    for (let i = 0; i < CODE_LENGTH; i++) {
        code.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }
    return code;
}

function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        
        // Create holes for colors
        for (let j = 0; j < CODE_LENGTH; j++) {
            const hole = document.createElement('div');
            hole.className = 'hole';
            hole.dataset.row = i;
            hole.dataset.position = j;
            hole.addEventListener('click', () => {
                if (i === currentRow && !gameOver) {
                    const selectedColor = document.querySelector('.color.selected');
                    if (selectedColor) {
                        hole.style.backgroundColor = selectedColor.dataset.color;
                        currentAttempt[j] = selectedColor.dataset.color;
                    }
                }
            });
            row.appendChild(hole);
        }
        
        // Create feedback pegs
        const feedback = document.createElement('div');
        feedback.className = 'feedback';
        for (let j = 0; j < CODE_LENGTH; j++) {
            const peg = document.createElement('div');
            peg.className = 'feedback-peg';
            feedback.appendChild(peg);
        }
        row.appendChild(feedback);
        
        gameBoard.appendChild(row);
    }
}

function setupColorPicker() {
    const picker = document.getElementById('colors-picker');
    COLORS.forEach(color => {
        const colorElement = picker.querySelector(`[data-color="${color}"]`);
        colorElement.style.backgroundColor = color;
        colorElement.addEventListener('click', () => {
            document.querySelectorAll('.color').forEach(c => c.classList.remove('selected'));
            colorElement.classList.add('selected');
        });
    });
}

function checkAttempt() {
    if (currentAttempt.length !== CODE_LENGTH || currentAttempt.includes(undefined)) {
        alert('Veuillez remplir toutes les positions!');
        return;
    }

    const feedback = getFeedback(currentAttempt, secretCode);
    displayFeedback(feedback, currentRow);
    
    attempts.push([...currentAttempt]);
    currentAttempt = [];
    currentRow++;
    
    // Update score and check game end conditions
    if (feedback.exact === CODE_LENGTH) {
        endGame(true);
    } else {
        score = Math.max(0, score - 1);
        document.getElementById('current-score').textContent = score;
        
        if (currentRow >= MAX_ATTEMPTS) {
            endGame(false);
        }
    }
    
    updateAttemptsLeft();
}

function getFeedback(attempt, code) {
    let exact = 0;
    let partial = 0;
    const usedAttempt = new Array(CODE_LENGTH).fill(false);
    const usedCode = new Array(CODE_LENGTH).fill(false);
    
    // Check exact matches
    for (let i = 0; i < CODE_LENGTH; i++) {
        if (attempt[i] === code[i]) {
            exact++;
            usedAttempt[i] = true;
            usedCode[i] = true;
        }
    }
    
    // Check partial matches
    for (let i = 0; i < CODE_LENGTH; i++) {
        if (!usedAttempt[i]) {
            for (let j = 0; j < CODE_LENGTH; j++) {
                if (!usedCode[j] && attempt[i] === code[j]) {
                    partial++;
                    usedCode[j] = true;
                    break;
                }
            }
        }
    }
    
    return { exact, partial };
}

function displayFeedback(feedback, row) {
    const feedbackPegs = document.querySelectorAll(`.row:nth-child(${row + 1}) .feedback-peg`);
    let pegIndex = 0;
    
    // Green pegs for exact matches
    for (let i = 0; i < feedback.exact; i++) {
        feedbackPegs[pegIndex].style.backgroundColor = '#2ecc71';
        pegIndex++;
    }
    
    // Orange pegs for partial matches
    for (let i = 0; i < feedback.partial; i++) {
        feedbackPegs[pegIndex].style.backgroundColor = '#e67e22';
        pegIndex++;
    }
}

function updateAttemptsLeft() {
    document.getElementById('attempts-left').textContent = MAX_ATTEMPTS - currentRow;
}

function endGame(won) {
    gameOver = true;
    const gameOverScreen = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

function saveScore() {
    const playerName = document.getElementById('player-name').value.trim();
    if (!playerName) {
        alert('Veuillez entrer un pseudo!');
        return;
    }
    
    const scores = JSON.parse(localStorage.getItem('mastermind-scores') || '{}');
    
    // Only save if it's the player's best score
    if (!scores[playerName] || scores[playerName] < score) {
        scores[playerName] = score;
        localStorage.setItem('mastermind-scores', JSON.stringify(scores));
        alert('Score sauvegardé !');
    } else {
        alert('Ce score n\'est pas votre meilleur score.');
    }
    
    window.location.href = 'scores.html';
}

function initGame() {
    secretCode = generateSecretCode();
    currentAttempt = [];
    attempts = [];
    currentRow = 0;
    score = INITIAL_SCORE;
    gameOver = false;
    
    createGameBoard();
    setupColorPicker();
    updateAttemptsLeft();
    
    document.getElementById('current-score').textContent = INITIAL_SCORE;
    document.getElementById('game-over').classList.add('hidden');
    
    console.log('Secret code:', secretCode); // For debugging
}

// Event Listeners
document.getElementById('check-button').addEventListener('click', checkAttempt);
document.getElementById('save-score').addEventListener('click', saveScore);
document.getElementById('play-again').addEventListener('click', initGame);

// Initialize the game
initGame();