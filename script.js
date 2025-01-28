var blocksize = 25;
var rows = 20;
var columns = 20;
var board;
var context;
var score = 0;
var lives = 3;

var snakeX = blocksize * 5;
var snakeY = blocksize * 5;
var velocityX = 0;
var velocityY = 0;

var snakeBody = [];
var foodX;
var foodY;
var powerUpX;
var powerUpY;
var showPowerUp = false;
var gameOver = false;
var obstacles = [];

window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * blocksize;
    board.width = columns * blocksize;
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 100);
};

function update() {
    if (gameOver) {
        document.getElementById("game-over").style.display = "block";
        document.getElementById("final-score").innerText = `Final Score: ${score}`;
        return;
    }

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // Draw Food
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blocksize, blocksize);

    // Draw Power-Up if visible
    if (showPowerUp) {
        context.fillStyle = "blue";
        context.fillRect(powerUpX, powerUpY, blocksize, blocksize);
    }

    // Draw Obstacles
    context.fillStyle = "gray";
    for (let obstacle of obstacles) {
        context.fillRect(obstacle[0], obstacle[1], blocksize, blocksize);
    }

    // Check if snake eats food
    if (snakeX == foodX && snakeY == foodY) {
        score += 1;
        snakeBody.push([foodX, foodY]);
        placeFood();
        if (score % 5 === 0) {
            placeObstacle();
        }
    }

    // Check if snake eats power-up
    if (showPowerUp && snakeX == powerUpX && snakeY == powerUpY) {
        score += 5;
        showPowerUp = false;
        document.getElementById("score").innerText = `Score: ${score}`;
        // Speed up temporarily
        setTimeout(() => {
            console.log("Power-Up Consumed: Speed Boost!");
        }, 1000);
    }

    // Move Snake Body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // Move Snake Head
    context.fillStyle = "green";
    context.fillRect(snakeX, snakeY, blocksize, blocksize);
    snakeX += velocityX;
    snakeY += velocityY;
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blocksize, blocksize);
    }

    // Check Collision with Walls
    if (
        snakeX < 0 ||
        snakeX > (columns - 1) * blocksize ||
        snakeY < 0 ||
        snakeY > (rows - 1) * blocksize
    ) {
        loseLife();
    }

    // Check Collision with Itself
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            loseLife();
        }
    }

    // Check Collision with Obstacles
    for (let obstacle of obstacles) {
        if (snakeX == obstacle[0] && snakeY == obstacle[1]) {
            loseLife();
        }
    }

    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("lives").innerText = `Lives: ${lives}`;
}

function placeFood() {
    foodX = Math.floor(Math.random() * columns) * blocksize;
    foodY = Math.floor(Math.random() * rows) * blocksize;

    if (Math.random() < 0.3) {
        placePowerUp();
    }
}

function placePowerUp() {
    powerUpX = Math.floor(Math.random() * columns) * blocksize;
    powerUpY = Math.floor(Math.random() * rows) * blocksize;
    showPowerUp = true;
}

function placeObstacle() {
    let obstacleX = Math.floor(Math.random() * columns) * blocksize;
    let obstacleY = Math.floor(Math.random() * rows) * blocksize;
    obstacles.push([obstacleX, obstacleY]);
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1 * blocksize) {
        velocityY = -1 * blocksize;
        velocityX = 0;
    } else if (e.code == "ArrowDown" && velocityY != -1 * blocksize) {
        velocityY = 1 * blocksize;
        velocityX = 0;
    } else if (e.code == "ArrowLeft" && velocityX != 1 * blocksize) {
        velocityY = 0;
        velocityX = -1 * blocksize;
    } else if (e.code == "ArrowRight" && velocityX != -1 * blocksize) {
        velocityY = 0;
        velocityX = 1 * blocksize;
    }
}

function loseLife() {
    lives -= 1;
    if (lives == 0) {
        gameOver = true;
    } else {
        // Reset snake position
        snakeX = blocksize * 5;
        snakeY = blocksize * 5;
        velocityX = 0;
        velocityY = 0;
        snakeBody = [];
    }
}

function restartGame() {
    lives = 3;
    score = 0;
    snakeX = blocksize * 5;
    snakeY = blocksize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    obstacles = [];
    gameOver = false;
    document.getElementById("game-over").style.display = "none";
    placeFood();
}
