import Block from "./Block";
import { BlOCK_T } from "./interface";
import BGBlocks from "./BackGroundBlock";
import NextBlock from "./NextBlock";
import EVENT_BUS from "./EventCenter";
import Score from "./Score";
const Game = (function() {
  let game = null;
  class _Game {
    frameIndex: number = 0;
    maxNumberX: number;
    maxNumberY: number;
    areaWidth: number;
    areaHeight: number;
    unitBlockw: number;

    unitBlockh: number;
    context: CanvasRenderingContext2D;
    curBlock: Block;
    nexBlock: NextBlock;
    score: Score;
    bgBlocks: BGBlocks;
    timerId: number;
    status: string = "normal";

    constructor({ context, maxNumberX, maxNumberY, areaWidth, areaHeight }) {
      if (!game) {
        game = this;
      }
      document.addEventListener("keyup", this.eventKeyUp.bind(this));

      game.context = context;
      game.maxNumberX = maxNumberX;
      game.maxNumberY = maxNumberY;
      game.areaWidth = areaWidth;
      game.areaHeight = areaHeight;
      game.unitBlockh = areaHeight / maxNumberY;
      game.unitBlockw = areaWidth / maxNumberX;
      game.nexBlock = new NextBlock({
        unitBlockw: game.unitBlockw,
        unitBlockh: game.unitBlockh
      });
      game.curBlock = new Block({
        unitBlockw: game.unitBlockw,
        unitBlockh: game.unitBlockh
      });
      game.bgBlocks = new BGBlocks({
        maxNumberX,
        maxNumberY,
        unitBlockw: game.unitBlockw,
        unitBlockh: game.unitBlockh
      });

      game.score = new Score();

      EVENT_BUS.addEventListener("gameover", game.gameover.bind(game));

      return game;
    }

    eventKeyUp(e) {
      if (e.keyCode === 38) {
        EVENT_BUS.fire("moveChange", this.curBlock);
        // _this.curBlock.moveChange(_this.bgBlocks);
      } else if (e.keyCode === 39) {
        EVENT_BUS.fire("moveRight", this.curBlock);
        //  _this.curBlock.moveRight(_this.bgBlocks);
      } else if (e.keyCode === 37) {
        EVENT_BUS.fire("moveLeft", this.curBlock);
        // _this.curBlock.moveLeft(_this.bgBlocks);
      } else if (e.keyCode === 13) {
        EVENT_BUS.fire("reStart");
      }
    }

    reStart() {
      if (this.status === "gameover") {
        this.status = "normal";
        // this.curBlock = new Block()
        // this.bgBlocks = new BGBlocks({ maxNumberX:this.maxNumberX,maxNumberY:this.maxNumberY})
        this.start();
      }
    }

    drawScore() {
      let cxt = this.context;
      cxt.strokeStyle = "#fff";
      cxt.font = "bold 30px consolas";
      cxt.fillText("分数:" + this.score.mark.toString(), 450, 100);
    }

    start() {
      this.frameIndex++;
      let cxt = this.context;
      cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);
      //   console.info(this.frameIndex);
      if (this.frameIndex % Math.ceil(1000 / 50) === 0) {
        this.bgBlocks.moveDown(this.curBlock);
      }
      this.curBlock.draw(this.context);
      this.nexBlock.draw(this.context);
      this.bgBlocks.draw(this.context);
      this.drawScore();
      if (this.status === "normal")
        this.timerId = requestAnimationFrame(this.start.bind(this));
      //   console.info(this.timerId)
    }

    gameover() {
      this.status = "gameover";
    }
  }

  return _Game;
})();

export default Game;
