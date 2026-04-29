//GLOBAL VARIABLES
let board, context;
let blockSize = 30;
let rows = 25;
let cols = 25;

let snakeX, snakeY, velocityX, velocityY;
let snakeBody;

let foodX, foodY, currentfood;

let score, duration;
let gameOver, paused, gameStarted;
let startTime;

let isImmune, immunityEndTime;
let cause, scoresent;

let username;

let confetti = [];
let confettiCtx;
let confettiRunning = false;
let appleImg = new Image();
appleImg.src = "static/Golden_Apple_JE2_BE2.png";
appleImg.onload = () => {
    console.log("Apple loaded");
};
let foods = [
    {type: "🥕", points: 1, immune:false},
    {type: "🎃", points: 3, immune:false},
    {img: appleImg, points: 0, immune:true, duration:10000}
];


//VALIDUSER
function validUser() {
    let name = document.getElementById("user").value;
    let error=document.getElementById("userError");

    if (name === "") {
        error.style.display="block";
        return;
    } else {
        error.style.display="none";
        document.getElementById("popup").style.display = "none";
        document.getElementById("hpg").style.display = "block";
    }
}
document.getElementById("user").addEventListener("input", function() {
    document.getElementById("userError").style.display = "none";
});

//DISPLAYRULES
function displayRules(){
    document.getElementById("Rules").style.display = "block";
    document.getElementById("hpg").style.display = "none";
}

//CLOSERULES
function closeRules(){
    document.getElementById("Rules").style.display = "none";
    document.getElementById("hpg").style.display = "block";
}

//START GAME
function startGame(){
    document.getElementById("hpg").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("canvas").style.display = "block";

    board = document.getElementById("canvas");
    context = board.getContext("2d");

    let confettiCanvas = document.getElementById("confettiCanvas");
    confettiCtx = confettiCanvas.getContext("2d");

    username = document.getElementById("user").value;

    resetGameState();

    document.addEventListener("keyup", changeDirection);

    if (!window.gameInterval) {
        window.gameInterval = setInterval(update, 130);
    }
}

// RESET GAME
function resetGameState() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];

    score = 0;
    duration = 0;
    gameOver = false;
    paused = false;
    gameStarted = false;
    scoresent = false;

    isImmune = false;
    immunityEndTime = 0;

    cause = "";

    startTime = 0;

    placeFood();
}

//GAME LOOP
function update() {
    if (gameOver) {
        if (!scoresent) {
            sendScore(username, score, cause, duration);
            scoresent = true;
        }
        return;
    }

    if (paused) return;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {

        // GRID
            if ((r + c) % 2 === 0) {
            context.fillStyle = "#2f3e5c"; 
            } 
            else {
            context.fillStyle = "#3b4f73";  
            }
            context.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
        }
    }

    //FOOD
    

    context.font = "16px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    if (currentfood.img) {
    //GOLDEN APPLE
        context.drawImage(
            currentfood.img,
            foodX,
            foodY,
            blockSize,
            blockSize
    );
    }
    else {
    //CARROT ,PUMPKIN
    context.fillText(
        currentfood.type,
        foodX + blockSize/2,
        foodY + blockSize/2
    );
    }
    // Eat food
    if (snakeX == foodX && snakeY == foodY) {

        if (currentfood.points) {
            score += currentfood.points;
            for (let i=0;i<currentfood.points; i++){
                snakeBody.push([foodX,foodY]);
            }
        } 
        else if (currentfood.immune) {
            
            if (Date.now() < immunityEndTime){
                immunityEndTime = Date.now() + currentfood.duration;
            }
            else {
                immunityEndTime = Date.now() + currentfood.duration;
            }
            isImmune = true;
        }

        placeFood();
    }

    // Time
    if (gameStarted) {
        duration = Math.floor((Date.now() - startTime) / 1000);
    }

    // Display score
    let display = "Score: " + score + " Time: " + duration + "s";

    if (isImmune) {
        let remaining = Math.max(0, Math.ceil((immunityEndTime - Date.now()) / 1000));
        display += " Immunity: " + remaining + "s";
    }

    document.getElementById("scoreDisplay").innerHTML = display;

    if (isImmune && Date.now() > immunityEndTime) {
        isImmune = false;
    }

    // Move body
    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // Move snake
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    // IMMUNITY WALL
    if (isImmune) {
        if (snakeX < 0) snakeX = (cols-1)*blockSize;
        if (snakeX >= cols*blockSize) snakeX = 0;
        if (snakeY < 0) snakeY = (rows-1)*blockSize;
        if (snakeY >= rows*blockSize) snakeY = 0;
    }

    // Draw snake
    // GLOW EFFECT WHEN IMMUNE
if (isImmune) {
    context.shadowBlur = 15;
    context.shadowColor = "gold";  
    context.fillStyle = "yellow";   
} else {
    context.shadowBlur = 0;
    context.fillStyle = "lime";    
}

//HEAD
context.fillRect(snakeX, snakeY, blockSize, blockSize);

//BODY
for (let i = 0; i < snakeBody.length; i++) {
    context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
}

