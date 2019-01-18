import { BlOCK_T, POINT_T } from "./interface";
class BGBlocks {
  matrix = [];
  constructor({ maxX, maxY }) {
    for (let i = 0; i < maxY; i++) {
      let arr = new Array(maxX).fill(0);
      this.matrix.push(arr);
    }
  }

  isCrash(block: BlOCK_T) {
    try {
      return !!block.matrix.find(
        item => this.matrix[block.y + item.y + 1][block.x + item.x]
      );
    } catch (e) {
      return true;
    }
    return true;
  }

  isCrashMatrix(matrix: Array<POINT_T>) {
    try {
      return !!matrix.find(item => this.matrix[item.y][item.x]);
    } catch (e) {
      return true;
    }
  }

  merge(block: BlOCK_T) {
    block.matrix.forEach(item => {
      this.matrix[block.y + item.y][block.x + item.x] = 1;
    });
  }
}

export default BGBlocks;
