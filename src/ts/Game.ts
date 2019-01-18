import BlockL from "./BlockL"
let  Game = {
    
    init({context,numberOfFirework = 5}){
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
        console.info("asdfsd")
        this.drawCurBlock()
        requestAnimationFrame(Game.start.bind(this))
    }
    
}

export default Game