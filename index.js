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

const colors = [
    'red', 
    'orange',
    'yellow', 
    'green', 
    'blue', 
    'indigo', 
    'purple'
];

const shapes = { 
    L: [[1, 0], [1, 0], [1, 1]],
    J: [[0, 1], [0, 1], [1, 1]],
    T: [[1, 0], [1, 1], [1, 0]],
    O: [[1, 1], [1, 1]],
    I: [[1], [1], [1], [1]],
    S: [[0, 1], [1, 1], [1, 0]],
    Z: [[1, 0], [1, 1], [0, 1]]
};

const floor = createFloor();
const bg = createBg();
const piece = createPiece(floor); 

function getRandomNum(num) {
   return Math.floor(Math.random() * num)
}

function createTile({color, isEmpty}) {
    const render = (x, y) => {
        if (isEmpty) {
            ctx.strokeStyle = 'white';
            ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        } else {
            ctx.fillStyle = color; 
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        }
    };

    return { render };
}

function createFloor() {
    let tiles = Array(HEIGHT).fill([]).map(() =>
        Array(WIDTH).fill(createTile({color: 'black', isEmpty: true}))
    )
    const render = () => {
        tiles.forEach((row, rowIdx) => {
            row.forEach((tile, colIdx) => {
                tile.render(colIdx, rowIdx);
            })
        })
    }
    const fillTile = (col, row, color) => {
        tiles[row][col] = createTile({
            isEmpty: false,
            color
        })
    }
    return { render, fillTile };
}

function createBg() {
    const render = () => {
        ctx.clearRect(0,0, WIDTH * TILE_SIZE, HEIGHT * TILE_SIZE)
    }
    return { render }
}

function createPiece(floor) {
    let pos = {x: WIDTH / 2, y: 0}
    let random = getRandomNum(7);
    let color = colors[random]
    let shape = Object.values(shapes)[random];
    
    const reset = () => {
        pos = {x: WIDTH / 2, y: 0}
        random = getRandomNum(7);
        color = colors[random]
        shape = Object.values(shapes)[random];
    }

    const render = () => {
        ctx.fillStyle = color;
        shape.forEach((row, rowIdx) => {
            row.forEach((col, colIdx) => {
                if(col){
                ctx.fillRect((pos.x + colIdx) * TILE_SIZE, (pos.y + rowIdx) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            })
        })
        
    }

    const update = () => {
        if (pos.y + shape.length >= HEIGHT) {
            ctx.fillStyle = color;
            shape.forEach((row, rowIdx) => {
                row.forEach((tile, colIdx) => {
                    if (!tile) return;
                    const xPosPlusOffset = pos.x + colIdx;
                    const yPosPlusOffset = pos.y + rowIdx;
                    floor.fillTile(xPosPlusOffset, yPosPlusOffset, color)
                })
            })


            reset();
            return;
        }
        pos.y += 1;
    }

    const moveLeft = () => {
        if(pos.x <= 0) {
            return;
        }
        pos.x -= 1
    }

    const moveRight = () => {
        if(pos.x + shape[0].length >= WIDTH) {
            return; 
        }
        pos.x += 1
    }

    const moveDown = () => {
        speed = 50; 
    }

    const stopMoveDown = () => {
        speed = DEFAULT_SPEED;
    }

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
    floor.render();
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
}

requestAnimationFrame(loop);
