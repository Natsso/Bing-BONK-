const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const endGameOverlay = document.getElementById('endGameOverlay');
const endGameMessage = document.getElementById('endGameMessage');
const timerElement = document.getElementById('timer');

// Variables du jeu
let playerY = canvas.height / 2 - 50;
let aiY = canvas.height / 2 - 50;
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let aiSpeed;
let aiMissChance;
let gameOver = false;
let difficulty;
let startTime;
let timerInterval;

// Dessiner les éléments du jeu
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Raquettes
    ctx.fillStyle = 'white';
    ctx.fillRect(0, playerY, paddleWidth, paddleHeight); // Joueur
    ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight); // IA

    // Balle
    ctx.fillRect(ballX, ballY, ballSize, ballSize);
}

// Mettre à jour les positions des éléments du jeu
function update() {
    if (gameOver) return;

    // Mouvement de la balle
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Rebondir sur les murs supérieur et inférieur
    if (ballY <= 0 || ballY >= canvas.height - ballSize) {
        ballSpeedY = -ballSpeedY;
    }

    // Rebondir sur les raquettes
    if (ballX <= paddleWidth) {
        if (ballY >= playerY && ballY <= playerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            endGame(false);
        }
    } else if (ballX >= canvas.width - paddleWidth - ballSize) {
        if (ballY >= aiY && ballY <= aiY + paddleHeight && Math.random() > aiMissChance) {
            ballSpeedX = -ballSpeedX;
        } else if (ballX >= canvas.width - ballSize) {
            endGame(true);
        }
    }

    // Mouvement de l'IA
    if (ballY > aiY + paddleHeight / 2) {
        aiY += aiSpeed;
    } else {
        aiY -= aiSpeed;
    }

    // Empêcher l'IA de sortir du canvas
    if (aiY <= 0) {
        aiY = 0;
    } else if (aiY >= canvas.height - paddleHeight) {
        aiY = canvas.height - paddleHeight;
    }
}

// Réinitialiser la balle
function resetBall() {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (Math.random() * 4) + 2; // Vitesse aléatoire sur l'axe Y
    if (Math.random() < 0.5) ballSpeedY = -ballSpeedY;
}

// Gérer les mouvements de la souris
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    const mouseY = e.clientY - rect.top - root.scrollTop;
    playerY = mouseY - paddleHeight / 2;

    // Empêcher la raquette de sortir du canvas
    if (playerY < 0) {
        playerY = 0;
    } else if (playerY > canvas.height - paddleHeight) {
        playerY = canvas.height - paddleHeight;
    }
});

// Démarrer le jeu avec la difficulté choisie
function startGame(selectedDifficulty) {
    difficulty = selectedDifficulty;
    switch (difficulty) {
        case 'easy':
            aiSpeed = 2;
            aiMissChance = 0.3;
            break;
        case 'medium':
            aiSpeed = 4;
            aiMissChance = 0.1;
            break;
        case 'hard':
            aiSpeed = 6;
            aiMissChance = 0.05;
            break;
        case 'mega-hard':
            aiSpeed = 8;
            aiMissChance = 0;
            break;
    }
    document.querySelector('.menu').style.display = 'none';
    canvas.style.display = 'block';
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    gameOver = false;
    resetBall();
    gameLoop();
}

// Boucle du jeu
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Terminer le jeu
function endGame(playerWon) {
    gameOver = true;
    clearInterval(timerInterval);
    endGameMessage.textContent = playerWon ? 'Tu as gagné ! Partage ta victoire sur La Casa !' : 'Vous avez perdu ! Recommencer ?';
    endGameOverlay.style.display = 'block';
}

// Recommencer le jeu
function retryGame() {
    endGameOverlay.style.display = 'none';
    startGame(difficulty);
}

// Mettre à jour le chronomètre
function updateTimer() {
    const now = Date.now();
    const elapsedTime = now - startTime;

    const hours = Math.floor(elapsedTime / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000).toString().padStart(2, '0');

    timerElement.textContent = `${hours}:${minutes}:${seconds}`;
}
