const gameBoard = document.querySelector('#gameBoard');
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector('#scoreText');
const resetBtn = document.querySelector('#resetBtn');
const pausa = document.querySelector('#pausa');
const reanudar = document.querySelector('#reanudar');
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const snakeLogo = document.querySelector('#snake-logo');
const snakeLogo2 = document.querySelector('#snake-logo-2');
const boardBg = document.querySelector('.board-bg');
const coloresBoard = document.querySelector('.colores-board');
const colores = document.querySelectorAll('.color');
const flecha = document.querySelector('.flecha');
const maxScoreGameover = document.querySelector('#max-score-gameover');
const scoreGameover = document.querySelector('#score-gameover');
let boardColor = "#4ddf4f";
let boardBackground = boardColor;
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
let running = false;
let paused = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let difficulty = "normal";
let difficultSpeed;
let arrayScore = [];
let ultimoLogro = 0; 
let scorePausa =  document.querySelector('#score-pausa');
let maxScorePausa =  document.querySelector('#max-score-pausa');
let startTime;
let elapsedTime = 0;
let visibleElapsed = 0;
let timeInterval;
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

gameBoard.style = `background-color: ${boardColor}`;
cambiarTablero();

document.addEventListener('DOMContentLoaded', () => {

const observer = new MutationObserver((mutationsList) => {
    for(const mutation of mutationsList) {
        if (mutation.attributeName === 'class') {
            const body = document.body;
            if(body.classList.contains('retro-bg')) {
                boardColor = "#6a0dad";
                boardBackground = boardColor;
                clearBoard();
                drawFood();
                drawSnake();
            } else if(body.classList.contains('frutiger-bg')) {
                boardColor = "#00ffee";
                boardBackground = boardColor;
                clearBoard();
                drawFood();
                drawSnake();
            } else if(!body.classList.contains('frutiger-bg') && !body.classList.contains('retro-bg')) {
                boardColor = "#4ddf4f";
                boardBackground = boardColor;
                clearBoard();
                drawFood();
                drawSnake();
            }
        }
    }
});

observer.observe(document.body, { attributes: true });
})

pausa.addEventListener('click', () => {
    paused = true;
    const menuPausa = document.querySelector('#cartel-pausa');
    menuPausa.classList.remove('invisible');
    reanudar.classList.remove('invisible');
    pausa.classList.add('invisible');

    const tiempoTotal = document.querySelector('#tiempo-total');

    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;

    const formattedTime = 
        String(hours).padStart(2, '0') + 'h' + ' ' + ':' + ' ' +
        String(minutes).padStart(2, '0') + 'm' + ' ' + ':' + ' ' +
        String(seconds).padStart(2, '0') + 's';

    tiempoTotal.textContent = formattedTime;

    const max = localStorage.getItem('maxScore') || 0;
    maxScorePausa.textContent = max;
})

reanudar.addEventListener('click', () => {
    const menuPausa = document.querySelector('#cartel-pausa');
    menuPausa.classList.add('invisible');
    reanudar.classList.remove('invisible');
    pausa.classList.add('invisible');
    reanudar.classList.add('invisible');
    pausa.classList.remove('invisible');
    paused = false;

});

const btnContinuar = document.querySelector('.btn-continuar');

btnContinuar.addEventListener('click', () => {
    const menuPausa = document.querySelector('#cartel-pausa');
    menuPausa.classList.add('invisible');
    reanudar.classList.remove('invisible');
    pausa.classList.add('invisible');
    reanudar.classList.add('invisible');
    pausa.classList.remove('invisible');
    paused = false;
})

window.addEventListener('keydown', changeDirection);
resetBtn.addEventListener('click', () => {
    const spanPlay = document.querySelector('#playText');
    const spanReset = document.querySelector('#resetText');

    if(spanReset.classList.contains('oculto')) {
        gameStart();
        spanPlay.classList.add('oculto');
        spanReset.classList.remove('oculto');
    } else {
        resetGame();
    }
});
    pausa.disabled = true;
    createFood();
    drawFood();
    drawSnake();

function gameStart(){
    running = true;
    score = 0;
    scoreText.textContent = score;
    startTime = Date.now();
    timeInterval = setInterval(updateTimer, 1000);
    nextTick();
    pausa.disabled = false;
}

