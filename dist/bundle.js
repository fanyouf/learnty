(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventCenter_1 = require("./EventCenter");
var BGBlocks = /** @class */ (function () {
    function BGBlocks(_a) {
        var maxNumberX = _a.maxNumberX, maxNumberY = _a.maxNumberY, unitBlockw = _a.unitBlockw, unitBlockh = _a.unitBlockh;
        this.matrix = [];
        this.maxNumberX = 0;
        this.maxNumberY = 0;
        this.unitBlockw = 10;
        this.unitBlockh = 10;
        this.maxNumberX = maxNumberX;
        this.maxNumberY = maxNumberY;
        this.unitBlockw = unitBlockw;
        this.unitBlockh = unitBlockh;
        for (var i = 0; i < maxNumberY; i++) {
            var arr = new Array(maxNumberX).fill(0);
            this.matrix.push(arr);
        }
        EventCenter_1.default.addEventListener("moveRight", this.moveRight.bind(this));
        EventCenter_1.default.addEventListener("moveLeft", this.moveLeft.bind(this));
        EventCenter_1.default.addEventListener("moveChange", this.moveChange.bind(this));
    }
    BGBlocks.prototype.draw = function (ctx) {
        var _this = this;
        ctx.fillStyle = "green";
        this.matrix.forEach(function (row, y) {
            row.forEach(function (val, x) {
                if (val) {
                    ctx.fillRect(x * _this.unitBlockh, y * _this.unitBlockh, _this.unitBlockh - 1, _this.unitBlockh - 1);
                }
                else {
                    ctx.strokeStyle = "green";
                    ctx.strokeRect(x * _this.unitBlockh, y * _this.unitBlockh, _this.unitBlockh, _this.unitBlockh);
                }
            });
        });
    };
    BGBlocks.prototype.canMoveLeft = function (block) {
        var minx = Math.min.apply(Math, block.pointList.map(function (item) { return block.x + item.x; }));
        if (minx === 0)
            return false;
        var shadeMatrix = block.getMatrix("left");
        return !this.isCrashMatrix(shadeMatrix);
    };
    BGBlocks.prototype.canMoveRight = function (block) {
        var stageMaxX = this.matrix[0].length;
        var maxX = Math.max.apply(Math, block.pointList.map(function (item) { return block.x + item.x; }));
        if (maxX === stageMaxX - 1)
            return false;
        var shadeMatrix = block.getMatrix("right");
        return !this.isCrashMatrix(shadeMatrix);
    };
    BGBlocks.prototype.canMoveDown = function (block) {
        var stageMaxY = this.matrix.length;
        var maxY = Math.max.apply(Math, block.pointList.map(function (item) { return block.y + item.y; }));
        if (maxY === stageMaxY - 1)
            return false;
        var shadeMatrix = block.getMatrix("down");
        return !this.isCrashMatrix(shadeMatrix);
    };
    BGBlocks.prototype.moveLeft = function (block) {
        if (this.canMoveLeft(block)) {
            block.x = block.x - 1;
            return true;
        }
        return false;
    };
    BGBlocks.prototype.moveRight = function (block) {
        if (this.canMoveRight(block)) {
            block.x = block.x + 1;
            return true;
        }
        return false;
    };
    BGBlocks.prototype.moveDown = function (block) {
        if (this.canMoveDown(block)) {
            block.y = block.y + 1;
        }
        else {
            console.info("merge,and fire Event_merge...");
            this.merge(block);
            EventCenter_1.default.fire("event_merge");
            if (this.isGameover()) {
                console.info();
            }
        }
    };
    BGBlocks.prototype.moveChange = function (block) {
        block.index = (block.index + 1) % block.block_shape_point_list.length;
        block.pointList = block.block_shape_point_list[block.index];
        return true;
    };
    BGBlocks.prototype.canMoveChange = function () {
        return true;
    };
    BGBlocks.prototype.isGameover = function () {
        var rs = this.matrix[0].find(function (item) { return item > 0; });
        if (rs) {
            EventCenter_1.default.fire("gameover");
        }
        return true;
    };
    BGBlocks.prototype.isCrash = function (block) {
        var _this = this;
        try {
            return !!block.pointList.find(function (item) { return _this.matrix[block.y + item.y + 1][block.x + item.x]; });
        }
        catch (e) {
            return true;
        }
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
        block.pointList.forEach(function (item) {
            _this.matrix[block.y + item.y][block.x + item.x] = 1;
        });
        this.clearSomeRow();
    };
    BGBlocks.prototype.clearSomeRow = function () {
        var _this = this;
        var arr = this.matrix.map(function (row) {
            return row.reduce(function (init, current) { return init + current; }, 0);
        });
        var rowIndexs = [];
        arr.forEach(function (sumVal, index) {
            if (sumVal === _this.maxNumberX) {
                rowIndexs.push(index);
            }
        });
        if (rowIndexs.length === 0)
            return false;
        if (rowIndexs.length === 1) {
            EventCenter_1.default.fire("addScore", 100);
        }
        else if (rowIndexs.length === 2) {
            EventCenter_1.default.fire("addScore", 250);
        }
        else if (rowIndexs.length === 3) {
            EventCenter_1.default.fire("addScore", 400);
        }
        rowIndexs.forEach(function (valIndex) {
            _this.matrix.splice(valIndex, 1);
            _this.matrix.unshift(new Array(_this.maxNumberX).fill(0));
        });
        EventCenter_1.default.fire("getScore");
        return true;
    };
    return BGBlocks;
}());
exports.default = BGBlocks;

},{"./EventCenter":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blockConfig_1 = require("./blockConfig");
var EventCenter_1 = require("./EventCenter");
var Block = /** @class */ (function () {
    function Block(_a) {
        var unitBlockw = _a.unitBlockw, unitBlockh = _a.unitBlockh;
        this.pointList = [];
        this.index = 0;
        this.unitBlockh = 10;
        this.unitBlockw = 10;
        this.x = 0;
        this.y = 0;
        this.block_shape_point_list = [];
        this.unitBlockw = unitBlockw;
        this.unitBlockh = unitBlockh;
        var index = Math.floor(Math.random() * 5);
        var initx = 0;
        this.x = initx;
        this.block_shape_point_list = blockConfig_1.getBlockShape();
        this.index = index % this.block_shape_point_list.length;
        this.pointList = this.block_shape_point_list[this.index];
        EventCenter_1.default.addEventListener("changeShape", this.handleChangeShape.bind(this));
    }
    Block.prototype.handleChangeShape = function (_a) {
        var index = _a.index, block_shape_point_list = _a.block_shape_point_list;
        this.x = 0;
        this.y = 0;
        this.index = index;
        this.block_shape_point_list = block_shape_point_list;
        this.pointList = this.block_shape_point_list[this.index];
    };
    Block.prototype.reset = function () {
        this.x = 3;
        this.y = 0;
    };
    Block.prototype.getMatrix = function (dir) {
        var _this = this;
        if (dir === void 0) { dir = ""; }
        return this.pointList.map(function (item) {
            var o = { x: 0, y: 0 };
            o.x = item.x + _this.x;
            o.y = item.y + _this.y;
            o.x = dir === "left" ? o.x - 1 : o.x;
            o.x = dir === "right" ? o.x + 1 : o.x;
            o.y = dir === "down" ? o.y + 1 : o.y;
            return o;
        });
    };
    Block.prototype.draw = function (ctx) {
        var _this = this;
        ctx.fillStyle = "green";
        this.getMatrix().forEach(function (item) {
            ctx.fillRect(item.x * _this.unitBlockw, item.y * _this.unitBlockw, _this.unitBlockw - 1, _this.unitBlockw - 1);
        });
    };
    return Block;
}());
exports.default = Block;

},{"./EventCenter":3,"./blockConfig":7}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventCenter = function () {
    var EVENT_BUS = null;
    var _EventCenter = /** @class */ (function () {
        function _EventCenter() {
            if (!EVENT_BUS) {
                EVENT_BUS = this;
            }
            EVENT_BUS.listenerList = {};
        }
        _EventCenter.prototype.addEventListener = function (eventName, callBack) {
            if (!this.listenerList[eventName]) {
                this.listenerList[eventName] = [];
            }
            this.listenerList[eventName].push(callBack);
        };
        _EventCenter.prototype.removeEventListener = function (eventName, callBack) {
            var arr = this.listenerList[eventName];
            var index = arr.findIndex(function (item) { return item === callBack; });
            arr.splice(index, 1);
        };
        _EventCenter.prototype.fire = function (eventName, param) {
            this.listenerList[eventName] && this.listenerList[eventName].forEach(function (func) {
                func(param);
            });
        };
        return _EventCenter;
    }());
    return _EventCenter;
}();
var EVENT_BUS = new EventCenter();
exports.default = EVENT_BUS;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Block_1 = require("./Block");
var BackGroundBlock_1 = require("./BackGroundBlock");
var NextBlock_1 = require("./NextBlock");
var EventCenter_1 = require("./EventCenter");
var Score_1 = require("./Score");
var Game = (function () {
    var game = null;
    var _Game = /** @class */ (function () {
        function _Game(_a) {
            var context = _a.context, maxNumberX = _a.maxNumberX, maxNumberY = _a.maxNumberY, areaWidth = _a.areaWidth, areaHeight = _a.areaHeight;
            this.frameIndex = 0;
            this.status = "normal";
            if (!game) {
                game = this;
            }
            document.addEventListener("keyup", this.eventKeyUp.bind(this));
            game.context = context;
            game.maxNumberX = maxNumberX;
            game.maxNumberY = maxNumberY;
            game.areaWidth = areaWidth;
            game.areaHeight = areaHeight;
            game.unitBlockh = areaHeight / maxNumberY;
            game.unitBlockw = areaWidth / maxNumberX;
            game.nexBlock = new NextBlock_1.default({
                unitBlockw: game.unitBlockw,
                unitBlockh: game.unitBlockh
            });
            game.curBlock = new Block_1.default({
                unitBlockw: game.unitBlockw,
                unitBlockh: game.unitBlockh
            });
            game.bgBlocks = new BackGroundBlock_1.default({
                maxNumberX: maxNumberX,
                maxNumberY: maxNumberY,
                unitBlockw: game.unitBlockw,
                unitBlockh: game.unitBlockh
            });
            game.score = new Score_1.default();
            EventCenter_1.default.addEventListener("gameover", game.gameover.bind(game));
            return game;
        }
        _Game.prototype.eventKeyUp = function (e) {
            if (e.keyCode === 38) {
                EventCenter_1.default.fire("moveChange", this.curBlock);
                // _this.curBlock.moveChange(_this.bgBlocks);
            }
            else if (e.keyCode === 39) {
                EventCenter_1.default.fire("moveRight", this.curBlock);
                //  _this.curBlock.moveRight(_this.bgBlocks);
            }
            else if (e.keyCode === 37) {
                EventCenter_1.default.fire("moveLeft", this.curBlock);
                // _this.curBlock.moveLeft(_this.bgBlocks);
            }
            else if (e.keyCode === 13) {
                EventCenter_1.default.fire("reStart");
            }
        };
        _Game.prototype.reStart = function () {
            if (this.status === "gameover") {
                this.status = "normal";
                // this.curBlock = new Block()
                // this.bgBlocks = new BGBlocks({ maxNumberX:this.maxNumberX,maxNumberY:this.maxNumberY})
                this.start();
            }
        };
        _Game.prototype.drawScore = function () {
            var cxt = this.context;
            cxt.strokeStyle = "#fff";
            cxt.font = "bold 30px consolas";
            cxt.fillText("分数:" + this.score.mark.toString(), 450, 100);
        };
        _Game.prototype.start = function () {
            this.frameIndex++;
            var cxt = this.context;
            cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);
            //   console.info(this.frameIndex);
            if (this.frameIndex % Math.ceil(1000 / 50) === 0) {
                this.bgBlocks.moveDown(this.curBlock);
            }
            this.curBlock.draw(this.context);
            this.nexBlock.draw(this.context);
            this.bgBlocks.draw(this.context);
            this.drawScore();
            if (this.status === "normal")
                this.timerId = requestAnimationFrame(this.start.bind(this));
            //   console.info(this.timerId)
        };
        _Game.prototype.gameover = function () {
            this.status = "gameover";
        };
        return _Game;
    }());
    return _Game;
})();
exports.default = Game;

},{"./BackGroundBlock":1,"./Block":2,"./EventCenter":3,"./NextBlock":5,"./Score":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventCenter_1 = require("./EventCenter");
var blockConfig_1 = require("./blockConfig");
var NextBlock = /** @class */ (function () {
    function NextBlock(_a) {
        var unitBlockw = _a.unitBlockw, unitBlockh = _a.unitBlockh;
        this.pointList = [];
        this.block_shape_point_list = [];
        this.index = 0;
        this.unitBlockw = unitBlockw;
        this.unitBlockh = unitBlockh;
        this.block_shape_point_list = blockConfig_1.getBlockShape();
        var index = Math.floor(Math.random() * 100);
        this.index = index % this.block_shape_point_list.length;
        this.pointList = this.block_shape_point_list[this.index];
        EventCenter_1.default.addEventListener("event_merge", this.change.bind(this));
    }
    NextBlock.prototype.draw = function (ctx) {
        var _this = this;
        var dx = 400;
        var dy = 40;
        ctx.fillStyle = "green";
        this.pointList.forEach(function (point) {
            var x = point.x, y = point.y;
            ctx.fillRect(dx + (x * _this.unitBlockw) / 2, dy + (y * _this.unitBlockh) / 2, (_this.unitBlockw - 1) / 2, (_this.unitBlockh - 1) / 2);
        });
    };
    NextBlock.prototype.change = function () {
        console.info("nextBlock.... change()....");
        var payload = {
            index: this.index,
            block_shape_point_list: JSON.parse(JSON.stringify(this.block_shape_point_list))
        };
        console.info("fire...changeShape....", payload);
        EventCenter_1.default.fire("changeShape", payload);
        this.block_shape_point_list = blockConfig_1.getBlockShape();
        var index = Math.floor(Math.random() * 100);
        this.index = index % this.block_shape_point_list.length;
        this.pointList = this.block_shape_point_list[this.index];
        console.info("nextBlock...", this.index, this.pointList);
    };
    return NextBlock;
}());
exports.default = NextBlock;

},{"./EventCenter":3,"./blockConfig":7}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventCenter_1 = require("./EventCenter");
var Score = /** @class */ (function () {
    function Score(mark) {
        if (mark === void 0) { mark = 0; }
        this.mark = 0;
        this.mark = mark;
        EventCenter_1.default.addEventListener("addScore", this.addScore.bind(this));
    }
    Score.prototype.addScore = function (point) {
        this.mark += point;
    };
    Score.prototype.draw = function (ctx) {
    };
    return Score;
}());
exports.default = Score;

},{"./EventCenter":3}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var L_Shape = [
    [
        [1, 0],
        [1, 0],
        [1, 1]
    ],
    [
        [1, 1, 1],
        [1, 0, 0],
    ],
    [
        [1, 1],
        [0, 1],
        [0, 1]
    ],
    [
        [0, 0, 1],
        [1, 1, 1],
    ]
];
var O_Shape = [
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1],
        [1, 1],
    ]
];
var N_Shape = [
    [
        [1, 0],
        [1, 1],
        [0, 1]
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
    ]
];
var Z_Shape = [
    [
        [0, 1],
        [1, 1],
        [1, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
    ]
];
var line_Shape = [
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]
    ]
];
var Crose_Shape = [
    [
        [1, 0],
        [1, 1],
        [1, 0],
    ],
    [
        [1, 1, 1],
        [0, 1, 0],
    ],
    [
        [0, 1],
        [1, 1],
        [0, 1],
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
    ],
];
// const Fan_Shape = [
//     [
//         [1,0,1],
//         [1,1,1],
//         [1,0,1],
//     ],
//     [
//         [1,1,1],
//         [0,1,0],
//         [1,1,1],
//     ]
// ]
var BLOCK_SHAPE_ARR = [L_Shape, N_Shape, O_Shape, Z_Shape, line_Shape, Crose_Shape].map(function (shape) { return shape.map(function (item) {
    var ar = [];
    item.forEach(function (it, y) {
        it.forEach(function (val, x) {
            if (val) {
                ar.push({ x: x, y: y });
            }
        });
    });
    return ar;
}); });
exports.BLOCK_SHAPE_ARR = BLOCK_SHAPE_ARR;
var getBlockShape = function () {
    var len = BLOCK_SHAPE_ARR.length;
    return BLOCK_SHAPE_ARR[Math.floor(Math.random() * len)];
};
exports.getBlockShape = getBlockShape;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("./Game");
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
console.dir(canvas);
var maxNumberX = 20; // 10个
var maxNumberY = 20; // 10个
var areaWidth = 400; //canvas.width;
var areaHeight = 400; //canvas.height;
var game = new Game_1.default({ context: context, maxNumberX: maxNumberX, maxNumberY: maxNumberY, areaWidth: areaWidth, areaHeight: areaHeight });
game.start();

},{"./Game":4}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvQmFja0dyb3VuZEJsb2NrLnRzIiwic3JjL3RzL0Jsb2NrLnRzIiwic3JjL3RzL0V2ZW50Q2VudGVyLnRzIiwic3JjL3RzL0dhbWUudHMiLCJzcmMvdHMvTmV4dEJsb2NrLnRzIiwic3JjL3RzL1Njb3JlLnRzIiwic3JjL3RzL2Jsb2NrQ29uZmlnLnRzIiwic3JjL3RzL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBLDZDQUF5QztBQUN6QztJQU1FLGtCQUFZLEVBQWtEO1lBQWhELDBCQUFVLEVBQUUsMEJBQVUsRUFBRSwwQkFBVSxFQUFFLDBCQUFVO1FBTDVELFdBQU0sR0FBRyxFQUFFLENBQUM7UUFDWixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBRXRCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkMsSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZCO1FBRUQscUJBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENB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O0tBQ1Y7Q0FDSixDQUFBO0FBRUQsSUFBTSxPQUFPLEdBQUc7SUFDWjtRQUNJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNSO0lBQ0Q7UUFDSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNWO0NBQ0osQ0FBQTtBQUVELElBQU0sVUFBVSxHQUFHO0lBQ2Y7UUFDSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNaO0lBQ0Q7UUFDSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7S0FDWjtDQUNKLENBQUE7QUFFRCxJQUFNLFdBQVcsR0FBRztJQUNoQjtRQUNJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNSO0lBQ0Q7UUFDSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNWO0lBQ0Q7UUFDSSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7S0FDUjtJQUNEO1FBQ0ksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7S0FDVjtDQUNKLENBQUE7QUFFRCxzQkFBc0I7QUFDdEIsUUFBUTtBQUNSLG1CQUFtQjtBQUNuQixtQkFBbUI7QUFDbkIsbUJBQW1CO0FBQ25CLFNBQVM7QUFDVCxRQUFRO0FBQ1IsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixtQkFBbUI7QUFDbkIsUUFBUTtBQUNSLElBQUk7QUFHSixJQUFNLGVBQWUsR0FBRyxDQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFDLE9BQU8sRUFBQyxVQUFVLEVBQUMsV0FBVyxDQUFFLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFFLE9BQUEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7SUFDMUcsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQUUsRUFBQyxDQUFDO1FBQ2QsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBQyxDQUFDO1lBQ2IsSUFBRyxHQUFHLEVBQUM7Z0JBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsR0FBQSxFQUFDLENBQUMsR0FBQSxFQUFDLENBQUMsQ0FBQTthQUNqQjtRQUNMLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7SUFDRixPQUFPLEVBQUUsQ0FBQztBQUNkLENBQUMsQ0FBQyxFQVY4RixDQVU5RixDQUFDLENBQUM7QUFRSywwQ0FBZTtBQUx4QixJQUFNLGFBQWEsR0FBRztJQUNsQixJQUFJLEdBQUcsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDO0lBQ2pDLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDM0QsQ0FBQyxDQUFBO0FBRXlCLHNDQUFhOzs7OztBQzFIdkMsK0JBQTBCO0FBRTFCLElBQUksTUFBTSxHQUFzQixRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BFLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNuQixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNO0FBQzNCLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU07QUFDM0IsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUEsZUFBZTtBQUNuQyxJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQSxnQkFBZ0I7QUFFckMsSUFBSSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsRUFBRSxPQUFPLFNBQUEsRUFBRSxVQUFVLFlBQUEsRUFBRSxVQUFVLFlBQUEsRUFBQyxTQUFTLFdBQUEsRUFBQyxVQUFVLFlBQUEsRUFBQyxDQUFDLENBQUM7QUFFN0UsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgQWN0b3IsIFBPSU5UX1QgfSBmcm9tIFwiLi9pbnRlcmZhY2VcIjtcbmltcG9ydCBCbG9jayBmcm9tIFwiLi9CbG9ja1wiO1xuaW1wb3J0IEVWRU5UX0NFTlRFUiBmcm9tIFwiLi9FdmVudENlbnRlclwiO1xuY2xhc3MgQkdCbG9ja3MgaW1wbGVtZW50cyBBY3RvciB7XG4gIG1hdHJpeCA9IFtdO1xuICBtYXhOdW1iZXJYOiBudW1iZXIgPSAwO1xuICBtYXhOdW1iZXJZOiBudW1iZXIgPSAwO1xuICB1bml0QmxvY2t3OiBudW1iZXIgPSAxMDtcbiAgdW5pdEJsb2NraDogbnVtYmVyID0gMTA7XG4gIGNvbnN0cnVjdG9yKHsgbWF4TnVtYmVyWCwgbWF4TnVtYmVyWSwgdW5pdEJsb2NrdywgdW5pdEJsb2NraCB9KSB7XG4gICAgdGhpcy5tYXhOdW1iZXJYID0gbWF4TnVtYmVyWDtcbiAgICB0aGlzLm1heE51bWJlclkgPSBtYXhOdW1iZXJZO1xuICAgIHRoaXMudW5pdEJsb2NrdyA9IHVuaXRCbG9ja3c7XG4gICAgdGhpcy51bml0QmxvY2toID0gdW5pdEJsb2NraDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1heE51bWJlclk7IGkrKykge1xuICAgICAgbGV0IGFyciA9IG5ldyBBcnJheShtYXhOdW1iZXJYKS5maWxsKDApO1xuICAgICAgdGhpcy5tYXRyaXgucHVzaChhcnIpO1xuICAgIH1cblxuICAgIEVWRU5UX0NFTlRFUi5hZGRFdmVudExpc3RlbmVyKFwibW92ZVJpZ2h0XCIsIHRoaXMubW92ZVJpZ2h0LmJpbmQodGhpcykpO1xuICAgIEVWRU5UX0NFTlRFUi5hZGRFdmVudExpc3RlbmVyKFwibW92ZUxlZnRcIiwgdGhpcy5tb3ZlTGVmdC5iaW5kKHRoaXMpKTtcbiAgICBFVkVOVF9DRU5URVIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdmVDaGFuZ2VcIiwgdGhpcy5tb3ZlQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgZHJhdyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIGN0eC5maWxsU3R5bGUgPSBcImdyZWVuXCI7XG4gICAgdGhpcy5tYXRyaXguZm9yRWFjaCgocm93LCB5KSA9PiB7XG4gICAgICByb3cuZm9yRWFjaCgodmFsLCB4KSA9PiB7XG4gICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICBjdHguZmlsbFJlY3QoXG4gICAgICAgICAgICB4ICogdGhpcy51bml0QmxvY2toLFxuICAgICAgICAgICAgeSAqIHRoaXMudW5pdEJsb2NraCxcbiAgICAgICAgICAgIHRoaXMudW5pdEJsb2NraCAtIDEsXG4gICAgICAgICAgICB0aGlzLnVuaXRCbG9ja2ggLSAxXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImdyZWVuXCI7XG4gICAgICAgICAgY3R4LnN0cm9rZVJlY3QoXG4gICAgICAgICAgICB4ICogdGhpcy51bml0QmxvY2toLFxuICAgICAgICAgICAgeSAqIHRoaXMudW5pdEJsb2NraCxcbiAgICAgICAgICAgIHRoaXMudW5pdEJsb2NraCxcbiAgICAgICAgICAgIHRoaXMudW5pdEJsb2NraFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY2FuTW92ZUxlZnQoYmxvY2s6IEJsb2NrKSB7XG4gICAgbGV0IG1pbnggPSBNYXRoLm1pbiguLi5ibG9jay5wb2ludExpc3QubWFwKGl0ZW0gPT4gYmxvY2sueCArIGl0ZW0ueCkpO1xuICAgIGlmIChtaW54ID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICBsZXQgc2hhZGVNYXRyaXggPSBibG9jay5nZXRNYXRyaXgoXCJsZWZ0XCIpO1xuICAgIHJldHVybiAhdGhpcy5pc0NyYXNoTWF0cml4KHNoYWRlTWF0cml4KTtcbiAgfVxuICBjYW5Nb3ZlUmlnaHQoYmxvY2s6IEJsb2NrKSB7XG4gICAgbGV0IHN0YWdlTWF4WCA9IHRoaXMubWF0cml4WzBdLmxlbmd0aDtcbiAgICBsZXQgbWF4WCA9IE1hdGgubWF4KC4uLmJsb2NrLnBvaW50TGlzdC5tYXAoaXRlbSA9PiBibG9jay54ICsgaXRlbS54KSk7XG4gICAgaWYgKG1heFggPT09IHN0YWdlTWF4WCAtIDEpIHJldHVybiBmYWxzZTtcblxuICAgIGxldCBzaGFkZU1hdHJpeCA9IGJsb2NrLmdldE1hdHJpeChcInJpZ2h0XCIpO1xuICAgIHJldHVybiAhdGhpcy5pc0NyYXNoTWF0cml4KHNoYWRlTWF0cml4KTtcbiAgfVxuXG4gIGNhbk1vdmVEb3duKGJsb2NrOiBCbG9jaykge1xuICAgIGxldCBzdGFnZU1heFkgPSB0aGlzLm1hdHJpeC5sZW5ndGg7XG4gICAgbGV0IG1heFkgPSBNYXRoLm1heCguLi5ibG9jay5wb2ludExpc3QubWFwKGl0ZW0gPT4gYmxvY2sueSArIGl0ZW0ueSkpO1xuICAgIGlmIChtYXhZID09PSBzdGFnZU1heFkgLSAxKSByZXR1cm4gZmFsc2U7XG5cbiAgICBsZXQgc2hhZGVNYXRyaXggPSBibG9jay5nZXRNYXRyaXgoXCJkb3duXCIpO1xuICAgIHJldHVybiAhdGhpcy5pc0NyYXNoTWF0cml4KHNoYWRlTWF0cml4KTtcbiAgfVxuXG4gIG1vdmVMZWZ0KGJsb2NrOiBCbG9jaykge1xuICAgIGlmICh0aGlzLmNhbk1vdmVMZWZ0KGJsb2NrKSkge1xuICAgICAgYmxvY2sueCA9IGJsb2NrLnggLSAxO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG1vdmVSaWdodChibG9jazogQmxvY2spIHtcbiAgICBpZiAodGhpcy5jYW5Nb3ZlUmlnaHQoYmxvY2spKSB7XG4gICAgICBibG9jay54ID0gYmxvY2sueCArIDE7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbW92ZURvd24oYmxvY2s6IEJsb2NrKSB7XG4gICAgaWYgKHRoaXMuY2FuTW92ZURvd24oYmxvY2spKSB7XG4gICAgICBibG9jay55ID0gYmxvY2sueSArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuaW5mbyhcIm1lcmdlLGFuZCBmaXJlIEV2ZW50X21lcmdlLi4uXCIpO1xuICAgICAgdGhpcy5tZXJnZShibG9jayk7XG4gICAgICBFVkVOVF9DRU5URVIuZmlyZShcImV2ZW50X21lcmdlXCIpO1xuICAgICAgaWYgKHRoaXMuaXNHYW1lb3ZlcigpKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBtb3ZlQ2hhbmdlKGJsb2NrOiBCbG9jaykge1xuICAgIGJsb2NrLmluZGV4ID0gKGJsb2NrLmluZGV4ICsgMSkgJSBibG9jay5ibG9ja19zaGFwZV9wb2ludF9saXN0Lmxlbmd0aDtcbiAgICBibG9jay5wb2ludExpc3QgPSBibG9jay5ibG9ja19zaGFwZV9wb2ludF9saXN0W2Jsb2NrLmluZGV4XTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNhbk1vdmVDaGFuZ2UoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpc0dhbWVvdmVyKCkge1xuICAgIGxldCBycyA9IHRoaXMubWF0cml4WzBdLmZpbmQoaXRlbSA9PiBpdGVtID4gMCk7XG4gICAgaWYgKHJzKSB7XG4gICAgICBFVkVOVF9DRU5URVIuZmlyZShcImdhbWVvdmVyXCIpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlzQ3Jhc2goYmxvY2s6IEJsb2NrKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAhIWJsb2NrLnBvaW50TGlzdC5maW5kKFxuICAgICAgICBpdGVtID0+IHRoaXMubWF0cml4W2Jsb2NrLnkgKyBpdGVtLnkgKyAxXVtibG9jay54ICsgaXRlbS54XVxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpc0NyYXNoTWF0cml4KG1hdHJpeDogQXJyYXk8UE9JTlRfVD4pIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICEhbWF0cml4LmZpbmQoaXRlbSA9PiB0aGlzLm1hdHJpeFtpdGVtLnldW2l0ZW0ueF0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIG1lcmdlKGJsb2NrOiBCbG9jaykge1xuICAgIGJsb2NrLnBvaW50TGlzdC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgdGhpcy5tYXRyaXhbYmxvY2sueSArIGl0ZW0ueV1bYmxvY2sueCArIGl0ZW0ueF0gPSAxO1xuICAgIH0pO1xuXG4gICAgdGhpcy5jbGVhclNvbWVSb3coKTtcbiAgfVxuXG4gIGNsZWFyU29tZVJvdygpIHtcbiAgICBsZXQgYXJyID0gdGhpcy5tYXRyaXgubWFwKHJvdyA9PlxuICAgICAgcm93LnJlZHVjZSgoaW5pdCwgY3VycmVudCkgPT4gaW5pdCArIGN1cnJlbnQsIDApXG4gICAgKTtcblxuICAgIGxldCByb3dJbmRleHMgPSBbXTtcbiAgICBhcnIuZm9yRWFjaCgoc3VtVmFsLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKHN1bVZhbCA9PT0gdGhpcy5tYXhOdW1iZXJYKSB7XG4gICAgICAgIHJvd0luZGV4cy5wdXNoKGluZGV4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocm93SW5kZXhzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgaWYgKHJvd0luZGV4cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIEVWRU5UX0NFTlRFUi5maXJlKFwiYWRkU2NvcmVcIiwgMTAwKTtcbiAgICB9IGVsc2UgaWYgKHJvd0luZGV4cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIEVWRU5UX0NFTlRFUi5maXJlKFwiYWRkU2NvcmVcIiwgMjUwKTtcbiAgICB9IGVsc2UgaWYgKHJvd0luZGV4cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIEVWRU5UX0NFTlRFUi5maXJlKFwiYWRkU2NvcmVcIiwgNDAwKTtcbiAgICB9XG5cbiAgICByb3dJbmRleHMuZm9yRWFjaCh2YWxJbmRleCA9PiB7XG4gICAgICB0aGlzLm1hdHJpeC5zcGxpY2UodmFsSW5kZXgsIDEpO1xuICAgICAgdGhpcy5tYXRyaXgudW5zaGlmdChuZXcgQXJyYXkodGhpcy5tYXhOdW1iZXJYKS5maWxsKDApKTtcbiAgICB9KTtcblxuICAgIEVWRU5UX0NFTlRFUi5maXJlKFwiZ2V0U2NvcmVcIik7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQkdCbG9ja3M7XG4iLCJpbXBvcnQgeyBCbE9DS19ULCBQT0lOVF9ULCBBY3RvciB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xuaW1wb3J0IHsgZ2V0QmxvY2tTaGFwZSB9IGZyb20gXCIuL2Jsb2NrQ29uZmlnXCI7XG5pbXBvcnQgRXZlbnRDZW50ZXIgZnJvbSBcIi4vRXZlbnRDZW50ZXJcIjtcbmNsYXNzIEJsb2NrIGltcGxlbWVudHMgQWN0b3Ige1xuICBwb2ludExpc3Q6IEFycmF5PFBPSU5UX1Q+ID0gW107XG4gIGluZGV4ID0gMDtcbiAgdW5pdEJsb2NraDogbnVtYmVyID0gMTA7XG4gIHVuaXRCbG9ja3c6IG51bWJlciA9IDEwO1xuICB4ID0gMDtcbiAgeSA9IDA7XG4gIGJsb2NrX3NoYXBlX3BvaW50X2xpc3QgPSBbXTtcblxuICBjb25zdHJ1Y3Rvcih7IHVuaXRCbG9ja3csIHVuaXRCbG9ja2ggfSkge1xuICAgIHRoaXMudW5pdEJsb2NrdyA9IHVuaXRCbG9ja3c7XG4gICAgdGhpcy51bml0QmxvY2toID0gdW5pdEJsb2NraDtcblxuICAgIGxldCBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpO1xuXG4gICAgbGV0IGluaXR4ID0gMDtcblxuICAgIHRoaXMueCA9IGluaXR4O1xuICAgIHRoaXMuYmxvY2tfc2hhcGVfcG9pbnRfbGlzdCA9IGdldEJsb2NrU2hhcGUoKTtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXggJSB0aGlzLmJsb2NrX3NoYXBlX3BvaW50X2xpc3QubGVuZ3RoO1xuICAgIHRoaXMucG9pbnRMaXN0ID0gdGhpcy5ibG9ja19zaGFwZV9wb2ludF9saXN0W3RoaXMuaW5kZXhdO1xuICAgIEV2ZW50Q2VudGVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcImNoYW5nZVNoYXBlXCIsXG4gICAgICB0aGlzLmhhbmRsZUNoYW5nZVNoYXBlLmJpbmQodGhpcylcbiAgICApO1xuICB9XG4gIGhhbmRsZUNoYW5nZVNoYXBlKHsgaW5kZXgsIGJsb2NrX3NoYXBlX3BvaW50X2xpc3QgfSkge1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5ibG9ja19zaGFwZV9wb2ludF9saXN0ID0gYmxvY2tfc2hhcGVfcG9pbnRfbGlzdDtcbiAgICB0aGlzLnBvaW50TGlzdCA9IHRoaXMuYmxvY2tfc2hhcGVfcG9pbnRfbGlzdFt0aGlzLmluZGV4XTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMueCA9IDM7XG4gICAgdGhpcy55ID0gMDtcbiAgfVxuICBnZXRNYXRyaXgoZGlyOiBzdHJpbmcgPSBcIlwiKSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRMaXN0Lm1hcChpdGVtID0+IHtcbiAgICAgIGxldCBvID0geyB4OiAwLCB5OiAwIH07XG4gICAgICBvLnggPSBpdGVtLnggKyB0aGlzLng7XG4gICAgICBvLnkgPSBpdGVtLnkgKyB0aGlzLnk7XG4gICAgICBvLnggPSBkaXIgPT09IFwibGVmdFwiID8gby54IC0gMSA6IG8ueDtcbiAgICAgIG8ueCA9IGRpciA9PT0gXCJyaWdodFwiID8gby54ICsgMSA6IG8ueDtcbiAgICAgIG8ueSA9IGRpciA9PT0gXCJkb3duXCIgPyBvLnkgKyAxIDogby55O1xuICAgICAgcmV0dXJuIG87XG4gICAgfSk7XG4gIH1cblxuICBkcmF3KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcbiAgICB0aGlzLmdldE1hdHJpeCgpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjdHguZmlsbFJlY3QoXG4gICAgICAgIGl0ZW0ueCAqIHRoaXMudW5pdEJsb2NrdyxcbiAgICAgICAgaXRlbS55ICogdGhpcy51bml0QmxvY2t3LFxuICAgICAgICB0aGlzLnVuaXRCbG9ja3cgLSAxLFxuICAgICAgICB0aGlzLnVuaXRCbG9ja3cgLSAxXG4gICAgICApO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJsb2NrO1xuIiwiY29uc3QgRXZlbnRDZW50ZXIgPSBmdW5jdGlvbigpe1xuICAgIGxldCBFVkVOVF9CVVMgPSBudWxsXG4gICAgY2xhc3MgX0V2ZW50Q2VudGVyIHtcbiAgICAgICAgbGlzdGVuZXJMaXN0Ont9XG5cbiAgICAgICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgICAgIGlmKCFFVkVOVF9CVVMpe1xuICAgICAgICAgICAgICAgIEVWRU5UX0JVUyA9IHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBFVkVOVF9CVVMubGlzdGVuZXJMaXN0ID0ge31cbiAgICAgICAgfVxuXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLGNhbGxCYWNrKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLmxpc3RlbmVyTGlzdFtldmVudE5hbWVdKXtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyTGlzdFtldmVudE5hbWVdID0gW11cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5saXN0ZW5lckxpc3RbZXZlbnROYW1lXS5wdXNoKGNhbGxCYWNrKTtcbiAgICAgICAgfVxuICAgICAgICByZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSxjYWxsQmFjayl7XG4gICAgICAgIGxldCBhcnIgPSAgdGhpcy5saXN0ZW5lckxpc3RbZXZlbnROYW1lXVxuICAgICAgICBsZXQgaW5kZXggPSBhcnIuZmluZEluZGV4KGl0ZW09Pml0ZW0gPT09IGNhbGxCYWNrKTtcbiAgICAgICAgYXJyLnNwbGljZShpbmRleCwxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpcmUoZXZlbnROYW1lOnN0cmluZyxwYXJhbT86YW55KXtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJMaXN0W2V2ZW50TmFtZV0gJiYgdGhpcy5saXN0ZW5lckxpc3RbZXZlbnROYW1lXS5mb3JFYWNoKGZ1bmMgPT4ge1xuICAgICAgICAgICAgICAgIGZ1bmMocGFyYW0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX0V2ZW50Q2VudGVyXG59KClcbmNvbnN0IEVWRU5UX0JVUyA9IG5ldyBFdmVudENlbnRlcigpO1xuXG5leHBvcnQgZGVmYXVsdCBFVkVOVF9CVVMiLCJpbXBvcnQgQmxvY2sgZnJvbSBcIi4vQmxvY2tcIjtcbmltcG9ydCB7IEJsT0NLX1QgfSBmcm9tIFwiLi9pbnRlcmZhY2VcIjtcbmltcG9ydCBCR0Jsb2NrcyBmcm9tIFwiLi9CYWNrR3JvdW5kQmxvY2tcIjtcbmltcG9ydCBOZXh0QmxvY2sgZnJvbSBcIi4vTmV4dEJsb2NrXCI7XG5pbXBvcnQgRVZFTlRfQlVTIGZyb20gXCIuL0V2ZW50Q2VudGVyXCI7XG5pbXBvcnQgU2NvcmUgZnJvbSBcIi4vU2NvcmVcIjtcbmNvbnN0IEdhbWUgPSAoZnVuY3Rpb24oKSB7XG4gIGxldCBnYW1lID0gbnVsbDtcbiAgY2xhc3MgX0dhbWUge1xuICAgIGZyYW1lSW5kZXg6IG51bWJlciA9IDA7XG4gICAgbWF4TnVtYmVyWDogbnVtYmVyO1xuICAgIG1heE51bWJlclk6IG51bWJlcjtcbiAgICBhcmVhV2lkdGg6IG51bWJlcjtcbiAgICBhcmVhSGVpZ2h0OiBudW1iZXI7XG4gICAgdW5pdEJsb2NrdzogbnVtYmVyO1xuXG4gICAgdW5pdEJsb2NraDogbnVtYmVyO1xuICAgIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBjdXJCbG9jazogQmxvY2s7XG4gICAgbmV4QmxvY2s6IE5leHRCbG9jaztcbiAgICBzY29yZTogU2NvcmU7XG4gICAgYmdCbG9ja3M6IEJHQmxvY2tzO1xuICAgIHRpbWVySWQ6IG51bWJlcjtcbiAgICBzdGF0dXM6IHN0cmluZyA9IFwibm9ybWFsXCI7XG5cbiAgICBjb25zdHJ1Y3Rvcih7IGNvbnRleHQsIG1heE51bWJlclgsIG1heE51bWJlclksIGFyZWFXaWR0aCwgYXJlYUhlaWdodCB9KSB7XG4gICAgICBpZiAoIWdhbWUpIHtcbiAgICAgICAgZ2FtZSA9IHRoaXM7XG4gICAgICB9XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5ldmVudEtleVVwLmJpbmQodGhpcykpO1xuXG4gICAgICBnYW1lLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgZ2FtZS5tYXhOdW1iZXJYID0gbWF4TnVtYmVyWDtcbiAgICAgIGdhbWUubWF4TnVtYmVyWSA9IG1heE51bWJlclk7XG4gICAgICBnYW1lLmFyZWFXaWR0aCA9IGFyZWFXaWR0aDtcbiAgICAgIGdhbWUuYXJlYUhlaWdodCA9IGFyZWFIZWlnaHQ7XG4gICAgICBnYW1lLnVuaXRCbG9ja2ggPSBhcmVhSGVpZ2h0IC8gbWF4TnVtYmVyWTtcbiAgICAgIGdhbWUudW5pdEJsb2NrdyA9IGFyZWFXaWR0aCAvIG1heE51bWJlclg7XG4gICAgICBnYW1lLm5leEJsb2NrID0gbmV3IE5leHRCbG9jayh7XG4gICAgICAgIHVuaXRCbG9ja3c6IGdhbWUudW5pdEJsb2NrdyxcbiAgICAgICAgdW5pdEJsb2NraDogZ2FtZS51bml0QmxvY2toXG4gICAgICB9KTtcbiAgICAgIGdhbWUuY3VyQmxvY2sgPSBuZXcgQmxvY2soe1xuICAgICAgICB1bml0QmxvY2t3OiBnYW1lLnVuaXRCbG9ja3csXG4gICAgICAgIHVuaXRCbG9ja2g6IGdhbWUudW5pdEJsb2NraFxuICAgICAgfSk7XG4gICAgICBnYW1lLmJnQmxvY2tzID0gbmV3IEJHQmxvY2tzKHtcbiAgICAgICAgbWF4TnVtYmVyWCxcbiAgICAgICAgbWF4TnVtYmVyWSxcbiAgICAgICAgdW5pdEJsb2NrdzogZ2FtZS51bml0QmxvY2t3LFxuICAgICAgICB1bml0QmxvY2toOiBnYW1lLnVuaXRCbG9ja2hcbiAgICAgIH0pO1xuXG4gICAgICBnYW1lLnNjb3JlID0gbmV3IFNjb3JlKCk7XG5cbiAgICAgIEVWRU5UX0JVUy5hZGRFdmVudExpc3RlbmVyKFwiZ2FtZW92ZXJcIiwgZ2FtZS5nYW1lb3Zlci5iaW5kKGdhbWUpKTtcblxuICAgICAgcmV0dXJuIGdhbWU7XG4gICAgfVxuXG4gICAgZXZlbnRLZXlVcChlKSB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAzOCkge1xuICAgICAgICBFVkVOVF9CVVMuZmlyZShcIm1vdmVDaGFuZ2VcIiwgdGhpcy5jdXJCbG9jayk7XG4gICAgICAgIC8vIF90aGlzLmN1ckJsb2NrLm1vdmVDaGFuZ2UoX3RoaXMuYmdCbG9ja3MpO1xuICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM5KSB7XG4gICAgICAgIEVWRU5UX0JVUy5maXJlKFwibW92ZVJpZ2h0XCIsIHRoaXMuY3VyQmxvY2spO1xuICAgICAgICAvLyAgX3RoaXMuY3VyQmxvY2subW92ZVJpZ2h0KF90aGlzLmJnQmxvY2tzKTtcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSAzNykge1xuICAgICAgICBFVkVOVF9CVVMuZmlyZShcIm1vdmVMZWZ0XCIsIHRoaXMuY3VyQmxvY2spO1xuICAgICAgICAvLyBfdGhpcy5jdXJCbG9jay5tb3ZlTGVmdChfdGhpcy5iZ0Jsb2Nrcyk7XG4gICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgRVZFTlRfQlVTLmZpcmUoXCJyZVN0YXJ0XCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlU3RhcnQoKSB7XG4gICAgICBpZiAodGhpcy5zdGF0dXMgPT09IFwiZ2FtZW92ZXJcIikge1xuICAgICAgICB0aGlzLnN0YXR1cyA9IFwibm9ybWFsXCI7XG4gICAgICAgIC8vIHRoaXMuY3VyQmxvY2sgPSBuZXcgQmxvY2soKVxuICAgICAgICAvLyB0aGlzLmJnQmxvY2tzID0gbmV3IEJHQmxvY2tzKHsgbWF4TnVtYmVyWDp0aGlzLm1heE51bWJlclgsbWF4TnVtYmVyWTp0aGlzLm1heE51bWJlcll9KVxuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZHJhd1Njb3JlKCkge1xuICAgICAgbGV0IGN4dCA9IHRoaXMuY29udGV4dDtcbiAgICAgIGN4dC5zdHJva2VTdHlsZSA9IFwiI2ZmZlwiO1xuICAgICAgY3h0LmZvbnQgPSBcImJvbGQgMzBweCBjb25zb2xhc1wiO1xuICAgICAgY3h0LmZpbGxUZXh0KFwi5YiG5pWwOlwiICsgdGhpcy5zY29yZS5tYXJrLnRvU3RyaW5nKCksIDQ1MCwgMTAwKTtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgIHRoaXMuZnJhbWVJbmRleCsrO1xuICAgICAgbGV0IGN4dCA9IHRoaXMuY29udGV4dDtcbiAgICAgIGN4dC5jbGVhclJlY3QoMCwgMCwgY3h0LmNhbnZhcy53aWR0aCwgY3h0LmNhbnZhcy5oZWlnaHQpO1xuICAgICAgLy8gICBjb25zb2xlLmluZm8odGhpcy5mcmFtZUluZGV4KTtcbiAgICAgIGlmICh0aGlzLmZyYW1lSW5kZXggJSBNYXRoLmNlaWwoMTAwMCAvIDUwKSA9PT0gMCkge1xuICAgICAgICB0aGlzLmJnQmxvY2tzLm1vdmVEb3duKHRoaXMuY3VyQmxvY2spO1xuICAgICAgfVxuICAgICAgdGhpcy5jdXJCbG9jay5kcmF3KHRoaXMuY29udGV4dCk7XG4gICAgICB0aGlzLm5leEJsb2NrLmRyYXcodGhpcy5jb250ZXh0KTtcbiAgICAgIHRoaXMuYmdCbG9ja3MuZHJhdyh0aGlzLmNvbnRleHQpO1xuICAgICAgdGhpcy5kcmF3U2NvcmUoKTtcbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gXCJub3JtYWxcIilcbiAgICAgICAgdGhpcy50aW1lcklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3RhcnQuYmluZCh0aGlzKSk7XG4gICAgICAvLyAgIGNvbnNvbGUuaW5mbyh0aGlzLnRpbWVySWQpXG4gICAgfVxuXG4gICAgZ2FtZW92ZXIoKSB7XG4gICAgICB0aGlzLnN0YXR1cyA9IFwiZ2FtZW92ZXJcIjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gX0dhbWU7XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IEVWRU5UX0JVUyBmcm9tIFwiLi9FdmVudENlbnRlclwiO1xuaW1wb3J0IHsgQWN0b3IsIFBPSU5UX1QgfSBmcm9tIFwiLi9pbnRlcmZhY2VcIjtcbmltcG9ydCB7IGdldEJsb2NrU2hhcGUgfSBmcm9tIFwiLi9ibG9ja0NvbmZpZ1wiO1xuY2xhc3MgTmV4dEJsb2NrIGltcGxlbWVudHMgQWN0b3Ige1xuICBwb2ludExpc3Q6IEFycmF5PFBPSU5UX1Q+ID0gW107XG4gIGJsb2NrX3NoYXBlX3BvaW50X2xpc3QgPSBbXTtcbiAgaW5kZXg6IG51bWJlciA9IDA7XG4gIHVuaXRCbG9ja3c6IG51bWJlcjtcbiAgdW5pdEJsb2NraDogbnVtYmVyO1xuICBjb25zdHJ1Y3Rvcih7IHVuaXRCbG9ja3csIHVuaXRCbG9ja2ggfSkge1xuICAgIHRoaXMudW5pdEJsb2NrdyA9IHVuaXRCbG9ja3c7XG4gICAgdGhpcy51bml0QmxvY2toID0gdW5pdEJsb2NraDtcbiAgICB0aGlzLmJsb2NrX3NoYXBlX3BvaW50X2xpc3QgPSBnZXRCbG9ja1NoYXBlKCk7XG5cbiAgICBsZXQgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApO1xuICAgIHRoaXMuaW5kZXggPSBpbmRleCAlIHRoaXMuYmxvY2tfc2hhcGVfcG9pbnRfbGlzdC5sZW5ndGg7XG4gICAgdGhpcy5wb2ludExpc3QgPSB0aGlzLmJsb2NrX3NoYXBlX3BvaW50X2xpc3RbdGhpcy5pbmRleF07XG5cbiAgICBFVkVOVF9CVVMuYWRkRXZlbnRMaXN0ZW5lcihcImV2ZW50X21lcmdlXCIsIHRoaXMuY2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgZHJhdyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIGxldCBkeCA9IDQwMDtcbiAgICBsZXQgZHkgPSA0MDtcbiAgICBjdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xuICAgIHRoaXMucG9pbnRMaXN0LmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgbGV0IHsgeCwgeSB9ID0gcG9pbnQ7XG4gICAgICBjdHguZmlsbFJlY3QoXG4gICAgICAgIGR4ICsgKHggKiB0aGlzLnVuaXRCbG9ja3cpIC8gMixcbiAgICAgICAgZHkgKyAoeSAqIHRoaXMudW5pdEJsb2NraCkgLyAyLFxuICAgICAgICAodGhpcy51bml0QmxvY2t3IC0gMSkgLyAyLFxuICAgICAgICAodGhpcy51bml0QmxvY2toIC0gMSkgLyAyXG4gICAgICApO1xuICAgIH0pO1xuICB9XG4gIGNoYW5nZSgpIHtcbiAgICBjb25zb2xlLmluZm8oXCJuZXh0QmxvY2suLi4uIGNoYW5nZSgpLi4uLlwiKTtcblxuICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgaW5kZXg6IHRoaXMuaW5kZXgsXG4gICAgICBibG9ja19zaGFwZV9wb2ludF9saXN0OiBKU09OLnBhcnNlKFxuICAgICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLmJsb2NrX3NoYXBlX3BvaW50X2xpc3QpXG4gICAgICApXG4gICAgfTtcbiAgICBjb25zb2xlLmluZm8oXCJmaXJlLi4uY2hhbmdlU2hhcGUuLi4uXCIsIHBheWxvYWQpO1xuICAgIEVWRU5UX0JVUy5maXJlKFwiY2hhbmdlU2hhcGVcIiwgcGF5bG9hZCk7XG5cbiAgICB0aGlzLmJsb2NrX3NoYXBlX3BvaW50X2xpc3QgPSBnZXRCbG9ja1NoYXBlKCk7XG5cbiAgICBsZXQgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApO1xuICAgIHRoaXMuaW5kZXggPSBpbmRleCAlIHRoaXMuYmxvY2tfc2hhcGVfcG9pbnRfbGlzdC5sZW5ndGg7XG4gICAgdGhpcy5wb2ludExpc3QgPSB0aGlzLmJsb2NrX3NoYXBlX3BvaW50X2xpc3RbdGhpcy5pbmRleF07XG4gICAgY29uc29sZS5pbmZvKFwibmV4dEJsb2NrLi4uXCIsIHRoaXMuaW5kZXgsIHRoaXMucG9pbnRMaXN0KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBOZXh0QmxvY2s7XG4iLCJpbXBvcnQgRVZFTlRfQlVTIGZyb20gXCIuL0V2ZW50Q2VudGVyXCI7XG5pbXBvcnQge0FjdG9yfSBmcm9tIFwiLi9pbnRlcmZhY2VcIlxuY2xhc3MgU2NvcmUgaW1wbGVtZW50cyBBY3RvcntcbiAgICBtYXJrOm51bWJlciA9IDA7XG4gICAgY29uc3RydWN0b3IobWFyazpudW1iZXIgPSAwKXtcbiAgICAgICAgdGhpcy5tYXJrID0gbWFyaztcblxuICAgICAgICBFVkVOVF9CVVMuYWRkRXZlbnRMaXN0ZW5lcihcImFkZFNjb3JlXCIsdGhpcy5hZGRTY29yZS5iaW5kKHRoaXMpKVxuICAgIH1cblxuICAgIGFkZFNjb3JlKHBvaW50Om51bWJlcil7XG4gICAgICAgIHRoaXMubWFyayArPSBwb2ludFxuICAgIH1cbiAgICBkcmF3KGN0eDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpe1xuICAgIFxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NvcmU7IiwiY29uc3QgTF9TaGFwZSA9IFtcbiAgICBbXG4gICAgICAgIFsxLDBdLFxuICAgICAgICBbMSwwXSxcbiAgICAgICAgWzEsMV1cbiAgICBdLFxuICAgIFtcbiAgICAgICAgWzEsMSwxXSxcbiAgICAgICAgWzEsMCwwXSxcbiAgICBdLFxuICAgIFtcbiAgICAgICAgWzEsMV0sXG4gICAgICAgIFswLDFdLFxuICAgICAgICBbMCwxXVxuICAgIF0sXG4gICAgW1xuICAgICAgICBbMCwwLDFdLFxuICAgICAgICBbMSwxLDFdLFxuICAgIF1cbl1cblxuY29uc3QgT19TaGFwZSA9IFtcbiAgICBbXG4gICAgICAgIFsxLDFdLFxuICAgICAgICBbMSwxXVxuICAgIF0sXG4gICAgW1xuICAgICAgICBbMSwxXSxcbiAgICAgICAgWzEsMV0sXG4gICAgXVxuXVxuXG5jb25zdCBOX1NoYXBlID0gW1xuICAgIFtcbiAgICAgICAgWzEsMF0sXG4gICAgICAgIFsxLDFdLFxuICAgICAgICBbMCwxXVxuICAgIF0sXG4gICAgW1xuICAgICAgICBbMCwxLDFdLFxuICAgICAgICBbMSwxLDBdLFxuICAgIF1cbl1cblxuY29uc3QgWl9TaGFwZSA9IFtcbiAgICBbXG4gICAgICAgIFswLDFdLFxuICAgICAgICBbMSwxXSxcbiAgICAgICAgWzEsMF1cbiAgICBdLFxuICAgIFtcbiAgICAgICAgWzEsMSwwXSxcbiAgICAgICAgWzAsMSwxXSxcbiAgICBdXG5dXG5cbmNvbnN0IGxpbmVfU2hhcGUgPSBbXG4gICAgW1xuICAgICAgICBbMCwxLDAsMF0sXG4gICAgICAgIFswLDEsMCwwXSxcbiAgICAgICAgWzAsMSwwLDBdLFxuICAgICAgICBbMCwxLDAsMF0sXG4gICAgXSxcbiAgICBbXG4gICAgICAgIFswLDAsMCwwXSxcbiAgICAgICAgWzEsMSwxLDFdLFxuICAgICAgICBbMCwwLDAsMF1cbiAgICBdXG5dXG5cbmNvbnN0IENyb3NlX1NoYXBlID0gW1xuICAgIFtcbiAgICAgICAgWzEsMF0sXG4gICAgICAgIFsxLDFdLFxuICAgICAgICBbMSwwXSxcbiAgICBdLFxuICAgIFtcbiAgICAgICAgWzEsMSwxXSxcbiAgICAgICAgWzAsMSwwXSxcbiAgICBdLFxuICAgIFtcbiAgICAgICAgWzAsMV0sXG4gICAgICAgIFsxLDFdLFxuICAgICAgICBbMCwxXSxcbiAgICBdLFxuICAgIFtcbiAgICAgICAgWzAsMSwwXSxcbiAgICAgICAgWzEsMSwxXSxcbiAgICBdLFxuXVxuXG4vLyBjb25zdCBGYW5fU2hhcGUgPSBbXG4vLyAgICAgW1xuLy8gICAgICAgICBbMSwwLDFdLFxuLy8gICAgICAgICBbMSwxLDFdLFxuLy8gICAgICAgICBbMSwwLDFdLFxuLy8gICAgIF0sXG4vLyAgICAgW1xuLy8gICAgICAgICBbMSwxLDFdLFxuLy8gICAgICAgICBbMCwxLDBdLFxuLy8gICAgICAgICBbMSwxLDFdLFxuLy8gICAgIF1cbi8vIF1cblxuXG5jb25zdCBCTE9DS19TSEFQRV9BUlIgPSBbIExfU2hhcGUsIE5fU2hhcGUsIE9fU2hhcGUsWl9TaGFwZSxsaW5lX1NoYXBlLENyb3NlX1NoYXBlIF0ubWFwKHNoYXBlPT5zaGFwZS5tYXAoaXRlbT0+e1xuICAgIGxldCBhciA9IFtdO1xuICAgIGl0ZW0uZm9yRWFjaCgoaXQseSk9PntcbiAgICAgICAgaXQuZm9yRWFjaCgodmFsLHgpPT57XG4gICAgICAgICAgICBpZih2YWwpe1xuICAgICAgICAgICAgICAgIGFyLnB1c2goe3gseX0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSlcbiAgICByZXR1cm4gYXI7XG59KSk7XG5cblxuY29uc3QgZ2V0QmxvY2tTaGFwZSA9IGZ1bmN0aW9uKCl7XG4gICAgbGV0IGxlbiA9IEJMT0NLX1NIQVBFX0FSUi5sZW5ndGg7XG4gICAgcmV0dXJuIEJMT0NLX1NIQVBFX0FSUltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBsZW4pXVxufVxuXG5leHBvcnQgeyBCTE9DS19TSEFQRV9BUlIgLGdldEJsb2NrU2hhcGV9ICIsIlxuaW1wb3J0IEdhbWUgZnJvbSBcIi4vR2FtZVwiO1xuXG5sZXQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlDYW52YXNcIik7XG5sZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5jb25zb2xlLmRpcihjYW52YXMpXG5sZXQgbWF4TnVtYmVyWCA9IDIwOyAvLyAxMOS4qlxubGV0IG1heE51bWJlclkgPSAyMDsgLy8gMTDkuKpcbmxldCBhcmVhV2lkdGggPSA0MDA7Ly9jYW52YXMud2lkdGg7XG5sZXQgYXJlYUhlaWdodCA9IDQwMDsvL2NhbnZhcy5oZWlnaHQ7XG5cbmxldCBnYW1lID0gbmV3IEdhbWUoeyBjb250ZXh0LCBtYXhOdW1iZXJYLCBtYXhOdW1iZXJZLGFyZWFXaWR0aCxhcmVhSGVpZ2h0fSk7XG5cbmdhbWUuc3RhcnQoKTtcbiJdfQ==
