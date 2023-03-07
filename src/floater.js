import Denizen from "./denizen"


export default class Floater extends Denizen {

    constructor(ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.bobCoef = Math.floor(Math.random() * 10) + 4
        this.bobSpeed = (Math.floor(Math.random() * 3) + .1) / 30
        this.trackCoef = 0
        this.up = [true, false][Math.floor(Math.random() * 2)]
    }

    draw() {
        this.bob()
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
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