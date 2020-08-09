const hit = new Audio();
hit.src = "./assets/sound/hit.wav";

const jumb = new Audio();
jumb.src = "./assets/sound/pulo.wav";

const point = new Audio();
point.src = "./assets/sound/ponto.wav";

const sprites = new Image();
sprites.src = "./assets/image/sprites.png";

const gravity = 0.2;

function getCtx() {
    return getCanvas().getContext('2d');
}

function getCanvas() {
    return document.querySelector('canvas');
}

function drawElement(element) {
    const ctx = getCtx();

    ctx.drawImage(
        sprites,
        element.spriteX, element.spriteY, //initial point in Sprite x, y
        element.width, element.height, //lenght in Sprite x, y
        element.initialX, element.initialY, //initial point in canvas x, y
        element.width, element.height, //lenght in canvas x, y
    )

    return ctx;
}

function render() {
    screenActive.draw();
    screenActive.update();
    screenActive.checkCollision();

    requestAnimationFrame(render);
    frames++;
}

function collidedFloor(elementOne, elementTwo) {
    const yOne = elementOne.initialY + elementOne.height;
    return yOne >= elementTwo.initialY;
}

let bird = createBird();
let pipes = createPipes();

let frames = 0;
let score = 0;


function createPipes() {
    return {
        down: {
            spriteX: 0,
            spriteY: 169,
        },
        up: {
            spriteX: 52,
            spriteY: 169,
        },
        width: 52,
        height: 400,
        initialX: 0,
        initialY: 0,
        distance: 100,
        pipes: [],
        draw() {

            this.pipes.forEach(pipe => {

                this.initialX = pipe.x;

                Object.assign(this.up, this);
                this.up.initialY = pipe.y;
                drawElement(this.up);

                Object.assign(this.down, this);
                this.down.initialY = this.up.height + this.up.initialY + this.distance;
                drawElement(this.down);
            });
        },
        update() {
            if (frames % 120 === 0) {
                this.pipes.push({
                    x: getCanvas().width,
                    y: -150 * (Math.random() + 1),
                });
            }

            this.pipes.forEach(pipe => {
                pipe.x = pipe.x - 2;
            });

            if (this.pipes[0] && this.pipes[0].x < (this.width * -1)) {
                this.pipes.shift();
                score++;
                point.play();
            }

        }
    };
}

function createBird() {
    return {
        spriteX: 0,
        spriteY: 0,
        width: 33,
        height: 24,
        initialX: 10,
        initialY: 50,
        velocity: 0,
        velocityJump: 4.6,
        rotate: 20,
        movements: [{
            spriteX: 0,
            spriteY: 0,
        }, {
            spriteX: 0,
            spriteY: 26,
        }, {
            spriteX: 0,
            spriteY: 52,
        }, ],
        movimentCurrent: 0,
        update() {
            this.velocity = this.velocity + gravity;
            this.initialY = bird.initialY + this.velocity;
        },
        draw() {
            drawElement(this);
            this.flay();
        },
        jump() {
            jumb.play();
            this.velocity = -this.velocityJump;
        },
        flay() {
            if (screenActive.animation && frames % 10 === 0) {
                this.movimentCurrent = frames % this.movements.length;
                Object.assign(this, this.movements[this.movimentCurrent]);
            }
        }
    }
};

const floor = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    initialX: 0,
    initialY: getCanvas().height - 112,
    draw() {
        drawElement(this);

        const floorComplement = Object.assign({}, this);
        floorComplement.initialX += floorComplement.width;
        drawElement(floorComplement);

        this.update();
    },
    update() {
        if (screenActive.animation) {
            this.initialX = (this.initialX - 1.5) % 13;
        }
    }
};

const background = {
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204,
    initialX: 0,
    initialY: getCanvas().height - 204 - 112,
    draw() {

        const ctx = getCtx();
        ctx.fillStyle = "#70c5ce";
        ctx.fillRect(0, 0, getCanvas().width, getCanvas().height);

        drawElement(this);

        const background = Object.assign({}, this);
        background.initialX += background.width;
        drawElement(background);
    }
};

const getReady = {
    spriteX: 134,
    spriteY: 0,
    width: 174,
    height: 152,
    initialX: (getCanvas().width / 2) - 174 / 2,
    initialY: 50,
    draw() {
        drawElement(this);
    }
};

const gameOver = {
    spriteX: 134,
    spriteY: 153,
    width: 226,
    height: 201,
    initialX: (getCanvas().width / 2) - 226 / 2,
    initialY: 50,
    draw() {

        drawElement(this);

        const ctx = getCtx();
        ctx.font = "20px Arial";
        ctx.fillStyle = "#dab055";
        ctx.fillText(score, 230, 143);
        ctx.fillText(localStorage.getItem('bestScore'), 230, 183);
    }
};

function collidedPipe() {
    const pipe = pipes.pipes[0];

    if (!pipe) {
        return false;
    }

    const topBird = bird.initialY;
    const rightBird = bird.initialX + bird.width;
    const bottomBird = bird.initialY + bird.height;

    const leftPipe = pipe.x;
    const bottomPipeUp = pipe.y + pipes.height;
    const topPipeDown = pipe.y + pipes.height + pipes.distance;

    return rightBird >= leftPipe && (topBird <= bottomPipeUp || bottomBird >= topPipeDown);

}

//////////////SCREENS

let screenActive = {};

function changeScreen(screen) {
    screenActive = screen;

    if (screenActive.begin) {
        screenActive.begin();
    }
}

const Screens = {
    start: {
        animation: true,
        begin() {
            bird = createBird();
            pipes = createPipes();
            score = 0;
        },
        draw() {
            background.draw();
            getReady.draw();
            floor.draw();
            bird.draw();
        },
        click() {
            changeScreen(Screens.game);
        },
        update() {

        },
        checkCollision() {}
    },
    game: {
        animation: true,
        draw() {
            background.draw();
            pipes.draw();
            floor.draw();
            bird.draw();
        },
        update() {
            bird.update();
            pipes.update();

             const ctx = getCtx();
             ctx.font = "25px Arial";
             ctx.fillStyle = "#f6b733";
             ctx.fillText(score, 300, 25);
           
        },
        click() {
            bird.jump();
        },
        checkCollision() {
            if (collidedFloor(bird, floor) || collidedPipe()) {
                hit.play();
                changeScreen(Screens.gameOver);
            }
        }
    },
    animation: false,
    gameOver: {
        begin() {
            const bestScore = localStorage.getItem('bestScore');
            if (!bestScore || bestScore < score) {
                localStorage.setItem('bestScore', score);
            }
        },
        draw() {
            background.draw();
            pipes.draw();
            floor.draw();
            bird.draw();
            gameOver.draw();
        },
        update() {},
        click() {
            changeScreen(Screens.start);
        },
        checkCollision() {

        }
    }
}

window.addEventListener('click', function () {
    if (screenActive.click) {
        screenActive.click();
    }
});

changeScreen(Screens.start);
render();