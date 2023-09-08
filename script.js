let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let modal = document.getElementById('modal');
let modalContent = document.getElementById('modalContent');


let birdWidth = 34;
let birdHeight = 24;
let birdY = boardHeight / 2;
let birdX = boardWidth / 8;
let birdImage;
let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImage;
let bottomPipeImage;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let gameOverTitle = document.createElement('p');
gameOverTitle.innerHTML = 'GAME OVER!!';
gameOverTitle.style.fontSize = '50px';

let previousScoreLabel = document.createElement('p');
previousScoreLabel.style.fontSize = '34px';
previousScoreLabel.style.marginTop = '50px';

let highScore = 0;
let highScoreLabel = document.createElement('p');
highScoreLabel.innerHTML = 'HighScore: ' + highScore;
highScoreLabel.style.fontSize = '28px';

let playAgainPrompt = document.createElement('p');
playAgainPrompt.innerHTML = '<< Flap your wings to play again >>';
playAgainPrompt.style.marginTop = '150px';


window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    

    birdImage = new Image();
    birdImage.src = "./assets/GameObjects/yellowbird-upflap.png";
    birdImage.onload = () => {
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    }
    topPipeImage = new Image();
    topPipeImage.src = "./assets/GameObjects/pipe-top.png";

    bottomPipeImage = new Image();
    bottomPipeImage.src = "./assets/GameObjects/pipe-bottom.png";
    gameOver = true;
    document.addEventListener("keydown", moveBird)
    setInterval(placePipes, 1500);
    requestAnimationFrame(update);
}

function update() {
    requestAnimationFrame(update)
    if (gameOver){
        previousScoreLabel.innerHTML = 'Score: ' + score;
        if (score > highScore) {
            highScore = score;
            highScoreLabel.innerHTML = 'HighScore: ' + highScore;
            localStorage.setItem('HighScore', highScore);
        }
        else {
            highScoreLabel.innerHTML = 'HighScore: ' + localStorage.getItem('HighScore');
        }
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    for (let i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)){
            gameOver = true;
        }
    }
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
    if (gameOver) {
        modal.style.display = 'inline-block';
        modalContent.innerHTML = '';
        modalContent.appendChild(gameOverTitle);
        modalContent.appendChild(previousScoreLabel);
        modalContent.appendChild(highScoreLabel);
        modalContent.appendChild(playAgainPrompt);
    }
}
function placePipes () {
    if (gameOver){
        return;
    }
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;
    let topPipe = {
        img : topPipeImage,
        x : pipeX,
        y : randomPipeY, 
        width : pipeWidth,
        height : pipeHeight,
        passed : false

    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImage,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if (e.code == "Space" || e.code == "ArrowUp") {
        velocityY = -6;
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            modal.style.display = 'none';
            gameOver = false;

        }
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}