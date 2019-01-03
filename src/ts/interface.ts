enum OPSYSMBOL {
    ADD ="+",
    SUB="-",
    MUL="*",
    DIV="/"
}
interface Subject{
    op1:number,
    op2:number,
    op:OPSYSMBOL,
    ans:number
}

export {OPSYSMBOL, Subject}