"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GAME_STATUS;
(function (GAME_STATUS) {
    GAME_STATUS[GAME_STATUS["RUNNING"] = 0] = "RUNNING";
    GAME_STATUS[GAME_STATUS["PAUSE"] = 1] = "PAUSE";
    GAME_STATUS[GAME_STATUS["OVER"] = 2] = "OVER";
    GAME_STATUS[GAME_STATUS["RESTART"] = 3] = "RESTART";
})(GAME_STATUS || (GAME_STATUS = {}));
var Game = /** @class */ (function () {
    function Game(setting) {
        this.actors = [];
        this.plane = setting.plane;
        this.gameFrequency = setting.gameFrequency;
        this.gameArea = setting.gameArea;
        this.status = GAME_STATUS.RUNNING;
    }
    Game.prototype.pause = function () {
        if (this.status === GAME_STATUS.RUNNING) {
            if (this.timerId) {
                clearInterval(this.timerId);
                this.status = GAME_STATUS.PAUSE;
                this.timerId = null;
            }
        }
        else if (this.status === GAME_STATUS.PAUSE) {
            this.start();
            this.status = GAME_STATUS.RUNNING;
        }
    };
    Game.prototype.init = function (actors) {
        var that = this;
        this.actors = this.actors.concat(actors);
        var gameArea = document.getElementById("gameArea");
        this.actors.forEach(function (item) {
            gameArea.appendChild(item.obj);
        });
        document.body.addEventListener("keydown", function (e) {
            console.info(e.keyCode);
            e.stopPropagation();
            e.preventDefault();
            if (e.keyCode === 38) {
                that.up();
            }
            else if (e.keyCode === 39) {
                that.right();
            }
            else if (e.keyCode === 40) {
                that.down();
            }
            else if (e.keyCode === 37) {
                that.left();
            }
            else if (e.keyCode === 13) {
                that.pause();
            }
        });
    };
    Game.prototype.down = function () {
        this.plane.dy = 1;
    };
    Game.prototype.up = function () {
        this.plane.dy = -1;
    };
    Game.prototype.left = function () {
        this.plane.dx = -1;
    };
    Game.prototype.right = function () {
        this.plane.dx = 1;
    };
    Game.prototype.start = function () {
        var _this = this;
        if (this.timerId) {
            clearInterval(this.timerId);
        }
        this.timerId = setInterval(function () {
            _this.actors.forEach(function (item) {
                item.move();
            });
        }, this.gameFrequency);
    };
    return Game;
}());
exports.default = Game;
