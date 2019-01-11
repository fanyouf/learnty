(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = require("./interface");
var util_1 = require("./util");
var Spark_1 = require("./Spark");
var Firework = /** @class */ (function () {
    function Firework(_a) {
        var x = _a.x, y = _a.y;
        this.x = x;
        this.y = y;
        this.curAge = 0;
        this.dy = 50 + util_1.R(20);
        this.phase = interface_1.PHASE.rise;
        this.sparkPerNumber = 6;
        this.sparks = [];
        for (var n = 0; n < this.sparkPerNumber; n++) {
            var spark = new Spark_1.default({
                vx: Math.random() * 5 + 0.5,
                vy: Math.random() * 5 + 0.5,
                weight: Math.random() * 0.3 + 0.03,
                red: Math.floor(Math.random() * 2),
                green: Math.floor(Math.random() * 2),
                blue: Math.floor(Math.random() * 2)
            });
            if (Math.random() > 0.5)
                spark.vx = -spark.vx;
            if (Math.random() > 0.5)
                spark.vy = -spark.vy;
            this.sparks.push(spark);
        }
    }
    Firework.prototype.run = function (context) {
        var _this = this;
        this.curAge += 1 / 25;
        this.phase = this.curAge > this.dy / util_1.G ? interface_1.PHASE.expolde : interface_1.PHASE.rise;
        // if(this.phase === PHASE.rise){
        //     this.y = 500 -  this.dy * this.curAge + 0.5 * G * this.curAge * this.curAge;
        // }
        this.sparks.forEach(function (element) {
            element.run(context, _this);
        });
    };
    return Firework;
}());
exports.default = Firework;
},{"./Spark":3,"./interface":4,"./util":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Firework_1 = require("./Firework");
var Game = {
    actors: [],
    init: function (_a) {
        var context = _a.context, _b = _a.numberOfFirework, numberOfFirework = _b === void 0 ? 5 : _b;
        console.info(context);
        this.context = context;
        this.numberOfFirework = numberOfFirework;
        for (var i = 0; i < numberOfFirework; i++) {
            var firework = new Firework_1.default({
                x: Math.floor(Math.random() * 100),
                y: 300
            });
            this.actors.push(firework);
        }
    },
    start: function () {
        var _this = this;
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.actors.forEach(function (actor) {
            actor.run(_this.context);
        });
        requestAnimationFrame(Game.start.bind(this));
    }
};
exports.default = Game;
},{"./Firework":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = require("./interface");
var util_1 = require("./util");
var Spark = /** @class */ (function () {
    function Spark(_a) {
        var vx = _a.vx, vy = _a.vy, weight = _a.weight, red = _a.red, green = _a.green, blue = _a.blue;
        this.vx = vx;
        this.vy = vy;
        this.weight = weight;
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
    Spark.prototype[interface_1.PHASE.rise] = function (context, firework) {
        var i = 8;
        context.beginPath();
        //     this.y = 
        this.x = firework.x;
        this.y = 500 - firework.dy * firework.curAge + 0.5 * util_1.G * firework.curAge * firework.curAge;
        context.fillStyle = 'rgba(' + 255 + ',' + i * 17 + ',255,1)';
        context.rect(this.x + Math.random() * i - i / 2, this.y, 4, 4);
        context.fill();
        console.info(firework.x, firework.y);
    };
    Spark.prototype[interface_1.PHASE.expolde] = function (context, firework) {
        var trailAge = 100;
        var x = this.x + this.vx * trailAge;
        var y = this.y + this.vy * trailAge + this.weight * trailAge;
        var fade = 1 * 20 - firework.curAge * 2;
        var r = Math.floor(this.red * fade);
        var g = Math.floor(this.green * fade);
        var b = Math.floor(this.blue * fade);
        context.beginPath();
        context.fillStyle = 'rgba(255,255,255,1)';
        context.rect(x, y, 4, 4);
        context.fill();
        console.info("explode");
        console.info(x, y);
    };
    Spark.prototype.run = function (context, firework) {
        this[firework.phase](context, firework);
    };
    return Spark;
}());
exports.default = Spark;
},{"./interface":4,"./util":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PHASE;
(function (PHASE) {
    PHASE["expolde"] = "expolde";
    PHASE["rise"] = "rise";
})(PHASE || (PHASE = {}));
exports.PHASE = PHASE;
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("./Game");
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
Game_1.default.init({ context: context, numberOfFirework: 1 });
Game_1.default.start();
},{"./Game":2}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function R(max) {
    if (max === void 0) { max = 1; }
    return Math.random() * max;
}
exports.R = R;
var G = 9.8;
exports.G = G;
},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvRmlyZXdvcmsudHMiLCJzcmMvdHMvR2FtZS50cyIsInNyYy90cy9TcGFyay50cyIsInNyYy90cy9pbnRlcmZhY2UudHMiLCJzcmMvdHMvbWFpbi50cyIsInNyYy90cy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQSx5Q0FBd0M7QUFDeEMsK0JBQTBCO0FBQzFCLGlDQUEyQjtBQUMzQjtJQVVJLGtCQUFZLEVBQUs7WUFBSixRQUFDLEVBQUMsUUFBQztRQUNaLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsRUFBRSxHQUFFLEVBQUUsR0FBRSxRQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxpQkFBSyxDQUFDLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQTtRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQTtRQUdoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1QyxJQUFJLEtBQUssR0FBRyxJQUFJLGVBQUssQ0FBRTtnQkFDckIsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRztnQkFDM0IsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRztnQkFDM0IsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSTtnQkFDbEMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFB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LENBQUE7SUFDdkIsQ0FBQztJQUNELG1CQUFHLEdBQUgsVUFBSSxPQUFPLEVBQUMsUUFBUTtRQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBQyxRQUFRLENBQUMsQ0FBQTtJQUUxQyxDQUFDO0lBQ0wsWUFBQztBQUFELENBL0RBLEFBK0RDLElBQUE7QUFFRCxrQkFBZSxLQUFLLENBQUE7Ozs7QUNqRXBCLElBQUssS0FHSjtBQUhELFdBQUssS0FBSztJQUNOLDRCQUFpQixDQUFBO0lBQ2pCLHNCQUFXLENBQUE7QUFDZixDQUFDLEVBSEksS0FBSyxLQUFMLEtBQUssUUFHVDtBQUVjLHNCQUFLOzs7O0FDVHBCLCtCQUF5QjtBQUN6QixJQUFJLE1BQU0sR0FBcUIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUVuRSxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLGNBQUksQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLFNBQUEsRUFBQyxnQkFBZ0IsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0FBQ3hDLGNBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7OztBQ0xaLFNBQVMsQ0FBQyxDQUFDLEdBQVk7SUFBWixvQkFBQSxFQUFBLE9BQVk7SUFDbkIsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsR0FBRyxDQUFBO0FBQzVCLENBQUM7QUFFTyxjQUFDO0FBRFQsSUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFBO0FBQ0gsY0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG5pbXBvcnQge1BIQVNFLEFDVE9SfSBmcm9tIFwiLi9pbnRlcmZhY2VcIjtcclxuaW1wb3J0IHtSLEd9IGZyb20gXCIuL3V0aWxcIlxyXG5pbXBvcnQgU3BhcmsgZnJvbSBcIi4vU3BhcmtcIlxyXG5jbGFzcyBGaXJld29yayBpbXBsZW1lbnRzIEFDVE9SIHtcclxuICAgIHBoYXNlOlBIQVNFXHJcbiAgICB4Om51bWJlclxyXG4gICAgeTpudW1iZXJcclxuICAgIGR5Om51bWJlclxyXG4gICAgY3VyQWdlOm51bWJlclxyXG4gICAgbWF4QWdlOm51bWJlclxyXG4gICAgc3BhcmtQZXJOdW1iZXI6bnVtYmVyXHJcbiAgICBzcGFya3M6QXJyYXk8U3Bhcms+XHJcblxyXG4gICAgY29uc3RydWN0b3Ioe3gseX0pe1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLmN1ckFnZSA9IDA7XHJcbiAgICAgICAgdGhpcy5keSA9NTArIFIoMjApO1xyXG4gICAgICAgIHRoaXMucGhhc2UgPSBQSEFTRS5yaXNlO1xyXG4gICAgICAgIHRoaXMuc3BhcmtQZXJOdW1iZXIgPSA2XHJcbiAgICAgICAgdGhpcy5zcGFya3MgPSBbXVxyXG5cclxuXHJcbiAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCB0aGlzLnNwYXJrUGVyTnVtYmVyOyBuKyspIHtcclxuICAgICAgICAgIGxldCBzcGFyayA9IG5ldyBTcGFyaygge1xyXG4gICAgICAgICAgICB2eDogTWF0aC5yYW5kb20oKSAqIDUgKyAwLjUsXHJcbiAgICAgICAgICAgIHZ5OiBNYXRoLnJhbmRvbSgpICogNSArIDAuNSxcclxuICAgICAgICAgICAgd2VpZ2h0OiBNYXRoLnJhbmRvbSgpICogMC4zICsgMC4wMyxcclxuICAgICAgICAgICAgcmVkOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKSxcclxuICAgICAgICAgICAgZ3JlZW46IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpLFxyXG4gICAgICAgICAgICBibHVlOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKVxyXG4gICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkgc3BhcmsudnggPSAtc3BhcmsudnhcclxuXHJcbiAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkgc3BhcmsudnkgPSAtc3BhcmsudnlcclxuXHJcbiAgICAgICAgICB0aGlzLnNwYXJrcy5wdXNoKHNwYXJrKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBydW4oY29udGV4dCl7XHJcbiAgICAgICAgdGhpcy5jdXJBZ2UrPSAxIC8gMjU7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucGhhc2UgPSB0aGlzLmN1ckFnZSA+IHRoaXMuZHkvRyA/ICBQSEFTRS5leHBvbGRlIDogUEhBU0UucmlzZTtcclxuICAgICAgICAvLyBpZih0aGlzLnBoYXNlID09PSBQSEFTRS5yaXNlKXtcclxuXHJcbiAgICAgICAgLy8gICAgIHRoaXMueSA9IDUwMCAtICB0aGlzLmR5ICogdGhpcy5jdXJBZ2UgKyAwLjUgKiBHICogdGhpcy5jdXJBZ2UgKiB0aGlzLmN1ckFnZTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgdGhpcy5zcGFya3MuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgZWxlbWVudC5ydW4oY29udGV4dCx0aGlzKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCAgRmlyZXdvcms7IiwiaW1wb3J0IEZpcmV3b3JrIGZyb20gXCIuL0ZpcmV3b3JrXCJcclxuaW1wb3J0IHtBQ1RPUn0gZnJvbSBcIi4vaW50ZXJmYWNlXCJcclxubGV0ICBHYW1lID0ge1xyXG4gICAgXHJcbiAgICBhY3RvcnM6W10sXHJcbiAgICBpbml0KHtjb250ZXh0LG51bWJlck9mRmlyZXdvcmsgPSA1fSl7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKGNvbnRleHQpXHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLm51bWJlck9mRmlyZXdvcmsgPSBudW1iZXJPZkZpcmV3b3JrO1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGk8IG51bWJlck9mRmlyZXdvcms7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCBmaXJld29yayA9IG5ldyBGaXJld29yayh7XHJcbiAgICAgICAgICAgICAgICB4IDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSxcclxuICAgICAgICAgICAgICAgIHkgOiAzMDBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdGhpcy5hY3RvcnMucHVzaChmaXJld29yaylcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc3RhcnQoKXtcclxuICAgICAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY29udGV4dC5jYW52YXMud2lkdGgsIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcclxuICBcclxuICAgICAgICB0aGlzLmFjdG9ycy5mb3JFYWNoKChhY3RvcjpBQ1RPUikgPT4ge1xyXG4gICAgICAgICAgICBhY3Rvci5ydW4odGhpcy5jb250ZXh0KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShHYW1lLnN0YXJ0LmJpbmQodGhpcykpXHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgR2FtZSIsIlxyXG5pbXBvcnQge0FDVE9SLFBIQVNFfSBmcm9tIFwiLi9pbnRlcmZhY2VcIlxyXG5pbXBvcnQgRmlyZXdvcmsgZnJvbSBcIi4vRmlyZXdvcmtcIlxyXG5pbXBvcnQge1IsR30gZnJvbSBcIi4vdXRpbFwiXHJcbmNsYXNzIFNwYXJrIGltcGxlbWVudHMgQUNUT1Ige1xyXG4gICAgeDpudW1iZXJcclxuICAgIHk6bnVtYmVyXHJcbiAgICB2eDogbnVtYmVyXHJcbiAgICB2eTogbnVtYmVyXHJcbiAgICB3ZWlnaHQ6bnVtYmVyXHJcbiAgICByZWQ6bnVtYmVyXHJcbiAgICBncmVlbjpudW1iZXJcclxuICAgIGJsdWU6bnVtYmVyXHJcbiAgIFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHt2eCx2eSx3ZWlnaHQscmVkLGdyZWVuLGJsdWV9KXtcclxuICAgICAgICB0aGlzLnZ4ID0gdng7XHJcbiAgICAgICAgdGhpcy52eSA9IHZ5O1xyXG4gICAgICAgIHRoaXMud2VpZ2h0ID0gd2VpZ2h0O1xyXG4gICAgICAgIHRoaXMucmVkID0gcmVkO1xyXG4gICAgICAgIHRoaXMuZ3JlZW4gPSBncmVlbjtcclxuICAgICAgICB0aGlzLmJsdWUgPSBibHVlO1xyXG4gICAgfVxyXG4gICAgW1BIQVNFLnJpc2VdKGNvbnRleHQsZmlyZXdvcms6RmlyZXdvcmspe1xyXG4gICAgICAgIGxldCBpID0gODtcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpXHJcblxyXG4gICAgICAgIC8vICAgICB0aGlzLnkgPSBcclxuICAgICAgICB0aGlzLnggPSBmaXJld29yay54XHJcbiAgICAgICAgdGhpcy55ID0gNTAwIC0gIGZpcmV3b3JrLmR5ICogZmlyZXdvcmsuY3VyQWdlICsgMC41ICogRyAqIGZpcmV3b3JrLmN1ckFnZSAqIGZpcmV3b3JrLmN1ckFnZTtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgnICsgMjU1ICsgJywnICsgaSAqIDE3ICsgJywyNTUsMSknXHJcblxyXG4gICAgICAgIGNvbnRleHQucmVjdCh0aGlzLnggKyBNYXRoLnJhbmRvbSgpICogaSAtIGkgLyAyLCB0aGlzLnkgLCA0LCA0KVxyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICBjb25zb2xlLmluZm8oZmlyZXdvcmsueCxmaXJld29yay55KVxyXG4gICAgfVxyXG4gICAgW1BIQVNFLmV4cG9sZGVdKGNvbnRleHQsZmlyZXdvcms6RmlyZXdvcmspe1xyXG4gICAgICAgIGxldCB0cmFpbEFnZSA9IDEwMFxyXG5cclxuICAgICAgICBsZXQgeCA9IHRoaXMueCArIHRoaXMudnggKiB0cmFpbEFnZVxyXG5cclxuICAgICAgICBsZXQgeSA9IHRoaXMueSArIHRoaXMudnkgKiB0cmFpbEFnZSArIHRoaXMud2VpZ2h0ICogdHJhaWxBZ2VcclxuXHJcbiAgICAgICAgbGV0IGZhZGUgPSAxICogMjAgLSBmaXJld29yay5jdXJBZ2UgKiAyXHJcblxyXG4gICAgICAgIGxldCByID0gTWF0aC5mbG9vcih0aGlzLnJlZCAqIGZhZGUpXHJcblxyXG4gICAgICAgIGxldCBnID0gTWF0aC5mbG9vcih0aGlzLmdyZWVuICogZmFkZSlcclxuXHJcbiAgICAgICAgbGV0IGIgPSBNYXRoLmZsb29yKHRoaXMuYmx1ZSAqIGZhZGUpXHJcblxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKClcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgyNTUsMjU1LDI1NSwxKSdcclxuXHJcbiAgICAgICAgY29udGV4dC5yZWN0KHgsIHksIDQsIDQpXHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpXHJcbiAgICAgICAgY29uc29sZS5pbmZvKFwiZXhwbG9kZVwiKVxyXG4gICAgICAgIGNvbnNvbGUuaW5mbyggeCwgeSlcclxuICAgIH1cclxuICAgIHJ1bihjb250ZXh0LGZpcmV3b3JrKXtcclxuICAgICAgICB0aGlzW2ZpcmV3b3JrLnBoYXNlXShjb250ZXh0LGZpcmV3b3JrKVxyXG4gICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNwYXJrXHJcblxyXG4iLCJpbnRlcmZhY2UgQUNUT1Ige1xyXG4gICAgcnVuOihjb250ZXh0LGZpcmV3b3JrPyk9PnZvaWRcclxufVxyXG5cclxuZW51bSBQSEFTRXtcclxuICAgIGV4cG9sZGU9XCJleHBvbGRlXCIsXHJcbiAgICByaXNlPVwicmlzZVwiXHJcbn1cclxuXHJcbmV4cG9ydCB7IEFDVE9SLFBIQVNFfSIsImltcG9ydCBHYW1lIGZyb20gXCIuL0dhbWVcIlxyXG5sZXQgY2FudmFzOkhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215Q2FudmFzJyk7XHJcblxyXG5sZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5HYW1lLmluaXQoe2NvbnRleHQsbnVtYmVyT2ZGaXJld29yazoxfSk7XHJcbkdhbWUuc3RhcnQoKSIsImZ1bmN0aW9uIFIobWF4Om51bWJlcj0xKXtcclxuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpKm1heFxyXG59XHJcbmNvbnN0IEcgPSA5LjhcclxuZXhwb3J0IHtSLEd9Il19
