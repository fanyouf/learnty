
import Plane from "./plane"
import Game from "./game"

const plane = new Plane();
const game = new Game({plane,gameArea:document.getElementById("HTMLElement"),gameFrequency:25});
game.init([plane]);
game.start()
console.info(plane)
