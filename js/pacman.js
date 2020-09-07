let PACMAN_DIRECTION = 1;
let PACMAN_DIRECTION_TRY = -1;
let PACMAN_DIRECTION_TRY_TIMER = -1;
let PACMAN_DIRECTION_TRY_CANCEL = 1000;
let PACMAN_POSITION_X = 276;
let PACMAN_POSITION_Y = 416;
let PACMAN_POSITION_STEP = 2;
let PACMAN_MOUTH_STATE = 3;
let PACMAN_MOUTH_STATE_MAX = 6;
let PACMAN_SIZE = 16;
let PACMAN_MOVING = false;
let PACMAN_MOVING_TIMER = -1;
let PACMAN_MOVING_SPEED = 25;
let PACMAN_CANVAS_CONTEXT = null;
let PACMAN_EAT_GAP = 10;

function initPacman() {
    let canvas = document.getElementById('canvas-pacman');
    canvas.setAttribute('width', '550');
    canvas.setAttribute('height', '550');
    if (canvas.getContext) {
        PACMAN_CANVAS_CONTEXT = canvas.getContext('2d');
    }
}

function getPacmanCanvasContext() {
    return PACMAN_CANVAS_CONTEXT;
}

function stopPacman() {
    if (PACMAN_MOVING_TIMER != -1) {
        console.log("MOVE PACMAN > STOP : " + PACMAN_MOVING_TIMER);
        clearInterval(PACMAN_MOVING_TIMER);
        PACMAN_MOVING_TIMER = -1;
        PACMAN_MOVING = false;
    }
}

function tryMovePacmanCancel() {
    if (PACMAN_DIRECTION_TRY_TIMER != -1) {
        console.log("TRY MOVE PACMAN > CANCEL : " + PACMAN_DIRECTION_TRY_TIMER);
        clearTimeout(PACMAN_DIRECTION_TRY_TIMER);
        PACMAN_DIRECTION_TRY = -1;
        PACMAN_DIRECTION_TRY_TIMER = -1;
    }
}

function tryMovePacman(direction) {
    PACMAN_DIRECTION_TRY = direction;
    PACMAN_DIRECTION_TRY_TIMER = setTimeout('tryMovePacmanCancel()', PACMAN_DIRECTION_TRY_CANCEL);
    console.log("TRY MOVE PACMAN > NEW : " + PACMAN_DIRECTION_TRY_TIMER);
}

function movePacman(direction) {

    if (PACMAN_MOVING === false) {
        PACMAN_MOVING = true;
        PACMAN_MOVING_TIMER = setInterval('movePacman()', PACMAN_MOVING_SPEED);
        console.log("MOVE PACMAN > NEW : " + PACMAN_MOVING_TIMER);
    }

    let directionTry = direction;

    if (!directionTry && PACMAN_DIRECTION_TRY != -1) {
        directionTry = PACMAN_DIRECTION_TRY;
    }

    if ((!directionTry || PACMAN_DIRECTION !== directionTry)) {

        if (directionTry) {
            if (canMovePacman(directionTry)) {
                PACMAN_DIRECTION = directionTry;
                tryMovePacmanCancel();
            } else {
                if (directionTry !== PACMAN_DIRECTION_TRY) {
                    tryMovePacmanCancel();
                }
                if (PACMAN_DIRECTION_TRY === -1) {
                    tryMovePacman(directionTry);
                }
            }
        }

        if (canMovePacman(PACMAN_DIRECTION)) {
            erasePacman();

            if (PACMAN_MOUTH_STATE < PACMAN_MOUTH_STATE_MAX) {
                PACMAN_MOUTH_STATE++;
            } else {
                PACMAN_MOUTH_STATE = 0;
            }

            if (PACMAN_DIRECTION === 1) {
                PACMAN_POSITION_X += PACMAN_POSITION_STEP;
            } else if (PACMAN_DIRECTION === 2) {
                PACMAN_POSITION_Y += PACMAN_POSITION_STEP;
            } else if (PACMAN_DIRECTION === 3) {
                PACMAN_POSITION_X -= PACMAN_POSITION_STEP;
            } else if (PACMAN_DIRECTION === 4) {
                PACMAN_POSITION_Y -= PACMAN_POSITION_STEP;
            }

            if (PACMAN_POSITION_X === 2 && PACMAN_POSITION_Y === 258) {
                PACMAN_POSITION_X = 548;
                PACMAN_POSITION_Y = 258;
            } else if (PACMAN_POSITION_X === 548 && PACMAN_POSITION_Y === 258) {
                PACMAN_POSITION_X = 2;
                PACMAN_POSITION_Y = 258;
            }

            drawPacman();

            testBubblesPacman();
        } else {
            stopPacman();
        }
    } else if (direction && PACMAN_DIRECTION === direction) {
        tryMovePacmanCancel();
    }
}

