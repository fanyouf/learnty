
import Game from "./Game";

let canvas: HTMLCanvasElement = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
console.dir(canvas)
let maxNumberX = 20; // 10个
let maxNumberY = 20; // 10个
let areaWidth = 400;//canvas.width;
let areaHeight = 400;//canvas.height;

let game = new Game({ context, maxNumberX, maxNumberY,areaWidth,areaHeight});

game.start();