function nextTick(){
    if(running){
        setTimeout(() => {
            if (!paused) {
                clearBoard();
                drawFood();
                moveSnake();
                drawSnake();
                checkGameOver();
            }
            resetBtn.disabled = true;
            nextTick();
        }, difficultSpeed);
    } else {
        displayGameOver();
        resetBtn.disabled = false;
        pausa.disabled = true;
    }
}


function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood(){
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }

    let validPosition = false;

    while (!validPosition) {
        foodX = randomFood(0, gameWidth - unitSize);
        foodY = randomFood(0, gameHeight - unitSize);

        validPosition = !snake.some(part => part.x === foodX && part.y === foodY);
    }
}

function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, foodX, foodY, unitSize, unitSize, 8);
}

function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    
    snake.unshift(head);

    if(snake[0].x == foodX && snake[0].y == foodY) {
        score+= 1;
        scoreText.textContent = score;
        arrayScore.push(score);
        scoreGameover.textContent = score;
        scorePausa.textContent = score;

        const maxScore = localStorage.getItem('maxScore');
        if(!maxScore || score > parseInt(maxScore)) {
            localStorage.setItem('maxScore', score);
        }
        createFood();
        reproducirComer();
    } else {
        snake.pop();
    }
};

function getSnakeColor(score) {
    let color;

    if (score === 20 && ultimoLogro < 20) {
        reproducirLogro(); 
        ultimoLogro = 20;
        snakeLogo.classList.add('anim-celebracion');
        snakeLogo2.classList.add('anim-celebracion2');
        setTimeout(() => {
            snakeLogo.classList.remove('anim-celebracion');
            snakeLogo2.classList.remove('anim-celebracion2');
        }, 1000);
    } else if (score === 10 && ultimoLogro < 10) {
        reproducirLogro(); 
        ultimoLogro = 10;
        snakeLogo.classList.add('anim-celebracion');
        snakeLogo2.classList.add('anim-celebracion2');
        setTimeout(() => {
            snakeLogo.classList.remove('anim-celebracion');
            snakeLogo2.classList.remove('anim-celebracion2');
        }, 1000);
    } else if (score === 5 && ultimoLogro < 5) {
        reproducirLogro();
        ultimoLogro = 5;
        snakeLogo.classList.add('anim-celebracion');
        snakeLogo2.classList.add('anim-celebracion2');
        setTimeout(() => {
            snakeLogo.classList.remove('anim-celebracion');
            snakeLogo2.classList.remove('anim-celebracion2');
        }, 1000);
    }
    
    if (score >= 20) {
        ctx.fillStyle = "#FFDF00";
        return color;
    } else if (score >= 10) {
        ctx.fillStyle = "#e20000";
        return color;
    } else if (score >= 5) {
        ctx.fillStyle = "#167cff";
        return color;
    } else {
        ctx.fillStyle = "#3dbd01";
        return color;
        
    }
}

