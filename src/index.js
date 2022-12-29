import "./styles.css";

// Constants
const MAX_SCORE = "MAX_SCORE";
const ROD_MOVEMENT_PIXEL = 30;
const BALL_MOVEMENT_PIXEL = 2;

// Elements
const app = document.getElementById("app");
const score = document.getElementById("score");
const ball = document.getElementById("ball");
const topRod = document.getElementById("rod-top");
const bottomRod = document.getElementById("rod-bottom");

// Score
let maxScoreString = localStorage.getItem("MAX_SCORE");
let maxScoreDetails = JSON.parse(maxScoreString);
let maxScore = maxScoreDetails?.score || 0;
let scoreDetails = {
  score: 0,
  playerName: null
};

let ballIntervalId = null;
let directionY = -1; // -1 for up and 1 for downward
let directionX = 1; // -1 for left and 1 for right

score.innerText = `SCORE - ${scoreDetails.score || 0}`;

// Game Details
let isGameStarted = false;

// Utils
const rodWidth = topRod.getBoundingClientRect().width;
const rodHeight = topRod.getBoundingClientRect().height;

// Audio
const bounceAudio = new Audio("assets/score.mp3");
const gameOverAudio = new Audio("assets/gameover.mp3");

// Event Listener
document.addEventListener("keydown", onKeyDown);

function startGame() {
  if (maxScoreDetails === null && maxScore === 0) {
    alert("This is your first time");
  } else {
    alert(`${maxScoreDetails.playerName} has maximum score of ${maxScore}`);
  }

  ball.classList.add("glow");
  isGameStarted = true;
  ballIntervalId = setInterval(moveBall, 12);
}

function moveBall() {
  const ballRect = ball.getBoundingClientRect();
  const ballLeftPosition = ballRect.left;
  const ballTopPosition = ballRect.top;
  const ballHeight = ballRect.height;
  const ballWidth = ballRect.width;

  const maxHeight = app.getBoundingClientRect().height;

  const top = ballTopPosition + BALL_MOVEMENT_PIXEL * directionY;
  const left = ballLeftPosition + BALL_MOVEMENT_PIXEL * directionX;

  ball.style.top = `${top}px`;
  ball.style.left = `${left}px`;
  console.log(ball.style.top, ball.style.left);

  const rodTopRect = topRod.getBoundingClientRect();
  const rodTopX = rodTopRect.x;
  const rodTopY = rodTopRect.y + rodTopRect.height;

  const rodBottomRect = bottomRod.getBoundingClientRect();
  const rodBottomX = rodBottomRect.x;
  const rodBottomY = rodBottomRect.y;

  if (
    top === rodTopY &&
    left >= rodTopX &&
    left <= rodTopX + rodTopRect.width
  ) {
    directionY = -directionY;
    scoreDetails.score = scoreDetails.score + 1;
    bounceAudio.play();
  } else if (
    top === rodBottomY - ballHeight &&
    left + ballWidth >= rodBottomX &&
    left <= rodBottomX + rodTopRect.width
  ) {
    directionY = -directionY;
    scoreDetails.score = scoreDetails.score + 1;
    bounceAudio.play();
  } else if (left >= window.innerWidth - ballWidth || left <= 0) {
    directionX = -directionX;
    bounceAudio.play();
  } else if (top <= 0 || top >= maxHeight - ballHeight) {
    gameOver();
  }
  score.innerText = `SCORE - ${scoreDetails.score || 0}`;
}

function gameOver() {
  isGameStarted = false;
  clearInterval(ballIntervalId);
  if (scoreDetails.score > maxScore) {
    const name = prompt(
      `You have scored max score of ${scoreDetails.score}. Please enter your name.`
    );
    scoreDetails.playerName = name;
    const scoreDetailsString = JSON.stringify(scoreDetails);
    localStorage.setItem(MAX_SCORE, scoreDetailsString);
  } else {
    gameOverAudio.play();
    alert(`Game Over. Your score is ${scoreDetails.score}`);
  }
  resetData();
}

// Reseting the elements to next
function resetData() {
  scoreDetails = {
    score: 0,
    playerName: null
  };

  maxScoreString = localStorage.getItem("MAX_SCORE");
  maxScoreDetails = JSON.parse(maxScoreString);
  maxScore = maxScoreDetails?.score || 0;
  const left = app.getBoundingClientRect().width / 2 - rodWidth / 2;

  const ballRect = ball.getBoundingClientRect();

  let top = topRod.getBoundingClientRect().height;
  let ballLeft = app.getBoundingClientRect().width / 2 - ballRect.width / 2;

  if (directionY === 1) {
    top = app.getBoundingClientRect().height - (rodHeight + ballRect.height);
  }

  ball.classList.remove("glow");

  directionY = -directionY;
  directionX = 1;
  ball.style.top = `${top}px`;
  ball.style.left = `${ballLeft}px`;
  updateRodPostion(left);
}

function onKeyDown(e) {
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
    return;
  }

  if (!isGameStarted && e.key === "Enter") {
    startGame();
    return;
  }

  if (isGameStarted) {
    if (e.key === "a" || e.key === "ArrowLeft") {
      moveRodLeft();
    } else if (e.key === "d" || e.key === "ArrowRight") {
      moveRodRight();
    }
  }
}

function moveRodLeft() {
  const rect = topRod.getBoundingClientRect();
  const newPosition = rect.left - ROD_MOVEMENT_PIXEL;
  const newLeftPositionPX = Math.max(0, newPosition);
  updateRodPostion(newLeftPositionPX);
}

function moveRodRight() {
  const rect = topRod.getBoundingClientRect();
  const newPosition = rect.left + ROD_MOVEMENT_PIXEL;
  const maxLeftPosition = window.innerWidth - rodWidth;
  const newLeftPositionPX = Math.min(newPosition, maxLeftPosition);
  updateRodPostion(newLeftPositionPX);
}

function updateRodPostion(newPosition) {
  const newLeftPostionPX = `${newPosition}px`;
  topRod.style.left = newLeftPostionPX;
  bottomRod.style.left = newLeftPostionPX;
  console.log(newPosition);
}
