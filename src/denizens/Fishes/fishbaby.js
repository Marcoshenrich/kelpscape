import Fish from "./fish"
import { miniRandomizer } from "../../engine/utils"

export default class FishBaby extends Fish {

    constructor(ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic, options)
        this.spawn = true
        this.pos = options.pos ? [options.pos[0] + miniRandomizer(), options.pos[1] + miniRandomizer()] : this.placer()
        this.oldPos = this.pos


        this.fadeThreshold = 3

        this.foodEaten = 0
        this.growUpThreshold = 4

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

    