interface BlOCK_T {
    moveLeft:()=>Array<POINT_T>
    moveRight:()=>Array<POINT_T>
    change:()=>Array<POINT_T>
    matrix:Array<POINT_T>
    type:BLOCK_TYPE_T
    
}
interface POINT_T {
    x:number
    y:number
}

enum BLOCK_TYPE_T{
    L="L",
    N="N",
    Z="Z",
    O="O"
}

export { BlOCK_T,BLOCK_TYPE_T,POINT_T}