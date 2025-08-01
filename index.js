const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const HEIGHT = 20;
const WIDTH = 10;
const TILE_SIZE = 20;
const DEFAULT_SPEED = 1;

canvas.width = WIDTH * TILE_SIZE;
canvas.height = HEIGHT * TILE_SIZE;
canvas.style.backgroundColor = 'black';
 
let speed = DEFAULT_SPEED;

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

    const moveLeft = () => {
        pos.x -= 1
    };

    const moveRight = () => {
        pos.x += 1
    };

    const moveDown = () => {
        speed = 50; 
    };

    const stopMoveDown = () => {
        speed = DEFAULT_SPEED;
    };

    const moveFns = {moveLeft, moveRight, moveDown, stopMoveDown}
    //TODO: dereg keys
    registerKeys(moveFns);
    return { render, update };
}

function registerKeys(fns) {
    function keyDown(e){
        switch(e.key){
            case 'ArrowLeft':
                fns.moveLeft();
                break;
            case 'ArrowRight':
                fns.moveRight();
                break;
            case 'ArrowDown': 
                fns.moveDown();
                break;    
        }
    }

    function keyUp(e){
        switch(e.key){
            case 'ArrowDown': 
                fns.stopMoveDown();
                break;    
        }
    }

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    //cleanup function
    return () => {
        document.removeEventListener('keydown', keyDown);
        document.removeEventListener('keyup', keyUp);
    };
}


function updateWorld() {
    piece.update();
}

function renderWorld() {
    bg.render();
    piece.render();
}

let startTime = 0;


const loop = (elapsed) => {
    if (elapsed - startTime > 1000 / speed) {
        updateWorld();
        startTime = elapsed; 
    }
    renderWorld();
    requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
