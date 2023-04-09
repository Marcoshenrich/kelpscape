import { rand } from "../engine/utils"



export default class Effect {
    constructor(id, ctx, canvas, view, logic, options) {
        this.id = "Effect" + id
        this.type = options.type
        this.pos = options.pos
        this.ctx = ctx
        this.canvas = canvas
        this.logic = logic
        this.view = view
        this.size = options.size
        this.coef1 = 0
        this.coef2 = 0
        this.dead = false
        this.bobCoef = Math.floor(Math.random() * 10) + 4
        this.bobSpeed = (Math.floor(Math.random() * 3) + .1) / 30
        this.trackCoef = 0
        this.up = [true, false][Math.floor(Math.random() * 2)]
        this.index = 0
        this.frame = 0
        this.parent = options.parent


        this.rbgGreen = options.rbgGreen
        this.fader = 1

        this.delta = options.delta
        if (this.parent) this.parentPosDeltafinder()
    }

    parentPosDeltafinder() {
        this.parentPosDelta = [this.pos[0] - this.parent.pos[0], this.pos[1] - this.parent.pos[1]]
    }

    coreloop() {
        switch(this.type) {
            case "bloodSpurt":
                this.bloodSpurt()
                break

            case "gametes":
                this.gametes()
                break

            case "eatingSeaweed":
                this.eatingSeaweed()
                break


            case "particle":
                this.particle()
                break

            default:
                return
        }

    }


    eatingSeaweed() {
        this.frame++
        if (this.frame % 5 !== 0) return
        let deltas = [[0, -.1], [.075, -.075], [.1, 0], [.075, .075], [0, .1], [-.075,.075], [-.1,0], [-.075,-.075]]
        this.logic.effectCount++
        this.logic.effects["Effect" + this.logic.effectCount] = new Effect(this.logic.effectCount, this.ctx, this.canvas, this.view, this.logic, { type: "particle", pos: [this.pos[0], this.pos[1]], delta: deltas[this.index], size: 2, rbgGreen:255})
        this.index = (this.index + 1) % deltas.length
        if (!this.parentPosDelta) return
        this.pos[0] = this.parent.pos[0] + this.parentPosDelta[0]
        this.pos[1] = this.parent.pos[1] + this.parentPosDelta[1]

        if (!this.parent.eatingSeagrass) {
            this.dead = true
            this.logic.recentlyDeadDenizens.push(this)
        }

    }

    particle() {
        this.ctx.fillStyle = `rgba(0,${this.rbgGreen},0,${this.fader})`;
        this.ctx.fillRect(this.pos[0] + this.view.offset[0], this.pos[1]+ this.view.offset[1], this.size, this.size)
        this.pos[0] += this.delta[0]
        this.pos[1] += this.delta[1]
        this.rbgGreen -= 1.25
        this.fader -= .005
        if (this.fader < 0) {
            this.dead = true
            this.view.logic.recentlyDeadDenizens.push(this)
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
        if (this.pos[1] > this.view.arenaHeight) {
            this.dead = true
            this.view.logic.recentlyDeadDenizens.push(this)
            this.view.logic.spawnDenizen(this)
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