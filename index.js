const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const HEIGHT = 20;
const WIDTH = 10;
const TILE_SIZE = 20;

canvas.width = WIDTH * TILE_SIZE;
canvas.height = HEIGHT * TILE_SIZE;
canvas.style.backgroundColor = 'black';

