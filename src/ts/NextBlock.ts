import EVENT_BUS from "./EventCenter";
import {Actor,POINT_T} from "./interface"
import {getBlockShape} from "./blockConfig"
class NextBlock implements Actor{
    pointList: Array<POINT_T> = [];
    block_shape_point_list = []
    index:number = 0;
    unitBlockw:number;
    unitBlockh:number;
    constructor({unitBlockw,unitBlockh}){
        this.unitBlockw = unitBlockw;
        this.unitBlockh = unitBlockh;
        let  index = Math.floor(Math.random() * 100)

        this.block_shape_point_list = getBlockShape()
        this.index = index % this.block_shape_point_list.length;
        this.pointList = this.block_shape_point_list[this.index];

        EVENT_BUS.addEventListener("merge",this.change.bind(this))
    }


    draw(ctx:CanvasRenderingContext2D){

     let dx = 400;
      let dy = 40;
      ctx.fillStyle = "green";
      this.pointList.forEach(point=>{
        let {x,y} = point;
        ctx.fillRect(dx+x * this.unitBlockw/2,dy+ y * this.unitBlockh/2, (this.unitBlockw-1)/2, (this.unitBlockh-1)/2);

      })

    }
    change(){
        EVENT_BUS.fire("changeShape",{index:this.index,pointList:JSON.parse(JSON.stringify(this.pointList))})

        let  index = Math.floor(Math.random() * 100)
        this.index = index % this.block_shape_point_list.length;
        this.pointList = this.block_shape_point_list[this.index];
    }
}

export default NextBlock;