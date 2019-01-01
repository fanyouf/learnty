import {actor,gameSetting} from "./interface"
import Plane from "./plane";

enum GAME_STATUS {
    RUNNING,
    PAUSE,
    OVER,
    RESTART
}
class Game {

    timerId:any;
    actors:Array<actor> = [];
    gameFrequency:number;
    gameArea:HTMLElement;
    plane:Plane;
    status:GAME_STATUS;
    constructor(setting:gameSetting){
        this.plane = setting.plane;
        this.gameFrequency = setting.gameFrequency;
        this.gameArea = setting.gameArea

        this.status = GAME_STATUS.RUNNING
    }
    pause(){
        if(this.status === GAME_STATUS.RUNNING){
            if(this.timerId){
                clearInterval(this.timerId)
                this.status = GAME_STATUS.PAUSE
                this.timerId = null;
            }
        }
        else if(this.status === GAME_STATUS.PAUSE){
            this.start()
            this.status = GAME_STATUS.RUNNING
        }
    }
    init(actors:Array<actor>){
        let that = this
        this.actors = [...this.actors, ...actors];
        const gameArea = document.getElementById("gameArea");

        this.actors.forEach(item=>{

            gameArea.appendChild(item.obj)
        })

        document.body.addEventListener("keydown",function(e){
            console.info(e.keyCode)
            e.stopPropagation();
            e.preventDefault();
            if(e.keyCode === 38){
                that.up()
                
            }
            else if(e.keyCode === 39){
                that.right()
                
            }
            else if(e.keyCode === 40){
                that.down()
                
            }
            else if(e.keyCode === 37){
                that.left()
                
            }
            else if(e.keyCode === 13){
                that.pause()
            }
            
        })

    }
    down(){
        this.plane.dy = 1
    }
    up(){
        this.plane.dy = -1
    }
    left(){
        this.plane.dx = -1;
    }
    right(){
        this.plane.dx = 1;
    }
    start(){
        if(this.timerId){
            clearInterval(this.timerId)
        }

        this.timerId = setInterval(()=>{
            this.actors.forEach(item=>{
                item.move();
            })
        },this.gameFrequency)
    }
}

export default Game;