const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const HEIGHT = 20;
const WIDTH = 10;
const TILE_SIZE = 20;
const DEFAULT_SPEED = 1;

canvas.width = WIDTH * TILE_SIZE;
canvas.height = HEIGHT * TILE_SIZE;
canvas.style.backgroundColor = 'black';
 

const bg = createBg();
const piece = createPiece(); 

function createBg() {
    const render = () => {
        ctx.clearRect(0,0, WIDTH * TILE_SIZE, HEIGHT * TILE_SIZE)
    }
    return { render }
}

function createPiece() {
    const pos = {x: WIDTH / 2, y: 0}
    const render = () => {
        ctx.fillStyle = 'red';
        ctx.fillRect(pos.x * TILE_SIZE, pos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
    const update = () => {
        pos.y += 1;
    }
    return { render, update }
}


function updateWorld() {
    piece.update();
}

function renderWorld() {
    bg.render();
    piece.render();
}

let startTime = 0;
let speed = DEFAULT_SPEED;
const loop = (elapsed) => {
    if (elapsed - startTime > 1000 / speed) {
        updateWorld();
        startTime = elapsed; 
    }
    renderWorld();
    requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
