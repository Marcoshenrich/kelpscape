import Denizen from "./denizen"
import Fish from "./fish"
import Floater from "./floater"

export default class Fishegg extends Floater {

    constructor(id, pos, ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.id = "Fishegg" + id
        this.pos = [pos[0] + this.miniRandomizer(), pos[1] + this.miniRandomizer()]
        this.img = new Image()
        this.img.src = './dist/art/fishEggs.png'
        this.spawn()
        this.dims = Math.floor(Math.random() * 5) + 20
        this.height = this.dims
        this.width = this.dims
    }

    miniRandomizer() {
        //to prevent pos collisions in the quad tree - if more than bucket limit share exact same pos, it recurses and breaks
        return Math.floor(Math.random() * 10000) / 100000
    }

    spawn() {
        setTimeout(()=>{
            this.dead = true
            this.logic.fishCount += 1
            this.logic.fishes[this.logic.fishCount] = new Fish(this.logic.fishCount, this.ctx, this.canvas, this.view, this.logic, this.pos[0], this.pos[1], "spawn")
        },10000)
    }
}