import { PHASE, ACTOR } from "./interface";
import { R, G } from "./util";
import Spark from "./Spark";
class Firework implements ACTOR {
  phase: PHASE;
  x: number;
  y: number;
  dy: number;
  dx: number;
  curAge: number;
  maxAge: number;
  sparkPerNumber: number;
  sparks: Array<Spark>;

  constructor({ x, y }) {
    this.reset({ x, y });
  }

  reset({ x, y }) {
    this.x = x;
    this.y = y;
    this.curAge = 0;
    this.dy = 100 + R(20);
    this.dx = -5 + R(10);
    this.phase = PHASE.rise;
    this.sparkPerNumber = 10;
    this.sparks = [];

    for (let n = 0; n < this.sparkPerNumber; n++) {
      let dela = ((180 / this.sparkPerNumber) * n * Math.PI) / 180;
      let t = Math.random() * 50 + 30;
      let spark = new Spark({
        vx: t * Math.cos(dela),
        vy: t * Math.sin(dela), //Math.random() * 40 + 30,
        weight: Math.random() * 0.3 + 0.03,
        red: Math.floor(Math.random() * 2),
        green: Math.floor(Math.random() * 2),
        blue: Math.floor(Math.random() * 2)
      });

      if (Math.random() > 0.5) spark.vx = -spark.vx;

      if (Math.random() > 0.5) spark.vy = -spark.vy;

      this.sparks.push(spark);
    }
  }

  run(context) {
    if (this.curAge > 9 && Math.random() < 0.01) {
      this.reset({
        x: 200 + Math.floor(Math.random() * 400),
        y: 500 + Math.floor(Math.random() * 200)
      });
    } else {
      this.curAge += 1 / 25;

      this.phase = this.curAge > this.dy / G ? PHASE.expolde : PHASE.rise;

      this.sparks.forEach(element => {
        element.run(context, this);
      });
      //   console.info(this.curAge);
    }
  }
}

export default Firework;
