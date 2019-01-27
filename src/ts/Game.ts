import Block from "./Block";
import { BlOCK_T, EVENTTYPE } from "./interface";
import BGBlocks from "./BackGroundBlock";
import NextBlock from "./NextBlock";
import EVENT_BUS from "./EventCenter";
import Score from "./Score";
import Display from "./Display";
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
    display: Display;
    timerId: number;
    status: string = "normal";
    speed: number = 50;

    constructor({ context, maxNumberX, maxNumberY, areaWidth, areaHeight }) {
      if (!game) {
        game = this;
      }
      document.addEventListener("keyup", this.eventKeyUp.bind(this));
      document.addEventListener("keydown", this.eventKeyDown.bind(this));

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
      game.speed = 50;

      game.score = new Score();
      game.display = new Display();

      //   EVENT_BUS.addEventListener("gameover", game.gameover.bind(game));
      EVENT_BUS.addEventListener(
        EVENTTYPE.moveQuick,
        game.moveQuick.bind(game)
      );
      EVENT_BUS.addEventListener(
        EVENTTYPE.moveNormal,
        game.moveNormal.bind(game)
      );
      EVENT_BUS.addEventListener(
        EVENTTYPE.changeStatus,
        game.changeStatus.bind(game)
      );
      //   EVENT_BUS.addEventListener("pause", game.pause.bind(game));

      return game;
    }

    eventKeyUp(e) {
      if (e.keyCode === 38) {
        EVENT_BUS.fire(EVENTTYPE.moveChange, this.curBlock);
        // _this.curBlock.moveChange(_this.bgBlocks);
      } else if (e.keyCode === 39) {
        EVENT_BUS.fire(EVENTTYPE.moveRight, this.curBlock);
        //  _this.curBlock.moveRight(_this.bgBlocks);
      } else if (e.keyCode === 37) {
        EVENT_BUS.fire(EVENTTYPE.moveLeft, this.curBlock);
        // _this.curBlock.moveLeft(_this.bgBlocks);
      } else if (e.keyCode === 13) {
        if (this.status === "gameover") {
          EVENT_BUS.fire(EVENTTYPE.changeStatus, "reStart");
        } else if (this.status === "pause") {
          EVENT_BUS.fire(EVENTTYPE.changeStatus, "reStart");
        } else if (this.status === "normal") {
          EVENT_BUS.fire(EVENTTYPE.changeStatus, "pause");
        }
      } else if (e.keyCode === 40) {
        EVENT_BUS.fire(EVENTTYPE.moveNormal);
      }
    }

    eventKeyDown(e) {
      if (e.keyCode === 40) {
        EVENT_BUS.fire(EVENTTYPE.moveQuick, this.curBlock);
        // _this.curBlock.moveChange(_this.bgBlocks);
      }
    }

    start() {
      this.frameIndex++;
      let cxt = this.context;
      cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);
      //   console.info(this.frameIndex);
      if (this.frameIndex % Math.ceil(1000 / this.speed) === 0) {
        this.bgBlocks.moveDown(this.curBlock);
      }
      this.curBlock.draw(this.context);
      this.nexBlock.draw(this.context);
      this.bgBlocks.draw(this.context);
      this.score.draw(this.context);
      this.display.draw(this.context);
      if (this.status === "normal")
        this.timerId = requestAnimationFrame(this.start.bind(this));
      //   console.info(this.timerId)
    }

    moveQuick() {
      this.speed += 50;
      console.info(this.speed);
    }
    moveNormal() {
      this.speed = 50;
    }
    changeStatus(status) {
      if (status === "reStart") {
        if (["gameover", "pause"].includes(this.status)) {
          this.status = "normal";
          this.start();
        }
      } else if (status === "pause") {
        this.status = "pause";
        if (this.timerId) {
          cancelAnimationFrame(this.timerId);
        }
      } else if (status === "gameove") {
        this.status = "gameover";
        console.info(this.status);
      }
    }
  }

  return _Game;
})();

export default Game;
