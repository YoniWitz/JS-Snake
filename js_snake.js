const DEBUG = false;
//banner area
let banner;
let bannerContext;

//game area
let game = {
    HEIGHT: 400,
    WIDTH: 400,
    gameStatus: null
}

let canvas;
let canvasContext;

//snake params
let snakeContext;

let snake = {
    LENGTH: 10,
    HEIGHT: 10,
    INCREMENT: 10,
    array: null,
    direction: null
}

const DIRECTIONS = {
    SOUTH: "SOUTH",
    NORTH: "NORTH",
    WEST: "WEST",
    EAST: "EAST"
}

//apple params
let appleContext;

let apple = {
    RADIUS: snake.HEIGHT / 2, // so the diameter is same as snake
    x: null, //x and y coordinates are from center of circle
    y: null, //this way the circle is fully in the canvas  
    eaten: null
}

//game control
const GAME_STATUSES = {
    START: "START",
    PAUSED: "PAUSED",
    OVER: "OVER",
    PLAYING: "PLAYING"
}

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
    game.gameStatus = GAME_STATUSES.START;

    framePerSecond = 8;
    let oneSecond = 1000;


    setInterval(() => {
        if (game.gameStatus === GAME_STATUSES.START) {
            drawBanner(game.gameStatus);
        }
        else if (game.gameStatus === GAME_STATUSES.OVER) {
            drawBanner("restart");
            bannerContext.fillText("Game Over!!", 50, 300);
        }
        else if (game.gameStatus === GAME_STATUSES.PAUSED) {
            drawBanner("continue");
        }
        else {
            play();
        }
    }, oneSecond / framePerSecond);

    //key listener
    document.addEventListener('keydown', keyPressed);
};

play = () => {
    drawBanner("pause");

    //must return false to break from forEach loop
    if (isSnakeEatingItself() || isSnakeHittingBorder())
        game.gameStatus = GAME_STATUSES.OVER;
    else
        moveSnake();

    isSnakeEatingApple();

    drawCanvas();
    drawSnake();
    drawApple();
}

restartGame = () => {
    snake.array = [
        { x: game.WIDTH / snake.INCREMENT, y: game.HEIGHT / 2 },
        { x: game.WIDTH / snake.INCREMENT - snake.INCREMENT, y: game.HEIGHT / 2 },
        { x: game.WIDTH / snake.INCREMENT - snake.INCREMENT * 2, y: game.HEIGHT / 2 },
        { x: game.WIDTH / snake.INCREMENT - snake.INCREMENT * 3, y: game.HEIGHT / 2 }
    ];
    appleReset();
    apple.eaten = 0;

    snake.direction = DIRECTIONS.EAST;

    drawCanvas();
    drawSnake();
    drawApple();
}

