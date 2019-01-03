
import  {OPSYSMBOL, Subject} from "./interface"

class SubjectItem implements Subject{
    op1:number;
    op2:number;
    op:OPSYSMBOL;
    ans:number;
    curAns:number;
    isRight:boolean=false;
    constructor(op1,op2,op){
        this.op1 = op1;
        this.op2 = op2;
        this.op = op;

        this.buildAns();
    }

    buildAns(){
        switch(this.op){
            case OPSYSMBOL.ADD :
                this.ans = this.op1 + this.op2
                break;
            case OPSYSMBOL.DIV :
                this.ans = this.op1 / this.op2
                break
            case OPSYSMBOL.MUL :
                this.ans = this.op1 * this.op2
                break
            case OPSYSMBOL.SUB :
                this.ans = this.op1 - this.op2
                break
        }
    }

    setAns(yourAns:number){
        this.curAns = yourAns;
        this.isRight = this.curAns  === this.ans;
    }
}

export default  SubjectItem;