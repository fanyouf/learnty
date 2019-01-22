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
            if (this.isGameover()) {
                this.merge(block);
                EventCenter_1.default.fire("merge");
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
        var arr = this.matrix.map(function (row) { return row.reduce(function (init, current) { return init + current; }, 0); });
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
},{"./EventCenter":4}],2:[function(require,module,exports){
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
        console.info("constructor....");
        EventCenter_1.default.addEventListener("changeShape", this.handleChangeShape.bind(this));
    }
    Block.prototype.handleChangeShape = function (_a) {
        var index = _a.index, pointList = _a.pointList;
        this.x = 0;
        this.y = 0;
        this.index = index;
        this.pointList = pointList;
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
},{"./EventCenter":4,"./blockConfig":8}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Block_1 = require("./Block");
var EventCenter_1 = require("./EventCenter");
var BlockManage = /** @class */ (function () {
    function BlockManage() {
        EventCenter_1.default.addEventListener("addScore", BlockManage.update.bind(BlockManage));
    }
    BlockManage.getNext = function () {
        if (BlockManage.nextBlock) {
            return BlockManage.nextBlock;
        }
        else {
            BlockManage.nextBlock = new Block_1.default();
            return BlockManage.nextBlock;
        }
    };
    BlockManage.update = function () {
        BlockManage.curBlock = BlockManage.getNext();
        BlockManage.nextBlock = new Block_1.default();
    };
    BlockManage.getCur = function () {
        if (BlockManage.nextBlock) {
            return BlockManage.nextBlock;
        }
        else {
            BlockManage.nextBlock = new Block_1.default();
            return BlockManage.nextBlock;
        }
    };
    BlockManage.curBlock = null;
    BlockManage.nextBlock = null;
    return BlockManage;
}());
exports.default = BlockManage;
},{"./Block":2,"./EventCenter":4}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Block_1 = require("./Block");
var BackGroundBlock_1 = require("./BackGroundBlock");
var NextBlock_1 = require("./NextBlock");
var EventCenter_1 = require("./EventCenter");
var Score_1 = require("./Score");
var BlockManange_1 = require("./BlockManange");
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
            game.nexBlock = new NextBlock_1.default({ unitBlockw: game.unitBlockw, unitBlockh: game.unitBlockh });
            game.curBlock = new Block_1.default({ unitBlockw: game.unitBlockw, unitBlockh: game.unitBlockh });
            game.bgBlocks = new BackGroundBlock_1.default({ maxNumberX: maxNumberX, maxNumberY: maxNumberY, unitBlockw: game.unitBlockw, unitBlockh: game.unitBlockh });
            game.score = new Score_1.default();
            EventCenter_1.default.addEventListener("gameover", game.gameover.bind(game));
            EventCenter_1.default.addEventListener("merge", game.handleMerge.bind(game));
            return game;
        }
        _Game.prototype.eventKeyUp = function (e) {
            console.info(e);
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
        _Game.prototype.handleMerge = function () {
            // this.curBlock.reset()
        };
        _Game.prototype.drawNextBlock = function () {
            var _this = this;
            var block = BlockManange_1.default.getNext();
            var dx = 400;
            var dy = 40;
            this.context.fillStyle = "green";
            block.pointList.forEach(function (point) {
                var x = point.x, y = point.y;
                _this.context.fillRect(dx + x * _this.unitBlockw / 2, dy + y * _this.unitBlockh / 2, (_this.unitBlockw - 1) / 2, (_this.unitBlockh - 1) / 2);
            });
        };
        _Game.prototype.drawScore = function () {
            var cxt = this.context;
            cxt.strokeStyle = "#fff";
            cxt.font = 'bold 30px consolas';
            cxt.fillText("分数:" + this.score.mark.toString(), 450, 100);
            console.info("分数:" + this.score.mark.toString());
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
},{"./BackGroundBlock":1,"./Block":2,"./BlockManange":3,"./EventCenter":4,"./NextBlock":6,"./Score":7}],6:[function(require,module,exports){
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
        var index = Math.floor(Math.random() * 100);
        this.block_shape_point_list = blockConfig_1.getBlockShape();
        this.index = index % this.block_shape_point_list.length;
        this.pointList = this.block_shape_point_list[this.index];
        EventCenter_1.default.addEventListener("merge", this.change.bind(this));
    }
    NextBlock.prototype.draw = function (ctx) {
        var _this = this;
        var dx = 400;
        var dy = 40;
        ctx.fillStyle = "green";
        this.pointList.forEach(function (point) {
            var x = point.x, y = point.y;
            ctx.fillRect(dx + x * _this.unitBlockw / 2, dy + y * _this.unitBlockh / 2, (_this.unitBlockw - 1) / 2, (_this.unitBlockh - 1) / 2);
        });
    };
    NextBlock.prototype.change = function () {
        EventCenter_1.default.fire("changeShape", { index: this.index, pointList: JSON.parse(JSON.stringify(this.pointList)) });
        var index = Math.floor(Math.random() * 100);
        this.index = index % this.block_shape_point_list.length;
        this.pointList = this.block_shape_point_list[this.index];
    };
    return NextBlock;
}());
exports.default = NextBlock;
},{"./EventCenter":4,"./blockConfig":8}],7:[function(require,module,exports){
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
},{"./EventCenter":4}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{"./Game":5}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvQmFja0dyb3VuZEJsb2NrLnRzIiwic3JjL3RzL0Jsb2NrLnRzIiwic3JjL3RzL0Jsb2NrTWFuYW5nZS50cyIsInNyYy90cy9FdmVudENlbnRlci50cyIsInNyYy90cy9HYW1lLnRzIiwic3JjL3RzL05leHRCbG9jay50cyIsInNyYy90cy9TY29yZS50cyIsInNyYy90cy9ibG9ja0NvbmZpZy50cyIsInNyYy90cy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNFQSw2Q0FBd0M7QUFDeEM7SUFNRSxrQkFBWSxFQUFpRDtZQUEvQywwQkFBVSxFQUFFLDBCQUFVLEVBQUcsMEJBQVUsRUFBQywwQkFBVTtRQUw1RCxXQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ1osZUFBVSxHQUFVLENBQUMsQ0FBQTtRQUNyQixlQUFVLEdBQVUsQ0FBQyxDQUFBO1FBQ3JCLGVBQVUsR0FBVSxFQUFFLENBQUE7UUFDdEIsZUFBVSxHQUFVLEVBQUUsQ0FBQTtRQUVwQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtRQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLElBQUksR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN2QjtRQUVELHFCQUFZLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7UUFDcEUscUJBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUNsRSxxQkFBWSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBRXhFLENBQUM7SUFFRCx1QkFBSSxHQUFKLFVBQUssR0FBNEI7UUFBakMsaUJBYUM7UUFaQyxHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3pCLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsQ0FBQztnQkFDakIsSUFBRyxHQUFHLEVBQUM7b0JBQ0wsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsS0FBSSxDQUFDLFVBQVUsRUFBRSxLQUFJLENBQUMsVUFBVSxHQUFDLENBQUMsRUFBRSxLQUFJLENBQUMsVUFBVSxHQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM5RjtxQkFDRztvQkFDRixHQUFHLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztvQkFDMUIsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsS0FBSSxDQUFDLFVBQVUsRUFBRSxLQUFJLENBQUMsVUFBVSxFQUFFLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDNUY7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDhCQUFXLEdBQVgsVUFBWSxLQUFZO1FBQ3RCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxFQUFRLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFoQixDQUFnQixDQUFDLENBQUMsQ0FBQztRQUN0RSxJQUFJLElBQUksS0FBSyxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFFN0IsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsK0JBQVksR0FBWixVQUFhLEtBQVc7UUFDdEIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDdEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLEVBQVEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksSUFBSSxLQUFLLFNBQVMsR0FBQyxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFFdkMsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsOEJBQVcsR0FBWCxVQUFZLEtBQVc7UUFDckIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbkMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLEVBQVEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLElBQUcsSUFBSSxLQUFLLFNBQVMsR0FBRSxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFFdkMsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUUxQyxDQUFDO0lBRUQsMkJBQVEsR0FBUixVQUFTLEtBQVc7UUFDbEIsSUFBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFDO1lBRXpCLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELDRCQUFTLEdBQVQsVUFBVSxLQUFXO1FBQ25CLElBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBQztZQUMxQixLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sSUFBSSxDQUFBO1NBQ1o7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCwyQkFBUSxHQUFSLFVBQVMsS0FBVztRQUNsQixJQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUM7WUFDekIsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN2QjthQUFJO1lBQ0gsSUFBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUM7Z0JBRW5CLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xCLHFCQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQzNCO1NBQ0Y7SUFDSCxDQUFDO0lBQ0QsNkJBQVUsR0FBVixVQUFXLEtBQVc7UUFDcEIsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQztRQUN0RSxLQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsZ0NBQWEsR0FBYjtRQUVFLE9BQU8sSUFBSSxDQUFDO0lBRWQsQ0FBQztJQUVELDZCQUFVLEdBQVY7UUFDRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUksSUFBRSxPQUFBLElBQUksR0FBQyxDQUFDLEVBQU4sQ0FBTSxDQUFDLENBQUE7UUFDMUMsSUFBRyxFQUFFLEVBQUU7WUFDTCxxQkFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtTQUM5QjtRQUNELE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVELDBCQUFPLEdBQVAsVUFBUSxLQUFZO1FBQXBCLGlCQVFDO1FBUEMsSUFBSTtZQUNGLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUMzQixVQUFBLElBQUksSUFBSSxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFuRCxDQUFtRCxDQUM1RCxDQUFDO1NBQ0g7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sSUFBSSxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRUQsZ0NBQWEsR0FBYixVQUFjLE1BQXNCO1FBQXBDLGlCQU1DO1FBTEMsSUFBSTtZQUNGLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQTNCLENBQTJCLENBQUMsQ0FBQztTQUMzRDtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxJQUFJLENBQUM7U0FDYjtJQUNILENBQUM7SUFFRCx3QkFBSyxHQUFMLFVBQU0sS0FBWTtRQUFsQixpQkFNQztRQUxDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtZQUMxQixLQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtJQUNyQixDQUFDO0lBRUQsK0JBQVksR0FBWjtRQUFBLGlCQTJCQztRQTFCQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBRyxPQUFBLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUUsT0FBTyxJQUFLLE9BQUEsSUFBSSxHQUFDLE9BQU8sRUFBWixDQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQTlDLENBQThDLENBQUUsQ0FBQTtRQUVoRixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUE7UUFDbEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU0sRUFBQyxLQUFLO1lBQ3ZCLElBQUcsTUFBTSxLQUFLLEtBQUksQ0FBQyxVQUFVLEVBQUM7Z0JBQzVCLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdkI7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNGLElBQUcsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQ3ZCLE9BQU8sS0FBSyxDQUFDO1FBRWYsSUFBRyxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBQztZQUN4QixxQkFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUMsR0FBRyxDQUFDLENBQUE7U0FDbEM7YUFBSyxJQUFHLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFDO1lBQzlCLHFCQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBQyxHQUFHLENBQUMsQ0FBQTtTQUNsQzthQUFLLElBQUcsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUM7WUFDOUIscUJBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQ2xDO1FBRUQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFFBQVE7WUFDeEIsS0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN6RCxDQUFDLENBQUMsQ0FBQTtRQUVGLHFCQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNILGVBQUM7QUFBRCxDQXJLQSxBQXFLQyxJQUFBO0FBRUQsa0JBQWUsUUFBUSxDQUFDOzs7O0FDeEt4Qiw2Q0FBMkM7QUFDM0MsNkNBQXVDO0FBQ3ZDO0lBVUUsZUFBWSxFQUF1QjtZQUF0QiwwQkFBVSxFQUFDLDBCQUFVO1FBVGxDLGNBQVMsR0FBbUIsRUFBRSxDQUFDO1FBQy9CLFVBQUssR0FBRyxDQUFDLENBQUM7UUFDVixlQUFVLEdBQVUsRUFBRSxDQUFDO1FBQ3ZCLGVBQVUsR0FBVSxFQUFFLENBQUM7UUFFdkIsTUFBQyxHQUFHLENBQUMsQ0FBQztRQUNOLE1BQUMsR0FBRyxDQUFDLENBQUM7UUFDTiwyQkFBc0IsR0FBRyxFQUFFLENBQUM7UUFHMUIsSUFBSSxDQUFDLFVBQVUsR0FBRSxVQUFVLENBQUM7UUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRSxVQUFVLENBQUM7UUFFNUIsSUFBSyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFFMUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFBO1FBRWIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUE7UUFDZCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsMkJBQWEsRUFBRSxDQUFBO1FBQzdDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUM7UUFDeEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pELE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNoQyxxQkFBVyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFFL0UsQ0FBQztJQUNELGlDQUFpQixHQUFqQixVQUFrQixFQUFpQjtZQUFoQixnQkFBSyxFQUFDLHdCQUFTO1FBQ2hDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtJQUM1QixDQUFDO0lBRUQscUJBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDWixDQUFDO0lBQ0QseUJBQVMsR0FBVCxVQUFVLEdBQWdCO1FBQTFCLGlCQVVDO1FBVlMsb0JBQUEsRUFBQSxRQUFnQjtRQUN4QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtZQUM1QixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE9BQU8sQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsb0JBQUksR0FBSixVQUFLLEdBQTRCO1FBQWpDLGlCQUtDO1FBSkcsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7WUFDM0IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsVUFBVSxFQUFFLEtBQUksQ0FBQyxVQUFVLEdBQUMsQ0FBQyxFQUFFLEtBQUksQ0FBQyxVQUFVLEdBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekcsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0gsWUFBQztBQUFELENBekRBLEFBeURDLElBQUE7QUFFRCxrQkFBZSxLQUFLLENBQUM7Ozs7QUMvRHJCLGlDQUEyQjtBQUMzQiw2Q0FBdUM7QUFDdkM7SUFZSTtRQUNJLHFCQUFXLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7SUFDakYsQ0FBQztJQVhPLG1CQUFPLEdBQWQ7UUFDRyxJQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUM7WUFDckIsT0FBTyxXQUFXLENBQUMsU0FBUyxDQUFDO1NBQ2hDO2FBQ0c7WUFDQSxXQUFXLENBQUMsU0FBUyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7WUFDcEMsT0FBTyxXQUFXLENBQUMsU0FBUyxDQUFBO1NBQy9CO0lBQ0wsQ0FBQztJQUlNLGtCQUFNLEdBQWI7UUFDSSxXQUFXLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM3QyxXQUFXLENBQUMsU0FBUyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUE7SUFFdkMsQ0FBQztJQUVNLGtCQUFNLEdBQWI7UUFDSSxJQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUM7WUFDckIsT0FBTyxXQUFXLENBQUMsU0FBUyxDQUFDO1NBQ2hDO2FBQ0c7WUFDQSxXQUFXLENBQUMsU0FBUyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7WUFDcEMsT0FBTyxXQUFXLENBQUMsU0FBUyxDQUFBO1NBQy9CO0lBQ0wsQ0FBQztJQTVCTyxvQkFBUSxHQUFTLElBQUksQ0FBQztJQUN0QixxQkFBUyxHQUFTLElBQUksQ0FBQztJQTRCbkMsa0JBQUM7Q0E5QkQsQUE4QkMsSUFBQTtBQUVELGtCQUFnQixXQUFXLENBQUM7Ozs7QUNsQzVCLElBQU0sV0FBVyxHQUFHO0lBQ2hCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQTtJQUNwQjtRQUdJO1lBQ0ksSUFBRyxDQUFDLFNBQVMsRUFBQztnQkFDVixTQUFTLEdBQUcsSUFBSSxDQUFDO2FBQ3BCO1lBQ0QsU0FBUyxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUE7UUFDL0IsQ0FBQztRQUVELHVDQUFnQixHQUFoQixVQUFpQixTQUFTLEVBQUMsUUFBUTtZQUMvQixJQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsRUFBQztnQkFDN0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUE7YUFDcEM7WUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRCxDQUFDO1FBQ0QsMENBQW1CLEdBQW5CLFVBQW9CLFNBQVMsRUFBQyxRQUFRO1lBQ3RDLElBQUksR0FBRyxHQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDdkMsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFBLElBQUksSUFBRSxPQUFBLElBQUksS0FBSyxRQUFRLEVBQWpCLENBQWlCLENBQUMsQ0FBQztZQUNuRCxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixDQUFDO1FBRUQsMkJBQUksR0FBSixVQUFLLFNBQWdCLEVBQUMsS0FBVTtZQUM1QixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtnQkFDckUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2YsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0wsbUJBQUM7SUFBRCxDQTVCQSxBQTRCQyxJQUFBO0lBQ0QsT0FBTyxZQUFZLENBQUE7QUFDdkIsQ0FBQyxFQUFFLENBQUE7QUFDSCxJQUFNLFNBQVMsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0FBRXBDLGtCQUFlLFNBQVMsQ0FBQTs7OztBQ25DeEIsaUNBQTRCO0FBRTVCLHFEQUF5QztBQUN6Qyx5Q0FBbUM7QUFDbkMsNkNBQXFDO0FBQ3JDLGlDQUEyQjtBQUMzQiwrQ0FBd0M7QUFDeEMsSUFBTSxJQUFJLEdBQUcsQ0FBQztJQUNaLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztJQUNoQjtRQWlCRSxlQUFZLEVBQXdEO2dCQUF0RCxvQkFBTyxFQUFFLDBCQUFVLEVBQUUsMEJBQVUsRUFBQyx3QkFBUyxFQUFDLDBCQUFVO1lBaEJsRSxlQUFVLEdBQVcsQ0FBQyxDQUFDO1lBY3ZCLFdBQU0sR0FBVSxRQUFRLENBQUM7WUFJdkIsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDVCxJQUFJLEdBQUcsSUFBSSxDQUFDO2FBQ2I7WUFDRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFL0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUFBO1lBQ3pDLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQTtZQUN4QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksbUJBQVMsQ0FBQyxFQUFDLFVBQVUsRUFBQyxJQUFJLENBQUMsVUFBVSxFQUFDLFVBQVUsRUFBQyxJQUFJLENBQUMsVUFBVSxFQUFDLENBQUMsQ0FBQTtZQUN0RixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksZUFBSyxDQUFDLEVBQUMsVUFBVSxFQUFDLElBQUksQ0FBQyxVQUFVLEVBQUMsVUFBVSxFQUFDLElBQUksQ0FBQyxVQUFVLEVBQUMsQ0FBQyxDQUFDO1lBQ25GLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSx5QkFBUSxDQUFDLEVBQUUsVUFBVSxZQUFBLEVBQUUsVUFBVSxZQUFBLEVBQUMsVUFBVSxFQUFDLElBQUksQ0FBQyxVQUFVLEVBQUMsVUFBVSxFQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1lBRS9HLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQTtZQUV4QixxQkFBUyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBQy9ELHFCQUFTLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7WUFHL0QsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsMEJBQVUsR0FBVixVQUFXLENBQUM7WUFDVixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxFQUFFLEVBQUU7Z0JBQ3BCLHFCQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7Z0JBQzFDLDZDQUE2QzthQUM5QztpQkFBTSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssRUFBRSxFQUFFO2dCQUMzQixxQkFBUyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO2dCQUMzQyw2Q0FBNkM7YUFDNUM7aUJBQU0sSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLEVBQUUsRUFBRTtnQkFDM0IscUJBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtnQkFDeEMsMkNBQTJDO2FBQzVDO2lCQUFNLElBQUcsQ0FBQyxDQUFDLE9BQU8sS0FBSyxFQUFFLEVBQUM7Z0JBQ3pCLHFCQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2FBQzFCO1FBQ0gsQ0FBQztRQUdELHVCQUFPLEdBQVA7WUFDSSxJQUFHLElBQUksQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFDO2dCQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQTtnQkFDdEIsOEJBQThCO2dCQUM5Qix5RkFBeUY7Z0JBQ3pGLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTthQUNmO1FBQ0wsQ0FBQztRQUNELDJCQUFXLEdBQVg7WUFDRSx3QkFBd0I7UUFDMUIsQ0FBQztRQUVELDZCQUFhLEdBQWI7WUFBQSxpQkFVQztZQVRDLElBQUksS0FBSyxHQUFHLHNCQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbEMsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDO1lBQ2IsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO1lBQ2pDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSztnQkFDdEIsSUFBQSxXQUFDLEVBQUMsV0FBQyxDQUFVO2dCQUNsQixLQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUMsQ0FBQyxHQUFHLEtBQUksQ0FBQyxVQUFVLEdBQUMsQ0FBQyxFQUFDLEVBQUUsR0FBRSxDQUFDLEdBQUcsS0FBSSxDQUFDLFVBQVUsR0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFJLENBQUMsVUFBVSxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEtBQUksQ0FBQyxVQUFVLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7WUFFMUgsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO1FBRUQseUJBQVMsR0FBVDtZQUNFLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDdkIsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7WUFDekIsR0FBRyxDQUFDLElBQUksR0FBRyxvQkFBb0IsQ0FBQztZQUNoQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUcsR0FBRyxDQUFDLENBQUM7WUFDMUQsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxDQUFDO1FBR0QscUJBQUssR0FBTDtZQUNFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFBO1lBQ3RCLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RELG1DQUFtQztZQUNuQyxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUU5QyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7YUFFdEM7WUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNoQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7WUFDaEIsSUFBRyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVE7Z0JBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNoRSwrQkFBK0I7UUFDL0IsQ0FBQztRQUVELHdCQUFRLEdBQVI7WUFDSSxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQTtRQUM1QixDQUFDO1FBQ0gsWUFBQztJQUFELENBcEhBLEFBb0hDLElBQUE7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFTCxrQkFBZSxJQUFJLENBQUM7Ozs7QUNsSXBCLDZDQUFzQztBQUV0Qyw2Q0FBMkM7QUFDM0M7SUFNSSxtQkFBWSxFQUF1QjtZQUF0QiwwQkFBVSxFQUFDLDBCQUFVO1FBTGxDLGNBQVMsR0FBbUIsRUFBRSxDQUFDO1FBQy9CLDJCQUFzQixHQUFHLEVBQUUsQ0FBQTtRQUMzQixVQUFLLEdBQVUsQ0FBQyxDQUFDO1FBSWIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFFNUMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLDJCQUFhLEVBQUUsQ0FBQTtRQUM3QyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV6RCxxQkFBUyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQzlELENBQUM7SUFHRCx3QkFBSSxHQUFKLFVBQUssR0FBNEI7UUFBakMsaUJBV0M7UUFUQSxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUM7UUFDWixJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDWixHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUs7WUFDckIsSUFBQSxXQUFDLEVBQUMsV0FBQyxDQUFVO1lBQ2xCLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsVUFBVSxHQUFDLENBQUMsRUFBQyxFQUFFLEdBQUUsQ0FBQyxHQUFHLEtBQUksQ0FBQyxVQUFVLEdBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSSxDQUFDLFVBQVUsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFJLENBQUMsVUFBVSxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWpILENBQUMsQ0FBQyxDQUFBO0lBRUosQ0FBQztJQUNELDBCQUFNLEdBQU47UUFDSSxxQkFBUyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUMsRUFBQyxLQUFLLEVBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQTtRQUVyRyxJQUFLLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUM1QyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBQ0wsZ0JBQUM7QUFBRCxDQXRDQSxBQXNDQyxJQUFBO0FBRUQsa0JBQWUsU0FBUyxDQUFDOzs7O0FDM0N6Qiw2Q0FBc0M7QUFFdEM7SUFFSSxlQUFZLElBQWU7UUFBZixxQkFBQSxFQUFBLFFBQWU7UUFEM0IsU0FBSSxHQUFVLENBQUMsQ0FBQztRQUVaLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWpCLHFCQUFTLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDbkUsQ0FBQztJQUVELHdCQUFRLEdBQVIsVUFBUyxLQUFZO1FBQ2pCLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFBO0lBQ3RCLENBQUM7SUFDRCxvQkFBSSxHQUFKLFVBQUssR0FBNEI7SUFFakMsQ0FBQztJQUNMLFlBQUM7QUFBRCxDQWRBLEFBY0MsSUFBQTtBQUVELGtCQUFlLEtBQUssQ0FBQzs7OztBQ2xCckIsSUFBTSxPQUFPLEdBQUc7SUFDWjtRQUNJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNSO0lBQ0Q7UUFDSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNWO0lBQ0Q7UUFDSSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7S0FDUjtJQUNEO1FBQ0ksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7S0FDVjtDQUNKLENBQUE7QUFFRCxJQUFNLE9BQU8sR0FBRztJQUNaO1FBQ0ksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ1I7SUFDRDtRQUNJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNSO0NBQ0osQ0FBQTtBQUVELElBQU0sT0FBTyxHQUFHO0lBQ1o7UUFDSSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7S0FDUjtJQUNEO1FBQ0ksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7S0FDVjtDQUNKLENBQUE7QUFFRCxJQUFNLE9BQU8sR0FBRztJQUNaO1FBQ0ksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ1I7SUFDRDtRQUNJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ1Y7Q0FDSixDQUFBO0FBRUQsSUFBTSxVQUFVLEdBQUc7SUFDZjtRQUNJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ1o7SUFDRDtRQUNJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNaO0NBQ0osQ0FBQTtBQUVELElBQU0sV0FBVyxHQUFHO0lBQ2hCO1FBQ0ksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ1I7SUFDRDtRQUNJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ1Y7SUFDRDtRQUNJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNSO0lBQ0Q7UUFDSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNWO0NBQ0osQ0FBQTtBQUVELHNCQUFzQjtBQUN0QixRQUFRO0FBQ1IsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixtQkFBbUI7QUFDbkIsU0FBUztBQUNULFFBQVE7QUFDUixtQkFBbUI7QUFDbkIsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixRQUFRO0FBQ1IsSUFBSTtBQUdKLElBQU0sZUFBZSxHQUFHLENBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUMsT0FBTyxFQUFDLFVBQVUsRUFBQyxXQUFXLENBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLLElBQUUsT0FBQSxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtJQUMxRyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRSxFQUFDLENBQUM7UUFDZCxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFDLENBQUM7WUFDYixJQUFHLEdBQUcsRUFBQztnQkFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxHQUFBLEVBQUMsQ0FBQyxHQUFBLEVBQUMsQ0FBQyxDQUFBO2FBQ2pCO1FBQ0wsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQTtJQUNGLE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQyxDQUFDLEVBVjhGLENBVTlGLENBQUMsQ0FBQztBQVFLLDBDQUFlO0FBTHhCLElBQU0sYUFBYSxHQUFHO0lBQ2xCLElBQUksR0FBRyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUM7SUFDakMsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUMzRCxDQUFDLENBQUE7QUFFeUIsc0NBQWE7Ozs7QUMxSHZDLCtCQUEwQjtBQUUxQixJQUFJLE1BQU0sR0FBc0IsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwRSxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbkIsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTTtBQUMzQixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNO0FBQzNCLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxDQUFBLGVBQWU7QUFDbkMsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLENBQUEsZ0JBQWdCO0FBRXJDLElBQUksSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLEVBQUUsT0FBTyxTQUFBLEVBQUUsVUFBVSxZQUFBLEVBQUUsVUFBVSxZQUFBLEVBQUMsU0FBUyxXQUFBLEVBQUMsVUFBVSxZQUFBLEVBQUMsQ0FBQyxDQUFDO0FBRTdFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7QWN0b3IsUE9JTlRfVCB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xyXG5pbXBvcnQgQmxvY2sgZnJvbSBcIi4vQmxvY2tcIlxyXG5pbXBvcnQgRVZFTlRfQ0VOVEVSIGZyb20gXCIuL0V2ZW50Q2VudGVyXCJcclxuY2xhc3MgQkdCbG9ja3MgaW1wbGVtZW50cyBBY3RvciB7XHJcbiAgbWF0cml4ID0gW107XHJcbiAgbWF4TnVtYmVyWDpudW1iZXIgPSAwXHJcbiAgbWF4TnVtYmVyWTpudW1iZXIgPSAwXHJcbiAgdW5pdEJsb2NrdzpudW1iZXIgPSAxMFxyXG4gIHVuaXRCbG9ja2g6bnVtYmVyID0gMTBcclxuICBjb25zdHJ1Y3Rvcih7IG1heE51bWJlclgsIG1heE51bWJlclksICB1bml0QmxvY2t3LHVuaXRCbG9ja2h9KSB7XHJcbiAgICB0aGlzLm1heE51bWJlclggPSBtYXhOdW1iZXJYXHJcbiAgICB0aGlzLm1heE51bWJlclkgPSBtYXhOdW1iZXJZXHJcbiAgICB0aGlzLnVuaXRCbG9ja3cgPSB1bml0QmxvY2t3O1xyXG4gICAgdGhpcy51bml0QmxvY2toID0gdW5pdEJsb2NraFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhOdW1iZXJZOyBpKyspIHtcclxuICAgICAgbGV0IGFyciA9IG5ldyBBcnJheShtYXhOdW1iZXJYKS5maWxsKDApO1xyXG4gICAgICB0aGlzLm1hdHJpeC5wdXNoKGFycik7XHJcbiAgICB9XHJcblxyXG4gICAgRVZFTlRfQ0VOVEVSLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3ZlUmlnaHRcIix0aGlzLm1vdmVSaWdodC5iaW5kKHRoaXMpKVxyXG4gICAgRVZFTlRfQ0VOVEVSLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3ZlTGVmdFwiLHRoaXMubW92ZUxlZnQuYmluZCh0aGlzKSlcclxuICAgIEVWRU5UX0NFTlRFUi5hZGRFdmVudExpc3RlbmVyKFwibW92ZUNoYW5nZVwiLHRoaXMubW92ZUNoYW5nZS5iaW5kKHRoaXMpKVxyXG5cclxuICB9XHJcblxyXG4gIGRyYXcoY3R4OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCl7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xyXG4gICAgICB0aGlzLm1hdHJpeC5mb3JFYWNoKChyb3csIHkpID0+IHtcclxuICAgICAgICByb3cuZm9yRWFjaCgodmFsLCB4KSA9PiB7XHJcbiAgICAgICAgICBpZih2YWwpe1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoeCAqIHRoaXMudW5pdEJsb2NraCwgeSAqIHRoaXMudW5pdEJsb2NraCwgdGhpcy51bml0QmxvY2toLTEsIHRoaXMudW5pdEJsb2NraC0xKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiZ3JlZW5cIjtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoeCAqIHRoaXMudW5pdEJsb2NraCwgeSAqIHRoaXMudW5pdEJsb2NraCwgdGhpcy51bml0QmxvY2toLCB0aGlzLnVuaXRCbG9ja2gpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGNhbk1vdmVMZWZ0KGJsb2NrOiBCbG9jaykge1xyXG4gICAgbGV0IG1pbnggPSBNYXRoLm1pbiguLi5ibG9jay5wb2ludExpc3QubWFwKGl0ZW0gPT4gYmxvY2sueCArIGl0ZW0ueCkpO1xyXG4gICAgaWYgKG1pbnggPT09IDApIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICBsZXQgc2hhZGVNYXRyaXggPSBibG9jay5nZXRNYXRyaXgoXCJsZWZ0XCIpO1xyXG4gICAgcmV0dXJuICF0aGlzLmlzQ3Jhc2hNYXRyaXgoc2hhZGVNYXRyaXgpO1xyXG4gIH1cclxuICBjYW5Nb3ZlUmlnaHQoYmxvY2s6QmxvY2spe1xyXG4gICAgbGV0IHN0YWdlTWF4WCA9IHRoaXMubWF0cml4WzBdLmxlbmd0aDtcclxuICAgIGxldCBtYXhYID0gTWF0aC5tYXgoLi4uYmxvY2sucG9pbnRMaXN0Lm1hcChpdGVtID0+IGJsb2NrLnggKyBpdGVtLngpKTtcclxuICAgIGlmIChtYXhYID09PSBzdGFnZU1heFgtMSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIGxldCBzaGFkZU1hdHJpeCA9IGJsb2NrLmdldE1hdHJpeChcInJpZ2h0XCIpO1xyXG4gICAgcmV0dXJuICF0aGlzLmlzQ3Jhc2hNYXRyaXgoc2hhZGVNYXRyaXgpO1xyXG4gIH1cclxuICBcclxuICBjYW5Nb3ZlRG93bihibG9jazpCbG9jayl7XHJcbiAgICBsZXQgc3RhZ2VNYXhZID0gdGhpcy5tYXRyaXgubGVuZ3RoO1xyXG4gICAgbGV0IG1heFkgPSBNYXRoLm1heCguLi5ibG9jay5wb2ludExpc3QubWFwKGl0ZW0gPT4gYmxvY2sueSArIGl0ZW0ueSkpO1xyXG4gICAgaWYobWF4WSA9PT0gc3RhZ2VNYXhZIC0xKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgbGV0IHNoYWRlTWF0cml4ID0gYmxvY2suZ2V0TWF0cml4KFwiZG93blwiKTtcclxuICAgIHJldHVybiAhdGhpcy5pc0NyYXNoTWF0cml4KHNoYWRlTWF0cml4KTtcclxuXHJcbiAgfVxyXG5cclxuICBtb3ZlTGVmdChibG9jazpCbG9jaykge1xyXG4gICAgaWYodGhpcy5jYW5Nb3ZlTGVmdChibG9jaykpe1xyXG5cclxuICAgICAgYmxvY2sueCA9IGJsb2NrLnggLSAxO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIG1vdmVSaWdodChibG9jazpCbG9jaykge1xyXG4gICAgaWYodGhpcy5jYW5Nb3ZlUmlnaHQoYmxvY2spKXtcclxuICAgICAgYmxvY2sueCA9IGJsb2NrLnggKyAxO1xyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgbW92ZURvd24oYmxvY2s6QmxvY2spIHtcclxuICAgIGlmKHRoaXMuY2FuTW92ZURvd24oYmxvY2spKXtcclxuICAgICAgYmxvY2sueSA9IGJsb2NrLnkgKyAxO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGlmKHRoaXMuaXNHYW1lb3ZlcigpKXtcclxuXHJcbiAgICAgICAgdGhpcy5tZXJnZShibG9jayk7XHJcbiAgICAgICAgRVZFTlRfQ0VOVEVSLmZpcmUoXCJtZXJnZVwiKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIG1vdmVDaGFuZ2UoYmxvY2s6QmxvY2spIHtcclxuICAgIGJsb2NrLmluZGV4ID0gKGJsb2NrLmluZGV4ICsgMSkgJSBibG9jay5ibG9ja19zaGFwZV9wb2ludF9saXN0Lmxlbmd0aDtcclxuICAgIGJsb2NrLnBvaW50TGlzdCA9IGJsb2NrLmJsb2NrX3NoYXBlX3BvaW50X2xpc3RbYmxvY2suaW5kZXhdO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBjYW5Nb3ZlQ2hhbmdlKCl7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcblxyXG4gIH1cclxuXHJcbiAgaXNHYW1lb3Zlcigpe1xyXG4gICAgbGV0IHJzID0gdGhpcy5tYXRyaXhbMF0uZmluZChpdGVtPT5pdGVtPjApXHJcbiAgICBpZihycyApe1xyXG4gICAgICBFVkVOVF9DRU5URVIuZmlyZShcImdhbWVvdmVyXCIpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZVxyXG4gIH1cclxuXHJcbiAgaXNDcmFzaChibG9jazogQmxvY2spIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJldHVybiAhIWJsb2NrLnBvaW50TGlzdC5maW5kKFxyXG4gICAgICAgIGl0ZW0gPT4gdGhpcy5tYXRyaXhbYmxvY2sueSArIGl0ZW0ueSArIDFdW2Jsb2NrLnggKyBpdGVtLnhdXHJcbiAgICAgICk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaXNDcmFzaE1hdHJpeChtYXRyaXg6IEFycmF5PFBPSU5UX1Q+KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gISFtYXRyaXguZmluZChpdGVtID0+IHRoaXMubWF0cml4W2l0ZW0ueV1baXRlbS54XSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbWVyZ2UoYmxvY2s6IEJsb2NrKSB7XHJcbiAgICBibG9jay5wb2ludExpc3QuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgdGhpcy5tYXRyaXhbYmxvY2sueSArIGl0ZW0ueV1bYmxvY2sueCArIGl0ZW0ueF0gPSAxO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5jbGVhclNvbWVSb3coKVxyXG4gIH1cclxuXHJcbiAgY2xlYXJTb21lUm93KCl7XHJcbiAgICBsZXQgYXJyID0gdGhpcy5tYXRyaXgubWFwKHJvdz0+IHJvdy5yZWR1Y2UoKGluaXQsIGN1cnJlbnQpID0+IGluaXQrY3VycmVudCwgMCkgKVxyXG5cclxuICAgIGxldCByb3dJbmRleHMgPSBbXVxyXG4gICAgYXJyLmZvckVhY2goKHN1bVZhbCxpbmRleCk9PntcclxuICAgICAgaWYoc3VtVmFsID09PSB0aGlzLm1heE51bWJlclgpe1xyXG4gICAgICAgIHJvd0luZGV4cy5wdXNoKGluZGV4KTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIGlmKHJvd0luZGV4cy5sZW5ndGggPT09IDApXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICBpZihyb3dJbmRleHMubGVuZ3RoID09PSAxKXtcclxuICAgICAgRVZFTlRfQ0VOVEVSLmZpcmUoXCJhZGRTY29yZVwiLDEwMClcclxuICAgIH1lbHNlIGlmKHJvd0luZGV4cy5sZW5ndGggPT09IDIpe1xyXG4gICAgICBFVkVOVF9DRU5URVIuZmlyZShcImFkZFNjb3JlXCIsMjUwKVxyXG4gICAgfWVsc2UgaWYocm93SW5kZXhzLmxlbmd0aCA9PT0gMyl7XHJcbiAgICAgIEVWRU5UX0NFTlRFUi5maXJlKFwiYWRkU2NvcmVcIiw0MDApXHJcbiAgICB9XHJcblxyXG4gICAgcm93SW5kZXhzLmZvckVhY2godmFsSW5kZXggPT4ge1xyXG4gICAgICB0aGlzLm1hdHJpeC5zcGxpY2UodmFsSW5kZXgsMSk7XHJcbiAgICAgIHRoaXMubWF0cml4LnVuc2hpZnQobmV3IEFycmF5KHRoaXMubWF4TnVtYmVyWCkuZmlsbCgwKSlcclxuICAgIH0pXHJcblxyXG4gICAgRVZFTlRfQ0VOVEVSLmZpcmUoXCJnZXRTY29yZVwiKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQkdCbG9ja3M7XHJcbiIsImltcG9ydCB7IEJsT0NLX1QsIFBPSU5UX1QsQWN0b3IgfSBmcm9tIFwiLi9pbnRlcmZhY2VcIjtcclxuaW1wb3J0IEJhY2tHcm91bmRCbG9ja3MgZnJvbSBcIi4vQmFja0dyb3VuZEJsb2NrXCI7XHJcbmltcG9ydCB7Z2V0QmxvY2tTaGFwZX0gZnJvbSBcIi4vYmxvY2tDb25maWdcIlxyXG5pbXBvcnQgRXZlbnRDZW50ZXIgZnJvbSBcIi4vRXZlbnRDZW50ZXJcIlxyXG5jbGFzcyBCbG9jayBpbXBsZW1lbnRzIEFjdG9yIHtcclxuICBwb2ludExpc3Q6IEFycmF5PFBPSU5UX1Q+ID0gW107XHJcbiAgaW5kZXggPSAwO1xyXG4gIHVuaXRCbG9ja2g6bnVtYmVyID0gMTA7XHJcbiAgdW5pdEJsb2NrdzpudW1iZXIgPSAxMDtcclxuXHJcbiAgeCA9IDA7XHJcbiAgeSA9IDA7XHJcbiAgYmxvY2tfc2hhcGVfcG9pbnRfbGlzdCA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3Rvcih7dW5pdEJsb2Nrdyx1bml0QmxvY2tofSkge1xyXG4gICAgdGhpcy51bml0QmxvY2t3ID11bml0QmxvY2t3O1xyXG4gICAgdGhpcy51bml0QmxvY2toID11bml0QmxvY2toO1xyXG5cclxuICAgIGxldCAgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1KVxyXG5cclxuICAgIGxldCBpbml0eCA9IDBcclxuXHJcbiAgICB0aGlzLnggPSBpbml0eFxyXG4gICAgdGhpcy5ibG9ja19zaGFwZV9wb2ludF9saXN0ID0gZ2V0QmxvY2tTaGFwZSgpXHJcbiAgICB0aGlzLmluZGV4ID0gaW5kZXggJSB0aGlzLmJsb2NrX3NoYXBlX3BvaW50X2xpc3QubGVuZ3RoO1xyXG4gICAgdGhpcy5wb2ludExpc3QgPSB0aGlzLmJsb2NrX3NoYXBlX3BvaW50X2xpc3RbdGhpcy5pbmRleF07XHJcbiAgICBjb25zb2xlLmluZm8oXCJjb25zdHJ1Y3Rvci4uLi5cIik7XHJcbiAgICBFdmVudENlbnRlci5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlU2hhcGVcIix0aGlzLmhhbmRsZUNoYW5nZVNoYXBlLmJpbmQodGhpcykpXHJcblxyXG4gIH1cclxuICBoYW5kbGVDaGFuZ2VTaGFwZSh7aW5kZXgscG9pbnRMaXN0fSl7XHJcbiAgICB0aGlzLnggPSAwO1xyXG4gICAgdGhpcy55ID0gMDtcclxuICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgIHRoaXMucG9pbnRMaXN0ID0gcG9pbnRMaXN0XHJcbiAgfVxyXG5cclxuICByZXNldCgpe1xyXG4gICAgdGhpcy54ID0gMztcclxuICAgIHRoaXMueSA9IDBcclxuICB9XHJcbiAgZ2V0TWF0cml4KGRpcjogc3RyaW5nID0gXCJcIikge1xyXG4gICAgcmV0dXJuIHRoaXMucG9pbnRMaXN0Lm1hcChpdGVtID0+IHtcclxuICAgICAgbGV0IG8gPSB7IHg6IDAsIHk6IDAgfTtcclxuICAgICAgby54ID0gaXRlbS54ICsgdGhpcy54O1xyXG4gICAgICBvLnkgPSBpdGVtLnkgKyB0aGlzLnk7XHJcbiAgICAgIG8ueCA9IGRpciA9PT0gXCJsZWZ0XCIgPyBvLnggLSAxIDogby54O1xyXG4gICAgICBvLnggPSBkaXIgPT09IFwicmlnaHRcIiA/IG8ueCArIDEgOiBvLng7XHJcbiAgICAgIG8ueSA9IGRpciA9PT0gXCJkb3duXCIgPyBvLnkgKzEgOiBvLnk7XHJcbiAgICAgIHJldHVybiBvO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIFxyXG4gIGRyYXcoY3R4OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCl7XHJcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBcImdyZWVuXCI7XHJcbiAgICAgIHRoaXMuZ2V0TWF0cml4KCkuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoaXRlbS54ICogdGhpcy51bml0QmxvY2t3LCBpdGVtLnkgKiB0aGlzLnVuaXRCbG9ja3csIHRoaXMudW5pdEJsb2Nrdy0xLCB0aGlzLnVuaXRCbG9ja3ctMSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuICBcclxuICBcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmxvY2s7XHJcbiIsImltcG9ydCBCbG9jayBmcm9tIFwiLi9CbG9ja1wiXHJcbmltcG9ydCBFdmVudENlbnRlciBmcm9tIFwiLi9FdmVudENlbnRlclwiXHJcbmNsYXNzIEJsb2NrTWFuYWdlIHtcclxuICAgICBzdGF0aWMgY3VyQmxvY2s6QmxvY2sgPSBudWxsO1xyXG4gICAgIHN0YXRpYyBuZXh0QmxvY2s6QmxvY2sgPSBudWxsO1xyXG4gICAgIHN0YXRpYyBnZXROZXh0KCl7XHJcbiAgICAgICAgaWYoQmxvY2tNYW5hZ2UubmV4dEJsb2NrKXtcclxuICAgICAgICAgICAgcmV0dXJuIEJsb2NrTWFuYWdlLm5leHRCbG9jaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgQmxvY2tNYW5hZ2UubmV4dEJsb2NrID0gbmV3IEJsb2NrKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBCbG9ja01hbmFnZS5uZXh0QmxvY2tcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIEV2ZW50Q2VudGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJhZGRTY29yZVwiLEJsb2NrTWFuYWdlLnVwZGF0ZS5iaW5kKEJsb2NrTWFuYWdlKSlcclxuICAgIH1cclxuICAgIHN0YXRpYyB1cGRhdGUoKXtcclxuICAgICAgICBCbG9ja01hbmFnZS5jdXJCbG9jayA9IEJsb2NrTWFuYWdlLmdldE5leHQoKTtcclxuICAgICAgICBCbG9ja01hbmFnZS5uZXh0QmxvY2sgPSBuZXcgQmxvY2soKVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0Q3VyKCl7XHJcbiAgICAgICAgaWYoQmxvY2tNYW5hZ2UubmV4dEJsb2NrKXtcclxuICAgICAgICAgICAgcmV0dXJuIEJsb2NrTWFuYWdlLm5leHRCbG9jaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgQmxvY2tNYW5hZ2UubmV4dEJsb2NrID0gbmV3IEJsb2NrKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBCbG9ja01hbmFnZS5uZXh0QmxvY2tcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCAgZGVmYXVsdCBCbG9ja01hbmFnZTsiLCJjb25zdCBFdmVudENlbnRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgRVZFTlRfQlVTID0gbnVsbFxyXG4gICAgY2xhc3MgX0V2ZW50Q2VudGVyIHtcclxuICAgICAgICBsaXN0ZW5lckxpc3Q6e31cclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICAgICAgaWYoIUVWRU5UX0JVUyl7XHJcbiAgICAgICAgICAgICAgICBFVkVOVF9CVVMgPSB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEVWRU5UX0JVUy5saXN0ZW5lckxpc3QgPSB7fVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsY2FsbEJhY2spe1xyXG4gICAgICAgICAgICBpZighdGhpcy5saXN0ZW5lckxpc3RbZXZlbnROYW1lXSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyTGlzdFtldmVudE5hbWVdID0gW11cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5saXN0ZW5lckxpc3RbZXZlbnROYW1lXS5wdXNoKGNhbGxCYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsY2FsbEJhY2spe1xyXG4gICAgICAgIGxldCBhcnIgPSAgdGhpcy5saXN0ZW5lckxpc3RbZXZlbnROYW1lXVxyXG4gICAgICAgIGxldCBpbmRleCA9IGFyci5maW5kSW5kZXgoaXRlbT0+aXRlbSA9PT0gY2FsbEJhY2spO1xyXG4gICAgICAgIGFyci5zcGxpY2UoaW5kZXgsMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmaXJlKGV2ZW50TmFtZTpzdHJpbmcscGFyYW0/OmFueSl7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJMaXN0W2V2ZW50TmFtZV0gJiYgdGhpcy5saXN0ZW5lckxpc3RbZXZlbnROYW1lXS5mb3JFYWNoKGZ1bmMgPT4ge1xyXG4gICAgICAgICAgICAgICAgZnVuYyhwYXJhbSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9FdmVudENlbnRlclxyXG59KClcclxuY29uc3QgRVZFTlRfQlVTID0gbmV3IEV2ZW50Q2VudGVyKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFVkVOVF9CVVMiLCJpbXBvcnQgQmxvY2sgZnJvbSBcIi4vQmxvY2tcIjtcclxuaW1wb3J0IHsgQmxPQ0tfVCB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xyXG5pbXBvcnQgQkdCbG9ja3MgZnJvbSBcIi4vQmFja0dyb3VuZEJsb2NrXCI7XHJcbmltcG9ydCBOZXh0QmxvY2sgZnJvbSBcIi4vTmV4dEJsb2NrXCJcclxuaW1wb3J0IEVWRU5UX0JVUyBmcm9tIFwiLi9FdmVudENlbnRlclwiXHJcbmltcG9ydCBTY29yZSBmcm9tIFwiLi9TY29yZVwiXHJcbmltcG9ydCBCbG9ja01hbmFnZSBmcm9tIFwiLi9CbG9ja01hbmFuZ2VcIlxyXG5jb25zdCBHYW1lID0gKGZ1bmN0aW9uKCkge1xyXG4gIGxldCBnYW1lID0gbnVsbDtcclxuICBjbGFzcyBfR2FtZSB7XHJcbiAgICBmcmFtZUluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgbWF4TnVtYmVyWDogbnVtYmVyO1xyXG4gICAgbWF4TnVtYmVyWTogbnVtYmVyO1xyXG4gICAgYXJlYVdpZHRoOiBudW1iZXI7XHJcbiAgICBhcmVhSGVpZ2h0OiBudW1iZXI7XHJcbiAgICB1bml0QmxvY2t3Om51bWJlcjtcclxuXHJcbiAgICB1bml0QmxvY2toOm51bWJlcjtcclxuICAgIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIGN1ckJsb2NrOiBCbG9jaztcclxuICAgIG5leEJsb2NrOk5leHRCbG9jaztcclxuICAgIHNjb3JlOlNjb3JlO1xyXG4gICAgYmdCbG9ja3M6IEJHQmxvY2tzO1xyXG4gICAgdGltZXJJZDpudW1iZXI7XHJcbiAgICBzdGF0dXM6c3RyaW5nID0gXCJub3JtYWxcIjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih7IGNvbnRleHQsIG1heE51bWJlclgsIG1heE51bWJlclksYXJlYVdpZHRoLGFyZWFIZWlnaHQgfSkge1xyXG5cclxuICAgICAgaWYgKCFnYW1lKSB7XHJcbiAgICAgICAgZ2FtZSA9IHRoaXM7XHJcbiAgICAgIH1cclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuZXZlbnRLZXlVcC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgIGdhbWUuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgIGdhbWUubWF4TnVtYmVyWCA9IG1heE51bWJlclg7XHJcbiAgICAgIGdhbWUubWF4TnVtYmVyWSA9IG1heE51bWJlclk7XHJcbiAgICAgIGdhbWUuYXJlYVdpZHRoID0gYXJlYVdpZHRoO1xyXG4gICAgICBnYW1lLmFyZWFIZWlnaHQgPSBhcmVhSGVpZ2h0O1xyXG4gICAgICBnYW1lLnVuaXRCbG9ja2ggPSBhcmVhSGVpZ2h0IC8gbWF4TnVtYmVyWVxyXG4gICAgICBnYW1lLnVuaXRCbG9ja3cgPSBhcmVhV2lkdGggLyBtYXhOdW1iZXJYXHJcbiAgICAgIGdhbWUubmV4QmxvY2sgPSBuZXcgTmV4dEJsb2NrKHt1bml0QmxvY2t3OmdhbWUudW5pdEJsb2Nrdyx1bml0QmxvY2toOmdhbWUudW5pdEJsb2NraH0pXHJcbiAgICAgIGdhbWUuY3VyQmxvY2sgPSBuZXcgQmxvY2soe3VuaXRCbG9ja3c6Z2FtZS51bml0QmxvY2t3LHVuaXRCbG9ja2g6Z2FtZS51bml0QmxvY2tofSk7XHJcbiAgICAgIGdhbWUuYmdCbG9ja3MgPSBuZXcgQkdCbG9ja3MoeyBtYXhOdW1iZXJYLCBtYXhOdW1iZXJZLHVuaXRCbG9ja3c6Z2FtZS51bml0QmxvY2t3LHVuaXRCbG9ja2g6Z2FtZS51bml0QmxvY2toIH0pO1xyXG5cclxuICAgICAgZ2FtZS5zY29yZSA9IG5ldyBTY29yZSgpXHJcblxyXG4gICAgICBFVkVOVF9CVVMuYWRkRXZlbnRMaXN0ZW5lcihcImdhbWVvdmVyXCIsZ2FtZS5nYW1lb3Zlci5iaW5kKGdhbWUpKVxyXG4gICAgICBFVkVOVF9CVVMuYWRkRXZlbnRMaXN0ZW5lcihcIm1lcmdlXCIsZ2FtZS5oYW5kbGVNZXJnZS5iaW5kKGdhbWUpKVxyXG4gICAgICBcclxuXHJcbiAgICAgIHJldHVybiBnYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGV2ZW50S2V5VXAoZSkge1xyXG4gICAgICBjb25zb2xlLmluZm8oZSk7XHJcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDM4KSB7XHJcbiAgICAgICAgRVZFTlRfQlVTLmZpcmUoXCJtb3ZlQ2hhbmdlXCIsdGhpcy5jdXJCbG9jaylcclxuICAgICAgICAvLyBfdGhpcy5jdXJCbG9jay5tb3ZlQ2hhbmdlKF90aGlzLmJnQmxvY2tzKTtcclxuICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM5KSB7XHJcbiAgICAgICAgRVZFTlRfQlVTLmZpcmUoXCJtb3ZlUmlnaHRcIix0aGlzLmN1ckJsb2NrKVxyXG4gICAgICAvLyAgX3RoaXMuY3VyQmxvY2subW92ZVJpZ2h0KF90aGlzLmJnQmxvY2tzKTtcclxuICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM3KSB7XHJcbiAgICAgICAgRVZFTlRfQlVTLmZpcmUoXCJtb3ZlTGVmdFwiLHRoaXMuY3VyQmxvY2spXHJcbiAgICAgICAgLy8gX3RoaXMuY3VyQmxvY2subW92ZUxlZnQoX3RoaXMuYmdCbG9ja3MpO1xyXG4gICAgICB9IGVsc2UgaWYoZS5rZXlDb2RlID09PSAxMyl7XHJcbiAgICAgICAgRVZFTlRfQlVTLmZpcmUoXCJyZVN0YXJ0XCIpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHJlU3RhcnQoKXtcclxuICAgICAgICBpZih0aGlzLnN0YXR1cyA9PT0gXCJnYW1lb3ZlclwiKXtcclxuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBcIm5vcm1hbFwiXHJcbiAgICAgICAgICAgIC8vIHRoaXMuY3VyQmxvY2sgPSBuZXcgQmxvY2soKVxyXG4gICAgICAgICAgICAvLyB0aGlzLmJnQmxvY2tzID0gbmV3IEJHQmxvY2tzKHsgbWF4TnVtYmVyWDp0aGlzLm1heE51bWJlclgsbWF4TnVtYmVyWTp0aGlzLm1heE51bWJlcll9KVxyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0KClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBoYW5kbGVNZXJnZSgpe1xyXG4gICAgICAvLyB0aGlzLmN1ckJsb2NrLnJlc2V0KClcclxuICAgIH1cclxuXHJcbiAgICBkcmF3TmV4dEJsb2NrKCl7XHJcbiAgICAgIGxldCBibG9jayA9IEJsb2NrTWFuYWdlLmdldE5leHQoKTtcclxuICAgICAgbGV0IGR4ID0gNDAwO1xyXG4gICAgICBsZXQgZHkgPSA0MDtcclxuICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcclxuICAgICAgYmxvY2sucG9pbnRMaXN0LmZvckVhY2gocG9pbnQ9PntcclxuICAgICAgICBsZXQge3gseX0gPSBwb2ludDtcclxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoZHgreCAqIHRoaXMudW5pdEJsb2Nrdy8yLGR5KyB5ICogdGhpcy51bml0QmxvY2toLzIsICh0aGlzLnVuaXRCbG9ja3ctMSkvMiwgKHRoaXMudW5pdEJsb2NraC0xKS8yKTtcclxuXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZHJhd1Njb3JlKCl7XHJcbiAgICAgIGxldCBjeHQgPSB0aGlzLmNvbnRleHQ7XHJcbiAgICAgIGN4dC5zdHJva2VTdHlsZSA9IFwiI2ZmZlwiO1xyXG4gICAgICBjeHQuZm9udCA9ICdib2xkIDMwcHggY29uc29sYXMnO1xyXG4gICAgICBjeHQuZmlsbFRleHQoXCLliIbmlbA6XCIrdGhpcy5zY29yZS5tYXJrLnRvU3RyaW5nKCksIDQ1MCAsIDEwMCk7XHJcbiAgICAgIGNvbnNvbGUuaW5mbyhcIuWIhuaVsDpcIit0aGlzLnNjb3JlLm1hcmsudG9TdHJpbmcoKSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgIHRoaXMuZnJhbWVJbmRleCsrO1xyXG4gICAgICBsZXQgY3h0ID0gdGhpcy5jb250ZXh0XHJcbiAgICAgIGN4dC5jbGVhclJlY3QoMCwwLGN4dC5jYW52YXMud2lkdGgsY3h0LmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAvLyAgIGNvbnNvbGUuaW5mbyh0aGlzLmZyYW1lSW5kZXgpO1xyXG4gICAgICBpZiAodGhpcy5mcmFtZUluZGV4ICUgTWF0aC5jZWlsKDEwMDAvNTApID09PSAwKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYmdCbG9ja3MubW92ZURvd24odGhpcy5jdXJCbG9jaylcclxuICAgICAgICBcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmN1ckJsb2NrLmRyYXcodGhpcy5jb250ZXh0KVxyXG4gICAgICB0aGlzLm5leEJsb2NrLmRyYXcodGhpcy5jb250ZXh0KVxyXG4gICAgICB0aGlzLmJnQmxvY2tzLmRyYXcodGhpcy5jb250ZXh0KVxyXG4gICAgICB0aGlzLmRyYXdTY29yZSgpXHJcbiAgICAgIGlmKHRoaXMuc3RhdHVzID09PSBcIm5vcm1hbFwiKVxyXG4gICAgICAgIHRoaXMudGltZXJJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnN0YXJ0LmJpbmQodGhpcykpO1xyXG4gICAgLy8gICBjb25zb2xlLmluZm8odGhpcy50aW1lcklkKVxyXG4gICAgfVxyXG5cclxuICAgIGdhbWVvdmVyKCl7XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBcImdhbWVvdmVyXCJcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBfR2FtZTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEdhbWU7XHJcbiIsImltcG9ydCBFVkVOVF9CVVMgZnJvbSBcIi4vRXZlbnRDZW50ZXJcIjtcclxuaW1wb3J0IHtBY3RvcixQT0lOVF9UfSBmcm9tIFwiLi9pbnRlcmZhY2VcIlxyXG5pbXBvcnQge2dldEJsb2NrU2hhcGV9IGZyb20gXCIuL2Jsb2NrQ29uZmlnXCJcclxuY2xhc3MgTmV4dEJsb2NrIGltcGxlbWVudHMgQWN0b3J7XHJcbiAgICBwb2ludExpc3Q6IEFycmF5PFBPSU5UX1Q+ID0gW107XHJcbiAgICBibG9ja19zaGFwZV9wb2ludF9saXN0ID0gW11cclxuICAgIGluZGV4Om51bWJlciA9IDA7XHJcbiAgICB1bml0QmxvY2t3Om51bWJlcjtcclxuICAgIHVuaXRCbG9ja2g6bnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3Ioe3VuaXRCbG9ja3csdW5pdEJsb2NraH0pe1xyXG4gICAgICAgIHRoaXMudW5pdEJsb2NrdyA9IHVuaXRCbG9ja3c7XHJcbiAgICAgICAgdGhpcy51bml0QmxvY2toID0gdW5pdEJsb2NraDtcclxuICAgICAgICBsZXQgIGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKVxyXG5cclxuICAgICAgICB0aGlzLmJsb2NrX3NoYXBlX3BvaW50X2xpc3QgPSBnZXRCbG9ja1NoYXBlKClcclxuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXggJSB0aGlzLmJsb2NrX3NoYXBlX3BvaW50X2xpc3QubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0ID0gdGhpcy5ibG9ja19zaGFwZV9wb2ludF9saXN0W3RoaXMuaW5kZXhdO1xyXG5cclxuICAgICAgICBFVkVOVF9CVVMuYWRkRXZlbnRMaXN0ZW5lcihcIm1lcmdlXCIsdGhpcy5jaGFuZ2UuYmluZCh0aGlzKSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJhdyhjdHg6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKXtcclxuXHJcbiAgICAgbGV0IGR4ID0gNDAwO1xyXG4gICAgICBsZXQgZHkgPSA0MDtcclxuICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcclxuICAgICAgdGhpcy5wb2ludExpc3QuZm9yRWFjaChwb2ludD0+e1xyXG4gICAgICAgIGxldCB7eCx5fSA9IHBvaW50O1xyXG4gICAgICAgIGN0eC5maWxsUmVjdChkeCt4ICogdGhpcy51bml0QmxvY2t3LzIsZHkrIHkgKiB0aGlzLnVuaXRCbG9ja2gvMiwgKHRoaXMudW5pdEJsb2Nrdy0xKS8yLCAodGhpcy51bml0QmxvY2toLTEpLzIpO1xyXG5cclxuICAgICAgfSlcclxuXHJcbiAgICB9XHJcbiAgICBjaGFuZ2UoKXtcclxuICAgICAgICBFVkVOVF9CVVMuZmlyZShcImNoYW5nZVNoYXBlXCIse2luZGV4OnRoaXMuaW5kZXgscG9pbnRMaXN0OkpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5wb2ludExpc3QpKX0pXHJcblxyXG4gICAgICAgIGxldCAgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApXHJcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4ICUgdGhpcy5ibG9ja19zaGFwZV9wb2ludF9saXN0Lmxlbmd0aDtcclxuICAgICAgICB0aGlzLnBvaW50TGlzdCA9IHRoaXMuYmxvY2tfc2hhcGVfcG9pbnRfbGlzdFt0aGlzLmluZGV4XTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTmV4dEJsb2NrOyIsImltcG9ydCBFVkVOVF9CVVMgZnJvbSBcIi4vRXZlbnRDZW50ZXJcIjtcclxuaW1wb3J0IHtBY3Rvcn0gZnJvbSBcIi4vaW50ZXJmYWNlXCJcclxuY2xhc3MgU2NvcmUgaW1wbGVtZW50cyBBY3RvcntcclxuICAgIG1hcms6bnVtYmVyID0gMDtcclxuICAgIGNvbnN0cnVjdG9yKG1hcms6bnVtYmVyID0gMCl7XHJcbiAgICAgICAgdGhpcy5tYXJrID0gbWFyaztcclxuXHJcbiAgICAgICAgRVZFTlRfQlVTLmFkZEV2ZW50TGlzdGVuZXIoXCJhZGRTY29yZVwiLHRoaXMuYWRkU2NvcmUuYmluZCh0aGlzKSlcclxuICAgIH1cclxuXHJcbiAgICBhZGRTY29yZShwb2ludDpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMubWFyayArPSBwb2ludFxyXG4gICAgfVxyXG4gICAgZHJhdyhjdHg6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKXtcclxuICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTY29yZTsiLCJjb25zdCBMX1NoYXBlID0gW1xyXG4gICAgW1xyXG4gICAgICAgIFsxLDBdLFxyXG4gICAgICAgIFsxLDBdLFxyXG4gICAgICAgIFsxLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDEsMV0sXHJcbiAgICAgICAgWzEsMCwwXSxcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzEsMV0sXHJcbiAgICAgICAgWzAsMV0sXHJcbiAgICAgICAgWzAsMV1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzAsMCwxXSxcclxuICAgICAgICBbMSwxLDFdLFxyXG4gICAgXVxyXG5dXHJcblxyXG5jb25zdCBPX1NoYXBlID0gW1xyXG4gICAgW1xyXG4gICAgICAgIFsxLDFdLFxyXG4gICAgICAgIFsxLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFsxLDFdLFxyXG4gICAgICAgIFsxLDFdLFxyXG4gICAgXVxyXG5dXHJcblxyXG5jb25zdCBOX1NoYXBlID0gW1xyXG4gICAgW1xyXG4gICAgICAgIFsxLDBdLFxyXG4gICAgICAgIFsxLDFdLFxyXG4gICAgICAgIFswLDFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFswLDEsMV0sXHJcbiAgICAgICAgWzEsMSwwXSxcclxuICAgIF1cclxuXVxyXG5cclxuY29uc3QgWl9TaGFwZSA9IFtcclxuICAgIFtcclxuICAgICAgICBbMCwxXSxcclxuICAgICAgICBbMSwxXSxcclxuICAgICAgICBbMSwwXVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMSwxLDBdLFxyXG4gICAgICAgIFswLDEsMV0sXHJcbiAgICBdXHJcbl1cclxuXHJcbmNvbnN0IGxpbmVfU2hhcGUgPSBbXHJcbiAgICBbXHJcbiAgICAgICAgWzAsMSwwLDBdLFxyXG4gICAgICAgIFswLDEsMCwwXSxcclxuICAgICAgICBbMCwxLDAsMF0sXHJcbiAgICAgICAgWzAsMSwwLDBdLFxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMCwwLDAsMF0sXHJcbiAgICAgICAgWzEsMSwxLDFdLFxyXG4gICAgICAgIFswLDAsMCwwXVxyXG4gICAgXVxyXG5dXHJcblxyXG5jb25zdCBDcm9zZV9TaGFwZSA9IFtcclxuICAgIFtcclxuICAgICAgICBbMSwwXSxcclxuICAgICAgICBbMSwxXSxcclxuICAgICAgICBbMSwwXSxcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzEsMSwxXSxcclxuICAgICAgICBbMCwxLDBdLFxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICBbMCwxXSxcclxuICAgICAgICBbMSwxXSxcclxuICAgICAgICBbMCwxXSxcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAgWzAsMSwwXSxcclxuICAgICAgICBbMSwxLDFdLFxyXG4gICAgXSxcclxuXVxyXG5cclxuLy8gY29uc3QgRmFuX1NoYXBlID0gW1xyXG4vLyAgICAgW1xyXG4vLyAgICAgICAgIFsxLDAsMV0sXHJcbi8vICAgICAgICAgWzEsMSwxXSxcclxuLy8gICAgICAgICBbMSwwLDFdLFxyXG4vLyAgICAgXSxcclxuLy8gICAgIFtcclxuLy8gICAgICAgICBbMSwxLDFdLFxyXG4vLyAgICAgICAgIFswLDEsMF0sXHJcbi8vICAgICAgICAgWzEsMSwxXSxcclxuLy8gICAgIF1cclxuLy8gXVxyXG5cclxuXHJcbmNvbnN0IEJMT0NLX1NIQVBFX0FSUiA9IFsgTF9TaGFwZSwgTl9TaGFwZSwgT19TaGFwZSxaX1NoYXBlLGxpbmVfU2hhcGUsQ3Jvc2VfU2hhcGUgXS5tYXAoc2hhcGU9PnNoYXBlLm1hcChpdGVtPT57XHJcbiAgICBsZXQgYXIgPSBbXTtcclxuICAgIGl0ZW0uZm9yRWFjaCgoaXQseSk9PntcclxuICAgICAgICBpdC5mb3JFYWNoKCh2YWwseCk9PntcclxuICAgICAgICAgICAgaWYodmFsKXtcclxuICAgICAgICAgICAgICAgIGFyLnB1c2goe3gseX0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSlcclxuICAgIHJldHVybiBhcjtcclxufSkpO1xyXG5cclxuXHJcbmNvbnN0IGdldEJsb2NrU2hhcGUgPSBmdW5jdGlvbigpe1xyXG4gICAgbGV0IGxlbiA9IEJMT0NLX1NIQVBFX0FSUi5sZW5ndGg7XHJcbiAgICByZXR1cm4gQkxPQ0tfU0hBUEVfQVJSW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxlbildXHJcbn1cclxuXHJcbmV4cG9ydCB7IEJMT0NLX1NIQVBFX0FSUiAsZ2V0QmxvY2tTaGFwZX0gIiwiXHJcbmltcG9ydCBHYW1lIGZyb20gXCIuL0dhbWVcIjtcclxuXHJcbmxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUNhbnZhc1wiKTtcclxubGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5jb25zb2xlLmRpcihjYW52YXMpXHJcbmxldCBtYXhOdW1iZXJYID0gMjA7IC8vIDEw5LiqXHJcbmxldCBtYXhOdW1iZXJZID0gMjA7IC8vIDEw5LiqXHJcbmxldCBhcmVhV2lkdGggPSA0MDA7Ly9jYW52YXMud2lkdGg7XHJcbmxldCBhcmVhSGVpZ2h0ID0gNDAwOy8vY2FudmFzLmhlaWdodDtcclxuXHJcbmxldCBnYW1lID0gbmV3IEdhbWUoeyBjb250ZXh0LCBtYXhOdW1iZXJYLCBtYXhOdW1iZXJZLGFyZWFXaWR0aCxhcmVhSGVpZ2h0fSk7XHJcblxyXG5nYW1lLnN0YXJ0KCk7XHJcbiJdfQ==
