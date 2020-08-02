console.log("[start]");

const sprites = new Image();
sprites.src = "./assets/image/sprites.png";

const gravity = 0.1;

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
    background.draw();
    floor.draw();
    bird.draw();

    requestAnimationFrame(render);
}

const bird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    initialX: 10,
    initialY: 50,
    velocity: 0,
    update() {
        this.velocity = this.velocity + gravity;
        this.initialY = bird.initialY + this.velocity;
    },
    draw() {
        this.update();
        drawElement(this);
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

render();