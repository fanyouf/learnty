(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = require("./interface");
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
        EventCenter_1.default.addEventListener(interface_1.EVENTTYPE.moveRight, this.moveRight.bind(this));
        EventCenter_1.default.addEventListener(interface_1.EVENTTYPE.moveLeft, this.moveLeft.bind(this));
        EventCenter_1.default.addEventListener(interface_1.EVENTTYPE.moveChange, this.moveChange.bind(this));
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
            EventCenter_1.default.fire(interface_1.EVENTTYPE.merge);
            if (this.isGameover()) {
                EventCenter_1.default.fire("changeStatus", "gameover");
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
        return !!rs;
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
            EventCenter_1.default.fire(interface_1.EVENTTYPE.addScore, 100);
        }
        else if (rowIndexs.length === 2) {
            EventCenter_1.default.fire(interface_1.EVENTTYPE.addScore, 250);
        }
        else if (rowIndexs.length === 3) {
            EventCenter_1.default.fire(interface_1.EVENTTYPE.addScore, 400);
        }
        rowIndexs.forEach(function (valIndex) {
            _this.matrix.splice(valIndex, 1);
            _this.matrix.unshift(new Array(_this.maxNumberX).fill(0));
        });
        return true;
    };
    return BGBlocks;
}());
exports.default = BGBlocks;

},{"./EventCenter":4,"./interface":9}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = require("./interface");
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
        EventCenter_1.default.addEventListener(interface_1.EVENTTYPE.changeShape, this.handleChangeShape.bind(this));
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

},{"./EventCenter":4,"./blockConfig":8,"./interface":9}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = require("./interface");
var EventCenter_1 = require("./EventCenter");
var Display = /** @class */ (function () {
    function Display() {
        this.msgList = [];
        this.msgList = ["kaishi"];
        EventCenter_1.default.addEventListener(interface_1.EVENTTYPE.addScore, this.addScore.bind(this));
        EventCenter_1.default.addEventListener(interface_1.EVENTTYPE.moveQuick, this.moveQuick.bind(this));
    }
    Display.prototype.addScore = function (score) {
        this.msgList.unshift("得分" + score);
    };
    Display.prototype.moveQuick = function (score) {
        this.msgList.unshift("加速...");
    };
    Display.prototype.draw = function (ctx) {
        var dx = 400;
        var dy = 40;
        ctx.fillStyle = "green";
        this.msgList.forEach(function (msg, index) {
            ctx.strokeStyle = "#fff";
            ctx.font = "14px consolas";
            ctx.fillText(msg, 450, 200 + index * 14);
        });
    };
    return Display;
}());
exports.default = Display;

},{"./EventCenter":4,"./interface":9}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventCenter = (function () {
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
            this.listenerList[eventName] &&
                this.listenerList[eventName].forEach(function (func) {
                    func(param);
                });
        };
        return _EventCenter;
    }());
    return _EventCenter;
})();
var EVENT_BUS = new EventCenter();
exports.default = EVENT_BUS;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Block_1 = require("./Block");
var interface_1 = require("./interface");
var BackGroundBlock_1 = require("./BackGroundBlock");
var NextBlock_1 = require("./NextBlock");
var EventCenter_1 = require("./EventCenter");
var Score_1 = require("./Score");
var Display_1 = require("./Display");
var Game = (function () {
    var game = null;
    var _Game = /** @class */ (function () {
        function _Game(_a) {
            var context = _a.context, maxNumberX = _a.maxNumberX, maxNumberY = _a.maxNumberY, areaWidth = _a.areaWidth, areaHeight = _a.areaHeight;
            this.frameIndex = 0;
            this.status = "normal";
            this.speed = 50;
            if (!game) {
                game = this;
            }
            document.addEventListener("keyup", this.eventKeyUp.bind(this));
            document.addEventListener("keydown", this.eventKeyDown.bind(this));
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
            game.speed = 50;
            game.score = new Score_1.default();
            game.display = new Display_1.default();
            //   EVENT_BUS.addEventListener("gameover", game.gameover.bind(game));
            EventCenter_1.default.addEventListener(interface_1.EVENTTYPE.moveQuick, game.moveQuick.bind(game));
            EventCenter_1.default.addEventListener(interface_1.EVENTTYPE.moveNormal, game.moveNormal.bind(game));
            EventCenter_1.default.addEventListener(interface_1.EVENTTYPE.changeStatus, game.changeStatus.bind(game));
            //   EVENT_BUS.addEventListener("pause", game.pause.bind(game));
            return game;
        }
        _Game.prototype.eventKeyUp = function (e) {
            if (e.keyCode === 38) {
                EventCenter_1.default.fire(interface_1.EVENTTYPE.moveChange, this.curBlock);
                // _this.curBlock.moveChange(_this.bgBlocks);
            }
            else if (e.keyCode === 39) {
                EventCenter_1.default.fire(interface_1.EVENTTYPE.moveRight, this.curBlock);
                //  _this.curBlock.moveRight(_this.bgBlocks);
            }
            else if (e.keyCode === 37) {
                EventCenter_1.default.fire(interface_1.EVENTTYPE.moveLeft, this.curBlock);
                // _this.curBlock.moveLeft(_this.bgBlocks);
            }
            else if (e.keyCode === 13) {
                if (this.status === "gameover") {
                    EventCenter_1.default.fire(interface_1.EVENTTYPE.changeStatus, "reStart");
                }
                else if (this.status === "pause") {
                    EventCenter_1.default.fire(interface_1.EVENTTYPE.changeStatus, "reStart");
                }
                else if (this.status === "normal") {
                    EventCenter_1.default.fire(interface_1.EVENTTYPE.changeStatus, "pause");
                }
            }
            else if (e.keyCode === 40) {
                EventCenter_1.default.fire(interface_1.EVENTTYPE.moveNormal);
            }
        };
        _Game.prototype.eventKeyDown = function (e) {
            if (e.keyCode === 40) {
                EventCenter_1.default.fire(interface_1.EVENTTYPE.moveQuick, this.curBlock);
                // _this.curBlock.moveChange(_this.bgBlocks);
            }
        };
        _Game.prototype.start = function () {
            this.frameIndex++;
            var cxt = this.context;
            cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);
            //   console.info(this.frameIndex);
            if (this.frameIndex % Math.ceil(1000 / this.speed) === 0) {
                this.bgBlocks.moveDown(this.curBlock);
            }
            this.curBlock.draw(this.context);
            this.nexBlock.draw(this.context);
            this.bgBlocks.draw(this.context);
            this.score.draw(this.context);
            this.display.draw(this.context);
            if (this.status === "normal")
                this.timerId = requestAnimationFrame(this.start.bind(this));
            //   console.info(this.timerId)
        };
        _Game.prototype.moveQuick = function () {
            this.speed += 50;
            console.info(this.speed);
        };
        _Game.prototype.moveNormal = function () {
            this.speed = 50;
        };
        _Game.prototype.changeStatus = function (status) {
            if (status === "reStart") {
                if (["gameover", "pause"].includes(this.status)) {
                    this.status = "normal";
                    this.start();
                }
            }
            else if (status === "pause") {
                this.status = "pause";
                if (this.timerId) {
                    cancelAnimationFrame(this.timerId);
                }
            }
            else if (status === "gameove") {
                this.status = "gameover";
                console.info(this.status);
            }
        };
        return _Game;
    }());
    return _Game;
})();
exports.default = Game;

},{"./BackGroundBlock":1,"./Block":2,"./Display":3,"./EventCenter":4,"./NextBlock":6,"./Score":7,"./interface":9}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventCenter_1 = require("./EventCenter");
var interface_1 = require("./interface");
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
        EventCenter_1.default.addEventListener(interface_1.EVENTTYPE.merge, this.change.bind(this));
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
        EventCenter_1.default.fire(interface_1.EVENTTYPE.changeShape, payload);
        this.block_shape_point_list = blockConfig_1.getBlockShape();
        var index = Math.floor(Math.random() * 100);
        this.index = index % this.block_shape_point_list.length;
        this.pointList = this.block_shape_point_list[this.index];
        console.info("nextBlock...", this.index, this.pointList);
    };
    return NextBlock;
}());
exports.default = NextBlock;

},{"./EventCenter":4,"./blockConfig":8,"./interface":9}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventCenter_1 = require("./EventCenter");
var interface_1 = require("./interface");
var Score = /** @class */ (function () {
    function Score(mark) {
        if (mark === void 0) { mark = 0; }
        this.mark = 0;
        this.mark = mark;
        EventCenter_1.default.addEventListener(interface_1.EVENTTYPE.addScore, this.addScore.bind(this));
    }
    Score.prototype.addScore = function (point) {
        this.mark += point;
    };
    Score.prototype.draw = function (ctx) {
        ctx.strokeStyle = "#fff";
        ctx.font = "bold 30px consolas";
        ctx.fillText("分数:" + this.mark.toString(), 450, 100);
    };
    return Score;
}());
exports.default = Score;

},{"./EventCenter":4,"./interface":9}],8:[function(require,module,exports){
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
var GAMESTAUTS;
(function (GAMESTAUTS) {
    GAMESTAUTS[GAMESTAUTS["normal"] = 0] = "normal";
    GAMESTAUTS[GAMESTAUTS["gameover"] = 1] = "gameover";
    GAMESTAUTS[GAMESTAUTS["pause"] = 2] = "pause";
})(GAMESTAUTS || (GAMESTAUTS = {}));
exports.GAMESTAUTS = GAMESTAUTS;
var EVENTTYPE;
(function (EVENTTYPE) {
    EVENTTYPE[EVENTTYPE["merge"] = 0] = "merge";
    EVENTTYPE[EVENTTYPE["gameover"] = 1] = "gameover";
    EVENTTYPE[EVENTTYPE["pause"] = 2] = "pause";
    EVENTTYPE[EVENTTYPE["changeStatus"] = 3] = "changeStatus";
    EVENTTYPE[EVENTTYPE["moveQuick"] = 4] = "moveQuick";
    EVENTTYPE[EVENTTYPE["moveNormal"] = 5] = "moveNormal";
    EVENTTYPE[EVENTTYPE["addScore"] = 6] = "addScore";
    EVENTTYPE[EVENTTYPE["changeShape"] = 7] = "changeShape";
    EVENTTYPE[EVENTTYPE["moveDown"] = 8] = "moveDown";
    EVENTTYPE[EVENTTYPE["moveLeft"] = 9] = "moveLeft";
    EVENTTYPE[EVENTTYPE["moveRight"] = 10] = "moveRight";
    EVENTTYPE[EVENTTYPE["moveChange"] = 11] = "moveChange";
})(EVENTTYPE || (EVENTTYPE = {}));
exports.EVENTTYPE = EVENTTYPE;

},{}],10:[function(require,module,exports){
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

},{"./Game":5}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvQmFja0dyb3VuZEJsb2NrLnRzIiwic3JjL3RzL0Jsb2NrLnRzIiwic3JjL3RzL0Rpc3BsYXkudHMiLCJzcmMvdHMvRXZlbnRDZW50ZXIudHMiLCJzcmMvdHMvR2FtZS50cyIsInNyYy90cy9OZXh0QmxvY2sudHMiLCJzcmMvdHMvU2NvcmUudHMiLCJzcmMvdHMvYmxvY2tDb25maWcudHMiLCJzcmMvdHMvaW50ZXJmYWNlLnRzIiwic3JjL3RzL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLHlDQUF3RDtBQUV4RCw2Q0FBeUM7QUFDekM7SUFNRSxrQkFBWSxFQUFrRDtZQUFoRCwwQkFBVSxFQUFFLDBCQUFVLEVBQUUsMEJBQVUsRUFBRSwwQkFBVTtRQUw1RCxXQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ1osZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFDeEIsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUV0QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLElBQUksR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN2QjtRQUVELHFCQUFZLENBQUMsZ0JBQWdCLENB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QyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ1I7SUFDRDtRQUNJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ1Y7Q0FDSixDQUFBO0FBRUQsSUFBTSxVQUFVLEdBQUc7SUFDZjtRQUNJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ1o7SUFDRDtRQUNJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNaO0NBQ0osQ0FBQTtBQUVELElBQU0sV0FBVyxHQUFHO0lBQ2hCO1FBQ0ksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ1I7SUFDRDtRQUNJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ1Y7SUFDRDtRQUNJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNSO0lBQ0Q7UUFDSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNWO0NBQ0osQ0FBQTtBQUVELHNCQUFzQjtBQUN0QixRQUFRO0FBQ1IsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixtQkFBbUI7QUFDbkIsU0FBUztBQUNULFFBQVE7QUFDUixtQkFBbUI7QUFDbkIsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixRQUFRO0FBQ1IsSUFBSTtBQUdKLElBQU0sZUFBZSxHQUFHLENBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUMsT0FBTyxFQUFDLFVBQVUsRUFBQyxXQUFXLENBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLLElBQUUsT0FBQSxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtJQUMxRyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRSxFQUFDLENBQUM7UUFDZCxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFDLENBQUM7WUFDYixJQUFHLEdBQUcsRUFBQztnQkFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxHQUFBLEVBQUMsQ0FBQyxHQUFBLEVBQUMsQ0FBQyxDQUFBO2FBQ2pCO1FBQ0wsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQTtJQUNGLE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQyxDQUFDLEVBVjhGLENBVTlGLENBQUMsQ0FBQztBQVFLLDBDQUFlO0FBTHhCLElBQU0sYUFBYSxHQUFHO0lBQ2xCLElBQUksR0FBRyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUM7SUFDakMsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUMzRCxDQUFDLENBQUE7QUFFeUIsc0NBQWE7Ozs7O0FDekd2QyxJQUFLLFVBSUo7QUFKRCxXQUFLLFVBQVU7SUFDYiwrQ0FBTSxDQUFBO0lBQ04sbURBQVEsQ0FBQTtJQUNSLDZDQUFLLENBQUE7QUFDUCxDQUFDLEVBSkksVUFBVSxLQUFWLFVBQVUsUUFJZDtBQTJCaUMsZ0NBQVU7QUF6QjVDLElBQUssU0FjSjtBQWRELFdBQUssU0FBUztJQUNaLDJDQUFLLENBQUE7SUFDTCxpREFBUSxDQUFBO0lBQ1IsMkNBQUssQ0FBQTtJQUNMLHlEQUFZLENBQUE7SUFDWixtREFBUyxDQUFBO0lBQ1QscURBQVUsQ0FBQTtJQUNWLGlEQUFRLENBQUE7SUFDUix1REFBVyxDQUFBO0lBRVgsaURBQVEsQ0FBQTtJQUNSLGlEQUFRLENBQUE7SUFDUixvREFBUyxDQUFBO0lBQ1Qsc0RBQVUsQ0FBQTtBQUNaLENBQUMsRUFkSSxTQUFTLEtBQVQsU0FBUyxRQWNiO0FBVzZDLDhCQUFTOzs7OztBQ2hEdkQsK0JBQTBCO0FBRTFCLElBQUksTUFBTSxHQUFzQixRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BFLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNuQixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNO0FBQzNCLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU07QUFDM0IsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUEsZUFBZTtBQUNuQyxJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQSxnQkFBZ0I7QUFFckMsSUFBSSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsRUFBRSxPQUFPLFNBQUEsRUFBRSxVQUFVLFlBQUEsRUFBRSxVQUFVLFlBQUEsRUFBQyxTQUFTLFdBQUEsRUFBQyxVQUFVLFlBQUEsRUFBQyxDQUFDLENBQUM7QUFFN0UsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgQWN0b3IsIFBPSU5UX1QsIEVWRU5UVFlQRSB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xuaW1wb3J0IEJsb2NrIGZyb20gXCIuL0Jsb2NrXCI7XG5pbXBvcnQgRVZFTlRfQ0VOVEVSIGZyb20gXCIuL0V2ZW50Q2VudGVyXCI7XG5jbGFzcyBCR0Jsb2NrcyBpbXBsZW1lbnRzIEFjdG9yIHtcbiAgbWF0cml4ID0gW107XG4gIG1heE51bWJlclg6IG51bWJlciA9IDA7XG4gIG1heE51bWJlclk6IG51bWJlciA9IDA7XG4gIHVuaXRCbG9ja3c6IG51bWJlciA9IDEwO1xuICB1bml0QmxvY2toOiBudW1iZXIgPSAxMDtcbiAgY29uc3RydWN0b3IoeyBtYXhOdW1iZXJYLCBtYXhOdW1iZXJZLCB1bml0QmxvY2t3LCB1bml0QmxvY2toIH0pIHtcbiAgICB0aGlzLm1heE51bWJlclggPSBtYXhOdW1iZXJYO1xuICAgIHRoaXMubWF4TnVtYmVyWSA9IG1heE51bWJlclk7XG4gICAgdGhpcy51bml0QmxvY2t3ID0gdW5pdEJsb2NrdztcbiAgICB0aGlzLnVuaXRCbG9ja2ggPSB1bml0QmxvY2toO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4TnVtYmVyWTsgaSsrKSB7XG4gICAgICBsZXQgYXJyID0gbmV3IEFycmF5KG1heE51bWJlclgpLmZpbGwoMCk7XG4gICAgICB0aGlzLm1hdHJpeC5wdXNoKGFycik7XG4gICAgfVxuXG4gICAgRVZFTlRfQ0VOVEVSLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBFVkVOVFRZUEUubW92ZVJpZ2h0LFxuICAgICAgdGhpcy5tb3ZlUmlnaHQuYmluZCh0aGlzKVxuICAgICk7XG4gICAgRVZFTlRfQ0VOVEVSLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRUWVBFLm1vdmVMZWZ0LCB0aGlzLm1vdmVMZWZ0LmJpbmQodGhpcykpO1xuICAgIEVWRU5UX0NFTlRFUi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgRVZFTlRUWVBFLm1vdmVDaGFuZ2UsXG4gICAgICB0aGlzLm1vdmVDaGFuZ2UuYmluZCh0aGlzKVxuICAgICk7XG4gIH1cblxuICBkcmF3KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcbiAgICB0aGlzLm1hdHJpeC5mb3JFYWNoKChyb3csIHkpID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKCh2YWwsIHgpID0+IHtcbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgIGN0eC5maWxsUmVjdChcbiAgICAgICAgICAgIHggKiB0aGlzLnVuaXRCbG9ja2gsXG4gICAgICAgICAgICB5ICogdGhpcy51bml0QmxvY2toLFxuICAgICAgICAgICAgdGhpcy51bml0QmxvY2toIC0gMSxcbiAgICAgICAgICAgIHRoaXMudW5pdEJsb2NraCAtIDFcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiZ3JlZW5cIjtcbiAgICAgICAgICBjdHguc3Ryb2tlUmVjdChcbiAgICAgICAgICAgIHggKiB0aGlzLnVuaXRCbG9ja2gsXG4gICAgICAgICAgICB5ICogdGhpcy51bml0QmxvY2toLFxuICAgICAgICAgICAgdGhpcy51bml0QmxvY2toLFxuICAgICAgICAgICAgdGhpcy51bml0QmxvY2toXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjYW5Nb3ZlTGVmdChibG9jazogQmxvY2spIHtcbiAgICBsZXQgbWlueCA9IE1hdGgubWluKC4uLmJsb2NrLnBvaW50TGlzdC5tYXAoaXRlbSA9PiBibG9jay54ICsgaXRlbS54KSk7XG4gICAgaWYgKG1pbnggPT09IDApIHJldHVybiBmYWxzZTtcblxuICAgIGxldCBzaGFkZU1hdHJpeCA9IGJsb2NrLmdldE1hdHJpeChcImxlZnRcIik7XG4gICAgcmV0dXJuICF0aGlzLmlzQ3Jhc2hNYXRyaXgoc2hhZGVNYXRyaXgpO1xuICB9XG4gIGNhbk1vdmVSaWdodChibG9jazogQmxvY2spIHtcbiAgICBsZXQgc3RhZ2VNYXhYID0gdGhpcy5tYXRyaXhbMF0ubGVuZ3RoO1xuICAgIGxldCBtYXhYID0gTWF0aC5tYXgoLi4uYmxvY2sucG9pbnRMaXN0Lm1hcChpdGVtID0+IGJsb2NrLnggKyBpdGVtLngpKTtcbiAgICBpZiAobWF4WCA9PT0gc3RhZ2VNYXhYIC0gMSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgbGV0IHNoYWRlTWF0cml4ID0gYmxvY2suZ2V0TWF0cml4KFwicmlnaHRcIik7XG4gICAgcmV0dXJuICF0aGlzLmlzQ3Jhc2hNYXRyaXgoc2hhZGVNYXRyaXgpO1xuICB9XG5cbiAgY2FuTW92ZURvd24oYmxvY2s6IEJsb2NrKSB7XG4gICAgbGV0IHN0YWdlTWF4WSA9IHRoaXMubWF0cml4Lmxlbmd0aDtcbiAgICBsZXQgbWF4WSA9IE1hdGgubWF4KC4uLmJsb2NrLnBvaW50TGlzdC5tYXAoaXRlbSA9PiBibG9jay55ICsgaXRlbS55KSk7XG4gICAgaWYgKG1heFkgPT09IHN0YWdlTWF4WSAtIDEpIHJldHVybiBmYWxzZTtcblxuICAgIGxldCBzaGFkZU1hdHJpeCA9IGJsb2NrLmdldE1hdHJpeChcImRvd25cIik7XG4gICAgcmV0dXJuICF0aGlzLmlzQ3Jhc2hNYXRyaXgoc2hhZGVNYXRyaXgpO1xuICB9XG5cbiAgbW92ZUxlZnQoYmxvY2s6IEJsb2NrKSB7XG4gICAgaWYgKHRoaXMuY2FuTW92ZUxlZnQoYmxvY2spKSB7XG4gICAgICBibG9jay54ID0gYmxvY2sueCAtIDE7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbW92ZVJpZ2h0KGJsb2NrOiBCbG9jaykge1xuICAgIGlmICh0aGlzLmNhbk1vdmVSaWdodChibG9jaykpIHtcbiAgICAgIGJsb2NrLnggPSBibG9jay54ICsgMTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBtb3ZlRG93bihibG9jazogQmxvY2spIHtcbiAgICBpZiAodGhpcy5jYW5Nb3ZlRG93bihibG9jaykpIHtcbiAgICAgIGJsb2NrLnkgPSBibG9jay55ICsgMTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5pbmZvKFwibWVyZ2UsYW5kIGZpcmUgRXZlbnRfbWVyZ2UuLi5cIik7XG4gICAgICB0aGlzLm1lcmdlKGJsb2NrKTtcbiAgICAgIEVWRU5UX0NFTlRFUi5maXJlKEVWRU5UVFlQRS5tZXJnZSk7XG4gICAgICBpZiAodGhpcy5pc0dhbWVvdmVyKCkpIHtcbiAgICAgICAgRVZFTlRfQ0VOVEVSLmZpcmUoXCJjaGFuZ2VTdGF0dXNcIiwgXCJnYW1lb3ZlclwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgbW92ZUNoYW5nZShibG9jazogQmxvY2spIHtcbiAgICBibG9jay5pbmRleCA9IChibG9jay5pbmRleCArIDEpICUgYmxvY2suYmxvY2tfc2hhcGVfcG9pbnRfbGlzdC5sZW5ndGg7XG4gICAgYmxvY2sucG9pbnRMaXN0ID0gYmxvY2suYmxvY2tfc2hhcGVfcG9pbnRfbGlzdFtibG9jay5pbmRleF07XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjYW5Nb3ZlQ2hhbmdlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNHYW1lb3ZlcigpIHtcbiAgICBsZXQgcnMgPSB0aGlzLm1hdHJpeFswXS5maW5kKGl0ZW0gPT4gaXRlbSA+IDApO1xuXG4gICAgcmV0dXJuICEhcnM7XG4gIH1cblxuICBpc0NyYXNoKGJsb2NrOiBCbG9jaykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gISFibG9jay5wb2ludExpc3QuZmluZChcbiAgICAgICAgaXRlbSA9PiB0aGlzLm1hdHJpeFtibG9jay55ICsgaXRlbS55ICsgMV1bYmxvY2sueCArIGl0ZW0ueF1cbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgaXNDcmFzaE1hdHJpeChtYXRyaXg6IEFycmF5PFBPSU5UX1Q+KSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAhIW1hdHJpeC5maW5kKGl0ZW0gPT4gdGhpcy5tYXRyaXhbaXRlbS55XVtpdGVtLnhdKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBtZXJnZShibG9jazogQmxvY2spIHtcbiAgICBibG9jay5wb2ludExpc3QuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIHRoaXMubWF0cml4W2Jsb2NrLnkgKyBpdGVtLnldW2Jsb2NrLnggKyBpdGVtLnhdID0gMTtcbiAgICB9KTtcblxuICAgIHRoaXMuY2xlYXJTb21lUm93KCk7XG4gIH1cblxuICBjbGVhclNvbWVSb3coKSB7XG4gICAgbGV0IGFyciA9IHRoaXMubWF0cml4Lm1hcChyb3cgPT5cbiAgICAgIHJvdy5yZWR1Y2UoKGluaXQsIGN1cnJlbnQpID0+IGluaXQgKyBjdXJyZW50LCAwKVxuICAgICk7XG5cbiAgICBsZXQgcm93SW5kZXhzID0gW107XG4gICAgYXJyLmZvckVhY2goKHN1bVZhbCwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChzdW1WYWwgPT09IHRoaXMubWF4TnVtYmVyWCkge1xuICAgICAgICByb3dJbmRleHMucHVzaChpbmRleCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJvd0luZGV4cy5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcblxuICAgIGlmIChyb3dJbmRleHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBFVkVOVF9DRU5URVIuZmlyZShFVkVOVFRZUEUuYWRkU2NvcmUsIDEwMCk7XG4gICAgfSBlbHNlIGlmIChyb3dJbmRleHMubGVuZ3RoID09PSAyKSB7XG4gICAgICBFVkVOVF9DRU5URVIuZmlyZShFVkVOVFRZUEUuYWRkU2NvcmUsIDI1MCk7XG4gICAgfSBlbHNlIGlmIChyb3dJbmRleHMubGVuZ3RoID09PSAzKSB7XG4gICAgICBFVkVOVF9DRU5URVIuZmlyZShFVkVOVFRZUEUuYWRkU2NvcmUsIDQwMCk7XG4gICAgfVxuXG4gICAgcm93SW5kZXhzLmZvckVhY2godmFsSW5kZXggPT4ge1xuICAgICAgdGhpcy5tYXRyaXguc3BsaWNlKHZhbEluZGV4LCAxKTtcbiAgICAgIHRoaXMubWF0cml4LnVuc2hpZnQobmV3IEFycmF5KHRoaXMubWF4TnVtYmVyWCkuZmlsbCgwKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQkdCbG9ja3M7XG4iLCJpbXBvcnQgeyBCbE9DS19ULCBQT0lOVF9ULCBBY3RvciwgRVZFTlRUWVBFIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XG5pbXBvcnQgeyBnZXRCbG9ja1NoYXBlIH0gZnJvbSBcIi4vYmxvY2tDb25maWdcIjtcbmltcG9ydCBFdmVudENlbnRlciBmcm9tIFwiLi9FdmVudENlbnRlclwiO1xuY2xhc3MgQmxvY2sgaW1wbGVtZW50cyBBY3RvciB7XG4gIHBvaW50TGlzdDogQXJyYXk8UE9JTlRfVD4gPSBbXTtcbiAgaW5kZXggPSAwO1xuICB1bml0QmxvY2toOiBudW1iZXIgPSAxMDtcbiAgdW5pdEJsb2NrdzogbnVtYmVyID0gMTA7XG4gIHggPSAwO1xuICB5ID0gMDtcbiAgYmxvY2tfc2hhcGVfcG9pbnRfbGlzdCA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHsgdW5pdEJsb2NrdywgdW5pdEJsb2NraCB9KSB7XG4gICAgdGhpcy51bml0QmxvY2t3ID0gdW5pdEJsb2NrdztcbiAgICB0aGlzLnVuaXRCbG9ja2ggPSB1bml0QmxvY2toO1xuXG4gICAgbGV0IGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSk7XG5cbiAgICBsZXQgaW5pdHggPSAwO1xuXG4gICAgdGhpcy54ID0gaW5pdHg7XG4gICAgdGhpcy5ibG9ja19zaGFwZV9wb2ludF9saXN0ID0gZ2V0QmxvY2tTaGFwZSgpO1xuICAgIHRoaXMuaW5kZXggPSBpbmRleCAlIHRoaXMuYmxvY2tfc2hhcGVfcG9pbnRfbGlzdC5sZW5ndGg7XG4gICAgdGhpcy5wb2ludExpc3QgPSB0aGlzLmJsb2NrX3NoYXBlX3BvaW50X2xpc3RbdGhpcy5pbmRleF07XG4gICAgRXZlbnRDZW50ZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIEVWRU5UVFlQRS5jaGFuZ2VTaGFwZSxcbiAgICAgIHRoaXMuaGFuZGxlQ2hhbmdlU2hhcGUuYmluZCh0aGlzKVxuICAgICk7XG4gIH1cbiAgaGFuZGxlQ2hhbmdlU2hhcGUoeyBpbmRleCwgYmxvY2tfc2hhcGVfcG9pbnRfbGlzdCB9KSB7XG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnkgPSAwO1xuICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICB0aGlzLmJsb2NrX3NoYXBlX3BvaW50X2xpc3QgPSBibG9ja19zaGFwZV9wb2ludF9saXN0O1xuICAgIHRoaXMucG9pbnRMaXN0ID0gdGhpcy5ibG9ja19zaGFwZV9wb2ludF9saXN0W3RoaXMuaW5kZXhdO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy54ID0gMztcbiAgICB0aGlzLnkgPSAwO1xuICB9XG4gIGdldE1hdHJpeChkaXI6IHN0cmluZyA9IFwiXCIpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludExpc3QubWFwKGl0ZW0gPT4ge1xuICAgICAgbGV0IG8gPSB7IHg6IDAsIHk6IDAgfTtcbiAgICAgIG8ueCA9IGl0ZW0ueCArIHRoaXMueDtcbiAgICAgIG8ueSA9IGl0ZW0ueSArIHRoaXMueTtcbiAgICAgIG8ueCA9IGRpciA9PT0gXCJsZWZ0XCIgPyBvLnggLSAxIDogby54O1xuICAgICAgby54ID0gZGlyID09PSBcInJpZ2h0XCIgPyBvLnggKyAxIDogby54O1xuICAgICAgby55ID0gZGlyID09PSBcImRvd25cIiA/IG8ueSArIDEgOiBvLnk7XG4gICAgICByZXR1cm4gbztcbiAgICB9KTtcbiAgfVxuXG4gIGRyYXcoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICBjdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xuICAgIHRoaXMuZ2V0TWF0cml4KCkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGN0eC5maWxsUmVjdChcbiAgICAgICAgaXRlbS54ICogdGhpcy51bml0QmxvY2t3LFxuICAgICAgICBpdGVtLnkgKiB0aGlzLnVuaXRCbG9ja3csXG4gICAgICAgIHRoaXMudW5pdEJsb2NrdyAtIDEsXG4gICAgICAgIHRoaXMudW5pdEJsb2NrdyAtIDFcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmxvY2s7XG4iLCJpbXBvcnQgeyBBY3RvciwgRVZFTlRUWVBFIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XG5pbXBvcnQgRXZlbnRDZW50ZXIgZnJvbSBcIi4vRXZlbnRDZW50ZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlzcGxheSBpbXBsZW1lbnRzIEFjdG9yIHtcbiAgbXNnTGlzdDogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm1zZ0xpc3QgPSBbXCJrYWlzaGlcIl07XG4gICAgRXZlbnRDZW50ZXIuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVFRZUEUuYWRkU2NvcmUsIHRoaXMuYWRkU2NvcmUuYmluZCh0aGlzKSk7XG4gICAgRXZlbnRDZW50ZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIEVWRU5UVFlQRS5tb3ZlUXVpY2ssXG4gICAgICB0aGlzLm1vdmVRdWljay5iaW5kKHRoaXMpXG4gICAgKTtcbiAgfVxuXG4gIGFkZFNjb3JlKHNjb3JlKSB7XG4gICAgdGhpcy5tc2dMaXN0LnVuc2hpZnQoXCLlvpfliIZcIiArIHNjb3JlKTtcbiAgfVxuICBtb3ZlUXVpY2soc2NvcmUpIHtcbiAgICB0aGlzLm1zZ0xpc3QudW5zaGlmdChcIuWKoOmAny4uLlwiKTtcbiAgfVxuXG4gIGRyYXcoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICBsZXQgZHggPSA0MDA7XG4gICAgbGV0IGR5ID0gNDA7XG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcbiAgICB0aGlzLm1zZ0xpc3QuZm9yRWFjaCgobXNnLCBpbmRleCkgPT4ge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCIjZmZmXCI7XG4gICAgICBjdHguZm9udCA9IFwiMTRweCBjb25zb2xhc1wiO1xuICAgICAgY3R4LmZpbGxUZXh0KG1zZywgNDUwLCAyMDAgKyBpbmRleCAqIDE0KTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRVZFTlRUWVBFIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XG5jb25zdCBFdmVudENlbnRlciA9IChmdW5jdGlvbigpIHtcbiAgbGV0IEVWRU5UX0JVUyA9IG51bGw7XG4gIGNsYXNzIF9FdmVudENlbnRlciB7XG4gICAgbGlzdGVuZXJMaXN0OiB7fTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgaWYgKCFFVkVOVF9CVVMpIHtcbiAgICAgICAgRVZFTlRfQlVTID0gdGhpcztcbiAgICAgIH1cbiAgICAgIEVWRU5UX0JVUy5saXN0ZW5lckxpc3QgPSB7fTtcbiAgICB9XG5cbiAgICBhZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZTogRVZFTlRUWVBFLCBjYWxsQmFjaykge1xuICAgICAgaWYgKCF0aGlzLmxpc3RlbmVyTGlzdFtldmVudE5hbWVdKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJMaXN0W2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5saXN0ZW5lckxpc3RbZXZlbnROYW1lXS5wdXNoKGNhbGxCYWNrKTtcbiAgICB9XG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWU6IEVWRU5UVFlQRSwgY2FsbEJhY2spIHtcbiAgICAgIGxldCBhcnIgPSB0aGlzLmxpc3RlbmVyTGlzdFtldmVudE5hbWVdO1xuICAgICAgbGV0IGluZGV4ID0gYXJyLmZpbmRJbmRleChpdGVtID0+IGl0ZW0gPT09IGNhbGxCYWNrKTtcbiAgICAgIGFyci5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIGZpcmUoZXZlbnROYW1lOiBFVkVOVFRZUEUsIHBhcmFtPzogYW55KSB7XG4gICAgICB0aGlzLmxpc3RlbmVyTGlzdFtldmVudE5hbWVdICYmXG4gICAgICAgIHRoaXMubGlzdGVuZXJMaXN0W2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jID0+IHtcbiAgICAgICAgICBmdW5jKHBhcmFtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBfRXZlbnRDZW50ZXI7XG59KSgpO1xuY29uc3QgRVZFTlRfQlVTID0gbmV3IEV2ZW50Q2VudGVyKCk7XG5cbmV4cG9ydCBkZWZhdWx0IEVWRU5UX0JVUztcbiIsImltcG9ydCBCbG9jayBmcm9tIFwiLi9CbG9ja1wiO1xuaW1wb3J0IHsgQmxPQ0tfVCwgRVZFTlRUWVBFIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XG5pbXBvcnQgQkdCbG9ja3MgZnJvbSBcIi4vQmFja0dyb3VuZEJsb2NrXCI7XG5pbXBvcnQgTmV4dEJsb2NrIGZyb20gXCIuL05leHRCbG9ja1wiO1xuaW1wb3J0IEVWRU5UX0JVUyBmcm9tIFwiLi9FdmVudENlbnRlclwiO1xuaW1wb3J0IFNjb3JlIGZyb20gXCIuL1Njb3JlXCI7XG5pbXBvcnQgRGlzcGxheSBmcm9tIFwiLi9EaXNwbGF5XCI7XG5jb25zdCBHYW1lID0gKGZ1bmN0aW9uKCkge1xuICBsZXQgZ2FtZSA9IG51bGw7XG4gIGNsYXNzIF9HYW1lIHtcbiAgICBmcmFtZUluZGV4OiBudW1iZXIgPSAwO1xuICAgIG1heE51bWJlclg6IG51bWJlcjtcbiAgICBtYXhOdW1iZXJZOiBudW1iZXI7XG4gICAgYXJlYVdpZHRoOiBudW1iZXI7XG4gICAgYXJlYUhlaWdodDogbnVtYmVyO1xuICAgIHVuaXRCbG9ja3c6IG51bWJlcjtcblxuICAgIHVuaXRCbG9ja2g6IG51bWJlcjtcbiAgICBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY3VyQmxvY2s6IEJsb2NrO1xuICAgIG5leEJsb2NrOiBOZXh0QmxvY2s7XG4gICAgc2NvcmU6IFNjb3JlO1xuICAgIGJnQmxvY2tzOiBCR0Jsb2NrcztcbiAgICBkaXNwbGF5OiBEaXNwbGF5O1xuICAgIHRpbWVySWQ6IG51bWJlcjtcbiAgICBzdGF0dXM6IHN0cmluZyA9IFwibm9ybWFsXCI7XG4gICAgc3BlZWQ6IG51bWJlciA9IDUwO1xuXG4gICAgY29uc3RydWN0b3IoeyBjb250ZXh0LCBtYXhOdW1iZXJYLCBtYXhOdW1iZXJZLCBhcmVhV2lkdGgsIGFyZWFIZWlnaHQgfSkge1xuICAgICAgaWYgKCFnYW1lKSB7XG4gICAgICAgIGdhbWUgPSB0aGlzO1xuICAgICAgfVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuZXZlbnRLZXlVcC5iaW5kKHRoaXMpKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMuZXZlbnRLZXlEb3duLmJpbmQodGhpcykpO1xuXG4gICAgICBnYW1lLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgZ2FtZS5tYXhOdW1iZXJYID0gbWF4TnVtYmVyWDtcbiAgICAgIGdhbWUubWF4TnVtYmVyWSA9IG1heE51bWJlclk7XG4gICAgICBnYW1lLmFyZWFXaWR0aCA9IGFyZWFXaWR0aDtcbiAgICAgIGdhbWUuYXJlYUhlaWdodCA9IGFyZWFIZWlnaHQ7XG4gICAgICBnYW1lLnVuaXRCbG9ja2ggPSBhcmVhSGVpZ2h0IC8gbWF4TnVtYmVyWTtcbiAgICAgIGdhbWUudW5pdEJsb2NrdyA9IGFyZWFXaWR0aCAvIG1heE51bWJlclg7XG4gICAgICBnYW1lLm5leEJsb2NrID0gbmV3IE5leHRCbG9jayh7XG4gICAgICAgIHVuaXRCbG9ja3c6IGdhbWUudW5pdEJsb2NrdyxcbiAgICAgICAgdW5pdEJsb2NraDogZ2FtZS51bml0QmxvY2toXG4gICAgICB9KTtcbiAgICAgIGdhbWUuY3VyQmxvY2sgPSBuZXcgQmxvY2soe1xuICAgICAgICB1bml0QmxvY2t3OiBnYW1lLnVuaXRCbG9ja3csXG4gICAgICAgIHVuaXRCbG9ja2g6IGdhbWUudW5pdEJsb2NraFxuICAgICAgfSk7XG4gICAgICBnYW1lLmJnQmxvY2tzID0gbmV3IEJHQmxvY2tzKHtcbiAgICAgICAgbWF4TnVtYmVyWCxcbiAgICAgICAgbWF4TnVtYmVyWSxcbiAgICAgICAgdW5pdEJsb2NrdzogZ2FtZS51bml0QmxvY2t3LFxuICAgICAgICB1bml0QmxvY2toOiBnYW1lLnVuaXRCbG9ja2hcbiAgICAgIH0pO1xuICAgICAgZ2FtZS5zcGVlZCA9IDUwO1xuXG4gICAgICBnYW1lLnNjb3JlID0gbmV3IFNjb3JlKCk7XG4gICAgICBnYW1lLmRpc3BsYXkgPSBuZXcgRGlzcGxheSgpO1xuXG4gICAgICAvLyAgIEVWRU5UX0JVUy5hZGRFdmVudExpc3RlbmVyKFwiZ2FtZW92ZXJcIiwgZ2FtZS5nYW1lb3Zlci5iaW5kKGdhbWUpKTtcbiAgICAgIEVWRU5UX0JVUy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBFVkVOVFRZUEUubW92ZVF1aWNrLFxuICAgICAgICBnYW1lLm1vdmVRdWljay5iaW5kKGdhbWUpXG4gICAgICApO1xuICAgICAgRVZFTlRfQlVTLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIEVWRU5UVFlQRS5tb3ZlTm9ybWFsLFxuICAgICAgICBnYW1lLm1vdmVOb3JtYWwuYmluZChnYW1lKVxuICAgICAgKTtcbiAgICAgIEVWRU5UX0JVUy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBFVkVOVFRZUEUuY2hhbmdlU3RhdHVzLFxuICAgICAgICBnYW1lLmNoYW5nZVN0YXR1cy5iaW5kKGdhbWUpXG4gICAgICApO1xuICAgICAgLy8gICBFVkVOVF9CVVMuYWRkRXZlbnRMaXN0ZW5lcihcInBhdXNlXCIsIGdhbWUucGF1c2UuYmluZChnYW1lKSk7XG5cbiAgICAgIHJldHVybiBnYW1lO1xuICAgIH1cblxuICAgIGV2ZW50S2V5VXAoZSkge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMzgpIHtcbiAgICAgICAgRVZFTlRfQlVTLmZpcmUoRVZFTlRUWVBFLm1vdmVDaGFuZ2UsIHRoaXMuY3VyQmxvY2spO1xuICAgICAgICAvLyBfdGhpcy5jdXJCbG9jay5tb3ZlQ2hhbmdlKF90aGlzLmJnQmxvY2tzKTtcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSAzOSkge1xuICAgICAgICBFVkVOVF9CVVMuZmlyZShFVkVOVFRZUEUubW92ZVJpZ2h0LCB0aGlzLmN1ckJsb2NrKTtcbiAgICAgICAgLy8gIF90aGlzLmN1ckJsb2NrLm1vdmVSaWdodChfdGhpcy5iZ0Jsb2Nrcyk7XG4gICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gMzcpIHtcbiAgICAgICAgRVZFTlRfQlVTLmZpcmUoRVZFTlRUWVBFLm1vdmVMZWZ0LCB0aGlzLmN1ckJsb2NrKTtcbiAgICAgICAgLy8gX3RoaXMuY3VyQmxvY2subW92ZUxlZnQoX3RoaXMuYmdCbG9ja3MpO1xuICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gXCJnYW1lb3ZlclwiKSB7XG4gICAgICAgICAgRVZFTlRfQlVTLmZpcmUoRVZFTlRUWVBFLmNoYW5nZVN0YXR1cywgXCJyZVN0YXJ0XCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdHVzID09PSBcInBhdXNlXCIpIHtcbiAgICAgICAgICBFVkVOVF9CVVMuZmlyZShFVkVOVFRZUEUuY2hhbmdlU3RhdHVzLCBcInJlU3RhcnRcIik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICBFVkVOVF9CVVMuZmlyZShFVkVOVFRZUEUuY2hhbmdlU3RhdHVzLCBcInBhdXNlXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gNDApIHtcbiAgICAgICAgRVZFTlRfQlVTLmZpcmUoRVZFTlRUWVBFLm1vdmVOb3JtYWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGV2ZW50S2V5RG93bihlKSB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSA0MCkge1xuICAgICAgICBFVkVOVF9CVVMuZmlyZShFVkVOVFRZUEUubW92ZVF1aWNrLCB0aGlzLmN1ckJsb2NrKTtcbiAgICAgICAgLy8gX3RoaXMuY3VyQmxvY2subW92ZUNoYW5nZShfdGhpcy5iZ0Jsb2Nrcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICB0aGlzLmZyYW1lSW5kZXgrKztcbiAgICAgIGxldCBjeHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgICBjeHQuY2xlYXJSZWN0KDAsIDAsIGN4dC5jYW52YXMud2lkdGgsIGN4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICAgIC8vICAgY29uc29sZS5pbmZvKHRoaXMuZnJhbWVJbmRleCk7XG4gICAgICBpZiAodGhpcy5mcmFtZUluZGV4ICUgTWF0aC5jZWlsKDEwMDAgLyB0aGlzLnNwZWVkKSA9PT0gMCkge1xuICAgICAgICB0aGlzLmJnQmxvY2tzLm1vdmVEb3duKHRoaXMuY3VyQmxvY2spO1xuICAgICAgfVxuICAgICAgdGhpcy5jdXJCbG9jay5kcmF3KHRoaXMuY29udGV4dCk7XG4gICAgICB0aGlzLm5leEJsb2NrLmRyYXcodGhpcy5jb250ZXh0KTtcbiAgICAgIHRoaXMuYmdCbG9ja3MuZHJhdyh0aGlzLmNvbnRleHQpO1xuICAgICAgdGhpcy5zY29yZS5kcmF3KHRoaXMuY29udGV4dCk7XG4gICAgICB0aGlzLmRpc3BsYXkuZHJhdyh0aGlzLmNvbnRleHQpO1xuICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBcIm5vcm1hbFwiKVxuICAgICAgICB0aGlzLnRpbWVySWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5zdGFydC5iaW5kKHRoaXMpKTtcbiAgICAgIC8vICAgY29uc29sZS5pbmZvKHRoaXMudGltZXJJZClcbiAgICB9XG5cbiAgICBtb3ZlUXVpY2soKSB7XG4gICAgICB0aGlzLnNwZWVkICs9IDUwO1xuICAgICAgY29uc29sZS5pbmZvKHRoaXMuc3BlZWQpO1xuICAgIH1cbiAgICBtb3ZlTm9ybWFsKCkge1xuICAgICAgdGhpcy5zcGVlZCA9IDUwO1xuICAgIH1cbiAgICBjaGFuZ2VTdGF0dXMoc3RhdHVzKSB7XG4gICAgICBpZiAoc3RhdHVzID09PSBcInJlU3RhcnRcIikge1xuICAgICAgICBpZiAoW1wiZ2FtZW92ZXJcIiwgXCJwYXVzZVwiXS5pbmNsdWRlcyh0aGlzLnN0YXR1cykpIHtcbiAgICAgICAgICB0aGlzLnN0YXR1cyA9IFwibm9ybWFsXCI7XG4gICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gXCJwYXVzZVwiKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gXCJwYXVzZVwiO1xuICAgICAgICBpZiAodGhpcy50aW1lcklkKSB7XG4gICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy50aW1lcklkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IFwiZ2FtZW92ZVwiKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gXCJnYW1lb3ZlclwiO1xuICAgICAgICBjb25zb2xlLmluZm8odGhpcy5zdGF0dXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBfR2FtZTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJpbXBvcnQgRVZFTlRfQlVTIGZyb20gXCIuL0V2ZW50Q2VudGVyXCI7XG5pbXBvcnQgeyBBY3RvciwgUE9JTlRfVCwgRVZFTlRUWVBFIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XG5pbXBvcnQgeyBnZXRCbG9ja1NoYXBlIH0gZnJvbSBcIi4vYmxvY2tDb25maWdcIjtcbmNsYXNzIE5leHRCbG9jayBpbXBsZW1lbnRzIEFjdG9yIHtcbiAgcG9pbnRMaXN0OiBBcnJheTxQT0lOVF9UPiA9IFtdO1xuICBibG9ja19zaGFwZV9wb2ludF9saXN0ID0gW107XG4gIGluZGV4OiBudW1iZXIgPSAwO1xuICB1bml0QmxvY2t3OiBudW1iZXI7XG4gIHVuaXRCbG9ja2g6IG51bWJlcjtcbiAgY29uc3RydWN0b3IoeyB1bml0QmxvY2t3LCB1bml0QmxvY2toIH0pIHtcbiAgICB0aGlzLnVuaXRCbG9ja3cgPSB1bml0QmxvY2t3O1xuICAgIHRoaXMudW5pdEJsb2NraCA9IHVuaXRCbG9ja2g7XG4gICAgdGhpcy5ibG9ja19zaGFwZV9wb2ludF9saXN0ID0gZ2V0QmxvY2tTaGFwZSgpO1xuXG4gICAgbGV0IGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKTtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXggJSB0aGlzLmJsb2NrX3NoYXBlX3BvaW50X2xpc3QubGVuZ3RoO1xuICAgIHRoaXMucG9pbnRMaXN0ID0gdGhpcy5ibG9ja19zaGFwZV9wb2ludF9saXN0W3RoaXMuaW5kZXhdO1xuXG4gICAgRVZFTlRfQlVTLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRUWVBFLm1lcmdlLCB0aGlzLmNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIGRyYXcoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICBsZXQgZHggPSA0MDA7XG4gICAgbGV0IGR5ID0gNDA7XG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcbiAgICB0aGlzLnBvaW50TGlzdC5mb3JFYWNoKHBvaW50ID0+IHtcbiAgICAgIGxldCB7IHgsIHkgfSA9IHBvaW50O1xuICAgICAgY3R4LmZpbGxSZWN0KFxuICAgICAgICBkeCArICh4ICogdGhpcy51bml0QmxvY2t3KSAvIDIsXG4gICAgICAgIGR5ICsgKHkgKiB0aGlzLnVuaXRCbG9ja2gpIC8gMixcbiAgICAgICAgKHRoaXMudW5pdEJsb2NrdyAtIDEpIC8gMixcbiAgICAgICAgKHRoaXMudW5pdEJsb2NraCAtIDEpIC8gMlxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuICBjaGFuZ2UoKSB7XG4gICAgY29uc29sZS5pbmZvKFwibmV4dEJsb2NrLi4uLiBjaGFuZ2UoKS4uLi5cIik7XG5cbiAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgIGluZGV4OiB0aGlzLmluZGV4LFxuICAgICAgYmxvY2tfc2hhcGVfcG9pbnRfbGlzdDogSlNPTi5wYXJzZShcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkodGhpcy5ibG9ja19zaGFwZV9wb2ludF9saXN0KVxuICAgICAgKVxuICAgIH07XG4gICAgY29uc29sZS5pbmZvKFwiZmlyZS4uLmNoYW5nZVNoYXBlLi4uLlwiLCBwYXlsb2FkKTtcbiAgICBFVkVOVF9CVVMuZmlyZShFVkVOVFRZUEUuY2hhbmdlU2hhcGUsIHBheWxvYWQpO1xuXG4gICAgdGhpcy5ibG9ja19zaGFwZV9wb2ludF9saXN0ID0gZ2V0QmxvY2tTaGFwZSgpO1xuXG4gICAgbGV0IGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKTtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXggJSB0aGlzLmJsb2NrX3NoYXBlX3BvaW50X2xpc3QubGVuZ3RoO1xuICAgIHRoaXMucG9pbnRMaXN0ID0gdGhpcy5ibG9ja19zaGFwZV9wb2ludF9saXN0W3RoaXMuaW5kZXhdO1xuICAgIGNvbnNvbGUuaW5mbyhcIm5leHRCbG9jay4uLlwiLCB0aGlzLmluZGV4LCB0aGlzLnBvaW50TGlzdCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTmV4dEJsb2NrO1xuIiwiaW1wb3J0IEVWRU5UX0JVUyBmcm9tIFwiLi9FdmVudENlbnRlclwiO1xuaW1wb3J0IHsgQWN0b3IsIEVWRU5UVFlQRSB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xuY2xhc3MgU2NvcmUgaW1wbGVtZW50cyBBY3RvciB7XG4gIG1hcms6IG51bWJlciA9IDA7XG4gIGNvbnN0cnVjdG9yKG1hcms6IG51bWJlciA9IDApIHtcbiAgICB0aGlzLm1hcmsgPSBtYXJrO1xuXG4gICAgRVZFTlRfQlVTLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRUWVBFLmFkZFNjb3JlLCB0aGlzLmFkZFNjb3JlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgYWRkU2NvcmUocG9pbnQ6IG51bWJlcikge1xuICAgIHRoaXMubWFyayArPSBwb2ludDtcbiAgfVxuICBkcmF3KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gXCIjZmZmXCI7XG4gICAgY3R4LmZvbnQgPSBcImJvbGQgMzBweCBjb25zb2xhc1wiO1xuICAgIGN0eC5maWxsVGV4dChcIuWIhuaVsDpcIiArIHRoaXMubWFyay50b1N0cmluZygpLCA0NTAsIDEwMCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NvcmU7XG4iLCJjb25zdCBMX1NoYXBlID0gW1xuICAgIFtcbiAgICAgICAgWzEsMF0sXG4gICAgICAgIFsxLDBdLFxuICAgICAgICBbMSwxXVxuICAgIF0sXG4gICAgW1xuICAgICAgICBbMSwxLDFdLFxuICAgICAgICBbMSwwLDBdLFxuICAgIF0sXG4gICAgW1xuICAgICAgICBbMSwxXSxcbiAgICAgICAgWzAsMV0sXG4gICAgICAgIFswLDFdXG4gICAgXSxcbiAgICBbXG4gICAgICAgIFswLDAsMV0sXG4gICAgICAgIFsxLDEsMV0sXG4gICAgXVxuXVxuXG5jb25zdCBPX1NoYXBlID0gW1xuICAgIFtcbiAgICAgICAgWzEsMV0sXG4gICAgICAgIFsxLDFdXG4gICAgXSxcbiAgICBbXG4gICAgICAgIFsxLDFdLFxuICAgICAgICBbMSwxXSxcbiAgICBdXG5dXG5cbmNvbnN0IE5fU2hhcGUgPSBbXG4gICAgW1xuICAgICAgICBbMSwwXSxcbiAgICAgICAgWzEsMV0sXG4gICAgICAgIFswLDFdXG4gICAgXSxcbiAgICBbXG4gICAgICAgIFswLDEsMV0sXG4gICAgICAgIFsxLDEsMF0sXG4gICAgXVxuXVxuXG5jb25zdCBaX1NoYXBlID0gW1xuICAgIFtcbiAgICAgICAgWzAsMV0sXG4gICAgICAgIFsxLDFdLFxuICAgICAgICBbMSwwXVxuICAgIF0sXG4gICAgW1xuICAgICAgICBbMSwxLDBdLFxuICAgICAgICBbMCwxLDFdLFxuICAgIF1cbl1cblxuY29uc3QgbGluZV9TaGFwZSA9IFtcbiAgICBbXG4gICAgICAgIFswLDEsMCwwXSxcbiAgICAgICAgWzAsMSwwLDBdLFxuICAgICAgICBbMCwxLDAsMF0sXG4gICAgICAgIFswLDEsMCwwXSxcbiAgICBdLFxuICAgIFtcbiAgICAgICAgWzAsMCwwLDBdLFxuICAgICAgICBbMSwxLDEsMV0sXG4gICAgICAgIFswLDAsMCwwXVxuICAgIF1cbl1cblxuY29uc3QgQ3Jvc2VfU2hhcGUgPSBbXG4gICAgW1xuICAgICAgICBbMSwwXSxcbiAgICAgICAgWzEsMV0sXG4gICAgICAgIFsxLDBdLFxuICAgIF0sXG4gICAgW1xuICAgICAgICBbMSwxLDFdLFxuICAgICAgICBbMCwxLDBdLFxuICAgIF0sXG4gICAgW1xuICAgICAgICBbMCwxXSxcbiAgICAgICAgWzEsMV0sXG4gICAgICAgIFswLDFdLFxuICAgIF0sXG4gICAgW1xuICAgICAgICBbMCwxLDBdLFxuICAgICAgICBbMSwxLDFdLFxuICAgIF0sXG5dXG5cbi8vIGNvbnN0IEZhbl9TaGFwZSA9IFtcbi8vICAgICBbXG4vLyAgICAgICAgIFsxLDAsMV0sXG4vLyAgICAgICAgIFsxLDEsMV0sXG4vLyAgICAgICAgIFsxLDAsMV0sXG4vLyAgICAgXSxcbi8vICAgICBbXG4vLyAgICAgICAgIFsxLDEsMV0sXG4vLyAgICAgICAgIFswLDEsMF0sXG4vLyAgICAgICAgIFsxLDEsMV0sXG4vLyAgICAgXVxuLy8gXVxuXG5cbmNvbnN0IEJMT0NLX1NIQVBFX0FSUiA9IFsgTF9TaGFwZSwgTl9TaGFwZSwgT19TaGFwZSxaX1NoYXBlLGxpbmVfU2hhcGUsQ3Jvc2VfU2hhcGUgXS5tYXAoc2hhcGU9PnNoYXBlLm1hcChpdGVtPT57XG4gICAgbGV0IGFyID0gW107XG4gICAgaXRlbS5mb3JFYWNoKChpdCx5KT0+e1xuICAgICAgICBpdC5mb3JFYWNoKCh2YWwseCk9PntcbiAgICAgICAgICAgIGlmKHZhbCl7XG4gICAgICAgICAgICAgICAgYXIucHVzaCh7eCx5fSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9KVxuICAgIHJldHVybiBhcjtcbn0pKTtcblxuXG5jb25zdCBnZXRCbG9ja1NoYXBlID0gZnVuY3Rpb24oKXtcbiAgICBsZXQgbGVuID0gQkxPQ0tfU0hBUEVfQVJSLmxlbmd0aDtcbiAgICByZXR1cm4gQkxPQ0tfU0hBUEVfQVJSW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxlbildXG59XG5cbmV4cG9ydCB7IEJMT0NLX1NIQVBFX0FSUiAsZ2V0QmxvY2tTaGFwZX0gIiwiaW50ZXJmYWNlIEJsT0NLX1Qge1xuICBjYW5Nb3ZlTGVmdDogKEJHQmxvY2tzX1QpID0+IEJvb2xlYW47XG4gIGNhbk1vdmVSaWdodDogKEJHQmxvY2tzX1QpID0+IEJvb2xlYW47XG4gIGNhbk1vdmVEb3duOiAoQkdCbG9ja3NfVCkgPT4gQm9vbGVhbjtcbiAgY2FuTW92ZUNoYW5nZTogKEJHQmxvY2tzX1QpID0+IEJvb2xlYW47XG5cbiAgbW92ZUxlZnQ6IChCR0Jsb2Nrc19UKSA9PiBib29sZWFuO1xuICBtb3ZlUmlnaHQ6IChCR0Jsb2Nrc19UKSA9PiBib29sZWFuO1xuICBtb3ZlRG93bjogKEJHQmxvY2tzX1QpID0+IGJvb2xlYW47XG4gIG1vdmVDaGFuZ2U6IChCR0Jsb2Nrc19UKSA9PiBib29sZWFuO1xuXG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICBwb2ludExpc3Q6IEFycmF5PFBPSU5UX1Q+O1xuXG4gIGdldE1hdHJpeDogKGRpcj86IFN0cmluZykgPT4gQXJyYXk8UE9JTlRfVD47XG59XG5cbmVudW0gR0FNRVNUQVVUUyB7XG4gIG5vcm1hbCxcbiAgZ2FtZW92ZXIsXG4gIHBhdXNlXG59XG5cbmVudW0gRVZFTlRUWVBFIHtcbiAgbWVyZ2UsXG4gIGdhbWVvdmVyLFxuICBwYXVzZSxcbiAgY2hhbmdlU3RhdHVzLFxuICBtb3ZlUXVpY2ssXG4gIG1vdmVOb3JtYWwsXG4gIGFkZFNjb3JlLFxuICBjaGFuZ2VTaGFwZSxcblxuICBtb3ZlRG93bixcbiAgbW92ZUxlZnQsXG4gIG1vdmVSaWdodCxcbiAgbW92ZUNoYW5nZVxufVxuXG5pbnRlcmZhY2UgQWN0b3Ige1xuICBkcmF3OiAoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSA9PiB2b2lkO1xufVxuXG5pbnRlcmZhY2UgUE9JTlRfVCB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG5leHBvcnQgeyBCbE9DS19ULCBQT0lOVF9ULCBBY3RvciwgR0FNRVNUQVVUUywgRVZFTlRUWVBFIH07XG4iLCJcbmltcG9ydCBHYW1lIGZyb20gXCIuL0dhbWVcIjtcblxubGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15Q2FudmFzXCIpO1xubGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuY29uc29sZS5kaXIoY2FudmFzKVxubGV0IG1heE51bWJlclggPSAyMDsgLy8gMTDkuKpcbmxldCBtYXhOdW1iZXJZID0gMjA7IC8vIDEw5LiqXG5sZXQgYXJlYVdpZHRoID0gNDAwOy8vY2FudmFzLndpZHRoO1xubGV0IGFyZWFIZWlnaHQgPSA0MDA7Ly9jYW52YXMuaGVpZ2h0O1xuXG5sZXQgZ2FtZSA9IG5ldyBHYW1lKHsgY29udGV4dCwgbWF4TnVtYmVyWCwgbWF4TnVtYmVyWSxhcmVhV2lkdGgsYXJlYUhlaWdodH0pO1xuXG5nYW1lLnN0YXJ0KCk7XG4iXX0=
