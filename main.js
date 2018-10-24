var ballX = 75;
var ballY = 75;
var ballSpeedX = 5;
var ballSpeedY = 7;

var paddleSpeed = 25;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 4;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
var bricksLeft = 0;

var score = 0;
var lives = 3;

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 40;
var paddleX = 350;

let rightArrowPressed = false;
let leftArrowPressed = false;
let spaceKeyPressed = false;

var canvas, ctx;

// ====================>> MOVE THE PADDLE USING MOUSE

// var mouseX = 0;
// var mouseY = 0;

// function updateMousePos(evt) {
//   var rect = canvas.getBoundingClientRect();
//   var root = document.documentElement;

//   mouseX = evt.clientX - rect.left - root.scrollLeft;
//   mouseY = evt.clientY - rect.top - root.scrollTop;

//   paddleX = mouseX - PADDLE_WIDTH / 2;
// }

// =================================================

// +++++=== MOVE THE PADDLE USING ARROW KEYS
// =================================================

function keyDownHandler(e) {
    if (e.keyCode === 39) {
        rightArrowPressed = true;
    }
    else if (e.keyCode === 37) {
        leftArrowPressed = true;
    }
    else if (e.keyCode === 32) {
        spaceKeyPressed = true;
        ballLaunch()
    }
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



function brickReset() {
    bricksLeft = 0;
    var i;
    for (i = 0; i < 3 * BRICK_COLS; i++) {
        brickGrid[i] = false;
    }
    for (; i < BRICK_COLS * BRICK_ROWS; i++) {
        brickGrid[i] = true;
        bricksLeft++;
    } // end of for each brick
} // end of brickReset func

window.onload = function () {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    var framesPerSecond = 30;
    setInterval(updateAll, 1000 / framesPerSecond);

    //   canvas.addEventListener("mousemove", updateMousePos);

    brickReset();
    ballReset();
};

function updateAll() {
    moveAll();
    drawAll();
}

function ballReset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 1.09;
    ballSpeedX = 0;
    ballSpeedY = 0;
}

// ======= LAUCH THE BALL ON PRESS SpaceKEY

function ballLaunch() {
    if (ballSpeedX === 0 && ballSpeedY === 0) {
        ballSpeedX = -5;
        ballSpeedY = -7;
    }
}

