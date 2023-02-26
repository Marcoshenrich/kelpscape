import Denizen from "./denizen"


export default class Algae extends Denizen {

    constructor(id, ctx, canvas, view, posMatrix, logic) {
        super(ctx, canvas, view, posMatrix, logic)
        this.id = "Algae" + id
        this.img = new Image()
        this.img.src = './dist/art/algae.png'
        this.height = 8
        this.width = 8
        this.pos = this.placer()
        this.bobCoef = Math.floor(Math.random() * 4) + 4
        this.up = [true, false][Math.floor(Math.random() * 2)]
    }

    placer() {
        let pos = []
        pos[0] = Math.floor(Math.random() * this.canvas.width) - this.height
        pos[1] = Math.floor(Math.random() * this.canvas.height / 2) + (this.canvas.height / 2) - this.width
        return pos
    }

    draw() {
        this.bob()
        this.ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height)
    }

    bob() {

        if (this.up) {
            this.pos[1] += .1
            this.bobCoef += .1
        } else {
            this.pos[1] -= .1
            this.bobCoef -= .1
        }

        if (this.bobCoef > 8) {
            this.up = false
        }

        if (this.bobCoef < 0 ) {
            this.up = true
        }

    }

    

}