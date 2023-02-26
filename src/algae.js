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
        this.bobCoef = Math.floor(Math.random() * 10) + 4
        this.bobSpeed = (Math.floor(Math.random() * 3) +.1)/30
        this.trackCoef = 0
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
        if (this.view.debugging) {
            this.ctx.fillStyle = 'rgba(0,0,0,1)';
            this.ctx.font = "12px serif";
            this.ctx.fillText(`${this.pos[1]}`, this.pos[0], this.pos[1])
        }

    
    }

    bob() {

        if (this.up) {
            this.trackCoef -= this.bobSpeed
            this.pos[1] -= this.bobSpeed
        } else {
            this.trackCoef += this.bobSpeed
            if (!(this.pos[1] > (this.canvas.height - this.height))) {
                console.log(this.pos[1])
                this.pos[1] += this.bobSpeed
            }

        }

        if (this.trackCoef > this.bobCoef) {
            this.up = true
        }

        if (this.trackCoef < 0) {
            this.up = false
        }

    }

    

}