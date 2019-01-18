
import {BLOCK_TYPE_T,BlOCK_T} from "./interface"

import {R,G} from "./util"
const BLOCK_TYPE_T_L = [
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0]
]
const BLOCK_TYPE_T_O = [
    [0,0,0,0,0],
    [0,1,1,0,0],
    [0,1,1,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
]

const BLOCK_TYPE_T_N = [
    [0,0,1],
    [0,1,1],
    [0,1,0]
]


const BLOCK_TYPE_T_Z = [
    [1,0,0],
    [1,1,0],
    [0,1,0]
]

class BlOCK implements BlOCK {
    x:number
    y:number
   

    constructor(t:BLOCK_TYPE_T){
        
    }
    
    run(context,firework){
        this[firework.phase](context,firework)
       
    }
}

export default Spark

