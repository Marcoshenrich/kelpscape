import Denizen from "./denizen"

export default class DeadCreature extends Denizen {
    constructor(id, ctx, canvas, view, logic, pos, options) {
        super(ctx, canvas, view, logic)
        this.id = "DeadCreature" + id
        this.pos = [pos[0], pos[1]]
        this.driftSpeed = .2
        this.img = new Image()
        this.type = options && options.type || "Fish"
        this.width;
        this.height;
        this.energyVal;
        this.typeSelector()
        this.dead = false
    }

    coreloop() {
        if (this.pos[1] < this.arenaHeight - this.height) this.pos[1] += this.driftSpeed
        this.draw()
        if (this.energyVal < 0) {
            this.dead = true
            this.logic.recentlyDeadDenizens.push(this)

        }
    }

    draw() {
        this.ctx.globalAlpha = this.energyVal > 5 ? 1 : (this.energyVal + 5) / 10
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
        this.ctx.globalAlpha = 1

        if (this.view.debugging) {
            this.ctx.fillStyle = 'rgba(255,255,255,1)';
            this.ctx.font = "12px serif";
            this.ctx.fillText(`${this.energyVal}`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1])
            this.ctx.fillText(`[${Math.floor(this.pos[0])},${Math.floor(this.pos[1])}]`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1] - this.height)

        }
    }


    typeSelector() {

        switch(this.type) {
            case "Spawn":
                this.img.src = './dist/art/fishdead.png'
                this.width = 12
                this.height = 8
                this.energyVal = 5
                break

            case "Fish":
                this.img.src = './dist/art/fishdead.png'
                this.width = 25
                this.height = 15
                this.energyVal = 10
                break

            case "Crab":
                this.img.src = './dist/art/crabdead.png'
                this.width = 30
                this.height = 15
                this.energyVal = 5
                break

            default: 
                this.img.src = './dist/art/fishdead.png'
        }

    }


}