import EVENT_BUS from "./EventCenter";
import { Actor, EVENTTYPE } from "./interface";
class Score implements Actor {
  mark: number = 0;
  constructor(mark: number = 0) {
    this.mark = mark;

    EVENT_BUS.addEventListener(EVENTTYPE.addScore, this.addScore.bind(this));
  }

  addScore(point: number) {
    this.mark += point;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#fff";
    ctx.font = "bold 30px consolas";
    ctx.fillText("分数:" + this.mark.toString(), 450, 100);
  }
}

export default Score;
