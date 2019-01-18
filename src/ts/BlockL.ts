import { BLOCK_T, BlOCK_T, BLOCK_TYPE_T, POINT_T } from "./interface";
import BackGroundBlocks from "./BackGroundBlock";
const MATRIX_ARR = [
  [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
  [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 2 }],
  [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }]
];
class BlockL implements BlOCK_T {
  type = BLOCK_TYPE_T.L;
  matrix: Array<POINT_T> = [];
  index = 0;
  x = 0;
  y = 0;

  constructor(index = Math.floor(Math.random() * 5)) {
    this.index = index % 4;
    this.matrix = MATRIX_ARR[this.index];
    console.info("constructor....");
  }
  getMatrix(dir: string = "") {
    return this.matrix.map(item => {
      let o = { x: 0, y: 0 };
      o.x = item.x + this.x;
      o.y = item.y + this.y;
      o.x = dir === "left" ? o.x - 1 : o.x;
      o.x = dir === "right" ? o.x + 1 : o.x;
      return o;
    });
  }

  change() {
    this.index = (this.index + 1) % 4;
    this.matrix = MATRIX_ARR[this.index];

    return this.getMatrix();
  }

  canMoveLeft(bbBlocks: BackGroundBlocks) {
    // debugger;
    let minx = Math.min(...this.matrix.map(item => this.x + item.x));
    if (minx === 0) return false;

    let shadeMatrix = this.getMatrix("left");
    return !bbBlocks.isCrashMatrix(shadeMatrix);
  }
  moveLeft() {
    this.x = this.x - 1;
    return this.getMatrix();
  }

  moveRight() {
    this.x = this.x + 1;
    return this.getMatrix();
  }

  moveDown(maxY) {
    if (this.isGoBottom(maxY)) return false;

    this.y = this.y + 1;
    return true;
  }

  isGoBottom(maxY: number) {
    let yList = this.matrix.map(item => item.y);

    let curY = Math.max(...yList);
    console.info(this.y, curY, maxY);
    return this.y + curY >= maxY - 1;
  }
}

export default BlockL;
