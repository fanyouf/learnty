(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],2:[function(require,module,exports){
var ab = require("./interface");
console.info(ab);
var max_fireworks = 5, max_sparks = 50;
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var fireworks = [];
for (var i = 0; i < max_fireworks; i++) {
    var firework = {
        sparks: []
    };
    for (var n = 0; n < max_sparks; n++) {
        var spark = {
            vx: Math.random() * 5 + 0.5,
            vy: Math.random() * 5 + 0.5,
            weight: Math.random() * 0.3 + 0.03,
            red: Math.floor(Math.random() * 2),
            green: Math.floor(Math.random() * 2),
            blue: Math.floor(Math.random() * 2)
        };
        if (Math.random() > 0.5)
            spark.vx = -spark.vx;
        if (Math.random() > 0.5)
            spark.vy = -spark.vy;
        firework.sparks.push(spark);
    }
    fireworks.push(firework);
    resetFirework(firework);
}
window.requestAnimationFrame(explode);
function resetFirework(firework) {
    firework.x = Math.floor(Math.random() * canvas.width);
    firework.y = canvas.height;
    firework.age = 0;
    firework.phase = 'fly';
}
function explode() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach(function (firework, index) {
        if (firework.phase == 'explode') {
            firework.sparks.forEach(function (spark) {
                for (var i = 0; i < 10; i++) {
                    var trailAge = firework.age + i;
                    var x = firework.x + spark.vx * trailAge;
                    var y = firework.y + spark.vy * trailAge + spark.weight * trailAge * spark.weight * trailAge;
                    var fade = i * 20 - firework.age * 2;
                    var r = Math.floor(spark.red * fade);
                    var g = Math.floor(spark.green * fade);
                    var b = Math.floor(spark.blue * fade);
                    context.beginPath();
                    context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',1)';
                    context.rect(x, y, 4, 4);
                    context.fill();
                }
            });
            firework.age++;
            if (firework.age > 100 && Math.random() < 0.05) {
                resetFirework(firework);
            }
        }
        else {
            firework.y = firework.y - 10;
            for (var spark = 0; spark < 15; spark++) {
                context.beginPath();
                context.fillStyle = 'rgba(' + index * 50 + ',' + spark * 17 + ',0,1)';
                context.rect(firework.x + Math.random() * spark - spark / 2, firework.y + spark * 4, 4, 4);
                context.fill();
            }
            if (Math.random() < 0.001 || firework.y < 200)
                firework.phase = 'explode';
        }
    });
    window.requestAnimationFrame(explode);
}
},{"./interface":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0FBLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBRSxhQUFhLENBQUMsQ0FBQTtBQUVoQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ2hCLElBQU0sYUFBYSxHQUFXLENBQUMsRUFDdkIsVUFBVSxHQUFVLEVBQUUsQ0FBQTtBQUV4QixJQUFJLE1BQU0sR0FBcUIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUVsRSxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBRXJDLElBQUksU0FBUyxHQUFnQixFQUFFLENBQUE7QUFFL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN0QyxJQUFJLFFBQVEsR0FBRztRQUNiLE1BQU0sRUFBRSxFQUFFO0tBQ1gsQ0FBQTtJQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbkMsSUFBSSxLQUFLLEdBQVM7WUFDaEIsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRztZQUUzQixFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHO1lBRTNCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUk7WUFFbEMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVsQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxF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bigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJsZXQgYWIgPSByZXF1aXJlKCBcIi4vaW50ZXJmYWNlXCIpXHJcblxyXG5jb25zb2xlLmluZm8oYWIpXHJcbmNvbnN0IG1heF9maXJld29ya3MgOm51bWJlciA9IDUsXHJcbiAgICAgICAgbWF4X3NwYXJrczpudW1iZXIgPSA1MFxyXG5cclxuICAgICAgbGV0IGNhbnZhczpIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteUNhbnZhcycpXHJcblxyXG4gICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcblxyXG4gICAgICBsZXQgZmlyZXdvcmtzOkFycmF5PFNwYXJrPiA9IFtdXHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1heF9maXJld29ya3M7IGkrKykge1xyXG4gICAgICAgIGxldCBmaXJld29yayA9IHtcclxuICAgICAgICAgIHNwYXJrczogW11cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgbWF4X3NwYXJrczsgbisrKSB7XHJcbiAgICAgICAgICBsZXQgc3Bhcms6U3BhcmsgPSB7XHJcbiAgICAgICAgICAgIHZ4OiBNYXRoLnJhbmRvbSgpICogNSArIDAuNSxcclxuXHJcbiAgICAgICAgICAgIHZ5OiBNYXRoLnJhbmRvbSgpICogNSArIDAuNSxcclxuXHJcbiAgICAgICAgICAgIHdlaWdodDogTWF0aC5yYW5kb20oKSAqIDAuMyArIDAuMDMsXHJcblxyXG4gICAgICAgICAgICByZWQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpLFxyXG5cclxuICAgICAgICAgICAgZ3JlZW46IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpLFxyXG5cclxuICAgICAgICAgICAgYmx1ZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMilcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkgc3BhcmsudnggPSAtc3BhcmsudnhcclxuXHJcbiAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkgc3BhcmsudnkgPSAtc3BhcmsudnlcclxuXHJcbiAgICAgICAgICBmaXJld29yay5zcGFya3MucHVzaChzcGFyaylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZpcmV3b3Jrcy5wdXNoKGZpcmV3b3JrKVxyXG5cclxuICAgICAgICByZXNldEZpcmV3b3JrKGZpcmV3b3JrKVxyXG4gICAgICB9XHJcblxyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGV4cGxvZGUpXHJcblxyXG4gICAgICBmdW5jdGlvbiByZXNldEZpcmV3b3JrKGZpcmV3b3JrKSB7XHJcbiAgICAgICAgZmlyZXdvcmsueCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNhbnZhcy53aWR0aClcclxuXHJcbiAgICAgICAgZmlyZXdvcmsueSA9IGNhbnZhcy5oZWlnaHRcclxuXHJcbiAgICAgICAgZmlyZXdvcmsuYWdlID0gMFxyXG5cclxuICAgICAgICBmaXJld29yay5waGFzZSA9ICdmbHknXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGV4cGxvZGUoKSB7XHJcbiAgICAgICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KVxyXG5cclxuICAgICAgICBmaXJld29ya3MuZm9yRWFjaCgoZmlyZXdvcmssIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZmlyZXdvcmsucGhhc2UgPT0gJ2V4cGxvZGUnKSB7XHJcbiAgICAgICAgICAgIGZpcmV3b3JrLnNwYXJrcy5mb3JFYWNoKHNwYXJrID0+IHtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB0cmFpbEFnZSA9IGZpcmV3b3JrLmFnZSArIGlcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgeCA9IGZpcmV3b3JrLnggKyBzcGFyay52eCAqIHRyYWlsQWdlXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHkgPSBmaXJld29yay55ICsgc3BhcmsudnkgKiB0cmFpbEFnZSArIHNwYXJrLndlaWdodCAqIHRyYWlsQWdlICogc3Bhcmsud2VpZ2h0ICogdHJhaWxBZ2VcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZmFkZSA9IGkgKiAyMCAtIGZpcmV3b3JrLmFnZSAqIDJcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgciA9IE1hdGguZmxvb3Ioc3BhcmsucmVkICogZmFkZSlcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZyA9IE1hdGguZmxvb3Ioc3BhcmsuZ3JlZW4gKiBmYWRlKVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBiID0gTWF0aC5mbG9vcihzcGFyay5ibHVlICogZmFkZSlcclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpXHJcblxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgnICsgciArICcsJyArIGcgKyAnLCcgKyBiICsgJywxKSdcclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlY3QoeCwgeSwgNCwgNClcclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGwoKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGZpcmV3b3JrLmFnZSsrXHJcblxyXG4gICAgICAgICAgICBpZiAoZmlyZXdvcmsuYWdlID4gMTAwICYmIE1hdGgucmFuZG9tKCkgPCAwLjA1KSB7XHJcbiAgICAgICAgICAgICAgcmVzZXRGaXJld29yayhmaXJld29yaylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZmlyZXdvcmsueSA9IGZpcmV3b3JrLnkgLSAxMFxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgc3BhcmsgPSAwOyBzcGFyayA8IDE1OyBzcGFyaysrKSB7XHJcbiAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKVxyXG5cclxuICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKCcgKyBpbmRleCAqIDUwICsgJywnICsgc3BhcmsgKiAxNyArICcsMCwxKSdcclxuXHJcbiAgICAgICAgICAgICAgY29udGV4dC5yZWN0KGZpcmV3b3JrLnggKyBNYXRoLnJhbmRvbSgpICogc3BhcmsgLSBzcGFyayAvIDIsIGZpcmV3b3JrLnkgKyBzcGFyayAqIDQsIDQsIDQpXHJcblxyXG4gICAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC4wMDEgfHwgZmlyZXdvcmsueSA8IDIwMCkgZmlyZXdvcmsucGhhc2UgPSAnZXhwbG9kZSdcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGV4cGxvZGUpXHJcbiAgICAgIH0iXX0=
