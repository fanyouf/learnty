interface BlOCK_T {
    canMoveLeft: (BGBlocks_T) => Boolean;
    canMoveRight: (BGBlocks_T) => Boolean;
    canMoveDown: (BGBlocks_T) => Boolean;
    canMoveChange: (BGBlocks_T) => Boolean;
    
    moveLeft: (BGBlocks_T) => boolean;
    moveRight: (BGBlocks_T) => boolean;
    moveDown: (BGBlocks_T) => boolean;
    moveChange: (BGBlocks_T) => boolean;

    x: number;
    y: number;
    pointList: Array<POINT_T>;

    getMatrix: (dir?: String) => Array<POINT_T>;
}

interface BGBlocks_T{

}

interface Actor {
  draw :(CanvasRenderingContext2D) =>void
}


interface POINT_T {
  x: number;
  y: number;
}



export { BlOCK_T, POINT_T,Actor};
