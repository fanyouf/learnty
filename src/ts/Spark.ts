
import {ACTOR,PHASE} from "./interface"
import Firework from "./Firework"
import {R,G} from "./util"
class Spark implements ACTOR {
    x:number
    y:number
    vx: number
    vy: number
    weight:number
    red:number
    green:number
    blue:number
   

    constructor({vx,vy,weight,red,green,blue}){
        this.vx = vx;
        this.vy = vy;
        this.weight = weight;
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
    [PHASE.rise](context,firework:Firework){
        let i = 8;
        context.beginPath()

        //     this.y = 
        this.x = firework.x
        this.y = 500 -  firework.dy * firework.curAge + 0.5 * G * firework.curAge * firework.curAge;

        context.fillStyle = 'rgba(' + 255 + ',' + i * 17 + ',255,1)'

        context.rect(this.x + Math.random() * i - i / 2, this.y , 4, 4)

        context.fill();
        console.info(firework.x,firework.y)
    }
    [PHASE.expolde](context,firework:Firework){
        let trailAge = 100

        let x = this.x + this.vx * trailAge

        let y = this.y + this.vy * trailAge + this.weight * trailAge

        let fade = 1 * 20 - firework.curAge * 2

        let r = Math.floor(this.red * fade)

        let g = Math.floor(this.green * fade)

        let b = Math.floor(this.blue * fade)

        context.beginPath()

        context.fillStyle = 'rgba(255,255,255,1)'

        context.rect(x, y, 4, 4)

        context.fill()
        console.info("explode")
        console.info( x, y)
    }
    run(context,firework){
        this[firework.phase](context,firework)
       
    }
}

export default Spark

