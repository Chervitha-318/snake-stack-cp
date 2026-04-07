function validUser() {
    let name = document.getElementById("user").value;

    if (name === "") {
        alert("Please enter username!");
    } else {
        document.getElementById("popup").style.display = "none";
        document.getElementById("hpg").style.display = "block";
    }
}

function displayRules(){
    document.getElementById("Rules").style.display = "block";
    document.getElementById("hpg").style.display = "none";
}

function closeRules(){
    document.getElementById("Rules").style.display = "none";
    document.getElementById("hpg").style.display = "block";
}
function startGame(){
    document.getElementById("canvas").style.display = "block";
    document.getElementById("hpg").style.display = "none";

const board =document.getElementById("canvas");
const context = board.getContext("2d");
var blockSize = 20;
var rows = 20;
var cols = 20;
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];
var foodX;
var foodY;

var gameOver = false;

    placeFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 1000/10);

function update() {
    if (gameOver) {
        return;
    }

    context.fillStyle="white";
    context.fillRect(0, 0, 400,400);

    context.beginPath();
for (let x=0; x<=innerWidth; x += 20){
context.moveTo(x,0);
context.lineTo(x,400);
}

for (let y=0;y<=innerHeight;y +=20){
    context.moveTo(0,y);
    context.lineTo(400,y);
}
context.stroke();

    context.fillStyle="red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle="lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }
    if (snakeX < 0 || snakeX > cols*blockSize || snakeY < 0 || snakeY > rows*blockSize) {
        gameOver = true;
        alert("Game Over");
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            alert("Game Over");
        }
    }
}

function changeDirection(v){
    if ((v.code == "ArrowUp" || v.code == "KeyW") && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if ((v.code == "ArrowDown" || v.code == "KeyS")&& velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if ((v.code == "ArrowLeft" || v.code == "KeyA") && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if ((v.code == "ArrowRight" || v.code == "KeyD") && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}


function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}
}
