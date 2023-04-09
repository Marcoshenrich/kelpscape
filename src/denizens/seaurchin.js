import { rand } from "../engine/utils"
import Denizen from "./denizen"

export default class SeaUrchin extends Denizen {
    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic)
        this.textBox = this.logic.textContentObj["Sea Urchin"]
        this.type = "SeaUrchin"
        this.id = this.type + id
        this.img = new Image()
        this.img.src = './dist/art/sea_urchin.png'
        
        this.height = 10
        this.width = 20
        this.seaweed = options.parent
        this.pos = [options.pos[0] + 8, options.pos[1] + this.height + 20]
    }

    coreloop() {
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
        if (this.seaweed.dead) this.logic.recentlyDeadDenizens.push(this)
        if (this.trapped) {
            this.pos[0] = this.trapped[0] - this.trappedPosDelta[0]
            this.pos[1] = this.trapped[1] - this.trappedPosDelta[1]
            return
        }
        this.dieWhenSeaweedDies() 

    }

    dieWhenSeaweedDies() {
        if (this.seaweed.dead) {
            this.dead = true
            this.logic.recentlyDeadDenizens.push(this)
        }
    }

}