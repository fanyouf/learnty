interface ACTOR {
    run:(context,firework?)=>void
}

enum PHASE{
    expolde="expolde",
    rise="rise"
}

export { ACTOR,PHASE}