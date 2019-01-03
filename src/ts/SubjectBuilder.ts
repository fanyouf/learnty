import subject from './subject'
import  {OPSYSMBOL} from "./interface"

import {math} from './utils'
class BuildSubject {
    list:Array<subject>=[];
    currentIndex:number = 0;

    constructor(op:OPSYSMBOL,amount:number){
        for(let i = 0; i< amount; i++){
            this.list.push(new subject(math.getRandom(),math.getRandom(),op))
        }
    }

    getSubject(){
        return this.list[this.currentIndex++];
    }

}

export default BuildSubject

