import { rand } from "../engine/utils";
import Effect from "./effect";
import Swimmer from "./swimmer";
import Floater from "../behaviors/floater";
import MouthEater from "../behaviors/moutheater";
import Metabolism from "../behaviors/metabolism";

import SwimmerExt from "../behaviors/swimmerExt";


export default class Turtle extends Swimmer {
    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic)
        this.textBox = this.logic.textContentObj["Turtle"]
        this.type = "Turtle"
        this.id = this.type + id
        this.leftImg.src = './dist/art/turtleleft.png'
        this.rightImg.src = './dist/art/turtleright.png'
        this.img = this.imgSelector()

        this.bobCoef = Math.floor(Math.random() * 10) + 4
        this.bobSpeed = (Math.floor(Math.random() * 3) + .1) / 30
        this.trackCoef = 0
        this.up = [true, false][Math.floor(Math.random() * 2)]

        this.inArena = false

        this.maxEnergy = 20
        this.eatFoodThreshold = 15
        this.energy = rand(10,20)
        this.energyUseCoef = .002
        this.energyVal = 30

        this.huntingThreshold = 13
        this.mouthSize = 8
        this.hunting = false
        
        this.width = 80
        this.height = 32
        this.maxSpeed = 1
        this.speed = 1
        this.pos = this.placer()
        this.timeToLeave = false
        this.leaveTimer()

        this.playingSeagrassEffect = false

        this.eatingSeagrass = false
        this.consumptionRate = .005

        this.floater = new Floater(this)
        this.mouthEater = new MouthEater(this, { mouthHeight: this.mouthSize, mouthWidth: this.mouthSize, leftMouthYAdjustment: (this.height / 2) - 8, leftMouthXAdjustment: 0, rightMouthXAdjustment: (this.width - this.mouthSize), rightMouthYAdjustment: (this.height / 2) - 8 })
        this.swimmer = new SwimmerExt(this, { facing: true })
        this.metabolism = new Metabolism(this, {})

    }

    leaveTimer() {
        let id = setTimeout(() => {
            this.timeToLeave = true
            this.eatingSeagrass = false
            this.playingSeagrassEffect = false
        }, Math.floor(Math.random() * 60000) + 60000)
        this.clearOnDeath.push(id)
    }

    placer() {
        let x = this.right ? 0 - this.width : this.arenaWidth
        return [x, rand(this.arenaHeight - this.height)]
    }

    enterArena() {
        if (this.right) {
            if (this.pos[0] > 0) this.inArena = true
            this.pos[0] += this.speed
        } else {
            if (this.pos[0] < this.arenaWidth - this.width) this.inArena = true
            this.pos[0] -= this.speed
        }
    }

    debugger() {
        this.ctx.fillStyle = 'rgba(255,225,225,1)';
        this.ctx.font = "16px serif";
        this.ctx.fillText(`${(Math.round(this.energy * 100) / 100).toFixed(2)}`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1] - 60)
        this.ctx.fillText(`${this.eatingSeagrass}`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1] - 30) 
        this.ctx.fillText(`${this.hunting.id}`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1])
    }

    deleteTurtle() {
        if (this.pos[0] + this.width < 0 || this.pos[0] > this.arenaWidth) {
            this.dead = true
            this.logic.recentlyDeadDenizens.push(this)
        }
    }

    seagrassEffect() {
        this.playingSeagrassEffect = true
        let effectPos;
        if (this.right) {
            effectPos = [this.pos[0] + this.width, this.pos[1] + 10 ]
        } else {
            effectPos = [this.pos[0], this.pos[1] + 10]
        }

        this.logic.effectCount++
        this.logic.effects["Effect" + this.logic.effectCount] = new Effect(this.logic.effectCount, this.ctx, this.canvas, this.view, this.logic, { type: "eatingSeaweed", pos: effectPos, parent: this })
    }

    coreloop() {
        // this.debugger()

        this.drawDenizen()
        this.speedModulator()

        if (this.timeToLeave) {
            this.enterArena()
            this.deleteTurtle()
            return
        }

        this.mouthEater.coreloop()
        this.metabolism.coreloop()

        if (this.inArena) {
            if (!this.eatingSeagrass) this.swimmer.coreloop()
        } else {
            this.enterArena()
        }

        if (this.energy > this.maxEnergy - 1) {
            this.hunting = false
            this.eatingSeagrass = false
        }

        if (!this.hunting) this.eatingSeagrass = false
        if (this.hunting && this.eatingSeagrass && !this.playingSeagrassEffect) this.seagrassEffect()

        if (this.hunting) this.consumeSeagrass()
    }

    consumeSeagrass() {
        if (!this.eatingSeagrass || this.hunting.type !== "Seaweed") return
        this.floater.coreloop()
        this.energy = Math.min(this.maxEnergy, this.energy + this.consumptionRate)
        this.hunting.energyVal -= this.consumptionRate
    }

    speedModulator() {
        this.speed -= .005
        if (this.speed < .2) this.speed = this.maxSpeed
    }
}