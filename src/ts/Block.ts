import { BlOCK_T, POINT_T, Actor } from "./interface";
import { getBlockShape } from "./blockConfig";
import EventCenter from "./EventCenter";
class Block implements Actor {
  pointList: Array<POINT_T> = [];
  index = 0;
  unitBlockh: number = 10;
  unitBlockw: number = 10;
  x = 0;
  y = 0;
  block_shape_point_list = [];

  constructor({ unitBlockw, unitBlockh }) {
    this.unitBlockw = unitBlockw;
    this.unitBlockh = unitBlockh;

    let index = Math.floor(Math.random() * 5);

    let initx = 0;

    this.x = initx;
    this.block_shape_point_list = getBlockShape();
    this.index = index % this.block_shape_point_list.length;
    this.pointList = this.block_shape_point_list[this.index];
    EventCenter.addEventListener(
      "changeShape",
      this.handleChangeShape.bind(this)
    );
  }
  handleChangeShape({ index, block_shape_point_list }) {
    this.x = 0;
    this.y = 0;
    this.index = index;
    this.block_shape_point_list = block_shape_point_list;
    this.pointList = this.block_shape_point_list[this.index];
  }

  reset() {
    this.x = 3;
    this.y = 0;
  }
  getMatrix(dir: string = "") {
    return this.pointList.map(item => {
      let o = { x: 0, y: 0 };
      o.x = item.x + this.x;
      o.y = item.y + this.y;
      o.x = dir === "left" ? o.x - 1 : o.x;
      o.x = dir === "right" ? o.x + 1 : o.x;
      o.y = dir === "down" ? o.y + 1 : o.y;
      return o;
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "green";
    this.getMatrix().forEach(item => {
      ctx.fillRect(
        item.x * this.unitBlockw,
        item.y * this.unitBlockw,
        this.unitBlockw - 1,
        this.unitBlockw - 1
      );
    });
  }
}

export default Block;
