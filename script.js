script.js
/* -------------------------------------------------------
   CANVAS + CONTEXT
------------------------------------------------------- */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* -------------------------------------------------------
   IMAGES
------------------------------------------------------- */
const grassImg = new Image();
grassImg.src = "assets/grass.png";

const leafImg = new Image();
leafImg.src = "assets/leaf.png";

const treeImg = new Image();
treeImg.src = "assets/tree.png";

/* -------------------------------------------------------
   GAME VARIABLES
------------------------------------------------------- */
let leaf = {
    x: 400,
    y: 50,
    width: 50,
    height: 50,
    vx: 0,
    vy: 0
};

let windForce = 0.4;   // how strongly arrow keys move the leaf
let gravity = 0.15;     // slight downward pull
let strongWindTimer = 0;

let score = 0;
let timer = 30;
let gameRunning = true;

/* Leaf pile area */
const pileArea = {
    x: 350,
    y: 400,
    width: 120,
    height: 60
};

/* UI Elements */
const restartBtn = document.getElementById("restartBtn");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const gameOverText = document.getElementById("gameOver");

/* -------------------------------------------------------
   KEYBOARD INPUT
------------------------------------------------------- */
let keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

/* -------------------------------------------------------
   MAIN UPDATE LOOP
------------------------------------------------------- */
function update() {
    if (!gameRunning) return;

    // Apply gravity
    leaf.vy += gravity;

    // Player control = wind
    if (keys["ArrowLeft"]) leaf.vx -= windForce;
    if (keys["ArrowRight"]) leaf.vx += windForce;
    if (keys["ArrowUp"]) leaf.vy -= windForce;
    if (keys["ArrowDown"]) leaf.vy += windForce;

    // Random strong wind bursts
    if (strongWindTimer <= 0) {
        if (Math.random() < 0.01) {  
            let gust = (Math.random() * 2 - 1) * 3; // -3 to +3
            leaf.vx += gust;
            strongWindTimer = 100; // cooldown
        }
    } else {
        strongWindTimer--;
    }

    // Update leaf position
    leaf.x += leaf.vx;
    leaf.y += leaf.vy;

    // Screen boundaries
    if (leaf.x < 0) leaf.x = 0;
    if (leaf.x + leaf.width > canvas.width) leaf.x = canvas.width - leaf.width;
    if (leaf.y < 0) leaf.y = 0;
    if (leaf.y + leaf.height > canvas.height) leaf.y = canvas.height - leaf.height;

    // Friction
    leaf.vx *= 0.97;
    leaf.vy *= 0.97;

    // Check if leaf lands in pile
    if (
        leaf.x > pileArea.x &&
        leaf.x < pileArea.x + pileArea.width &&
        leaf.y > pileArea.y &&
        leaf.y < pileArea.y + pileArea.height
    ) {
        score += 10;
        scoreEl.textContent = "Score: " + score;

        // Respawn leaf at top
        leaf.x = Math.random() * 700 + 50;
        leaf.y = 20;
        leaf.vx = 0;
        leaf.vy = 0;
    }

    draw();
    requestAnimationFrame(update);
}

/* -------------------------------------------------------
   DRAWING
------------------------------------------------------- */
function draw() {
    // Draw background grass
    ctx.drawImage(grassImg, 0, 0, canvas.width, canvas.height);

    // Draw tree in background
    ctx.drawImage(treeImg, 200, 70, 400, 300);

    // Draw the leaf pile area
    ctx.fillStyle = "rgba(255, 150, 50, 0.4)";
    ctx.fillRect(pileArea.x, pileArea.y, pileArea.width, pileArea.height);

    // Draw the leaf
    ctx.drawImage(leafImg, leaf.x, leaf.y, leaf.width, leaf.height);
}

/* -------------------------------------------------------
   TIMER
------------------------------------------------------- */
function startTimer() {
    const countdown = setInterval(() => {
        if (!gameRunning) {
            clearInterval(countdown);
            return;
        }

        timer--;
        timerEl.textContent = "Time: " + timer;

        if (timer <= 0) {
            endGame();
            clearInterval(countdown);
        }
    }, 1000);
}

/* -------------------------------------------------------
   END GAME
------------------------------------------------------- */
function endGame() {
    gameRunning = false;
    gameOverText.classList.remove("hidden");
}

/* -------------------------------------------------------
   RESTART
------------------------------------------------------- */
restartBtn.addEventListener("click", () => {
    // Reset variables
    leaf.x = 400;
    leaf.y = 50;
    leaf.vx = 0;
    leaf.vy = 0;

    score = 0;
    timer = 30;
    scoreEl.textContent = "Score: 0";
    timerEl.textContent = "Time: 30";

    gameOverText.classList.add("hidden");
    gameRunning = true;

    startTimer();
    update();
});

/* -------------------------------------------------------
   START GAME
------------------------------------------------------- */
window.onload = () => {
    startTimer();
    update();
};