//reset apple position. must be within the canvas and alligned with the snake. watch the radius
appleReset = () => {
    let x = Math.random() * (game.WIDTH - snake.INCREMENT * 2) + snake.INCREMENT;
    apple.x = Math.round(x / snake.INCREMENT) * snake.INCREMENT;

    let y = Math.random() * (game.HEIGHT - snake.INCREMENT * 2) + snake.INCREMENT;
    apple.y = Math.round(y / snake.INCREMENT) * snake.INCREMENT;

    snake.array.some(item => {
        if (item.x === apple.x && item.y === apple.y) {
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
            if (game.gameStatus === GAME_STATUSES.START) {
                game.gameStatus = GAME_STATUSES.PLAYING;
            }
            else if (game.gameStatus === GAME_STATUSES.OVER) {
                game.gameStatus = GAME_STATUSES.PLAYING;
                restartGame();
            }
            else if (game.gameStatus === GAME_STATUSES.PAUSED) {
                game.gameStatus = GAME_STATUSES.PLAYING;
            }
            else if (game.gameStatus === GAME_STATUSES.PLAYING) {
                game.gameStatus = GAME_STATUSES.PAUSED;
            }
            break;
        //right arrow
        case 39:
            if (snake.direction !== DIRECTIONS.WEST && snake.direction !== DIRECTIONS.EAST) {//if was already going right or left, don't change. 
                snake.direction = DIRECTIONS.EAST;
            }
            break;
        //left arrow
        case 37:
            if (snake.direction !== DIRECTIONS.EAST && snake.direction !== DIRECTIONS.WEST) {//if was already going right or left, don't change.
                snake.direction = DIRECTIONS.WEST;
            }
            break;
        //up arrow
        case 38:
            if (snake.direction !== DIRECTIONS.NORTH && snake.direction !== DIRECTIONS.SOUTH) {//if was already going right or left, don't change.
                snake.direction = DIRECTIONS.NORTH;
            }
            break;
        //down arrow
        case 40:
            if (snake.direction !== DIRECTIONS.NORTH && snake.direction !== DIRECTIONS.SOUTH) {//if was already going right or left, don't change.
                snake.direction = DIRECTIONS.SOUTH;
            }
            break;

    };
    document.addEventListener('keydown', keyPressed);
}

//make snake move
moveSnake = () => {
    nextStep = {
        x: snake.array[0].x,
        y: snake.array[0].y
    };

    if (snake.direction === DIRECTIONS.NORTH) {
        nextStep.y -= snake.INCREMENT;
    }
    else if (snake.direction === DIRECTIONS.SOUTH) {
        nextStep.y += snake.INCREMENT;
    }
    else if (snake.direction === DIRECTIONS.EAST) {
        nextStep.x += snake.INCREMENT;
    }
    else if (snake.direction === DIRECTIONS.WEST) {
        nextStep.x -= snake.INCREMENT;
    }

    //creating movement 
    snake.array.unshift(nextStep);
    snake.array.pop();
}

isSnakeEatingItself = () => {
    let flag = false;
    snake.array.forEach((item, index) => {
        if (index !== 0 && item.x === snake.array[0].x && item.y === snake.array[0].y) {
            flag = true;
        }
    })
    return flag;
}

isSnakeHittingBorder = () => {
    //if snake hits boarder
    return (snake.array[0].x > game.WIDTH - snake.INCREMENT || snake.array[0].x < 0 || snake.array[0].y > game.HEIGHT - snake.INCREMENT || snake.array[0].y <   0)
}

isSnakeEatingApple = () => {
    //snake touches apple
    if ((snake.array[0].y === apple.y) && (snake.array[0].x === apple.x)) {
        //update score
        apple.eaten++;
        //place new apple
        appleReset();
        //add link to snake (non proven theory to detect direction of next link)
        newLink = {
            x: 2*snake.array[snake.array.length - 1].x - snake.array[snake.array.length - 2].x,
            y: 2*snake.array[snake.array.length - 1].y - snake.array[snake.array.length - 2].y
        };

        snake.array.push(newLink);
    }
}

drawBanner = (toWhat) => {
    bannerContext.fillStyle = 'white';
    bannerContext.fillRect(0, 0, banner.width, banner.height);
    bannerContext.font = "20px Arial";
    bannerContext.fillStyle = 'black';
    bannerContext.fillText("Instructions: ", 50, 20);
    bannerContext.fillText("1. Use keyboard arrows to navigate.", 50, 60);
    bannerContext.fillText("2. Eat as many apples as you can.", 50, 100);
    bannerContext.fillText("3. Avoid the walls and snake's body.", 50, 140);
    bannerContext.fillText("Press Spacebar to " + toWhat, 50, 250);
    bannerContext.fillText("Apples Eaten: " + apple.eaten, 50, 350);
}

drawCanvas = () => {
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

drawSnake = () => {
    snake.array.forEach((coordinate) => {
        snakeContext.fillStyle = 'green';
        snakeContext.fillRect(coordinate.x, coordinate.y, snake.LENGTH, snake.HEIGHT);
    });
}

drawApple = () => {
    appleContext.fillStyle = 'red';
    appleContext.beginPath();
    appleContext.arc(apple.x + apple.RADIUS, apple.y + apple.RADIUS, apple.RADIUS, 0, Math.PI * 2, true);
    appleContext.fill();
}

