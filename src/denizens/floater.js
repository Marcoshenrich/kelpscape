import Denizen from "./denizen"


export default class Floater extends Denizen {

    constructor(ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.bobCoef = Math.floor(Math.random() * 10) + 4
        this.bobSpeed = (Math.floor(Math.random() * 3) + .1) / 30
        this.trackCoef = 0
        this.up = [true, false][Math.floor(Math.random() * 2)]
        this.energy = 5
    }

    coreloop() {
        this.bob()
        this.dieFromEnergyLoss()
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
        if (this.view.debugging) {
            this.ctx.fillStyle = 'rgba(0,0,0,1)';
            this.ctx.font = "12px serif";
            this.ctx.fillText(`${this.pos[1]}`, this.pos[0], this.pos[1])
        }
    }

    dieFromEnergyLoss() {
        if (this.energy < 0) {
            this.dead = true
            this.logic.recentlyDeadDenizens.push(this)
        }
    }

    bob() {

        if (this.trapped) {
            this.pos[0] = this.trapped.pos[0] - this.trappedPosDelta[0]
            this.pos[1] = this.trapped.pos[1] - this.trappedPosDelta[1]
            return
        }

        if (this.up) {
            this.trackCoef -= this.bobSpeed
            this.pos[1] -= this.bobSpeed
        } else {
            this.trackCoef += this.bobSpeed
            
            if (!(this.pos[1] > (this.arenaHeight - this.height))) {
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