function drawSnake(){
    ctx.fillStyle = getSnakeColor(score);
    ctx.strokeStyle = snakeBorder;
    ctx.lineWidth = 2;

    // Dibuja cuerpo
    snake.forEach(function(snakePart){
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });

    // Dibuja bordes externos
    snake.forEach(function(part){
        var hasTopNeighbor = false;
        var hasBottomNeighbor = false;
        var hasLeftNeighbor = false;
        var hasRightNeighbor = false;

        for (var i = 0; i < snake.length; i++) {
            var p = snake[i];
            if (p.x === part.x && p.y === part.y - unitSize) hasTopNeighbor = true;
            if (p.x === part.x && p.y === part.y + unitSize) hasBottomNeighbor = true;
            if (p.x === part.x - unitSize && p.y === part.y) hasLeftNeighbor = true;
            if (p.x === part.x + unitSize && p.y === part.y) hasRightNeighbor = true;
        }

        if (!hasTopNeighbor) {
            ctx.beginPath();
            ctx.moveTo(part.x, part.y);
            ctx.lineTo(part.x + unitSize, part.y);
            ctx.stroke();
        }
        if (!hasBottomNeighbor) {
            ctx.beginPath();
            ctx.moveTo(part.x, part.y + unitSize);
            ctx.lineTo(part.x + unitSize, part.y + unitSize);
            ctx.stroke();
        }
        if (!hasLeftNeighbor) {
            ctx.beginPath();
            ctx.moveTo(part.x, part.y);
            ctx.lineTo(part.x, part.y + unitSize);
            ctx.stroke();
        }
        if (!hasRightNeighbor) {
            ctx.beginPath();
            ctx.moveTo(part.x + unitSize, part.y);
            ctx.lineTo(part.x + unitSize, part.y + unitSize);
            ctx.stroke();
        }
    });

    // Ojos
    var head = snake[0];
    var eyeRadius = 3;
    var eyeOffset = 6;
    var eye1x = 0, eye1y = 0;
    var eye2x = 0, eye2y = 0;

    if (xVelocity > 0) { // Derecha
        eye1x = head.x + unitSize - eyeOffset;
        eye1y = head.y + eyeOffset;
        eye2x = head.x + unitSize - eyeOffset;
        eye2y = head.y + unitSize - eyeOffset;
    } else if (xVelocity < 0) { // Izquierda
        eye1x = head.x + eyeOffset;
        eye1y = head.y + eyeOffset;
        eye2x = head.x + eyeOffset;
        eye2y = head.y + unitSize - eyeOffset;
    } else if (yVelocity > 0) { // Abajo
        eye1x = head.x + eyeOffset;
        eye1y = head.y + unitSize - eyeOffset;
        eye2x = head.x + unitSize - eyeOffset;
        eye2y = head.y + unitSize - eyeOffset;
    } else if (yVelocity < 0) { // Arriba
        eye1x = head.x + eyeOffset;
        eye1y = head.y + eyeOffset;
        eye2x = head.x + unitSize - eyeOffset;
        eye2y = head.y + eyeOffset;
    }

    // Ojos blancos
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(eye1x, eye1y, eyeRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(eye2x, eye2y, eyeRadius, 0, Math.PI * 2);
    ctx.fill();

    // Pupilas negras
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(eye1x, eye1y, eyeRadius / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(eye2x, eye2y, eyeRadius / 2, 0, Math.PI * 2);
    ctx.fill();
}


function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT =  37;
    const UP =  38;
    const RIGHT =  39;
    const DOWN =  40;
    const controls = {
    "a": { x: -unitSize, y: 0 },
    "w": { x: 0, y: -unitSize },
    "d": { x: unitSize, y: 0 },
    "s": { x: 0, y: unitSize }
    };
    const key = event.key.toLowerCase();
    const newDir = controls[key];

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true) {
        case(keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }

        if ((newDir.x == -unitSize && goingRight) ||
        (newDir.x == unitSize && goingLeft) ||
        (newDir.y == -unitSize && goingDown) ||
        (newDir.y == unitSize && goingUp)) {
        return;
    }

    xVelocity = newDir.x;
    yVelocity = newDir.y;
};

function checkGameOver(){
    switch(true) {
        case(snake[0].x < 0):
            running = false;
            break;
        case(snake[0].x >= gameWidth):
            running = false;
            break;
        case(snake[0].y < 0):
            running = false;
            break;
        case(snake[0].y >= gameHeight):
            running = false;
            break;
    }

    for(let i = 1; i < snake.length; i+=1) {
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false;
        }
    }
};

function displayGameOver(){
    const gameover = document.querySelector('#cartel-gameover');
    gameover.classList.remove('invisible');
    running = false;
    reproducirGameOver();

    const tiempoTotal = document.querySelector('#tiempo-gameover');

    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;

    const formattedTime = 
        String(hours).padStart(2, '0') + 'h' + ' ' + ':' + ' ' +
        String(minutes).padStart(2, '0') + 'm' + ' ' + ':' + ' ' +
        String(seconds).padStart(2, '0') + 's';

    tiempoTotal.textContent = formattedTime;

    const max = localStorage.getItem('maxScore') || 0;
    const MaxPuntuacion = document.querySelector('#max-score');
    MaxPuntuacion.textContent = max;
    maxScoreGameover.textContent = max;

    flecha.classList.remove('oculto');
};


