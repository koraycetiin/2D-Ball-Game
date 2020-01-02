const ball = document.querySelector('.ball');
const ground = document.querySelector('.ground');
const stick = document.querySelector('.stick');
const t = 1.5;
const airForceCoefficient = 0.000002;
let xpos = 100;
let ypos = 300;
drawBall();
let a = 15.81;
let ballWidth = ball.getBoundingClientRect().width;
let vx = 100.0;
let vy = 0.0;
let vstick = 0.0;
const screenWidth = document.body.clientWidth;
let safeVerticalCollision = true;
let safeHorizontalBallCollision = true;
let safeHorizontalStickCollision = true;
let safeStickBallCollision = true;
dragElement();

function dragElement() {
    ball.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        if(e.clientX < xpos + ballWidth / 2 && e.clientX > 0 &&
            e.clientY > 0 && e.clientY < ground.getBoundingClientRect().top){
            ball.style.top = e.clientY - ballWidth / 2+ "px";
            ball.style.left = e.clientX - ballWidth / 2+ "px";
        }
    }

    function closeDragElement(e) {
        vx = (xpos - e.clientX) * 1.5;
        vy = (ypos - e.clientY) * 1.5;
        ypos = e.clientY - ballWidth / 2;
        xpos = e.clientX - ballWidth / 2;
        move();
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

airForceUpdate = (vx, vy, size, t) => {
    vx -= size * t * vx * airForceCoefficient;
    vy -= size * t * vy * airForceCoefficient;
    return [parseFloat(vx), parseFloat(vy)];
};

function drawBall () {
    ball.style.left = `${xpos}px`;
    ball.style.top = `${ypos}px`;
}

function move () {
    setInterval(() => {
        console.log(vx, vy);
        const stickCollision = collision();
        [vx, vy] = airForceUpdate(vx, vy, ballWidth, t);
        if ((ball.getBoundingClientRect().bottom >= ground.getBoundingClientRect().top ||
            ball.getBoundingClientRect().top <= 0) && safeVerticalCollision) {
            vy = parseFloat(-0.80 * vy);
            safeVerticalCollision = !safeVerticalCollision;
        } else {
            vy = vy + parseFloat(a * t / 100.0);
            safeVerticalCollision = true;
        }
        if (safeHorizontalBallCollision && (screenWidth <= ball.getBoundingClientRect().right ||
            0 >= xpos || ( safeStickBallCollision && stickCollision))) {
            if(stickCollision){
                vstick = vx + vstick;
                vx = vstick + vx;
                safeStickBallCollision = false;
            } else {
                safeStickBallCollision = true;
            }
            vx = parseFloat(-0.80 * vx);
            safeHorizontalBallCollision = false;
        } else {
            safeHorizontalBallCollision = true;
            safeStickBallCollision = true;
        }
        if ((stick.getBoundingClientRect().left <= 0 || stick.getBoundingClientRect().right >= screenWidth) &&
            safeHorizontalStickCollision) {
            vstick = -0.8 * vstick;
            safeHorizontalStickCollision = false;
        } else {
            safeHorizontalStickCollision = true;
        }
        ypos += vy * t / 50;
        xpos += vx * t / 50;
        stick.style.left = stick.getBoundingClientRect().left + vstick * t / 50 + 'px';
        drawBall();
    }, t);
}

collision = () => {
    return ball.getBoundingClientRect().right <= stick.getBoundingClientRect().right &&
        ball.getBoundingClientRect().right >= stick.getBoundingClientRect().left &&
        ball.getBoundingClientRect().bottom >= stick.getBoundingClientRect().top
};