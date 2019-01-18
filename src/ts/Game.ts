import BlockL from "./BlockL"
let  Game = {
    eventKeyUp(e){
        console.info(e)
        if(e.keyCode === 38){
            this.changeCurBlock()
        }
    },
    addEventListener(){
        document.addEventListener("keyup",Game.eventKeyUp)
    },
    init({context,numberOfFirework = 5}){

        this.addEventListener()
        console.info(context)
        this.context = context;
       
        this.curBlock = new BlockL()
        
    },
    drawCurBlock(){
        let ctx = this.context;
        ctx.fillStyle = "green";
        this.curBlock.getMatrix().forEach(item=>{
            ctx.fillRect(item.x*10, item.y*10, 9, 9);
        })
    },
    start(){
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        // console.info("asdfsd")
        this.drawCurBlock()
        requestAnimationFrame(Game.start.bind(this))
    }
    
}

export default Game