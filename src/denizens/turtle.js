import Denizen from "./denizen";

export default class Turtle extends Denizen {
    constructor(id, ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.id = "Turtle" + id
        this.img = new Image()
        this.img.src = './dist/art/turtle.png'
        this.pos = [500,500]
        this.width = 80
        this.height = 32
        this.maxSpeed = 1
        this.speed = 1
    }

    coreloop() {
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
        this.move()
    }

    move() {
        this.speed -= .005
        if (this.speed < .2) this.speed = 1.3
        this.pos[0] += this.speed
    }
}