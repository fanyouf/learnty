import Plane from "./plane";

interface actor {
    move:Function,
    obj:HTMLElement,
}
interface gameSetting{
    gameFrequency:number,
    gameArea:HTMLElement,
    plane:Plane
}
export { actor,gameSetting };