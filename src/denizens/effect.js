import { rand } from "../engine/utils"



export default class Effect {
    constructor(id, ctx, canvas, view, type, pos, options) {
        this.id = "Effect" + id
        this.type = type
        this.pos = pos
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.size = options.size
        this.coef1 = 0
        this.coef2 = 0
        this.dead = false
        this.bobCoef = Math.floor(Math.random() * 10) + 4
        this.bobSpeed = (Math.floor(Math.random() * 3) + .1) / 30
        this.trackCoef = 0
        this.up = [true, false][Math.floor(Math.random() * 2)]
    }

    coreloop() {
        switch(this.type) {
            case "bloodSpurt":
                this.bloodSpurt()
                break

            case "gametes":
                this.gametes()
                break

            default:
                return
        }

    }

    gametes() {
        this.ctx.fillStyle = 'rgba(0,255,255,1)';
        this.ctx.globalAlpha = .3
        this.ctx.fillRect(this.pos[0] + this.view.offset[0], this.pos[1] + 15 + this.view.offset[1], this.size, this.size)
        this.ctx.fillRect(this.pos[0] + 5 + this.view.offset[0], this.pos[1] + 10 + this.view.offset[1], this.size, this.size)
        this.ctx.fillRect(this.pos[0] + 10 + this.view.offset[0], this.pos[1] + 15 + this.view.offset[1], this.size, this.size)
        this.ctx.fillRect(this.pos[0] + 15 + this.view.offset[0], this.pos[1] + 10 + this.view.offset[1], this.size, this.size)
        this.ctx.fillRect(this.pos[0] + this.view.offset[0], this.pos[1] + 5 + this.view.offset[1], this.size, this.size)
        this.ctx.fillRect(this.pos[0] + 5 + this.view.offset[0], this.pos[1] + this.view.offset[1], this.size, this.size)
        this.ctx.fillRect(this.pos[0] + 10 + this.view.offset[0], this.pos[1] + 5 + this.view.offset[1], this.size, this.size)
        this.ctx.fillRect(this.pos[0] + 15 + this.view.offset[0], this.pos[1] + this.view.offset[1], this.size, this.size)

        this.pos[1] += .1
    
        this.ctx.globalAlpha = 1
        if (this.pos[1] < 0) {
            this.dead = true
            this.view.logic.recentlyDeadDenizens.push(this)
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