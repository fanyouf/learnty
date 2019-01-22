import Block from "./Block"
import EventCenter from "./EventCenter"
class BlockManage {
     static curBlock:Block = null;
     static nextBlock:Block = null;
     static getNext(){
        if(BlockManage.nextBlock){
            return BlockManage.nextBlock;
        }
        else{
            BlockManage.nextBlock = new Block();
            return BlockManage.nextBlock
        }
    }
    constructor(){
        EventCenter.addEventListener("addScore",BlockManage.update.bind(BlockManage))
    }
    static update(){
        BlockManage.curBlock = BlockManage.getNext();
        BlockManage.nextBlock = new Block()

    }

    static getCur(){
        if(BlockManage.nextBlock){
            return BlockManage.nextBlock;
        }
        else{
            BlockManage.nextBlock = new Block();
            return BlockManage.nextBlock
        }
    }
}

export  default BlockManage;