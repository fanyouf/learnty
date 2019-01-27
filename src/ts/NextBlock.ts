import EVENT_BUS from "./EventCenter";
import { Actor, POINT_T, EVENTTYPE } from "./interface";
import { getBlockShape } from "./blockConfig";
class NextBlock implements Actor {
  pointList: Array<POINT_T> = [];
  block_shape_point_list = [];
  index: number = 0;
  unitBlockw: number;
  unitBlockh: number;
  constructor({ unitBlockw, unitBlockh }) {
    this.unitBlockw = unitBlockw;
    this.unitBlockh = unitBlockh;
    this.block_shape_point_list = getBlockShape();

    let index = Math.floor(Math.random() * 100);
    this.index = index % this.block_shape_point_list.length;
    this.pointList = this.block_shape_point_list[this.index];

    EVENT_BUS.addEventListener(EVENTTYPE.merge, this.change.bind(this));
  }

  draw(ctx: CanvasRenderingContext2D) {
    let dx = 400;
    let dy = 40;
    ctx.fillStyle = "green";
    this.pointList.forEach(point => {
      let { x, y } = point;
      ctx.fillRect(
        dx + (x * this.unitBlockw) / 2,
        dy + (y * this.unitBlockh) / 2,
        (this.unitBlockw - 1) / 2,
        (this.unitBlockh - 1) / 2
      );
    });
  }
  change() {
    console.info("nextBlock.... change()....");

    let payload = {
      index: this.index,
      block_shape_point_list: JSON.parse(
        JSON.stringify(this.block_shape_point_list)
      )
    };
    console.info("fire...changeShape....", payload);
    EVENT_BUS.fire(EVENTTYPE.changeShape, payload);

    this.block_shape_point_list = getBlockShape();

    let index = Math.floor(Math.random() * 100);
    this.index = index % this.block_shape_point_list.length;
    this.pointList = this.block_shape_point_list[this.index];
    console.info("nextBlock...", this.index, this.pointList);
  }
}

export default NextBlock;
