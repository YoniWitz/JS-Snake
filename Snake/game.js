const DEBUG = false;
//banner area
let banner;
let bannerContext;
let eatenApples;

//game area
const HEIGHT = WIDTH = 400;

let canvas;
let canvasContext;

//snake params
let snakeContext;
let snakeLength = 10;
const SNAKE_HEIGHT = 10;
const INCREMENT = 10;
let snakeArray;

let xIncrement;
let yIncrement;

//apple params
let appleContext;
const APPLE_RADIUS = SNAKE_HEIGHT / 2;//so the diameter is same as snake 
let appleX; //x and y coordinates are from center of circle
let appleY;//this way the circle is fully in the canvas

//game control
let gameStatus = "start";
let framePerSecond;
window.onload = () => {
    //banner area
    banner = document.getElementById('gameBanner');
    bannerContext = banner.getContext('2d');

    //game area
    canvas = document.getElementById('gameCanvas');
    snakeContext = canvas.getContext('2d');
    appleContext = canvas.getContext('2d');
    canvasContext = canvas.getContext('2d');

    restartGame();

    framePerSecond = 8;
    let oneSecond = 1000;

    drawEverything();
    setInterval(() => {
        if (gameStatus === "start") {
            drawBanner(gameStatus);
        }
        else if (gameStatus === "over") {
            drawBanner("restart");
            bannerContext.fillText("Game Over!!", 50, 60);
        }
        else if (gameStatus === "paused") {
            drawBanner("continue");
        }
        else {
            drawBanner("pause");
            moveEverything();
            drawEverything();
        }
    }, oneSecond / framePerSecond);

    //key listener
    document.addEventListener('keydown', keyPressed);
};

restartGame = () => {
    snakeArray = [
        { x: WIDTH / INCREMENT, y: HEIGHT / 2 },
        { x: WIDTH / INCREMENT - INCREMENT, y: HEIGHT / 2 },
        { x: WIDTH / INCREMENT - INCREMENT * 2, y: HEIGHT / 2 },
        { x: WIDTH / INCREMENT - INCREMENT * 3, y: HEIGHT / 2 }
    ];

    appleReset();

    eatenApples = 0;

    xIncrement = INCREMENT;
    yIncrement = 0;
}

//reset apple position. must be within the canvas and alligned with the snake. watch the radius
appleReset = () => {
    let x = Math.random() * (WIDTH - INCREMENT * 2) + INCREMENT;
    appleX = Math.round(x / INCREMENT) * INCREMENT;

    let y = Math.random() * (HEIGHT - INCREMENT * 2) + INCREMENT;
    appleY = Math.round(y / INCREMENT) * INCREMENT;

    if (DEBUG) {
        console.log(appleX, appleY);
    }
    snakeArray.forEach(item => {
        if (item.x === appleX && item.y === appleY) {
            appleReset();
        }
    })
}

//key listener function
keyPressed = (event) => {
    document.removeEventListener('keydown', keyPressed)
    var code = event.which;
    switch (code) {
        //space
        case 32:
            if (gameStatus === "start") {
                gameStatus = "playing";
            }
            else if (gameStatus === "over") {
                gameStatus = "playing";
                restartGame();
            }
            else if (gameStatus === "paused") {
                gameStatus = "playing"
            }
            else if (gameStatus === "playing") {
                gameStatus = "paused";
            }
            break;
        //right arrow
        case 39:
            if (yIncrement !== 0) {//if was already going right or left, don't change. 
                xIncrement = INCREMENT;
                yIncrement = 0;
            }
            break;
        //left arrow
        case 37:
            if (yIncrement !== 0) {//if was already going right or left, don't change.
                xIncrement = -INCREMENT;
                yIncrement = 0;
            }
            break;
        //up arrow
        case 38:
            if (xIncrement !== 0) {//if was already going up or down, don't change.
                xIncrement = 0;
                yIncrement = -INCREMENT;
            }
            break;
        //down arrow
        case 40:
            if (xIncrement !== 0) {//if was already going up or down, don't change.
                xIncrement = 0;
                yIncrement = INCREMENT;
            }
            break;
    }
    document.addEventListener('keydown', keyPressed);
};

//make snake move
moveEverything = () => {
    nextStep = {
        x: snakeArray[0].x + xIncrement,
        y: snakeArray[0].y + yIncrement
    };

    //if snake touches itself
    snakeArray.forEach(item => {
        if (item.x === nextStep.x && item.y === nextStep.y) {
            if (!DEBUG)
                gameOver();
            else {
                console.log('game over');
            }
        }
    })

    //if snake hits boarder
    if (nextStep.x >= WIDTH - INCREMENT || nextStep.x <= 0 || nextStep.y >= HEIGHT - INCREMENT || nextStep.y <= 0) {
        console.log('game over');
        if (!DEBUG) {
            gameOver();
        }
    }

    //snake touches apple
    if ((nextStep.y === appleY) && (nextStep.x === appleX)) {
        //update score
        eatenApples++;
        //place new apple
        appleReset();
        //add link to snake
        newLink = {
            x: snakeArray[snakeArray.length - 1].x - xIncrement,
            y: snakeArray[snakeArray.length - 1].y - yIncrement
        };

        snakeArray.push(newLink);
    }

    //creating movement 
    snakeArray.unshift(nextStep);
    snakeArray.pop();
}

gameOver = () => {
    gameStatus = "over";
}

drawBanner = (toWhat) => {
    colorRect(bannerContext, 0, 0, banner.width, banner.height, 'white');
    bannerContext.font = "20px Arial";
    bannerContext.fillStyle = 'black';
    bannerContext.fillText("Press Spacebar to " + toWhat, 50, 25);
    bannerContext.fillText("Apples Eaten: " + eatenApples, 50, 90);
}

drawEverything = () => {
    //canvas
    colorRect(canvasContext, 0, 0, canvas.width, canvas.height, 'black');
    //snake
    snakeArray.forEach((coordinate) =>
        colorRect(snakeContext, coordinate.x, coordinate.y, snakeLength, SNAKE_HEIGHT, 'green'))
    //apple     
    colorCircle(appleContext, appleX + APPLE_RADIUS, appleY + APPLE_RADIUS, APPLE_RADIUS, 'red');
};

//create rectangle
colorRect = (element, distanceX, distanceY, shapeHeight, shapeWidth, color) => {
    element.fillStyle = color;
    element.fillRect(distanceX, distanceY, shapeHeight, shapeWidth);
};

//create circle
colorCircle = (element, distanceX, distanceY, radius, color) => {
    element.fillStyle = color;
    element.beginPath();
    element.arc(distanceX, distanceY, radius, 0, Math.PI * 2, true);
    element.fill();
}

increaseSpeed = () => framePerSecond++;
decreaseSpeed = () => framePerSecond--;