// Reset shadow 
context.shadowBlur = 0;

    // Wall collision
    if (!isImmune) {
        if (snakeX < 0 || snakeX >= cols*blockSize || snakeY < 0 || snakeY >= rows*blockSize) {
            cause = "WALL";
            showGameOver();
        }
    }

    // Body collision
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            if (isImmune) {
                paused = true;
                velocityX = 0;
                velocityY = 0;
                return;
            } else {
                cause = "SELF";
                showGameOver();
            }
        }
    }
}

//CHANGE DIRECTIONS
function changeDirection(e){
    if (gameOver) return;

    if (!gameStarted){
        startTime = Date.now();
        gameStarted = true;
    }

    if (paused) paused = false;

    if ((e.code == "ArrowUp" || e.code == "KeyW") && velocityY != 1) {
        velocityX = 0; velocityY = -1;
    }
    else if ((e.code == "ArrowDown" || e.code == "KeyS") && velocityY != -1) {
        velocityX = 0; velocityY = 1;
    }
    else if ((e.code == "ArrowLeft" || e.code == "KeyA") && velocityX != 1) {
        velocityX = -1; velocityY = 0;
    }
    else if ((e.code == "ArrowRight" || e.code == "KeyD") && velocityX != -1) {
        velocityX = 1; velocityY = 0;
    }
}

// FOOD 
function placeFood() {
    let valid=false;
    while(!valid){
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
    currentfood = foods[Math.floor(Math.random() * foods.length)];
        valid = true;

        // Check with snake head
        if (foodX === snakeX && foodY === snakeY) {
            valid = false;
        }

        // Check with snake body
        for (let i = 0; i < snakeBody.length; i++) {
            if (snakeBody[i][0] === foodX && snakeBody[i][1] === foodY) {
                valid = false;
                break;
            }
        }
    

    }
    
let r=Math.random();
if(r<0.6){
    currentfood=foods[0];
}
else if(r<0.9){
    currentfood=foods[1];

}
else{
    currentfood=foods[2];
}

}
// GAME OVER
function showGameOver() {
    gameOver = true;

    if(!scoresent) {
        sendScore(username,score,cause,duration);
        scoresent=true;
    }
    
    clearInterval(window.gameInterval);
    window.gameInterval = null;
    const now = new Date().toLocaleString();
    document.getElementById("gameOverBox").style.display="block";
    document.getElementById("bigScore").innerText=score;
    document.getElementById("finalScore").innerText = "Score: " + score;
    document.getElementById("finalTime").innerText = "Time: " + duration + "s";
    document.getElementById("finalCause").innerText = "Cause: " + cause;
    document.getElementById("timestamp").innerText = "Played at: " + now;
    
}

//RESTART 
function restartGame() {
    document.getElementById("gameOverBox").style.display = "none";
    resetGameState();
    if (!window.gameInterval) {
        window.gameInterval = setInterval(update, 130);
    }

}

//SEND SCORE
function sendScore(username, score, cause, duration) {
    fetch("/save_score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: username,
            score: score,
            cause: cause,
            duration: duration
        })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("highScore").innerText = "High Score: "+ data.highScore;

        if (score== data.highScore){
            document.getElementById("highScore").innerText =  "🎉 NEW HIGH SCORE: " + data.highScore;

            startConfetti();
        }
    })        
    .catch(err => console.error("Error:",err));
}

function showProfile() {
    let username = document.getElementById("user").value;

    fetch("/get_profile/" + username)
    .then(res => res.json())
    .then(data => {
        document.getElementById("pName").innerText = data.name;
        document.getElementById("pHigh").innerText = data.highscore;
        document.getElementById("pGames").innerText = data.games;
        document.getElementById("pLast").innerText = data.last_score;
        document.getElementById("pCause").innerText = data.last_cause;

        document.getElementById("profileBox").style.display = "block";
        document.getElementById("hpg").style.display = "none";
    });
}

function closeProfile() {
    document.getElementById("profileBox").style.display = "none";
    document.getElementById("hpg").style.display = "block";
}
function startConfetti() {
    confetti = [];
    confettiRunning = true;

    for (let i = 0; i < 120; i++) {
        confetti.push({
            x: Math.random() * 750,
            y: Math.random() * -750,
            size: Math.random() * 6 + 4,
            speed: Math.random() * 3 + 2,
            color: `hsl(${Math.random()*360}, 100%, 50%)`,
            tilt: Math.random() * 10 - 5
        });
    }

    animateConfetti();

    // stop after 4 seconds
    setTimeout(() => {
        confettiRunning = false;
        confettiCtx.clearRect(0, 0, 750, 750);
    }, 6000);
}

function animateConfetti() {
    if (!confettiRunning) return;

    confettiCtx.clearRect(0, 0, 750, 750);

    confetti.forEach(p => {
        p.y += p.speed;
        p.x += Math.sin(p.y * 0.05);

        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(p.x, p.y, p.size, p.size);

        if (p.y > 750) {
            p.y = -10;
            p.x = Math.random() * 750;
        }
    });

    requestAnimationFrame(animateConfetti);
}
