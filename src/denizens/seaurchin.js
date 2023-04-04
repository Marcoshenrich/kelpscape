import { rand } from "../engine/utils"
import Denizen from "./denizen"

export default class SeaUrchin extends Denizen {
    constructor(id, ctx, canvas, view, logic, parentPos) {
        super(ctx, canvas, view, logic)
        this.id = "SeaUrchin" + id
        this.img = new Image()
        this.img.src = './dist/art/sea_urchin.png'

        this.height = 10
        this.width = 20

        this.pos = [parentPos[0] + this.width + rand(5), parentPos[1] + this.height + 20]
    }

    coreloop() {
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)

        if (this.trapped) {
            this.pos[0] = this.trapped[0] - this.trappedPosDelta[0]
            this.pos[1] = this.trapped[1] - this.trappedPosDelta[1]
            return
        }

    }

}