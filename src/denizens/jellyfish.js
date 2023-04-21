import { rand } from "../engine/utils";
import Effect from "./effect";
import Swimmer from "./swimmer";
import Floater from "../behaviors/floater"
import Trapper from "../behaviors/trapper";
import Denizen from "./denizen";
import SwimmerExt from "../behaviors/swimmerExt";


export default class Jellyfish extends Denizen {
    constructor(id, ctx, canvas, view, logic, options){

        super(ctx, canvas, view, logic)
        this.floater = new Floater(this)
        this.trapper = new Trapper(this, { trapHeight: 18, trapWidth: 18, trapYAdjustment: 10, trapXAdjustment: 0, denizenEatsImmediately: true})
        this.trappedPrey = false
        this.textBox = this.logic.textContentObj["Jellyfish"]
        this.type = "Jellyfish"
        this.id = this.type + id
        this.img = new Image()
        this.img.src = ['./dist/art/jelly1.png', './dist/art/jelly2.png'][rand(2)]
        this.height = 25
        this.width =  15
        this.pos = options.pos || this.placer()

        this.maxSpeed = .04
        this.speed = rand(1, 4) / 100

        this.maxEnergy = 5
        this.energy = this.maxEnergy
        this.consumptionRate = .002
        this.energyVal = 4

        this.up = [true,false][rand(2)]
        this.right = [true, false][rand(2)]

        this.dropGametes()

        this.swimmer = new SwimmerExt(this,{})
    }

    dropGametes() {
        let timeoutID = setTimeout(()=>{
            this.logic.effectCount++
            this.logic.effects["Effect" + this.logic.effectCount] = new Effect(this.logic.effectCount, this.ctx, this.canvas, this.view, this.logic,{type: "gametes", pos: [this.pos[0], this.pos[1]],  size: 2 })
        }, rand(6000000))
        this.clearOnDeath.push(timeoutID)
    }

    beforeIDieCB() {
        if (this.trappedPrey) this.trappedPrey.trapped = false
        this.clearOnDeath.forEach((timerId) => {
            clearTimeout(timerId)
        })
    }

    moveSelector = () => {
        return Object.values(this.movementPatterns)[Math.floor(Math.random() * 2)]
    }

    coreloop() {
        this.trapper.coreloop()
        this.floater.coreloop()
        this.swimmer.coreloop()
        // this.move()
        this.draw()

        if (this.view.debugging) {
            this.ctx.fillStyle = 'rgba(0,0,0,1)';
            this.ctx.font = "12px serif";
            this.ctx.fillText(`${[Math.floor(this.pos[0]), Math.floor(this.pos[1])]}`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1])
            this.ctx.fillRect(this.trapPos[0] + this.offset[0], this.trapPos[1] + this.offset[1], this.trapWidth, this.trapHeight)
        }
    }
    
    // move() {
    //     if (this.timeToSwitchMovement) {
    //         Object.values(this.movementSwitches)[Math.floor(Math.random() * Object.values(this.movementSwitches).length)]()
    //         this.timeToSwitchMovement = false
    //     }    
    //     if (this.pos[0] > this.arenaWidth - this.width || this.pos[0] < 0) this.right = !this.right;
    //     if (this.pos[1] > this.arenaHeight - this.height || this.pos[1] < 0) this.up = !this.up
    //     this.movement1();
    //     this.movement2();
    // }

    movementSwitches = {
        reverseUp: () => {
            this.up = !this.up
        },

        reverseSide: () => {
            this.right = !this.right;
        },

        speedUp: () => {
            if (this.speed < this.maxSpeed) this.speed += .1
        },

        slowDown: () => {
            if (this.speed > .3) this.speed -= .1
        }
    }

    draw() {
        this.drawDenizen()
    }

}


