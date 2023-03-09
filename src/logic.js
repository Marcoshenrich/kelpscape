import Fish from "./fish"
import Algae from "./algae"
import Shark from "./shark"
import Effect from "./effect"
import Input from "./input"
import SeaweedCluster from "./seaweedCluster"
import Crab from "./crab"

export default class Logic {

    constructor(ctx, canvas, view) {
        this.input = new Input()
        this.ctx = ctx
        this.canvas = canvas
        this.view = view

        this.fishCount = 20
        this.algaeCount = 100
        this.sharkCount = 2
        this.eggCount = 0
        this.effectCount = 0
        this.seaweedClusterCount = 10
        this.deadCreatureCount = 0
        this.crabCount = 20

        this.fishes = this.tankPopulator(this.fishCount, Fish)
        this.algae = this.tankPopulator(this.algaeCount, Algae)
        this.sharks = this.tankPopulator(this.sharkCount, Shark)
        this.eggs = {}
        this.effects = this.tankPopulator(0, Effect)
        this.seaweedClusters = this.tankPopulator(this.seaweedClusterCount, SeaweedCluster)
        this.deadCreatures = {}
        this.crabs = this.tankPopulator(this.crabCount, Crab)

        this.algaeSpawnIncrement = 2000
        this.algaeSpawns()
        
        this.hungryDenizenArr = []
        this.assignFoodWeb() 
    }


    assignFoodWeb() {
        Fish.prototype.preySpecies = [this.algae]
        Shark.prototype.preySpecies = [this.fishes]
    }

    coreLoop(){
        this.denizensHuntWhenHungry()
        // this.fishCanFindSomethingElseToEat()
        this.fishEatAlgae()
        // this.fishMeetOtherFish()
        // this.sharksHuntWhenHungry()
        // this.sharksEatFish()
        // this.fishFleeFromSharks()
        this.denizensDie([this.fishes,this.algae,this.sharks,this.eggs,this.effects, this.crabs])
    }

    denizensHuntWhenHungry() {
        while (this.hungryDenizenArr.length) {
            let hungryDenizen = this.hungryDenizenArr.pop()
            this.findNearestFood(hungryDenizen)
        }
    }

    findNearestFood(predator) {
        let nearestFoodCords = []
        let nearestFoundDistance = Infinity
        let foodId;

        let allPreyArr = []
        predator.preySpecies.forEach((preyObj) => { allPreyArr = allPreyArr.concat(Object.values(preyObj)) })

        for (const prey of allPreyArr) {
            let xDistance = Math.abs(predator.pos[0] - prey.pos[0])
            let yDistance = Math.abs(predator.pos[1] - prey.pos[1])

            if ((xDistance + yDistance) < nearestFoundDistance) {
                nearestFoundDistance = xDistance + yDistance
                nearestFoodCords = prey.pos
                foodId = prey.id
            }
        }

        predator.hunting = foodId
        predator.nearestFoodCords = nearestFoodCords
    }

    fishEatAlgae() {
        for (let i = 0; i < Object.values(this.fishes).length; i++) {
            let fish = Object.values(this.fishes)[i]
            if (fish.energy > fish.eatFoodThreshold) continue
            if (fish.mating) continue

            console.log(this.view.quadtree.queryRange({ x: fish.mouthPos[0], y: fish.mouthPos[1], height: fish.mouthSize, width: fish.mouthSize }))






            // for (const [id, algae] of Object.entries(this.algae)) {
            //     let eat = fish.collisionDetector([fish.mouthPos, [fish.mouthSize, fish.mouthSize]], [algae.pos, [algae.height, algae.width]])
            //     if (eat) {
            //         algae.dead = true
            //         fish.energy= (fish.energy + algae.energyVal) > fish.maxEnergy ? fish.maxEnergy : algae.energyVal
            //         fish.foodEaten++
            //         fish.hunting = false
            //         if (fish.spawn && fish.foodEaten > 4) {
            //             fish.growUp()
            //         }
            //     }

            // }
        }
    }

    fishFleeFromSharks() {
        for (let i = 0; i < Object.values(this.fishes).length; i++) {
            let fish = Object.values(this.fishes)[i]
            if (fish.mating) continue
            if (fish.fleeing) continue
            this.findNearestPredator(fish, this.sharks)
        }

    }

    denizensDie(classObjArr){
        for (let classObj of classObjArr) {
            for (const [id, denizen] of Object.entries(classObj)) {
                if (denizen.dead) delete classObj[id]
            }
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
        setTimeout(()=>{
            this.algaeCount++
            this.algae["Algae" + this.algaeCount] = new Algae(this.algaeCount, this.ctx, this.canvas, this.view, this)
            this.algaeSpawns()
        }, Math.floor(Math.random() * this.algaeSpawnIncrement) + this.algaeSpawnIncrement)
    }

    fishMeetOtherFish() {
        for (let i = 0; i < Object.values(this.fishes).length; i++) {
            let fish1 = Object.values(this.fishes)[i]
            if (fish1.spawn || fish1.mating) continue
            if (fish1.energy < fish1.matingThreshold) continue

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



    findNearestPredator(prey, predatorSpecies) {
        let fleeFromCoords = []
        let nearestFoundDistance = Infinity

            for (const [id, predator] of Object.entries(predatorSpecies)) {
                let xDistance = Math.abs(prey.pos[0] - predator.pos[0])
                let yDistance = Math.abs(prey.pos[1] - predator.pos[1])
                if ((xDistance + yDistance) > prey.fleeDistanceThreshold) continue
                if ((xDistance + yDistance) < nearestFoundDistance) {
                    nearestFoundDistance = xDistance + yDistance
                    fleeFromCoords = predator.pos
                }
            }
        if (nearestFoundDistance === Infinity) return
        prey.fleeing = true
        prey.fleeFromCoords = fleeFromCoords
        setTimeout(()=>{
            prey.fleeing = false
            prey.fleeFromCoords = []
        },1000)

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


    tankPopulator(objnum, className, options) {
        let denizenObj = {}

        while (objnum > 0) {
            denizenObj[className.name + objnum] = new className(objnum, this.ctx, this.canvas, this.view, this, options)
            objnum--
        }
        return denizenObj
    }

}