(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BGBlocks = /** @class */ (function () {
    function BGBlocks(_a) {
        var maxX = _a.maxX, maxY = _a.maxY;
        this.matrix = [];
        for (var i = 0; i < maxY; i++) {
            var arr = new Array(maxX).fill(0);
            this.matrix.push(arr);
        }
    }
    BGBlocks.prototype.isCrash = function (block) {
        var _this = this;
        try {
            return !!block.matrix.find(function (item) { return _this.matrix[block.y + item.y + 1][block.x + item.x]; });
        }
        catch (e) {
            return true;
        }
        return true;
    };
    BGBlocks.prototype.isCrashMatrix = function (matrix) {
        var _this = this;
        try {
            return !!matrix.find(function (item) { return _this.matrix[item.y][item.x]; });
        }
        catch (e) {
            return true;
        }
    };
    BGBlocks.prototype.merge = function (block) {
        var _this = this;
        block.matrix.forEach(function (item) {
            _this.matrix[block.y + item.y][block.x + item.x] = 1;
        });
    };
    return BGBlocks;
}());
exports.default = BGBlocks;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = require("./interface");
var MATRIX_ARR = [
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
    [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
    [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 2 }],
    [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }]
];
var BlockL = /** @class */ (function () {
    function BlockL(index) {
        if (index === void 0) { index = Math.floor(Math.random() * 5); }
        this.type = interface_1.BLOCK_TYPE_T.L;
        this.matrix = [];
        this.index = 0;
        this.x = 0;
        this.y = 0;
        this.index = index % 4;
        this.matrix = MATRIX_ARR[this.index];
        console.info("constructor....");
    }
    BlockL.prototype.getMatrix = function (dir) {
        var _this = this;
        if (dir === void 0) { dir = ""; }
        return this.matrix.map(function (item) {
            var o = { x: 0, y: 0 };
            o.x = item.x + _this.x;
            o.y = item.y + _this.y;
            o.x = dir === "left" ? o.x - 1 : o.x;
            o.x = dir === "right" ? o.x + 1 : o.x;
            return o;
        });
    };
    BlockL.prototype.change = function () {
        this.index = (this.index + 1) % 4;
        this.matrix = MATRIX_ARR[this.index];
        return this.getMatrix();
    };
    BlockL.prototype.canMoveLeft = function (bbBlocks) {
        var _this = this;
        // debugger;
        var minx = Math.min.apply(Math, this.matrix.map(function (item) { return _this.x + item.x; }));
        if (minx === 0)
            return false;
        var shadeMatrix = this.getMatrix("left");
        return !bbBlocks.isCrashMatrix(shadeMatrix);
    };
    BlockL.prototype.moveLeft = function () {
        this.x = this.x - 1;
        return this.getMatrix();
    };
    BlockL.prototype.moveRight = function () {
        this.x = this.x + 1;
        return this.getMatrix();
    };
    BlockL.prototype.moveDown = function (maxY) {
        if (this.isGoBottom(maxY))
            return false;
        this.y = this.y + 1;
        return true;
    };
    BlockL.prototype.isGoBottom = function (maxY) {
        var yList = this.matrix.map(function (item) { return item.y; });
        var curY = Math.max.apply(Math, yList);
        console.info(this.y, curY, maxY);
        return this.y + curY >= maxY - 1;
    };
    return BlockL;
}());
exports.default = BlockL;

},{"./interface":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BlockL_1 = require("./BlockL");
var BackGroundBlock_1 = require("./BackGroundBlock");
var Game = (function () {
    var game = null;
    var _Game = /** @class */ (function () {
        function _Game(_a) {
            var context = _a.context, maxX = _a.maxX, maxY = _a.maxY;
            this.frameIndex = 0;
            if (!game) {
                game = this;
            }
            game.addEventListener();
            //   console.info(context);
            game.context = context;
            game.maxX = maxX;
            game.maxY = maxY;
            game.curBlock = new BlockL_1.default();
            game.bgBlocks = new BackGroundBlock_1.default({ maxX: maxX, maxY: maxY });
            return game;
        }
        _Game.prototype.eventKeyUp = function (e) {
            var _this = this;
            console.info(e);
            if (e.keyCode === 38) {
                _this.curBlock.change();
            }
            else if (e.keyCode === 39) {
                _this.curBlock.moveRight();
            }
            else if (e.keyCode === 37) {
                if (_this.curBlock.canMoveLeft(_this.bgBlocks)) {
                    _this.curBlock.moveLeft();
                }
            }
        };
        _Game.prototype.addEventListener = function () {
            document.addEventListener("keyup", this.eventKeyUp.bind(this));
        };
        _Game.prototype.drawCurBlock = function () {
            var ctx = this.context;
            ctx.fillStyle = "green";
            this.curBlock.getMatrix().forEach(function (item) {
                ctx.fillRect(item.x * 10, item.y * 10, 9, 9);
            });
        };
        _Game.prototype.drawBGBlocks = function () {
            var ctx = this.context;
            ctx.fillStyle = "green";
            this.bgBlocks.matrix.forEach(function (row, y) {
                row.forEach(function (val, x) {
                    val && ctx.fillRect(x * 10, y * 10, 9, 9);
                });
            });
        };
        _Game.prototype.start = function () {
            this.frameIndex++;
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            //   console.info(this.frameIndex);
            if (this.frameIndex % Math.ceil(1000 / 50) === 0) {
                if (this.bgBlocks.isCrash(this.curBlock)) {
                    this.bgBlocks.merge(this.curBlock);
                    this.curBlock = new BlockL_1.default();
                }
                else {
                    if (this.curBlock.moveDown(this.maxY)) {
                    }
                    else {
                        this.bgBlocks.merge(this.curBlock);
                        this.curBlock = new BlockL_1.default();
                    }
                }
            }
            this.drawCurBlock();
            this.drawBGBlocks();
            requestAnimationFrame(this.start.bind(this));
        };
        return _Game;
    }());
    return _Game;
})();
exports.default = Game;

},{"./BackGroundBlock":1,"./BlockL":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BLOCK_TYPE_T;
(function (BLOCK_TYPE_T) {
    BLOCK_TYPE_T["L"] = "L";
    BLOCK_TYPE_T["N"] = "N";
    BLOCK_TYPE_T["Z"] = "Z";
    BLOCK_TYPE_T["O"] = "O";
})(BLOCK_TYPE_T || (BLOCK_TYPE_T = {}));
exports.BLOCK_TYPE_T = BLOCK_TYPE_T;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("./Game");
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var maxX = 20;
var maxY = 20;
var game = new Game_1.default({ context: context, maxX: maxX, maxY: maxY });
game.start();

},{"./Game":3}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvQmFja0dyb3VuZEJsb2NrLnRzIiwic3JjL3RzL0Jsb2NrTC50cyIsInNyYy90cy9HYW1lLnRzIiwic3JjL3RzL2ludGVyZmFjZS50cyIsInNyYy90cy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTtJQUVFLGtCQUFZLEVBQWM7WUFBWixjQUFJLEVBQUUsY0FBSTtRQUR4QixXQUFNLEdBQUcsRUFBRSxDQUFDO1FBRVYsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QixJQUFJLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQsMEJBQU8sR0FBUCxVQUFRLEtBQWM7UUFBdEIsaUJBU0M7UUFSQyxJQUFJO1lBQ0YsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ3hCLFVBQUEsSUFBSSxJQUFJLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQW5ELENBQW1ELENBQzVELENBQUM7U0FDSDtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELGdDQUFhLEdBQWIsVUFBYyxNQUFzQjtRQUFwQyxpQkFNQztRQUxDLElBQUk7WUFDRixPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxD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Q0FBQztRQUMvQyxDQUFDO1FBQ0gsWUFBQztJQUFELENBakZBLEFBaUZDLElBQUE7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFTCxrQkFBZSxJQUFJLENBQUM7Ozs7O0FDeEVwQixJQUFLLFlBS0o7QUFMRCxXQUFLLFlBQVk7SUFDZix1QkFBTyxDQUFBO0lBQ1AsdUJBQU8sQ0FBQTtJQUNQLHVCQUFPLENBQUE7SUFDUCx1QkFBTyxDQUFBO0FBQ1QsQ0FBQyxFQUxJLFlBQVksS0FBWixZQUFZLFFBS2hCO0FBRWlCLG9DQUFZOzs7OztBQzFCOUIsK0JBQTBCO0FBQzFCLElBQUksTUFBTSxHQUFzQixRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRXBFLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2QsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2QsSUFBSSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsRUFBRSxPQUFPLFNBQUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxDQUFDLENBQUM7QUFDN0MsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgQmxPQ0tfVCwgUE9JTlRfVCB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xuY2xhc3MgQkdCbG9ja3Mge1xuICBtYXRyaXggPSBbXTtcbiAgY29uc3RydWN0b3IoeyBtYXhYLCBtYXhZIH0pIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1heFk7IGkrKykge1xuICAgICAgbGV0IGFyciA9IG5ldyBBcnJheShtYXhYKS5maWxsKDApO1xuICAgICAgdGhpcy5tYXRyaXgucHVzaChhcnIpO1xuICAgIH1cbiAgfVxuXG4gIGlzQ3Jhc2goYmxvY2s6IEJsT0NLX1QpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICEhYmxvY2subWF0cml4LmZpbmQoXG4gICAgICAgIGl0ZW0gPT4gdGhpcy5tYXRyaXhbYmxvY2sueSArIGl0ZW0ueSArIDFdW2Jsb2NrLnggKyBpdGVtLnhdXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlzQ3Jhc2hNYXRyaXgobWF0cml4OiBBcnJheTxQT0lOVF9UPikge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gISFtYXRyaXguZmluZChpdGVtID0+IHRoaXMubWF0cml4W2l0ZW0ueV1baXRlbS54XSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgbWVyZ2UoYmxvY2s6IEJsT0NLX1QpIHtcbiAgICBibG9jay5tYXRyaXguZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIHRoaXMubWF0cml4W2Jsb2NrLnkgKyBpdGVtLnldW2Jsb2NrLnggKyBpdGVtLnhdID0gMTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCR0Jsb2NrcztcbiIsImltcG9ydCB7IEJMT0NLX1QsIEJsT0NLX1QsIEJMT0NLX1RZUEVfVCwgUE9JTlRfVCB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xuaW1wb3J0IEJhY2tHcm91bmRCbG9ja3MgZnJvbSBcIi4vQmFja0dyb3VuZEJsb2NrXCI7XG5jb25zdCBNQVRSSVhfQVJSID0gW1xuICBbeyB4OiAwLCB5OiAwIH0sIHsgeDogMCwgeTogMSB9LCB7IHg6IDAsIHk6IDIgfSwgeyB4OiAxLCB5OiAyIH1dLFxuICBbeyB4OiAwLCB5OiAxIH0sIHsgeDogMSwgeTogMSB9LCB7IHg6IDIsIHk6IDEgfSwgeyB4OiAyLCB5OiAyIH1dLFxuICBbeyB4OiAyLCB5OiAwIH0sIHsgeDogMiwgeTogMSB9LCB7IHg6IDIsIHk6IDIgfSwgeyB4OiAxLCB5OiAyIH1dLFxuICBbeyB4OiAwLCB5OiAxIH0sIHsgeDogMCwgeTogMiB9LCB7IHg6IDEsIHk6IDIgfSwgeyB4OiAyLCB5OiAyIH1dXG5dO1xuY2xhc3MgQmxvY2tMIGltcGxlbWVudHMgQmxPQ0tfVCB7XG4gIHR5cGUgPSBCTE9DS19UWVBFX1QuTDtcbiAgbWF0cml4OiBBcnJheTxQT0lOVF9UPiA9IFtdO1xuICBpbmRleCA9IDA7XG4gIHggPSAwO1xuICB5ID0gMDtcblxuICBjb25zdHJ1Y3RvcihpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpKSB7XG4gICAgdGhpcy5pbmRleCA9IGluZGV4ICUgNDtcbiAgICB0aGlzLm1hdHJpeCA9IE1BVFJJWF9BUlJbdGhpcy5pbmRleF07XG4gICAgY29uc29sZS5pbmZvKFwiY29uc3RydWN0b3IuLi4uXCIpO1xuICB9XG4gIGdldE1hdHJpeChkaXI6IHN0cmluZyA9IFwiXCIpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRyaXgubWFwKGl0ZW0gPT4ge1xuICAgICAgbGV0IG8gPSB7IHg6IDAsIHk6IDAgfTtcbiAgICAgIG8ueCA9IGl0ZW0ueCArIHRoaXMueDtcbiAgICAgIG8ueSA9IGl0ZW0ueSArIHRoaXMueTtcbiAgICAgIG8ueCA9IGRpciA9PT0gXCJsZWZ0XCIgPyBvLnggLSAxIDogby54O1xuICAgICAgby54ID0gZGlyID09PSBcInJpZ2h0XCIgPyBvLnggKyAxIDogby54O1xuICAgICAgcmV0dXJuIG87XG4gICAgfSk7XG4gIH1cblxuICBjaGFuZ2UoKSB7XG4gICAgdGhpcy5pbmRleCA9ICh0aGlzLmluZGV4ICsgMSkgJSA0O1xuICAgIHRoaXMubWF0cml4ID0gTUFUUklYX0FSUlt0aGlzLmluZGV4XTtcblxuICAgIHJldHVybiB0aGlzLmdldE1hdHJpeCgpO1xuICB9XG5cbiAgY2FuTW92ZUxlZnQoYmJCbG9ja3M6IEJhY2tHcm91bmRCbG9ja3MpIHtcbiAgICAvLyBkZWJ1Z2dlcjtcbiAgICBsZXQgbWlueCA9IE1hdGgubWluKC4uLnRoaXMubWF0cml4Lm1hcChpdGVtID0+IHRoaXMueCArIGl0ZW0ueCkpO1xuICAgIGlmIChtaW54ID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICBsZXQgc2hhZGVNYXRyaXggPSB0aGlzLmdldE1hdHJpeChcImxlZnRcIik7XG4gICAgcmV0dXJuICFiYkJsb2Nrcy5pc0NyYXNoTWF0cml4KHNoYWRlTWF0cml4KTtcbiAgfVxuICBtb3ZlTGVmdCgpIHtcbiAgICB0aGlzLnggPSB0aGlzLnggLSAxO1xuICAgIHJldHVybiB0aGlzLmdldE1hdHJpeCgpO1xuICB9XG5cbiAgbW92ZVJpZ2h0KCkge1xuICAgIHRoaXMueCA9IHRoaXMueCArIDE7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TWF0cml4KCk7XG4gIH1cblxuICBtb3ZlRG93bihtYXhZKSB7XG4gICAgaWYgKHRoaXMuaXNHb0JvdHRvbShtYXhZKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgdGhpcy55ID0gdGhpcy55ICsgMTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlzR29Cb3R0b20obWF4WTogbnVtYmVyKSB7XG4gICAgbGV0IHlMaXN0ID0gdGhpcy5tYXRyaXgubWFwKGl0ZW0gPT4gaXRlbS55KTtcblxuICAgIGxldCBjdXJZID0gTWF0aC5tYXgoLi4ueUxpc3QpO1xuICAgIGNvbnNvbGUuaW5mbyh0aGlzLnksIGN1clksIG1heFkpO1xuICAgIHJldHVybiB0aGlzLnkgKyBjdXJZID49IG1heFkgLSAxO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJsb2NrTDtcbiIsImltcG9ydCBCbG9ja0wgZnJvbSBcIi4vQmxvY2tMXCI7XG5pbXBvcnQgeyBCbE9DS19UIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XG5pbXBvcnQgQkdCbG9ja3MgZnJvbSBcIi4vQmFja0dyb3VuZEJsb2NrXCI7XG5jb25zdCBHYW1lID0gKGZ1bmN0aW9uKCkge1xuICBsZXQgZ2FtZSA9IG51bGw7XG4gIGNsYXNzIF9HYW1lIHtcbiAgICBmcmFtZUluZGV4OiBudW1iZXIgPSAwO1xuICAgIG1heFg6IG51bWJlcjtcbiAgICBtYXhZOiBudW1iZXI7XG4gICAgY29udGV4dDogbnVsbDtcbiAgICBjdXJCbG9jazogQmxPQ0tfVDtcbiAgICBiZ0Jsb2NrczogQkdCbG9ja3M7XG5cbiAgICBjb25zdHJ1Y3Rvcih7IGNvbnRleHQsIG1heFgsIG1heFkgfSkge1xuICAgICAgaWYgKCFnYW1lKSB7XG4gICAgICAgIGdhbWUgPSB0aGlzO1xuICAgICAgfVxuICAgICAgZ2FtZS5hZGRFdmVudExpc3RlbmVyKCk7XG4gICAgICAvLyAgIGNvbnNvbGUuaW5mbyhjb250ZXh0KTtcbiAgICAgIGdhbWUuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICBnYW1lLm1heFggPSBtYXhYO1xuICAgICAgZ2FtZS5tYXhZID0gbWF4WTtcblxuICAgICAgZ2FtZS5jdXJCbG9jayA9IG5ldyBCbG9ja0woKTtcbiAgICAgIGdhbWUuYmdCbG9ja3MgPSBuZXcgQkdCbG9ja3MoeyBtYXhYLCBtYXhZIH0pO1xuXG4gICAgICByZXR1cm4gZ2FtZTtcbiAgICB9XG5cbiAgICBldmVudEtleVVwKGUpIHtcbiAgICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgICBjb25zb2xlLmluZm8oZSk7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAzOCkge1xuICAgICAgICBfdGhpcy5jdXJCbG9jay5jaGFuZ2UoKTtcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSAzOSkge1xuICAgICAgICBfdGhpcy5jdXJCbG9jay5tb3ZlUmlnaHQoKTtcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSAzNykge1xuICAgICAgICBpZiAoX3RoaXMuY3VyQmxvY2suY2FuTW92ZUxlZnQoX3RoaXMuYmdCbG9ja3MpKSB7XG4gICAgICAgICAgX3RoaXMuY3VyQmxvY2subW92ZUxlZnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBhZGRFdmVudExpc3RlbmVyKCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuZXZlbnRLZXlVcC5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgZHJhd0N1ckJsb2NrKCkge1xuICAgICAgbGV0IGN0eCA9IHRoaXMuY29udGV4dDtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBcImdyZWVuXCI7XG4gICAgICB0aGlzLmN1ckJsb2NrLmdldE1hdHJpeCgpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGN0eC5maWxsUmVjdChpdGVtLnggKiAxMCwgaXRlbS55ICogMTAsIDksIDkpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGRyYXdCR0Jsb2NrcygpIHtcbiAgICAgIGxldCBjdHggPSB0aGlzLmNvbnRleHQ7XG4gICAgICBjdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xuICAgICAgdGhpcy5iZ0Jsb2Nrcy5tYXRyaXguZm9yRWFjaCgocm93LCB5KSA9PiB7XG4gICAgICAgIHJvdy5mb3JFYWNoKCh2YWwsIHgpID0+IHtcbiAgICAgICAgICB2YWwgJiYgY3R4LmZpbGxSZWN0KHggKiAxMCwgeSAqIDEwLCA5LCA5KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgc3RhcnQoKSB7XG4gICAgICB0aGlzLmZyYW1lSW5kZXgrKztcbiAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIHRoaXMuY29udGV4dC5jYW52YXMud2lkdGgsXG4gICAgICAgIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0XG4gICAgICApO1xuICAgICAgLy8gICBjb25zb2xlLmluZm8odGhpcy5mcmFtZUluZGV4KTtcbiAgICAgIGlmICh0aGlzLmZyYW1lSW5kZXggJSBNYXRoLmNlaWwoMTAwMCAvIDUwKSA9PT0gMCkge1xuICAgICAgICBpZiAodGhpcy5iZ0Jsb2Nrcy5pc0NyYXNoKHRoaXMuY3VyQmxvY2spKSB7XG4gICAgICAgICAgdGhpcy5iZ0Jsb2Nrcy5tZXJnZSh0aGlzLmN1ckJsb2NrKTtcbiAgICAgICAgICB0aGlzLmN1ckJsb2NrID0gbmV3IEJsb2NrTCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLmN1ckJsb2NrLm1vdmVEb3duKHRoaXMubWF4WSkpIHtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5iZ0Jsb2Nrcy5tZXJnZSh0aGlzLmN1ckJsb2NrKTtcbiAgICAgICAgICAgIHRoaXMuY3VyQmxvY2sgPSBuZXcgQmxvY2tMKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRyYXdDdXJCbG9jaygpO1xuICAgICAgdGhpcy5kcmF3QkdCbG9ja3MoKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnN0YXJ0LmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBfR2FtZTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJpbnRlcmZhY2UgQmxPQ0tfVCB7XG4gIG1vdmVMZWZ0OiAoKSA9PiBBcnJheTxQT0lOVF9UPjtcbiAgY2FuTW92ZUxlZnQ6IChhbnkpID0+IEJvb2xlYW47XG4gIG1vdmVSaWdodDogKCkgPT4gQXJyYXk8UE9JTlRfVD47XG4gIG1vdmVEb3duOiAoTnVtYmVyKSA9PiBCb29sZWFuO1xuICBjaGFuZ2U6ICgpID0+IEFycmF5PFBPSU5UX1Q+O1xuICBpc0dvQm90dG9tOiAoTnVtYmVyKSA9PiBCb29sZWFuO1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbiAgbWF0cml4OiBBcnJheTxQT0lOVF9UPjtcbiAgdHlwZTogQkxPQ0tfVFlQRV9UO1xuICBnZXRNYXRyaXg6IChkaXI/OiBTdHJpbmcpID0+IEFycmF5PFBPSU5UX1Q+O1xufVxuXG5pbnRlcmZhY2UgUE9JTlRfVCB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG5lbnVtIEJMT0NLX1RZUEVfVCB7XG4gIEwgPSBcIkxcIixcbiAgTiA9IFwiTlwiLFxuICBaID0gXCJaXCIsXG4gIE8gPSBcIk9cIlxufVxuXG5leHBvcnQgeyBCbE9DS19ULCBCTE9DS19UWVBFX1QsIFBPSU5UX1QgfTtcbiIsImltcG9ydCBHYW1lIGZyb20gXCIuL0dhbWVcIjtcbmxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUNhbnZhc1wiKTtcblxubGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xubGV0IG1heFggPSAyMDtcbmxldCBtYXhZID0gMjA7XG5sZXQgZ2FtZSA9IG5ldyBHYW1lKHsgY29udGV4dCwgbWF4WCwgbWF4WSB9KTtcbmdhbWUuc3RhcnQoKTtcbiJdfQ==
