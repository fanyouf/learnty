(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var subject_1 = require("./subject");
var utils_1 = require("./utils");
var BuildSubject = /** @class */ (function () {
    function BuildSubject(op, amount) {
        this.list = [];
        this.currentIndex = 0;
        for (var i = 0; i < amount; i++) {
            this.list.push(new subject_1.default(utils_1.math.getRandom(), utils_1.math.getRandom(), op));
        }
    }
    BuildSubject.prototype.getSubject = function () {
        return this.list[this.currentIndex++];
    };
    return BuildSubject;
}());
exports.default = BuildSubject;
},{"./subject":4,"./utils":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OPSYSMBOL;
(function (OPSYSMBOL) {
    OPSYSMBOL["ADD"] = "+";
    OPSYSMBOL["SUB"] = "-";
    OPSYSMBOL["MUL"] = "*";
    OPSYSMBOL["DIV"] = "/";
})(OPSYSMBOL || (OPSYSMBOL = {}));
exports.OPSYSMBOL = OPSYSMBOL;
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SubjectBuilder_1 = require("./SubjectBuilder");
var interface_1 = require("./interface");
window.onload = function () {
    var subjects = new SubjectBuilder_1.default(interface_1.OPSYSMBOL.ADD, 3);
    var opSymbol = document.getElementById("opSymbol");
    var op1 = document.getElementById("op1");
    var op2 = document.getElementById("op2");
    var updateSubject = function (curSubject) {
        opSymbol.innerHTML = curSubject.op.toString();
        op1.innerHTML = curSubject.op1.toString();
        op2.innerHTML = curSubject.op2.toString();
    };
    var initSubjectStatus = function (subjectList) {
        var doc = document.getElementById("subjectStatus");
        var resultMap = subjectList.list.map(function (item, index) {
            var span = document.createElement("span");
            span.className = "normal";
            doc.appendChild(span);
        });
    };
    var updateSubjectStatus = function (subjectList) {
        var doc = document.getElementById("subjectStatus");
        var rs = doc.querySelectorAll("span");
        // console.info(rs)
        var index = subjectList.currentIndex - 1;
        rs[index].className = subjectList.list[subjectList.currentIndex - 1].isRight ? "yes" : "no";
    };
    var curSubject = subjects.getSubject();
    updateSubject(curSubject);
    initSubjectStatus(subjects);
    document.getElementById("ansBox").focus();
    document.getElementById("getNext").addEventListener("click", function () {
        var rs = parseInt(document.getElementById("ansBox").value);
        console.info(rs);
        curSubject.setAns(rs);
        updateSubjectStatus(subjects);
        console.info(curSubject);
        curSubject = subjects.getSubject();
        if (curSubject) {
            document.getElementById("ansBox").value = '';
            document.getElementById("ansBox").focus();
            updateSubject(curSubject);
        }
        else {
            document.getElementById("getNext").style.display = "none";
        }
    });
};
},{"./SubjectBuilder":1,"./interface":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = require("./interface");
var SubjectItem = /** @class */ (function () {
    function SubjectItem(op1, op2, op) {
        this.isRight = false;
        this.op1 = op1;
        this.op2 = op2;
        this.op = op;
        this.buildAns();
    }
    SubjectItem.prototype.buildAns = function () {
        switch (this.op) {
            case interface_1.OPSYSMBOL.ADD:
                this.ans = this.op1 + this.op2;
                break;
            case interface_1.OPSYSMBOL.DIV:
                this.ans = this.op1 / this.op2;
                break;
            case interface_1.OPSYSMBOL.MUL:
                this.ans = this.op1 * this.op2;
                break;
            case interface_1.OPSYSMBOL.SUB:
                this.ans = this.op1 - this.op2;
                break;
        }
    };
    SubjectItem.prototype.setAns = function (yourAns) {
        this.curAns = yourAns;
        this.isRight = this.curAns === this.ans;
    };
    return SubjectItem;
}());
exports.default = SubjectItem;
},{"./interface":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var math = /** @class */ (function () {
    function math() {
    }
    math.getRandom = function (n) {
        if (n === void 0) { n = 100; }
        var rs = Math.ceil(Math.random() * n);
        return rs;
    };
    return math;
}());
exports.math = math;
},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvU3ViamVjdEJ1aWxkZXIudHMiLCJzcmMvdHMvaW50ZXJmYWNlLnRzIiwic3JjL3RzL21haW4udHMiLCJzcmMvdHMvc3ViamVjdC50cyIsInNyYy90cy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEscUNBQStCO0FBRy9CLGlDQUE0QjtBQUM1QjtJQUlJLHNCQUFZLEVBQVksRUFBQyxNQUFhO1FBSHRDLFNBQUksR0FBZ0IsRUFBRSxDQUFDO1FBQ3ZCLGlCQUFZLEdBQVUsQ0FBQyxDQUFDO1FBR3BCLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7WUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBTyxDQUFDLFlBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQyxZQUFJLENBQUMsU0FBUyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtTQUNwRTtJQUNMLENBQUM7SUFFRCxpQ0FBVSxHQUFWO1FBQ0ksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTCxtQkFBQztBQUFELENBZEEsQUFjQyxJQUFBO0FBRUQsa0JBQWUsWUFBWSxDQUFBOzs7O0FDcEIzQixJQUFLLFNBS0o7QUFMRCxXQUFLLFNBQVM7SUFDVixzQkFBUSxDQUFBO0lBQ1Isc0JBQU8sQ0FBQTtJQUNQLHNCQUFPLENBQUE7SUFDUCxzQkFBTyxDQUFBO0FBQ1gsQ0FBQyxFQUxJLFNBQVMsS0FBVCxTQUFTLFFBS2I7QUFRTyw4QkFBUzs7OztBQ2JqQixtREFBNkM7QUFDN0MseUNBQThDO0FBRTlDLE1BQU0sQ0FBQyxNQUFNLEdBQUc7SUFDWixJQUFNLFFBQVEsR0FBRyxJQUFJLHdCQUFjLENBQUMscUJBQVMs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dEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxLQUFNLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDN0MsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0FwQ0EsQUFvQ0MsSUFBQTtBQUVELGtCQUFnQixXQUFXLENBQUM7Ozs7QUN6QzVCO0lBQUE7SUFLQSxDQUFDO0lBSlUsY0FBUyxHQUFoQixVQUFpQixDQUFZO1FBQVosa0JBQUEsRUFBQSxPQUFZO1FBQ3pCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3JDLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUxBLEFBS0MsSUFBQTtBQUVPLG9CQUFJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHN1YmplY3QgZnJvbSAnLi9zdWJqZWN0J1xyXG5pbXBvcnQgIHtPUFNZU01CT0x9IGZyb20gXCIuL2ludGVyZmFjZVwiXHJcblxyXG5pbXBvcnQge21hdGh9IGZyb20gJy4vdXRpbHMnXHJcbmNsYXNzIEJ1aWxkU3ViamVjdCB7XHJcbiAgICBsaXN0OkFycmF5PHN1YmplY3Q+PVtdO1xyXG4gICAgY3VycmVudEluZGV4Om51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3A6T1BTWVNNQk9MLGFtb3VudDpudW1iZXIpe1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8IGFtb3VudDsgaSsrKXtcclxuICAgICAgICAgICAgdGhpcy5saXN0LnB1c2gobmV3IHN1YmplY3QobWF0aC5nZXRSYW5kb20oKSxtYXRoLmdldFJhbmRvbSgpLG9wKSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U3ViamVjdCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxpc3RbdGhpcy5jdXJyZW50SW5kZXgrK107XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCdWlsZFN1YmplY3RcclxuXHJcbiIsImVudW0gT1BTWVNNQk9MIHtcclxuICAgIEFERCA9XCIrXCIsXHJcbiAgICBTVUI9XCItXCIsXHJcbiAgICBNVUw9XCIqXCIsXHJcbiAgICBESVY9XCIvXCJcclxufVxyXG5pbnRlcmZhY2UgU3ViamVjdHtcclxuICAgIG9wMTpudW1iZXIsXHJcbiAgICBvcDI6bnVtYmVyLFxyXG4gICAgb3A6T1BTWVNNQk9MLFxyXG4gICAgYW5zOm51bWJlclxyXG59XHJcblxyXG5leHBvcnQge09QU1lTTUJPTCwgU3ViamVjdH0iLCJpbXBvcnQgU3ViamVjdEJ1aWxkZXIgZnJvbSAnLi9TdWJqZWN0QnVpbGRlcidcclxuaW1wb3J0ICB7T1BTWVNNQk9MLFN1YmplY3R9IGZyb20gXCIuL2ludGVyZmFjZVwiXHJcblxyXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKXtcclxuICAgIGNvbnN0IHN1YmplY3RzID0gbmV3IFN1YmplY3RCdWlsZGVyKE9QU1lTTUJPTC5BREQsMyk7XHJcbiAgICBsZXQgb3BTeW1ib2wgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wU3ltYm9sXCIpO1xyXG4gICAgbGV0IG9wMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3AxXCIpO1xyXG4gICAgbGV0IG9wMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3AyXCIpO1xyXG4gICAgXHJcbiAgICBjb25zdCB1cGRhdGVTdWJqZWN0PShjdXJTdWJqZWN0OlN1YmplY3QpPT57XHJcbiAgICAgICAgb3BTeW1ib2wuaW5uZXJIVE1MID0gY3VyU3ViamVjdC5vcC50b1N0cmluZygpO1xyXG4gICAgICAgIG9wMS5pbm5lckhUTUwgPSBjdXJTdWJqZWN0Lm9wMS50b1N0cmluZygpXHJcbiAgICAgICAgb3AyLmlubmVySFRNTCA9IGN1clN1YmplY3Qub3AyLnRvU3RyaW5nKClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpbml0U3ViamVjdFN0YXR1cz0oc3ViamVjdExpc3Q6U3ViamVjdEJ1aWxkZXIpPT57XHJcbiAgICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3ViamVjdFN0YXR1c1wiKTtcclxuICAgICAgICBsZXQgcmVzdWx0TWFwID0gc3ViamVjdExpc3QubGlzdC5tYXAoKGl0ZW0saW5kZXgpPT57XHJcbiAgICAgICAgICAgIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgICAgIHNwYW4uY2xhc3NOYW1lPVwibm9ybWFsXCI7XHJcbiAgICAgICAgICAgIGRvYy5hcHBlbmRDaGlsZChzcGFuKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHVwZGF0ZVN1YmplY3RTdGF0dXM9KHN1YmplY3RMaXN0OlN1YmplY3RCdWlsZGVyKT0+e1xyXG4gICAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1YmplY3RTdGF0dXNcIik7XHJcbiAgICAgICAgbGV0IHJzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuXCIpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyhycylcclxuXHJcbiAgICAgICAgbGV0IGluZGV4ID0gc3ViamVjdExpc3QuY3VycmVudEluZGV4IC0xIDtcclxuICAgICAgICByc1tpbmRleF0uY2xhc3NOYW1lID0gc3ViamVjdExpc3QubGlzdFtzdWJqZWN0TGlzdC5jdXJyZW50SW5kZXgtMV0uaXNSaWdodCA/IFwieWVzXCIgOlwibm9cIlxyXG5cclxuXHJcbiAgICB9XHJcbiAgICBsZXQgY3VyU3ViamVjdCA9IHN1YmplY3RzLmdldFN1YmplY3QoKTtcclxuXHJcbiAgICB1cGRhdGVTdWJqZWN0KGN1clN1YmplY3QpO1xyXG4gICAgaW5pdFN1YmplY3RTdGF0dXMoc3ViamVjdHMpXHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbnNCb3hcIikuZm9jdXMoKVxyXG5cclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldE5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsKCk9PntcclxuICAgICAgICBsZXQgcnMgPSBwYXJzZUludCggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbnNCb3hcIikudmFsdWUgKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5pbmZvKHJzKVxyXG4gICAgICAgIGN1clN1YmplY3Quc2V0QW5zKHJzKVxyXG4gICAgICAgIHVwZGF0ZVN1YmplY3RTdGF0dXMoc3ViamVjdHMpXHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5pbmZvKGN1clN1YmplY3QpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGN1clN1YmplY3QgPSBzdWJqZWN0cy5nZXRTdWJqZWN0KCk7XHJcbiAgICAgICAgaWYoY3VyU3ViamVjdCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuc0JveFwiKS52YWx1ZSA9ICcnXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5zQm94XCIpLmZvY3VzKClcclxuICAgICAgICAgICAgdXBkYXRlU3ViamVjdChjdXJTdWJqZWN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZXROZXh0XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgfSlcclxufVxyXG4iLCJcclxuaW1wb3J0ICB7T1BTWVNNQk9MLCBTdWJqZWN0fSBmcm9tIFwiLi9pbnRlcmZhY2VcIlxyXG5cclxuY2xhc3MgU3ViamVjdEl0ZW0gaW1wbGVtZW50cyBTdWJqZWN0e1xyXG4gICAgb3AxOm51bWJlcjtcclxuICAgIG9wMjpudW1iZXI7XHJcbiAgICBvcDpPUFNZU01CT0w7XHJcbiAgICBhbnM6bnVtYmVyO1xyXG4gICAgY3VyQW5zOm51bWJlcjtcclxuICAgIGlzUmlnaHQ6Ym9vbGVhbj1mYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKG9wMSxvcDIsb3Ape1xyXG4gICAgICAgIHRoaXMub3AxID0gb3AxO1xyXG4gICAgICAgIHRoaXMub3AyID0gb3AyO1xyXG4gICAgICAgIHRoaXMub3AgPSBvcDtcclxuXHJcbiAgICAgICAgdGhpcy5idWlsZEFucygpO1xyXG4gICAgfVxyXG5cclxuICAgIGJ1aWxkQW5zKCl7XHJcbiAgICAgICAgc3dpdGNoKHRoaXMub3Ape1xyXG4gICAgICAgICAgICBjYXNlIE9QU1lTTUJPTC5BREQgOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hbnMgPSB0aGlzLm9wMSArIHRoaXMub3AyXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBPUFNZU01CT0wuRElWIDpcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5zID0gdGhpcy5vcDEgLyB0aGlzLm9wMlxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSBPUFNZU01CT0wuTVVMIDpcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5zID0gdGhpcy5vcDEgKiB0aGlzLm9wMlxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSBPUFNZU01CT0wuU1VCIDpcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5zID0gdGhpcy5vcDEgLSB0aGlzLm9wMlxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QW5zKHlvdXJBbnM6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLmN1ckFucyA9IHlvdXJBbnM7XHJcbiAgICAgICAgdGhpcy5pc1JpZ2h0ID0gdGhpcy5jdXJBbnMgID09PSB0aGlzLmFucztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgIFN1YmplY3RJdGVtOyIsImNsYXNzIG1hdGh7XHJcbiAgICBzdGF0aWMgZ2V0UmFuZG9tKG46bnVtYmVyPTEwMCl7XHJcbiAgICAgICAgbGV0IHJzID0gTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiBuKVxyXG4gICAgICAgIHJldHVybiBycztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHttYXRofSJdfQ==
