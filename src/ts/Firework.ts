
import {PHASE,ACTOR} from "./interface";
import {R,G} from "./util"
import Spark from "./Block"
class Firework implements ACTOR {
    phase:PHASE
    x:number
    y:number
    dy:number
    curAge:number
    maxAge:number
    sparkPerNumber:number
    sparks:Array<Spark>

    constructor({x,y}){
        this.x = x;
        this.y = y;
        this.curAge = 0;
        this.dy =50+ R(20);
        this.phase = PHASE.rise;
        this.sparkPerNumber = 6
        this.sparks = []


        for (let n = 0; n < this.sparkPerNumber; n++) {
          let spark = new Spark( {
            vx: Math.random() * 5 + 0.5,
            vy: Math.random() * 5 + 0.5,
            weight: Math.random() * 0.3 + 0.03,
            red: Math.floor(Math.random() * 2),
            green: Math.floor(Math.random() * 2),
            blue: Math.floor(Math.random() * 2)
          })

          if (Math.random() > 0.5) spark.vx = -spark.vx

          if (Math.random() > 0.5) spark.vy = -spark.vy

          this.sparks.push(spark)
        }
    }

    run(context){
        this.curAge+= 1 / 25;

        
        this.phase = this.curAge > this.dy/G ?  PHASE.expolde : PHASE.rise;
        // if(this.phase === PHASE.rise){

        //     this.y = 500 -  this.dy * this.curAge + 0.5 * G * this.curAge * this.curAge;
        // }
        this.sparks.forEach(element => {
            element.run(context,this)
        });
    }

    
}

export default  Firework;