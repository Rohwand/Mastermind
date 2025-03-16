import readline from 'readline';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COLORS = ['R', 'B', 'G', 'Y', 'P', 'O'];
const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 20;
const INITIAL_SCORE = 20;
const SCORES_FILE = join(__dirname, 'scores.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let secretCode = [];
let score = INITIAL_SCORE;
let attempts = 0;

function generateSecretCode() {
    const code = [];
    for (let i = 0; i < CODE_LENGTH; i++) {
        code.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }
    return code;
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

function saveScore(playerName, score) {
    let scores = {};
    try {
        if (fs.existsSync(SCORES_FILE)) {
            scores = JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('Error reading scores file:', error);
    }
    
    // Only save if it's the player's best score
    if (!scores[playerName] || scores[playerName] < score) {
        scores[playerName] = score;
        try {
            fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
            console.log('Score sauvegardé !');
        } catch (error) {
            console.error('Error saving score:', error);
        }
    } else {
        console.log('Ce score n\'est pas votre meilleur score.');
    }
}

function displayInstructions() {
    console.log('\nBienvenue dans Mastermind Console!');
    console.log('-----------------------------------');
    console.log('Couleurs disponibles: R (Rouge), B (Bleu), G (Vert), Y (Jaune), P (Violet), O (Orange)');
    console.log('Entrez une combinaison de 4 lettres, par exemple: RBYG');
    console.log('✓ = bonne couleur à la bonne position');
    console.log('○ = bonne couleur à la mauvaise position\n');
}

function playGame() {
    secretCode = generateSecretCode();
    attempts = 0;
    score = INITIAL_SCORE;
    
    displayInstructions();
    
    function askGuess() {
        rl.question(`\nEssai ${attempts + 1}/${MAX_ATTEMPTS} (Score: ${score}) > `, (answer) => {
            const guess = answer.toUpperCase().split('');
            
            if (guess.length !== CODE_LENGTH || !guess.every(c => COLORS.includes(c))) {
                console.log('Entrée invalide! Utilisez 4 lettres parmi:', COLORS.join(', '));
                askGuess();
                return;
            }
            
            attempts++;
            const feedback = getFeedback(guess, secretCode);
            
            // Display feedback
            const feedbackSymbols = [
                ...Array(feedback.exact).fill('✓'),
                ...Array(feedback.partial).fill('○')
            ].join(' ');
            console.log('Feedback:', feedbackSymbols || 'Aucune correspondance');
            
            if (feedback.exact === CODE_LENGTH) {
                console.log('\nFélicitations! Vous avez gagné!');
                console.log(`Score final: ${score}`);
                
                rl.question('\nEntrez votre pseudo pour sauvegarder votre score: ', (name) => {
                    if (name.trim()) {
                        saveScore(name.trim(), score);
                    }
                    rl.question('\nVoulez-vous rejouer? (o/n) ', (answer) => {
                        if (answer.toLowerCase() === 'o') {
                            playGame();
                        } else {
                            rl.close();
                        }
                    });
                });
                return;
            }
            
            if (attempts >= MAX_ATTEMPTS) {
                console.log('\nGame Over! Le code était:', secretCode.join(''));
                rl.question('\nVoulez-vous rejouer? (o/n) ', (answer) => {
                    if (answer.toLowerCase() === 'o') {
                        playGame();
                    } else {
                        rl.close();
                    }
                });
                return;
            }
            
            score = Math.max(0, score - 1);
            askGuess();
        });
    }
    
    askGuess();
}

// Start the game
playGame();