function resetGame(){
    const gameover = document.querySelector('#cartel-gameover');
    score = 0;
    ultimoLogro = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
    ];
    gameStart();
    gameover.classList.add('invisible');
    flecha.classList.add('oculto');
};

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (ctx.fillStyle) ctx.fill();
    if (ctx.strokeStyle) ctx.stroke();
}



let lastButtonState = false;

function gamepadLoop() {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0];
    if (!gp) return;

    // Joystick izquierdo o D-Pad
    const xAxis = gp.axes[0]; 
    const yAxis = gp.axes[1]; 
    const threshold = 0.5;

    if (xAxis < -threshold && xVelocity !== unitSize) {
        xVelocity = -unitSize;
        yVelocity = 0;
    } else if (xAxis > threshold && xVelocity !== -unitSize) {
        xVelocity = unitSize;
        yVelocity = 0;
    } else if (yAxis < -threshold && yVelocity !== unitSize) {
        xVelocity = 0;
        yVelocity = -unitSize;
    } else if (yAxis > threshold && yVelocity !== -unitSize) {
        xVelocity = 0;
        yVelocity = unitSize;
    }

    // D-Pad (botones 12, 13, 14, 15)
    if (gp.buttons[14].pressed && xVelocity !== unitSize) { // Izquierda
        xVelocity = -unitSize;
        yVelocity = 0;
    }
    if (gp.buttons[15].pressed && xVelocity !== -unitSize) { // Derecha
        xVelocity = unitSize;
        yVelocity = 0;
    }
    if (gp.buttons[12].pressed && yVelocity !== unitSize) { // Arriba
        xVelocity = 0;
        yVelocity = -unitSize;
    }
    if (gp.buttons[13].pressed && yVelocity !== -unitSize) { // Abajo
        xVelocity = 0;
        yVelocity = unitSize;
    }

    // Botón A para iniciar
    const buttonA = gp.buttons[0].pressed;
    if (buttonA && !lastButtonState) {
        resetBtn.click();
    }
    lastButtonState = buttonA;

    requestAnimationFrame(gamepadLoop);
}


function cambiarTablero() {
    colores.forEach(color => {
        color.addEventListener('click', () => {
            if (color.classList.contains('verde')) {
                setBoardColor("#4ddf4f");
            } else if (color.classList.contains('azul')) {
                setBoardColor("#00ffee");
            } else if (color.classList.contains('morado')) {
                setBoardColor("#6a0dad");
            }
        });
    });
}


        
if (score == 0) {
    scorePausa.textContent = 0;
    scoreGameover.textContent = 0;
}

const max = localStorage.getItem('maxScore') || 0;
maxScorePausa.textContent = max;

function tiempoJuego() {
    resetBtn.addEventListener('click', function () {
        console.log('Primer clic detectado. Iniciando temporizador...');

        let segundos = 0;
        let minutos = 0;
        let horas = 0;

        const intervalo = setInterval(() => {
            segundos++;

            if (segundos === 60) {
                segundos = 0;
                minutos++;
            }

            if (minutos === 60) {
                minutos = 0;
                horas++;
            }

            console.log(
                `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`
            );
        }, 1000);

    }, { once: true }); 
}

function updateTimer() {
    const now = Date.now();
    elapsedTime = Math.floor((now - startTime) / 1000); // total de segundos

    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;

    // Mostrar el tiempo en formato HH:MM:SS
    const formattedTime = 
        String(hours).padStart(2, '0') + 'h:' +
        String(minutes).padStart(2, '0') + 'm:' +
        String(seconds).padStart(2, '0') + 's';

}

document.addEventListener('keydown', (e) => {
    const keyPressed = e.code; 
    if(paused == false && keyPressed === 'Escape' || paused == false && keyPressed ===  'Space' || paused == false && keyPressed ===  'Enter') {
        pausa.click()
    } else if(paused == true && keyPressed === 'Escape' || paused == true && keyPressed === 'Enter' || paused == true && keyPressed === 'Space') {
        reanudar.click()
    }
    if(keyPressed === 'Enter' || keyPressed === 'Space') {
        resetBtn.click();
    }
    if(keyPressed === 'KeyQ') {
        $('#start').click();
    } else if(keyPressed === 'KeyE') {
        btnMando.click();
    } else if(keyPressed === 'KeyM') {
        $(".audio").click();
    }
})


