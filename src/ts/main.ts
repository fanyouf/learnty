import Game from "./Game"
let canvas:HTMLCanvasElement = document.getElementById('myCanvas');

let context = canvas.getContext('2d');
Game.init({context,numberOfFirework:1});
Game.start()