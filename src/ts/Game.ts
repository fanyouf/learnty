import Firework from "./Firework"
import {ACTOR} from "./interface"
let  Game = {
    
    actors:[],
    init({context,numberOfFirework = 5}){
        console.info(context)
        this.context = context;
        this.numberOfFirework = numberOfFirework;
        for(var i = 0; i< numberOfFirework; i++){
            let firework = new Firework({
                x : Math.floor(Math.random() * 100),
                y : 300
            })
            this.actors.push(firework)
        }
    },
    start(){
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  
        this.actors.forEach((actor:ACTOR) => {
            actor.run(this.context)
        });
        requestAnimationFrame(Game.start.bind(this))
    }
    
}

export default Game