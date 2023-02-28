import Fish from "./fish"
import Algae from "./algae"
import Shark from "./shark"
import Effect from "./effect"
import Fishegg from "./fishegg"

export default class Logic {

    constructor(ctx, canvas, view) {
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.effect = new Effect(ctx, canvas, view)
        this.fishCount = 10
        this.fishes = this.tankPopulator(this.fishCount, Fish)
        this.algaeCount = 50
        this.algae = this.tankPopulator(this.algaeCount, Algae)
        this.sharkCount = 1
        this.sharks = this.tankPopulator(this.sharkCount, Shark)
        this.eggCount = 0
        this.eggs = {}
        this.effectCount = 0
        this.effects = this.tankPopulator(0, Effect)
    }

    coreLoop(){
        this.fishEatAlgae()
        this.fishMeetOtherFish()
        this.fishHuntWhenHungry()
        this.fishCanFindSomethingElseToEat()
        this.sharksHuntWhenHungry()
        this.sharksEatFish()
        this.algaeSpawns()
        this.denizensDie(["fishes", "eggs", "algae", "sharks", "effects"])
        this.effectsExpire()
    }

    denizensDie(classnamesArr){
        for (let classname of classnamesArr) {
            for (const [id, denizen] of Object.entries(this[classname])) {
                if (denizen.dead) delete this[classname][id]
            }
        }
    }

    fishDieFromNoFood() {
        for (const [id, fish] of Object.entries(this.fishes)) {
            if (fish.dead) delete this.fishes[id]
        }
        for (const [id, shark] of Object.entries(this.sharks)) {
            if (shark.dead) delete this.sharks[id]
        }
    }


    effectsExpire() {
        for (const [id, effect] of Object.entries(this.effects)) {
            if (effect.effectEnded) delete this.effects[id]
        }
    }

    sharksHuntWhenHungry() {
        for (let i = 0; i < Object.values(this.sharks).length; i++) {
            let shark = Object.values(this.sharks)[i]
            if (shark.energy > 40) continue
            if (shark.hunting) continue

            let nearestFoodCords = []
            let nearestFoundDistance = Infinity
            let foodId;

            for (const [id, fish] of Object.entries(this.fishes)) {
                let xDistance = Math.abs(shark.pos[0] - fish.pos[0])
                let yDistance = Math.abs(shark.pos[1] - fish.pos[1])
                if ((xDistance + yDistance) < nearestFoundDistance) {
                    nearestFoundDistance = xDistance + yDistance
                    nearestFoodCords = fish.pos
                    foodId = id
                }
            }
            shark.hunting = foodId
            shark.nearestFoodCords = nearestFoodCords
        }
    }

    sharksEatFish() {
        for (let i = 0; i < Object.values(this.sharks).length; i++) {
            let shark = Object.values(this.sharks)[i]
            if (shark.energy > shark.eatFoodThreshold) continue
            for (const [id, fish] of Object.entries(this.fishes)) {
                let eat = shark.collisionDetector([shark.mouthPos, [shark.mouthSize, shark.mouthSize]], [fish.pos, [fish.height, fish.width]])
                if (eat) {
                    fish.dead = true
                    shark.energy = shark.maxEnergy
                    shark.foodEaten++
                    shark.hunting = false
                    this.effectCount++
                    this.effects["Effect" + this.effectCount] = new Effect("bloodSpurt", [shark.mouthPos[0], shark.mouthPos[1]], this.ctx, this.canvas, this.view)
                }

            }
        }
    }

    algaeSpawns() {
        let spawnAlgae = (1 === Math.floor(Math.random() * 200))
        if (spawnAlgae) {
            this.algaeCount++
            this.algae["Algae" + this.algaeCount] = new Algae(this.algaeCount, this.ctx, this.canvas, this.view, this.posMatrix, this)
        }
    }

    fishMeetOtherFish() {
        for (let i = 0; i < Object.values(this.fishes).length; i++) {
            let fish1 = Object.values(this.fishes)[i]
            if (fish1.energy < fish1.matingThreshold) continue
            if (fish1.spawn || fish1.mating) continue

            for (let j = 0; j < Object.values(this.fishes).length; j++) {
                if (i === j) continue
                let fish2 = Object.values(this.fishes)[j]
                if (fish2.energy < fish2.matingThreshold) continue
                if (fish2.spawn || fish2.mating) continue

                let bump = fish1.collisionDetector([[fish1.pos[0], fish1.pos[1]], [fish1.width, fish1.height]], [[fish2.pos[0], fish2.pos[1]], [fish2.width, fish2.height]])
                if (bump) {
                    fish1.mate(true)
                    fish2.mate()
                }
            }
        }

    }


    fishEatAlgae() {

        for (let i = 0; i < Object.values(this.fishes).length; i++) {
            let fish = Object.values(this.fishes)[i]
            if (fish.energy > fish.eatFoodThreshold) continue
            if (fish.mating) continue

            for (const [id, algae] of Object.entries(this.algae)) {
                let eat = fish.collisionDetector([fish.mouthPos, [fish.mouthSize, fish.mouthSize]], [algae.pos, [algae.height, algae.width]])
                if (eat) {
                    algae.dead = true
                    fish.energy = fish.maxEnergy
                    fish.foodEaten++
                    fish.hunting = false
                    fish.nearestFoodCords = []
                    if (fish.spawn && fish.foodEaten > 4) {
                        fish.growUp()
                    }
                }

            }
        }
    }

    fishHuntWhenHungry() {
        for (let i = 0; i < Object.values(this.fishes).length; i++) {
            let fish = Object.values(this.fishes)[i]
            if (fish.energy > 7) continue
            if (fish.hunting) continue
            if (fish.mating) continue

            let nearestFoodCords = []
            let nearestFoundDistance = Infinity
            let foodId;

            for (const [id, algae] of Object.entries(this.algae)) {
                let xDistance = Math.abs(fish.pos[0] - algae.pos[0])
                let yDistance = Math.abs(fish.pos[1] - algae.pos[1])
                if ((xDistance + yDistance) < nearestFoundDistance) {
                    nearestFoundDistance = xDistance + yDistance
                    nearestFoodCords = algae.pos
                    foodId = id
                }
            }
            fish.hunting = foodId
            fish.nearestFoodCords = nearestFoodCords
        }
    }


    fishCanFindSomethingElseToEat() {
        for (let i = 0; i < Object.values(this.fishes).length; i++) {
            let fish = Object.values(this.fishes)[i]
            if (!fish.hunting) continue
            if (!(fish.hunting in this.algae)) {
                fish.hunting = false
                fish.nearestFoodCords = []
            }
        }
    }




    tankPopulator(objnum, className) {
        let denizenObj = {}
  
        while (objnum > 0) {
            denizenObj[className.name + objnum] = new className(objnum, this.ctx, this.canvas, this.view, this.posMatrix, this)
            objnum--
        }
        return denizenObj
    }

    matrixMaker() {
        let matrix = {}
        let i = 100
        while (i > 0) {
            matrix[i] = new Set()
            i--
        }
        return matrix
    }

}