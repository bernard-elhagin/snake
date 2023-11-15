const canvas = document.getElementById("snakeboard");
const context = canvas.getContext("2d");
const scoreField = document.getElementById("score");

document.addEventListener('keydown', changeDirection);

const csize = canvas.width;

const boardColour     = 'black';
const boardBorder     = 'white';
const snakeColour     = 'lightblue';
const snakeBorder     = 'darkblue';
const snakeHead       = 'red';
const foodColour      = 'green';
const obstaclesColour = 'orange';

let dx = 10;
let dy = 0;

let foodx;
let foody;

let score = 0;

let obstacles = [];

let snake = [
   { x: 200, y: 200 },
   { x: 190, y: 200 },
   { x: 180, y: 200 },
   { x: 170, y: 200 },
   { x: 160, y: 200 },
];

generateFood();
mainGameLoop();

function mainGameLoop() {
   if(gameOver()) {
      showGameOverMessage();

      return;
   }

   setTimeout(gameLoop, 100);
}

function gameLoop() {
   drawBoard();
   drawFood();
   drawObstacles();
   moveSnake();
   drawSnake();

   mainGameLoop();
}

function showGameOverMessage() {
   scoreField.style.fontSize = '50px';
   scoreField.innerHTML = "GAME OVER!<p>Final score: " + score;
}

function moveSnake() {
   const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
   snake.unshift(newHead);

   if(newHead.x == foodx && newHead.y == foody) {
      generateFood();
      generateObstacle();

      score += 10;
      scoreField.innerHTML = score;
   }
   else {
      snake.pop();
   }
}

function generateObstacle() {
   const coords = generateCoordinates();

   if(coords.x == foodx && coords.y == foody) {
      coords = generateCoordinates();
   }

   obstacles.push(generateCoordinates());
}

function generateFood() {
   const coords = generateCoordinates();

   foodx = coords.x;
   foody = coords.y;
}

function generateCoordinates() {
   let x = Math.random() * (csize - 10);
   let y = Math.random() * (csize - 10);

   x = Math.round(x / 10) * 10;
   y = Math.round(y / 10) * 10;

   return { x: x, y: y }
}

function gameOver() {
   const x = snake[0].x;
   const y = snake[0].y;

   for(i = 1; i < snake.length; i++) {
      if(snake[i].x == x && snake[i].y == y) {
         return true;
      }
   }

   for(i = 0; i < obstacles.length; i++) {
      if(obstacles[i].x == x && obstacles[i].y == y) {
         return true;
      }
   }

   const hitRightWall  = x > csize - 10;
   const hitLeftWall   = x < 0;
   const hitTopWall    = y < 0;
   const hitBottomWall = y > csize - 10;

   return hitRightWall || hitLeftWall || hitTopWall || hitBottomWall;

}

function changeDirection(event) {

   const keyPressed = event.keyCode;

   const KEY_RIGHT = 39;
   const KEY_LEFT  = 37;
   const KEY_UP    = 38;
   const KEY_DOWN  = 40;

   const notMovingRight = dx != 10;
   const notMovingLeft  = dx != -10;
   const notMovingUp    = dy != -10;
   const notMovingDown  = dy != 10;

   if(keyPressed == KEY_RIGHT && notMovingLeft) {
      dx = 10;
      dy = 0;
   }

   if(keyPressed == KEY_LEFT && notMovingRight) {
      dx = -10;
      dy = 0;
   }

   if(keyPressed == KEY_UP && notMovingDown) {
      dx = 0;
      dy = -10;
   }

   if(keyPressed == KEY_DOWN && notMovingUp) {
      dx = 0;
      dy = 10;
   }

}

function drawSnake() {
   drawSquare(snakeHead, snakeBorder, snake[0].x, snake[0].y, 10);
   for(i = 1; i < snake.length; i++) {
      drawSquare(snakeColour, snakeBorder, snake[i].x, snake[i].y, 10);
   }
}

function drawObstacles() {
   for(i = 0; i < obstacles.length; i++) {
      drawSquare(obstaclesColour, boardBorder, obstacles[i].x, obstacles[i].y, 10);
   }
}

function drawBoard() {
   drawSquare(boardColour, boardBorder, 0, 0, csize);
}

function drawFood() {
   drawSquare(foodColour, boardBorder, foodx, foody, 10);
}

function drawSquare(colour, border, x, y, size) {
   context.fillStyle = colour;
   context.fillRect(x, y, size, size);

   context.strokeStyle = border;
   context.strokeRect(x, y, size, size);
}

