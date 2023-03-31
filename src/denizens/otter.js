
import { rand } from "../engine/utils";
import Denizen from "./denizen";


export default class Otter extends Denizen{
    constructor(id, ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.id = "Otter" + id
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.logic = logic
        this.img = new Image()
        this.img.src = './dist/art/otter/otterDiveDownLeft.png'
        this.height = 60
        this.width = 45
        this.pos = [rand(this.arenaWidth - this.width),0-this.height]
    }

    coreloop() {
        this.ctx.save()
        this.ctx.rotate(this.pos[1] * Math.PI / 180)
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
        this.ctx.restore()
        this.pos[1] += .1
    }

}