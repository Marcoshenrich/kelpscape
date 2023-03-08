import Denizen from "./denizen"

export default class DeadCreature extends Denizen {
    constructor(id, ctx, canvas, view, logic, pos, options) {
        super(ctx, canvas, view, logic)
        this.id = "DeadCreature" + id
        this.pos = [pos[0], pos[1]]
        this.driftSpeed = .2
        this.img = new Image()
        this.type = options.type
        this.width;
        this.height;
        this.typeSelector()
    }

    draw() {
        if (this.pos[1] < this.arenaHeight - this.height) this.pos[1] += this.driftSpeed
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
    }

    typeSelector() {

        switch(this.type) {
            case "Spawn":
                this.img.src = './dist/art/fishdead.png'
                this.width = 12
                this.height = 8
                break

            case "Fish":
                this.img.src = './dist/art/fishdead.png'
                this.width = 25
                this.height = 16
                break

            default: 
                this.img.src = './dist/art/fishdead.png'
        }

    }


}