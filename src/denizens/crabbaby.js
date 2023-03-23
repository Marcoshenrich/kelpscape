import { miniRandomizer } from "../engine/utils";
import Crab from "./deadCreature";


export default class CrabBaby extends Crab {

    constructor(id, ctx, canvas, view, logic, pos) {
        super(ctx, canvas, view, logic)
        this.id = "CrabBaby" + id
        this.spawn = true
        this.img = new Image()
        this.img.src = './dist/art/crab.png'
        this.height = 7.5
        this.width = 15
        this.pos = [pos[0] + miniRandomizer(), this.arenaHeight - this.height]
        this.speed = Math.floor(Math.random() * 4) / 20
        this.maxSpeed = .25

        this.consumptionRate = .002

        this.maxEnergy = 5
        this.energy = this.maxEnergy
        this.energyUseCoef = .0007
        this.fadeThreshold = 2.5

        this.trapHeight = 3
        this.trapWidth = this.width

        this.afterIEatCB = () => {
            if (this.foodEaten === this.growUpThreshold) this.growUp()
        }
    }

    growUp() {
        this.dead = true
        this.logic.recentlyDeadDenizens.push(this)
        this.logic.crabCount += 1
        this.logic.crabs["Crab" + this.logic.fishCount] = new Crab(this.logic.crabCount, this.ctx, this.canvas, this.view, this.logic, [this.pos[0], this.pos[1]])
    }



}

