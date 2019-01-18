import Game from "./Game";
let canvas: HTMLCanvasElement = document.getElementById("myCanvas");

let context = canvas.getContext("2d");
let maxX = 20;
let maxY = 20;
let game = new Game({ context, maxX, maxY });
game.start();
