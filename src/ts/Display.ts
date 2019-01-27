import { Actor, EVENTTYPE } from "./interface";
import EventCenter from "./EventCenter";

export default class Display implements Actor {
  msgList: Array<string> = [];
  constructor() {
    this.msgList = ["kaishi"];
    EventCenter.addEventListener(EVENTTYPE.addScore, this.addScore.bind(this));
    EventCenter.addEventListener(
      EVENTTYPE.moveQuick,
      this.moveQuick.bind(this)
    );
  }

  addScore(score) {
    this.msgList.unshift("得分" + score);
  }
  moveQuick(score) {
    this.msgList.unshift("加速...");
  }

  draw(ctx: CanvasRenderingContext2D) {
    let dx = 400;
    let dy = 40;
    ctx.fillStyle = "green";
    this.msgList.forEach((msg, index) => {
      ctx.strokeStyle = "#fff";
      ctx.font = "14px consolas";
      ctx.fillText(msg, 450, 200 + index * 14);
    });
  }
}
