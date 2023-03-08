import Denizen from "./denizen"

export default class DeadCreature extends Denizen {
    constructor(ctx, canvas, view, logic, pos, type) {
        super(ctx, canvas, view, logic)
        this.pos = [pos[0], pos[1]]
        this.driftSpeed = .2
        this.img;
        this.type = type
        this.imgSelector()
    }

    driftDown() {
        this.pos[1] -= this.driftSpeed
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
    }

    imgSelector() {
        // selects image based on type of creature
    }


}