import EVENT_BUS from "./EventCenter";
import {Actor} from "./interface"
class Score implements Actor{
    mark:number = 0;
    constructor(mark:number = 0){
        this.mark = mark;

        EVENT_BUS.addEventListener("addScore",this.addScore.bind(this))
    }

    addScore(point:number){
        this.mark += point
    }
    draw(ctx:CanvasRenderingContext2D){
    
    }
}

export default Score;