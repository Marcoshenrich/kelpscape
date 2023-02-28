import Fish from "./fish"
import Algae from "./algae"
import Shark from "./shark"
import Effect from "./effect"

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
        this.algaeSpawns()
        this.fishHuntWhenHungry()
        this.fishCanFindSomethingElseToEat()
        this.fishEatAlgae()
        this.fishMeetOtherFish()
        this.sharksHuntWhenHungry()
        this.sharksEatFish()
        this.denizensDie([this.fishes,this.algae,this.sharks,this.eggs,this.effects])
    }

    denizensDie(classObjArr){
        for (let classObj of classObjArr) {
            for (const [id, denizen] of Object.entries(classObj)) {
                if (denizen.dead) delete classObj[id]
            }
        }
    }

    sharksHuntWhenHungry() {
        for (let i = 0; i < Object.values(this.sharks).length; i++) {
            let shark = Object.values(this.sharks)[i]
            if (shark.energy > 40) continue
            if (shark.hunting) continue
            this.findNearestFood(shark, this.fishes)
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
            this.algae["Algae" + this.algaeCount] = new Algae(this.algaeCount, this.ctx, this.canvas, this.view, this)
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
            this.findNearestFood(fish, this.algae)
        }
    }

    findNearestFood(predator, preySpecies) {
        let nearestFoodCords = []
        let nearestFoundDistance = Infinity
        let foodId;

            for (const [id, prey] of Object.entries(preySpecies)) {
            let xDistance = Math.abs(predator.pos[0] - prey.pos[0])
            let yDistance = Math.abs(predator.pos[1] - prey.pos[1])

            if ((xDistance + yDistance) < nearestFoundDistance) {
                nearestFoundDistance = xDistance + yDistance
                nearestFoodCords = prey.pos
                foodId = id
            }
        }

        predator.hunting = foodId
        predator.nearestFoodCords = nearestFoodCords
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
            denizenObj[className.name + objnum] = new className(objnum, this.ctx, this.canvas, this.view, this)
            objnum--
        }
        return denizenObj
    }

}