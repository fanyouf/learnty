"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Plane = /** @class */ (function () {
    function Plane(x, y) {
        if (x === void 0) { x = 200; }
        if (y === void 0) { y = 200; }
        this.dx = -1;
        this.dy = -1;
        this.x = x;
        this.y = y;
        this.obj = document.createElement("div");
        this.obj.style.width = "30px";
        this.obj.style.height = "30px";
        this.obj.style.borderRadius = "15px";
        this.obj.className = "plane";
        this.move(x, y);
    }
    Plane.prototype.move = function (x, y) {
        if (x === void 0) { x = this.x; }
        if (y === void 0) { y = this.y; }
        this.x = x + this.dx;
        this.y = y + this.dy;
        this.obj.style.left = this.x + "px";
        this.obj.style.top = this.y + "px";
        // console.log(this.x)
    };
    return Plane;
}());
exports.default = Plane;
