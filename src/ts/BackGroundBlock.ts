import { Actor, POINT_T } from "./interface";
import Block from "./Block";
import EVENT_CENTER from "./EventCenter";
class BGBlocks implements Actor {
  matrix = [];
  maxNumberX: number = 0;
  maxNumberY: number = 0;
  unitBlockw: number = 10;
  unitBlockh: number = 10;
  constructor({ maxNumberX, maxNumberY, unitBlockw, unitBlockh }) {
    this.maxNumberX = maxNumberX;
    this.maxNumberY = maxNumberY;
    this.unitBlockw = unitBlockw;
    this.unitBlockh = unitBlockh;
    for (let i = 0; i < maxNumberY; i++) {
      let arr = new Array(maxNumberX).fill(0);
      this.matrix.push(arr);
    }

    EVENT_CENTER.addEventListener("moveRight", this.moveRight.bind(this));
    EVENT_CENTER.addEventListener("moveLeft", this.moveLeft.bind(this));
    EVENT_CENTER.addEventListener("moveChange", this.moveChange.bind(this));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "green";
    this.matrix.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val) {
          ctx.fillRect(
            x * this.unitBlockh,
            y * this.unitBlockh,
            this.unitBlockh - 1,
            this.unitBlockh - 1
          );
        } else {
          ctx.strokeStyle = "green";
          ctx.strokeRect(
            x * this.unitBlockh,
            y * this.unitBlockh,
            this.unitBlockh,
            this.unitBlockh
          );
        }
      });
    });
  }

  canMoveLeft(block: Block) {
    let minx = Math.min(...block.pointList.map(item => block.x + item.x));
    if (minx === 0) return false;

    let shadeMatrix = block.getMatrix("left");
    return !this.isCrashMatrix(shadeMatrix);
  }
  canMoveRight(block: Block) {
    let stageMaxX = this.matrix[0].length;
    let maxX = Math.max(...block.pointList.map(item => block.x + item.x));
    if (maxX === stageMaxX - 1) return false;

    let shadeMatrix = block.getMatrix("right");
    return !this.isCrashMatrix(shadeMatrix);
  }

  canMoveDown(block: Block) {
    let stageMaxY = this.matrix.length;
    let maxY = Math.max(...block.pointList.map(item => block.y + item.y));
    if (maxY === stageMaxY - 1) return false;

    let shadeMatrix = block.getMatrix("down");
    return !this.isCrashMatrix(shadeMatrix);
  }

  moveLeft(block: Block) {
    if (this.canMoveLeft(block)) {
      block.x = block.x - 1;
      return true;
    }
    return false;
  }

  moveRight(block: Block) {
    if (this.canMoveRight(block)) {
      block.x = block.x + 1;
      return true;
    }
    return false;
  }

  moveDown(block: Block) {
    if (this.canMoveDown(block)) {
      block.y = block.y + 1;
    } else {
      console.info("merge,and fire Event_merge...");
      this.merge(block);
      EVENT_CENTER.fire("event_merge");
      if (this.isGameover()) {
        console.info();
      }
    }
  }
  moveChange(block: Block) {
    block.index = (block.index + 1) % block.block_shape_point_list.length;
    block.pointList = block.block_shape_point_list[block.index];
    return true;
  }

  canMoveChange() {
    return true;
  }

  isGameover() {
    let rs = this.matrix[0].find(item => item > 0);
    if (rs) {
      EVENT_CENTER.fire("gameover");
    }
    return true;
  }

  isCrash(block: Block) {
    try {
      return !!block.pointList.find(
        item => this.matrix[block.y + item.y + 1][block.x + item.x]
      );
    } catch (e) {
      return true;
    }
  }

  isCrashMatrix(matrix: Array<POINT_T>) {
    try {
      return !!matrix.find(item => this.matrix[item.y][item.x]);
    } catch (e) {
      return true;
    }
  }

  merge(block: Block) {
    block.pointList.forEach(item => {
      this.matrix[block.y + item.y][block.x + item.x] = 1;
    });

    this.clearSomeRow();
  }

  clearSomeRow() {
    let arr = this.matrix.map(row =>
      row.reduce((init, current) => init + current, 0)
    );

    let rowIndexs = [];
    arr.forEach((sumVal, index) => {
      if (sumVal === this.maxNumberX) {
        rowIndexs.push(index);
      }
    });
    if (rowIndexs.length === 0) return false;

    if (rowIndexs.length === 1) {
      EVENT_CENTER.fire("addScore", 100);
    } else if (rowIndexs.length === 2) {
      EVENT_CENTER.fire("addScore", 250);
    } else if (rowIndexs.length === 3) {
      EVENT_CENTER.fire("addScore", 400);
    }

    rowIndexs.forEach(valIndex => {
      this.matrix.splice(valIndex, 1);
      this.matrix.unshift(new Array(this.maxNumberX).fill(0));
    });

    EVENT_CENTER.fire("getScore");
    return true;
  }
}

export default BGBlocks;
