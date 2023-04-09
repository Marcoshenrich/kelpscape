import { miniRandomizer } from "../engine/utils";
import Crab from "./crab";


export default class CrabBaby extends Crab {

    constructor(id, ctx, canvas, view, logic, options) {
        super(id, ctx, canvas, view, logic,{spawn:true})
        this.spawn = true
        this.type = "CrabBaby"
        this.id = this.type + id
        this.img = new Image()
        this.img.src = './dist/art/crab.png'
        this.height = 7.5
        this.width = 15
        this.pos = [options.pos[0] + miniRandomizer(), this.arenaHeight - this.height]
        this.speed = Math.floor(Math.random() * 4) / 20
        this.maxSpeed = .25
        this.energyVal = 5

        this.consumptionRate = .002
        this.growUpThreshold = 1

        this.maxEnergy = 5
        this.energy = this.maxEnergy
        this.energyUseCoef = .0007
        this.fadeThreshold = 2.5
 
    }

    growUp() {
        this.dead = true
        this.logic.recentlyDeadDenizens.push(this)
        this.logic.spawnDenizen(this) 
    }

}

