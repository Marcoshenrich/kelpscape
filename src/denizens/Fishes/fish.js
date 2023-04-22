import Mater from "../../behaviors/mater"
import MouthEater from "../../behaviors/moutheater"
import swimmer from "../../behaviors/swimmer"
import Denizen from "../denizen"
import { rand } from "../../engine/utils";
import Metabolism from "../../behaviors/metabolism"

export default class Fish extends Denizen {

    constructor(ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic)
        this.spawn = false

        this.up = [true, false][Math.floor(Math.random() * 2)]
        this.right = [true, false][Math.floor(Math.random() * 2)]

        this.width = options.width
        this.height = options.height
        this.mouthSize = options.mouthSize

        this.leftImg = new Image()
        this.rightImg = new Image()
        this.img = null

        this.pos = options.pos || this.placer()

        this.fadeThreshold = 7
        this.foodEaten = 0

        this.hunting = false
        this.nearestFoodCords = []


        this.fleeDistanceThreshold = 200
        this.fleeing = false
        this.fleeFromCoords = []

        this.afterIEatCB = () => {
            //nothing required, spawn grow up separately
        }

        
        this.swimmer = new swimmer(this,{facing:true})
        this.mouthEater = new MouthEater(this, { mouthHeight: this.mouthSize, mouthWidth: this.mouthSize, leftMouthYAdjustment: (this.height / 2), leftMouthXAdjustment: 0, rightMouthXAdjustment: (this.width - this.mouthSize), rightMouthYAdjustment: (this.height / 2) })
        this.mater = new Mater(this,{})
        this.metabolism = new Metabolism(this)
    }

    coreloop() {
        this.swimmer.coreloop()
        this.metabolism.coreloop()
        this.mouthEater.coreloop()
        this.mater.coreloop()
        this.draw()
    }


    draw() {
        this.ctx.fillStyle = 'rgba(0,225,225,1)';
        this.ctx.globalAlpha = this.energy > 7 ? 1 : (this.energy + 3) / 10
        this.drawDenizen()
        if (this.mating) this.ctx.drawImage(this.mateHeart, this.mouthEater.mouthPos[0] + this.offset[0], this.mouthEater.mouthPos[1] + this.offset[1] - this.width, 15, 15)
        if (this.view.debugging) {
            this.ctx.fillRect(this.mouthEater.mouthPos[0] + this.offset[0], this.mouthEater.mouthPos[1] + this.offset[1], this.mouthEater.mouthHeight, this.mouthEater.mouthWidth)
        }
        this.drawId()
        this.ctx.globalAlpha = 1
    }

    drawId() {
        //debugging function
        this.ctx.fillStyle = 'rgba(255,255,255,1)';
        this.ctx.font = "12px serif";
        // this.ctx.fillText(`${(Math.round(this.energy * 100) / 100).toFixed(2)}`, this.pos[0] + this.offset[0], this.pos[1] +  this.offset[1])
    }

    mate(spawnBool) {
        this.mating = true
        this.speed = 0
        this.energy -= this.matingEnergyCost
        let id = setTimeout(()=>{
            this.speed += .5
            this.mating = false
            if (spawnBool) return
            let i = Math.floor(Math.random() * 6)
            while (i > 0) {
                i--
                this.logic.spawnDenizen(this) 
            }
        }, 1500)
        this.clearOnDeath.push(id)
    }
}