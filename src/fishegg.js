import Denizen from "./denizen"
import Fish from "./fish"

export default class Fishegg extends Denizen {

    constructor(id, pos, ctx, canvas, view, posMatrix, logic) {
        super(ctx, canvas, view, posMatrix, logic)
        this.id = "Fishegg" + id
        this.pos = pos
        this.img = new Image()
        this.img.src = './dist/art/fishEggs.png'
        this.spawn()
        this.destroy = false
    }

    draw() {
        this.ctx.drawImage(this.img, this.pos[0], this.pos[1], 25, 25)
    }

    spawn() {
        setTimeout(()=>{
            this.destroy = true
            this.logic.fishCount += 1
            this.logic.fishes[this.logic.fishCount] = new Fish(this.logic.fishCount, this.ctx, this.canvas, this.view, this.posMatrix, this.logic, [this.pos[0], this.pos[1]])
        },1000)
    }
}