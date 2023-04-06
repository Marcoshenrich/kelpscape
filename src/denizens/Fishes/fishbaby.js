import Fish from "./fish"
import { rand, miniRandomizer } from "../../engine/utils"
import TextBox from "../../engine/textbox"

export default class FishBaby extends Fish {

    constructor(ctx, canvas, view, logic, options) {
        super(id, ctx, canvas, view, logic, options)
        this.spawn = true
        this.id = "FishBaby" + id
        this.leftImg.src = './dist/art/fishleft.png'
        this.rightImg.src = './dist/art/fishright.png'
        this.speed = (Math.floor(Math.random() * 5) + 1) / 10
        this.width = 12
        this.height = 8
        this.pos = options.pos ? [pos[0] + miniRandomizer(), pos[1] + miniRandomizer()] : this.placer()
        this.oldPos = this.pos
        this.mouthSize = 4

        this.maxEnergy = 10
        this.energy = this.maxEnergy
        this.energyUseCoef = .0025
        this.maxSpeed = .3

        this.energyVal = 5
        this.fadeThreshold = 3

        this.foodEaten = 0
        this.growUpThreshold = 4
        this.eatFoodThreshold = 8
        this.huntingThreshold = 6

        this.hunting = false
        this.nearestFoodCords = []

        this.fleeDistanceThreshold = 200
        this.fleeing = false
        this.fleeFromCoords = []

        this.afterIEatCB = () => {
            if (this.foodEaten === this.growUpThreshold) this.growUp()
        }
    }

    growUp() {
        this.dead = true
        this.logic.recentlyDeadDenizens.push(this)
        this.logic.spawnDenizen(this)
    }

}

    