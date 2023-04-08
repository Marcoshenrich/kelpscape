
import Denizen from "./denizen";

export default class Polyp extends Denizen {
    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic)
        this.type = "Polyp"
        this.id = this.type + id
        this.width = 5
        this.height = 4
        this.pos = [100, this.arenaHeight - this.height]
        this.img = new Image()
        this.img.src = './dist/art/polyp.png'

    }

    coreloop(){
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
    }

}