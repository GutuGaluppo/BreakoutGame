var ballX = 75;
var ballY = 75;
var ballSpeedX = 5;
var ballSpeedY = 7;
var paddleSpeed = 25;
const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 4;
const BRICK_COLS = 10;
const BRICK_ROWS = 10;
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
var bricksLeft = 0;
var score = 0;
var lives = 3;
const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 8;
const PADDLE_DIST_FROM_EDGE = 40;
var paddleX = 350;
let musicPlaying = true;
let fxAllowed = true;

let gameInterval;

let winVariable = ""

// SOUND FXs

var backgroundAudio = new Audio("https://github.com/GutuGaluppo/BreakoutGame/blob/master/soundfx1/futuristic-game-ambience.wav");


function ballLost() {
    var ballLostVar = new Audio("../soundfx1/finalgrunt1.wav");
    if (fxAllowed) {
        ballLostVar.play();
        ballLostVar.volume = 0.4;
    } else console.log('blabla')
}

function paddleSound() {
    var paddleSoundVar = new Audio("../soundfx1/grunt_1.wav");
    if (fxAllowed) {
        console.log("paddlesound")
        paddleSoundVar.play();
    } else console.log("false")
    paddleSoundVar.volume = 0.5;
}

function paddleSoundTennis() {
    var paddleSoundTennisVar = new Audio("../soundfx1/tennisBall.wav");
    if (fxAllowed) {
        console.log("paddlesound2")
        paddleSoundTennisVar.play()
    } else console.log("false")
}
function brickSound() {
    var brickSoundVar = new Audio("../soundfx1/bubble.wav");
    if (fxAllowed) {
        brickSoundVar.play();
    } else console.log('something')
}

function brickSoundTennis() {
    var brickSoundTennisVar = new Audio("../soundfx1/tennisball3.wav");
    if (fxAllowed) {
        brickSoundTennisVar.play();
        brickSoundTennisVar.volume = 0.2;
    } else console.log('somthing2')
}

function edgSound() {
    var edgSoundVar = new Audio("../soundfx1/bubble-pop.wav");
    if (fxAllowed) {
        edgSoundVar.play();
        edgSoundVar = 0.4;
    } else console.log('bla')
}

function gameOverTrack() {
    var gameOverTrackVar = new Audio("../soundfx1/gameovertrack1.wav")
    if (fxAllowed) {
        console.log("paddlesound")
        gameOverTrackVar.play();
    } else console.log("false")
    gameOverTrackVar.volume = 0.7;
}

function youWinSound() {
    var youWinSoundVar = new Audio("../soundfx1/youwin.mp3")
    if (fxAllowed) {
        console.log("paddlesound")
        youWinSoundVar.play();
    } else console.log("false")
    youWinSoundVar.volume = 0.7;
}

function crewSound() {
    var crewSoundVar = new Audio("../soundfx1/crew2.wav")
    if (fxAllowed) {
        console.log("paddlesound")
        crewSoundVar.play();
    } else console.log("false")
    crewSoundVar.volume = 0.6;
}

// CHANGE BUTTON
// SETTING MUSIC AND REMOVING/ADDING CLASSES
$("#musicBtn").click(function () {
    if (!musicPlaying) {
        musicPlaying = true;
        backgroundAudio.play();
        backgroundAudio.volume = 0.3;
        backgroundAudio.loop = true;
        $("#musicBtn").attr("class", "active");
    } else {
        backgroundAudio.pause();
        musicPlaying = false;
        $("#musicBtn").attr("class", "button btn1");
    }
});

$("#fxBtn").click(function () {
    if (!fxAllowed) {
        fxAllowed = true;
        $('#fxBtn').attr('class', 'active')
    } else {
        fxAllowed = false;
        $('#fxBtn').attr('class', 'button btn2')
    }
});

var canvas, ctx;

// >>>> MOVE THE PADDLE USING ARROW KEYS

let rightArrowPressed = false;
let leftArrowPressed = false;
let spaceKeyPressed = false;

