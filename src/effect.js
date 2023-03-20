

export default class Effect {
    constructor(id, type, pos, ctx, canvas, view) {
        this.id = "Effect" + id
        this.type = type
        this.pos = pos
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.size = 10
        this.coef1 = 0
        this.coef2 = 0
        this.dead = false
    }

    coreloop() {
        switch(this.type) {
            case "bloodSpurt":
                this.bloodSpurt()
                break

            default:
                return
        }

    }

    bloodSpurt() {
        this.ctx.fillStyle = 'rgba(255,0,0,1)';
        this.ctx.fillRect(this.pos[0] + this.coef1 + this.view.offset[0], this.pos[1] + this.coef2 + this.view.offset[1], this.size, this.size)
        this.ctx.fillRect(this.pos[0] + this.coef1 + this.view.offset[0], this.pos[1] - this.coef2 + this.view.offset[1], this.size, this.size)
        this.ctx.fillRect(this.pos[0] - this.coef1 + this.view.offset[0], this.pos[1] + this.coef2 + this.view.offset[1], this.size, this.size)
        this.ctx.fillRect(this.pos[0] - this.coef1 + this.view.offset[0], this.pos[1] - this.coef2 + this.view.offset[1], this.size, this.size)
        this.coef1 += .7
        this.coef2 += .7
        this.size -= .3
        if (this.size < 0) {
            this.dead = true
            this.view.logic.recentlyDeadDenizens.push(this)
        }
    }

    clearCallbacksOnDeath(){
        //prevents breaking on logic deathloop
    }

}