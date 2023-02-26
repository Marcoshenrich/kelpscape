import Denizen from "./denizen"
import Fish from "./fish"
import Floater from "./floater"

export default class Fishegg extends Floater {

    constructor(id, pos, ctx, canvas, view, posMatrix, logic) {
        super(ctx, canvas, view, posMatrix, logic)
        this.id = "Fishegg" + id
        this.pos = pos
        this.img = new Image()
        this.img.src = './dist/art/fishEggs.png'
        this.spawn()
        this.destroy = false
        this.dims = Math.floor(Math.random() * 5) + 20
        this.height = this.dims
        this.width = this.dims
    }

    spawn() {
        setTimeout(()=>{
            this.destroy = true
            this.logic.fishCount += 1
            this.logic.fishes[this.logic.fishCount] = new Fish(this.logic.fishCount, this.ctx, this.canvas, this.view, this.posMatrix, this.logic, [this.pos[0], this.pos[1]], "spawn")
        },10000)
    }
}