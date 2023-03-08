import Denizen from "./denizen";


export default class Crab extends Denizen {

    constructor(id, ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.id = "Crab" + id
        this.img = new Image()
        this.img.src = './dist/art/crab.png'
        this.height = 15
        this.width = 30
        this.pos = [100,this.arenaHeight - this.height]
    }

    draw() {
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
    }

}