function keyDownHandler(e) {
    if (e.keyCode === 39) {
        rightArrowPressed = true;
    }
    else if (e.keyCode === 37) {
        leftArrowPressed = true;
    }
    else if (e.keyCode === 32) {
        e.preventDefault()
        spaceKeyPressed = true;
        ballLaunch();
    }
    return false
}
function keyUpHandler(e) {
    if (e.keyCode === 39) {
        rightArrowPressed = false;
    } else if (e.keyCode === 37) {
        leftArrowPressed = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// =================================================

    // BRICKS

    function brickReset() {
        bricksLeft = 0;
        var i;
        for (i = 0; i < 4 * BRICK_COLS; i++) {
            brickGrid[i] = false;
        }
        for (; i < BRICK_COLS * BRICK_ROWS; i++) {
            brickGrid[i] = true;
            bricksLeft++;
        } // end of for each brick
    } // end of brickReset func


    // LOADING WINDOW

    window.onload = function () {
        canvas = document.getElementById("gameCanvas");
        ctx = canvas.getContext("2d");

        var framesPerSecond = 30;
        gameInterval = setInterval(updateAll, 1000 / framesPerSecond);
        brickReset();
        ballReset();
        // fxAllowed.play();
        backgroundAudio.play();
    };
    
    function updateAll() {
        moveAll();
        drawAll();
        colorText(winVariable, canvas.width / 2.2, canvas.height /2, "aqua")
    }
    
    function ballReset() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 1.09;
        ballSpeedX = 0;
        ballSpeedY = 0;
    }
    
    function youWin() {
        if (bricksLeft <= 0) {
            crewSound()
            youWinSound()
            winVariable  = "YOU WON!"
            clearInterval(gameInterval)
            setTimeout(function(){ winVariable= " ";
            }, 3000);
        }
    }


    // LAUCH THE BALL

    function ballLaunch() {
        if (ballSpeedX === 0 && ballSpeedY === 0) {
            ballSpeedX = -5;
            ballSpeedY = -7;
        }
    }

    // BALL MOVEMENT

    function ballMove() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballX < 0 && ballSpeedX < 0.0) {
            //left
            ballSpeedX *= -1;
            edgSound();
        }
        if (ballX > canvas.width && ballSpeedX > 0.0) {
            // right
            ballSpeedX *= -1;
            edgSound();
        }
        if (ballY < 0 && ballSpeedY < 0.0) {
            // top
            ballSpeedY *= -1;
            edgSound();
        }
        if (ballY > canvas.height) {
            lives--
            // bottom
            ballReset();
            ballLost();
            if (lives <= 0) {
                brickReset();
                liveReset()
                scoreReset();
                gameOverTrack();
            }
        }
    }


    function isBrickAtColRow(col, row) {
        if (col >= 0 && col < BRICK_COLS && row >= 0 && row < BRICK_ROWS) {
            var brickIndexUnderCoord = rowColToArrayIndex(col, row);
            return brickGrid[brickIndexUnderCoord];
        } else {
            return false;
        }
    }

    function ballBrickHandling() {
        var ballBrickCol = Math.floor(ballX / BRICK_W);
        var ballBrickRow = Math.floor(ballY / BRICK_H);
        var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

        if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
            if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
                brickGrid[brickIndexUnderBall] = false;
                bricksLeft--;
                // console.log(bricksLeft);
                score++;
                brickSound();
                brickSoundTennis();

                var prevBallX = ballX - ballSpeedX;
                var prevBallY = ballY - ballSpeedY;
                var prevBrickCol = Math.floor(prevBallX / BRICK_W);
                var prevBrickRow = Math.floor(prevBallY / BRICK_H);

                var bothTestsFailed = true;

                if (prevBrickCol != ballBrickCol) {
                    if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
                        ballSpeedX *= -1;
                        bothTestsFailed = false;
                    }
                }
                if (prevBrickRow != ballBrickRow) {
                    if (isBrickAtColRow(ballBrickCol, prevBrickRow) == false) {
                        ballSpeedY *= -1;
                        bothTestsFailed = false;
                    }
                }

                if (bothTestsFailed) {
                    // armpit case, prevents ball from going through
                    ballSpeedX *= -1;
                    ballSpeedY *= -1;
                }
            } // end of brick found
        } // end of valid col and row
    } // end of ballBrickHandling func

    

    function ballPaddleHandling() {
        var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
        var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
        var paddleLeftEdgeX = paddleX;
        var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
        if (
            ballY > paddleTopEdgeY - 8 && // below the top of paddle
            ballY < paddleBottomEdgeY && // above bottom of paddle
            ballX > paddleLeftEdgeX && // right of the left side of paddle
            ballX < paddleRightEdgeX
        ) {
            // left of the left side of paddle

            ballSpeedY *= -1;
            paddleSoundTennis();
            paddleSound();

            var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
            var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
            ballSpeedX = ballDistFromPaddleCenterX * 0.38;

            if (bricksLeft == 0) {
                crewSound()
                youWinSound()
                youWin()
                brickReset();

                // win();
            } // out of bricks
        } // ball center inside paddle
    } // end of ballPaddleHandling

    function moveAll() {
        ballMove();
        ballBrickHandling();
        ballPaddleHandling();
        movingAround();
    }

    function rowColToArrayIndex(col, row) {
        return col + BRICK_COLS * row;
    }

    // DRAWING BRICKS

    function drawBricks() {
        for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
            for (var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
                var arrayIndex = rowColToArrayIndex(eachCol, eachRow);

                if (brickGrid[arrayIndex]) {
                    colorRect(
                        BRICK_W * eachCol,
                        BRICK_H * eachRow,
                        BRICK_W - BRICK_GAP,
                        BRICK_H - BRICK_GAP,
                        "aqua"
                    );
                } // end of is this brick here
            } // end of for each brick
        } // end of for each row
    } // end of drawBricks func


    // =================================================

    // ======== SCORE ==========


    function drawScore() {
        ctx.font = "bold 20px Oswald";
        ctx.fillStyle = "aqua";
        ctx.fillText("Score: " + score, 10, 30);
    }
    function scoreReset() {
        score = 0;
    }

    // =========== LIVES ============

    function drawLives() {
        ctx.font = "bold 20px Oswald";
        ctx.fillStyle = "aqua";
        ctx.fillText("Lives: " + lives, canvas.width - 80, 40);
    }

    function liveReset() {
        lives = 3;
    }



    function drawAll() {
        ctx.clearRect(0,0,canvas.width,canvas.height); // clear the canvas each movement

        colorCircle(ballX, ballY, 10, "chartreuse"); // draw ball

        colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, "aqua");

        drawScore();
        drawLives();
        drawBricks();
    }

    function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
    }

    function colorCircle(centerX, centerY, radius, fillColor) {
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0, Math.PI * 2, true);
        ctx.fill();
    }

    function colorText(showWords, textX, textY, fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fillText(showWords, textX, textY);
    }

    

    function movingAround() {
        if (rightArrowPressed && paddleX < canvas.width - PADDLE_WIDTH) {
            paddleX += paddleSpeed;
        } else if (leftArrowPressed && paddleX > 0) {
            paddleX -= paddleSpeed;
        }
        if (ballSpeedX === 0 && ballSpeedY === 0) { // PLACING THE BALL CENTRILYZED ON THE PADDLE
            ballX = paddleX + PADDLE_WIDTH / 2
        }
    }