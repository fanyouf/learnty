import {actor} from "./interface"
class Plane implements actor{
    dx:number;
    dy:number;
    x:number;
    y:number;
    obj:HTMLElement ;
    constructor(x: number=200,y:number=200) {
        this.dx = -1;
        this.dy = -1;
        this.x = x;
        this.y = y;
        this.obj = document.createElement("div");
        this.obj.style.width = "30px";
        this.obj.style.height = "30px";
        this.obj.style.borderRadius = "15px";
        this.obj.className="plane";

        this.move(x,y)
    }


    move(x:number=this.x,y:number=this.y){
        this.x = x + this.dx;
        this.y = y + this.dy;

        this.obj.style.left = this.x + "px";
        this.obj.style.top = this.y + "px";

        // console.log(this.x)
    }


}
    
export default Plane;
