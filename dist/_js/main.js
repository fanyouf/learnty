"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plane_1 = require("./plane");
var game_1 = require("./game");
var plane = new plane_1.default();
var game = new game_1.default({ plane: plane, gameArea: document.getElementById("HTMLElement"), gameFrequency: 25 });
game.init([plane]);
game.start();
console.info(plane);
