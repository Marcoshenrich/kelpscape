
import Floater from "../floater"
import { rand, miniRandomizer } from "../../engine/utils"
import FishBaby from "./fishbaby"

export default class Fishegg extends Floater {

    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic)
        this.textBox = this.logic.textContentObj["Fish Egg"]
        this.id = "Fishegg" + id
        this.pos = [options.pos[0] + miniRandomizer(), options.pos[1] + miniRandomizer()]
        this.parent = options.parent
        this.img = new Image()
        this.img.src = './dist/art/fishEggs.png'
        this.spawn()
        this.dims = Math.floor(Math.random() * 5) + 10
        this.height = this.dims
        this.width = this.dims

        this.energyVal = 2
    }


    spawn() {
        let timerId = setTimeout(()=>{
            this.dead = true
            this.logic.recentlyDeadDenizens.push(this)
            if (this.trapped) return
            this.logic.spawnDenizen(this)
        },rand(15000,25000))

        this.clearOnDeath.push(timerId)
    }
}