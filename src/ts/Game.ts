import BlockL from "./BlockL";
import { BlOCK_T } from "./interface";
import BGBlocks from "./BackGroundBlock";
const Game = (function() {
  let game = null;
  class _Game {
    frameIndex: number = 0;
    maxX: number;
    maxY: number;
    context: null;
    curBlock: BlOCK_T;
    bgBlocks: BGBlocks;

    constructor({ context, maxX, maxY }) {
      if (!game) {
        game = this;
      }
      game.addEventListener();
      //   console.info(context);
      game.context = context;
      game.maxX = maxX;
      game.maxY = maxY;

      game.curBlock = new BlockL();
      game.bgBlocks = new BGBlocks({ maxX, maxY });

      return game;
    }

    eventKeyUp(e) {
      let _this = this;
      console.info(e);
      if (e.keyCode === 38) {
        _this.curBlock.change();
      } else if (e.keyCode === 39) {
        _this.curBlock.moveRight();
      } else if (e.keyCode === 37) {
        if (_this.curBlock.canMoveLeft(_this.bgBlocks)) {
          _this.curBlock.moveLeft();
        }
      }
    }
    addEventListener() {
      document.addEventListener("keyup", this.eventKeyUp.bind(this));
    }
    drawCurBlock() {
      let ctx = this.context;
      ctx.fillStyle = "green";
      this.curBlock.getMatrix().forEach(item => {
        ctx.fillRect(item.x * 10, item.y * 10, 9, 9);
      });
    }
    drawBGBlocks() {
      let ctx = this.context;
      ctx.fillStyle = "green";
      this.bgBlocks.matrix.forEach((row, y) => {
        row.forEach((val, x) => {
          val && ctx.fillRect(x * 10, y * 10, 9, 9);
        });
      });
    }
    start() {
      this.frameIndex++;
      this.context.clearRect(
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height
      );
      //   console.info(this.frameIndex);
      if (this.frameIndex % Math.ceil(1000 / 50) === 0) {
        if (this.bgBlocks.isCrash(this.curBlock)) {
          this.bgBlocks.merge(this.curBlock);
          this.curBlock = new BlockL();
        } else {
          if (this.curBlock.moveDown(this.maxY)) {
          } else {
            this.bgBlocks.merge(this.curBlock);
            this.curBlock = new BlockL();
          }
        }
      }
      this.drawCurBlock();
      this.drawBGBlocks();
      requestAnimationFrame(this.start.bind(this));
    }
  }

  return _Game;
})();

export default Game;
