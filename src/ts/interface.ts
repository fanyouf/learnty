interface BlOCK_T {
  moveLeft: () => Array<POINT_T>;
  canMoveLeft: (any) => Boolean;
  moveRight: () => Array<POINT_T>;
  moveDown: (Number) => Boolean;
  change: () => Array<POINT_T>;
  isGoBottom: (Number) => Boolean;
  x: number;
  y: number;
  matrix: Array<POINT_T>;
  type: BLOCK_TYPE_T;
  getMatrix: (dir?: String) => Array<POINT_T>;
}

interface POINT_T {
  x: number;
  y: number;
}

enum BLOCK_TYPE_T {
  L = "L",
  N = "N",
  Z = "Z",
  O = "O"
}

export { BlOCK_T, BLOCK_TYPE_T, POINT_T };
