function displayScores() {
    const scoresList = document.getElementById('scores-list');
    const scores = JSON.parse(localStorage.getItem('mastermind-scores') || '{}');
    
    // Clear existing scores
    scoresList.innerHTML = '';
    
    if (Object.keys(scores).length === 0) {
        scoresList.innerHTML = '<p>Aucun score enregistré</p>';
        return;
    }
    
    // Sort scores from highest to lowest
    const sortedScores = Object.entries(scores)
        .sort(([, a], [, b]) => b - a);
    
    // Create score elements
    sortedScores.forEach(([name, score], index) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        scoreItem.innerHTML = `
            <span>${index + 1}. ${name}</span>
            <span>${score} points</span>
        `;
        scoresList.appendChild(scoreItem);
    });
}

// Initialize scores display
document.addEventListener('DOMContentLoaded', displayScores);