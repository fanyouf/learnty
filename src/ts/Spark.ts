import { ACTOR, PHASE } from "./interface";
import Firework from "./Firework";
import { R, G } from "./util";
class Spark implements ACTOR {
  x: number;
  y: number;
  vx: number;
  vy: number;
  weight: number;
  red: number;
  green: number;
  blue: number;
  curAge: number;

  constructor({ vx, vy, weight, red, green, blue }) {
    this.vx = vx;
    this.vy = vy;
    this.weight = weight;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.curAge = 0;
  }
  [PHASE.rise](context, firework: Firework) {
    let i = 15;
    context.beginPath();

    //     this.y =
    this.x = firework.x + firework.curAge * firework.dx;
    this.y =
      firework.y -
      firework.dy * firework.curAge +
      0.5 * G * firework.curAge * firework.curAge;

    context.fillStyle = "rgba(" + 255 + "," + i * 17 + ",255,1)";

    context.rect(this.x, this.y + Math.random() * i - i / 2, 4, 4);

    context.fill();
    // console.info(firework.x, firework.y);

    this.curAge = firework.curAge;
  }
  [PHASE.expolde](context, firework: Firework) {
    let t = firework.curAge - this.curAge;
    let dxx = Math.max(0.5, 1 - t / 10);
    console.info(dxx);
    let x = this.x + this.vx * t * dxx;

    let y = this.y - this.vy * t + (1 / 2) * G * t * t;

    let fade = 1 * 20 - firework.curAge * 2;

    let r = Math.max(0, Math.floor(255 - t * 10));

    let g = R(255);

    let b = R(255);
    let de = 1 - t / 10;

    context.beginPath();

    context.fillStyle = `rgba(${r},${g},${b},${de})`;

    context.rect(x, y, 4, 4);

    context.fill();
    // console.info("explode");
    // console.info(x, y);
  }
  run(context, firework) {
    this[firework.phase](context, firework);
  }
}

export default Spark;
