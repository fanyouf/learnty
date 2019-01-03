class math{
    static getRandom(n:number=100){
        let rs = Math.ceil(Math.random() * n)
        return rs;
    }
}

export {math}