import {BLOCK_T, BlOCK_T, BLOCK_TYPE_T,POINT_T} from "./interface"

const MATRIX_ARR = [
    [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:2}],
    [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:2,y:2}],
    [{x:2,y:0},{x:2,y:1},{x:2,y:2},{x:1,y:2}],
    [{x:0,y:1},{x:0,y:2},{x:2,y:1},{x:2,y:2}],

]
class BlockL implements BlOCK_T {
    type = BLOCK_TYPE_T.L
    matrix:Array<POINT_T> = []
    index = 0;
    x = 0;
    y = 0;

    constructor(index = Math.floor( Math.random() * 5)){
        this.index = index  % 4
        this.matrix = MATRIX_ARR[this.index];
    }
    getMatrix(){
        return this.matrix.map(item=>{
            
            let o = {x:0,y:0}
            o.x = item.x + this.x;
            o.y = item.y + this.y;

            return o;
        })
    }

    change(){
        this.index = (this.index + 1)%4
        this.matrix = MATRIX_ARR[this.index]

        return this.getMatrix()
    }
    moveLeft(){
        this.x = this.x - 1;
        return this.getMatrix()
    }
   
    moveRight (){
        this.x = this.x + 1;
        return this.getMatrix()
    }

}

export default BlockL