function ballMove() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0 && ballSpeedX < 0.0) {
        //left
        ballSpeedX *= -1;
    }
    if (ballX > canvas.width && ballSpeedX > 0.0) {
        // right
        ballSpeedX *= -1;
    }
    if (ballY < 0 && ballSpeedY < 0.0) {
        // top
        ballSpeedY *= -1;
    }
    if (ballY > canvas.height) {
        // bottom
        ballReset();
        brickReset();
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

    if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS
    ) {
        if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
            brickGrid[brickIndexUnderBall] = false;
            bricksLeft--;
            // console.log(bricksLeft);

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

        var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
        var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
        ballSpeedX = ballDistFromPaddleCenterX * 0.35;

        if (bricksLeft == 0) {
            brickReset();
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

// ======== SCORE ==========

function drawScore() {
    ctx.font = "11px Arial";
    ctx.fillStyle = "#E0E2E4";
    ctx.fillText("Score: " + score, 5, 15);
}

// =========== LIVES ============

function drawLives() {
    ctx.font = "11px Arial";
    ctx.fillStyle = "#E0E2E4";
    ctx.fillText("Lives: " + lives, canvas.width - 43, 15);
}


function drawAll() {
    colorRect(0, 0, canvas.width, canvas.height, "black"); // clear screen

    colorCircle(ballX, ballY, 10, "chartreuse"); // draw ball

    colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, "aquamarine");

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

// THIS GIVES YOU SICK COLORS
// function random_rgba() {
//   var o = Math.round,
//     r = Math.random,
//     s = 255;
//   return (
//     "rgba(" +
//     o(r() * s) +
//     "," +
//     o(r() * s) +
//     "," +
//     o(r() * s) +
//     "," +
//     r().toFixed(1) +
//     ")"
//   );
// }

// var randomColor = random_rgba();

function movingAround() {
    if (rightArrowPressed && paddleX < canvas.width - PADDLE_WIDTH) {
        paddleX += paddleSpeed;
    } else if (leftArrowPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
    if (ballSpeedX === 0 && ballSpeedY === 0) {
        ballX = paddleX + PADDLE_WIDTH/2
    }
}








// var blocks = 10;
// var paddleWidth = 125;
// var paddleHeight = 8;
// var ballSize = 28;
// var speed = 2;

// /*for (i=1;i<=blocks;i++) {
//   $('body').append('<div class="block"></div>');
// }*/

// $('body').append('<div class="ball" style="width:'+ballSize+'px;height:'+ballSize+'px;"></div><div class="paddle" style="width:'+paddleWidth+'px;height:'+paddleHeight+'px;"></div>');

// /* CHANGE HUE */
// setInterval(function() {$('.ball').css('background','hsla('+H+',100%,70%,1)');},40);
// var H = 0;
// setInterval(function() {
//   if(H <= 360) {H++;}
//   else {H = 0;}
// },20);

// /* PADDLE INTERACTION */
// $(document).bind('mouseenter touchstart',function(e) {
//   e.preventDefault();
//   $(this).bind('mousemove touchmove',function(e) {
//     mouseX = e.originalEvent.pageX;
//     $('.paddle').css('left',mouseX-(paddleWidth/2)+'px');
//   });
// });
// $(document).bind('mouseleave touchend',function(e) {
//   $(document).unbind('mousemove touchmove');
// });

// var ballX = 0;
// var ballY = 0;
// var moveX = speed;
// var moveY = speed;

// setInterval(function() {
//   var paddleX = Math.round($('.paddle').position().left);
//   var paddleY = Math.round($('.paddle').position().top);
//   var height = $(document).height();
//   var width = $(document).width();

//   ballX = ballX+(moveX);
//   if (ballX >= width-ballSize) {moveX = -speed;}
//   else if (ballX <= 0) {moveX = +speed;}

//   ballY = ballY+(moveY);
//   if (ballY >= height-ballSize) {moveY = -speed;}
//   else if (ballY <= 0) {moveY = +speed;}

//   if (moveY > 0 && ballY >= paddleY-ballSize && ballY <= paddleY+paddleHeight) {
//     if (ballX >= paddleX-ballSize && ballX <= paddleX+paddleWidth) {
//       moveY = -speed;
//       $('.paddle').addClass('wave').css({
//         'color':'hsla('+H+',100%,70%,1)',
//         'border':'2px solid hsla('+H+',100%,70%,1)'
//       });
//       setTimeout(function() {$('.wave').removeClass('wave');},400);
//     }
//   }

//   $('.ball').css({
//     '-webkit-transform':'translate3D('+ballX+'px,'+ballY+'px,0)',
//     '-moz-transform':'translate3D('+ballX+'px,'+ballY+'px,0)'
//   });   

//   $('.block').each(function(){
//     var blockWidth = $(this).width();
//     var blockHeight = $(this).height();
//     var blockX = Math.round($(this).position().left);
//     var blockY = Math.round($(this).position().top);

//     if (moveY < 0 && ballY >= blockY-ballSize && ballY <= blockY+blockHeight) {
//       if (ballX >= blockX-ballSize && ballX <= blockX+blockWidth) {
//         moveY = +speed;
//         $(this).addClass('wave').css('color','hsla('+H+',100%,70%,1)').delay(400).fadeOut(100);
//       }
//     }
//   });
// },1);

// setInterval(function () {
//   var floatTypes = Array('floatOne','floatTwo','floatThree','floatFour','floatFive');
//   var floatType = floatTypes[Math.floor(Math.random()*floatTypes.length)];
//   $('body').append('<div class="tail" style="width:'+ballSize+'px;height:'+ballSize+'px;left:'+ballX+'px;top:'+ballY+'px;-webkit-animation:'+floatType+' .9s 1;-moz-animation:'+floatType+' .9s 1;box-shadow:inset 0 0 0 2px hsla('+H+',100%,70%,1);background:hsla('+H+',100%,70%,1);"></div>');

//   $('.tail').each(function() {
//     var div = $(this);
//     setTimeout(function() {$(div).remove();},800);
//   });
// },20);