function canMovePacman(direction) {

    let positionX = PACMAN_POSITION_X;
    let positionY = PACMAN_POSITION_Y;

    if (direction === 1) {
        positionX += PACMAN_POSITION_STEP;
    } else if (direction === 2) {
        positionY += PACMAN_POSITION_STEP;
    } else if (direction === 3) {
        positionX -= PACMAN_POSITION_STEP;
    } else if (direction === 4) {
        positionY -= PACMAN_POSITION_STEP;
    }

    for (let i = 0, imax = PATHS.length; i < imax; i++) {

        let p = PATHS[i];

        let startX = p.split("-")[0].split(",")[0];
        let startY = p.split("-")[0].split(",")[1];
        let endX = p.split("-")[1].split(",")[0];
        let endY = p.split("-")[1].split(",")[1];

        if (positionX >= startX && positionX <= endX && positionY >= startY && positionY <= endY) {
            return true;
        }
    }

    return false;
}

function drawPacman() {

    let ctx = getPacmanCanvasContext();

    ctx.fillStyle = "#fff200";
    ctx.beginPath();

    let startAngle = 0;
    let endAngle = 2 * Math.PI;
    let lineToX = PACMAN_POSITION_X;
    let lineToY = PACMAN_POSITION_Y;
    if (PACMAN_DIRECTION === 1) {
        startAngle = (0.35 - (PACMAN_MOUTH_STATE * 0.05)) * Math.PI;
        endAngle = (1.65 + (PACMAN_MOUTH_STATE * 0.05)) * Math.PI;
        lineToX -= 8;
    } else if (PACMAN_DIRECTION === 2) {
        startAngle = (0.85 - (PACMAN_MOUTH_STATE * 0.05)) * Math.PI;
        endAngle = (0.15 + (PACMAN_MOUTH_STATE * 0.05)) * Math.PI;
        lineToY -= 8;
    } else if (PACMAN_DIRECTION === 3) {
        startAngle = (1.35 - (PACMAN_MOUTH_STATE * 0.05)) * Math.PI;
        endAngle = (0.65 + (PACMAN_MOUTH_STATE * 0.05)) * Math.PI;
        lineToX += 8;
    } else if (PACMAN_DIRECTION === 4) {
        startAngle = (1.85 - (PACMAN_MOUTH_STATE * 0.05)) * Math.PI;
        endAngle = (1.15 + (PACMAN_MOUTH_STATE * 0.05)) * Math.PI;
        lineToY += 8;
    }
    ctx.arc(PACMAN_POSITION_X, PACMAN_POSITION_Y, PACMAN_SIZE, startAngle, endAngle, false);
    ctx.lineTo(lineToX, lineToY);
    ctx.fill();
    ctx.closePath();
}

function erasePacman() {

    let ctx = getPacmanCanvasContext();

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();
    ctx.arc(PACMAN_POSITION_X, PACMAN_POSITION_Y, PACMAN_SIZE + 1, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();

    ctx.restore();
}

function testBubblesPacman() {

    for (let i = 0, imax = BUBBLES.length; i < imax; i++) {
        let b = BUBBLES[i];

        let line = b.split(";")[0];
        let bubble = b.split(";")[1];
        let positionX = parseInt(b.split(";")[2].split(",")[0]);
        let positionY = parseInt(b.split(";")[2].split(",")[1]);
        let eat = b.split(";")[3];

        //console.log("PACMAN EAT BUBBLE > TEST : " + positionX + "," + positionY + " / " + PACMAN_POSITION_X + "," + PACMAN_POSITION_Y);

        if (eat === "1") {
            if (positionX <= PACMAN_POSITION_X + PACMAN_EAT_GAP && positionX >= PACMAN_POSITION_X - PACMAN_EAT_GAP && positionY <= PACMAN_POSITION_Y + PACMAN_EAT_GAP && positionY >= PACMAN_POSITION_Y - PACMAN_EAT_GAP) {
                eraseBubble(positionX, positionY);
                //console.log("PACMAN EAT BUBBLE : " + line + ";" + bubble);
            }
        }
    }
}
