import Fish from "./fish"
import Algae from "./algae"
import Shark from "./shark"
import Effect from "./effect"
import Input from "./input"
import SeaweedCluster from "./seaweedCluster"
import Crab from "./crab"
import { Rectangle } from "./quadtree"


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
        this.crabCount = 12

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

        this.matingDenizensObj = {}

        this.predatorsWithMouthsArr = [...Object.values(this.fishes), ...Object.values(this.sharks)]

    }

    reAssignDataObjs() {
        this.predatorsWithMouthsArr = [...Object.values(this.fishes), ...Object.values(this.sharks)]
    }


    assignFoodWeb() {
        Fish.prototype.preySpecies = [Algae]
        Fish.prototype.preySpeciesArr = [this.algae]
        Shark.prototype.preySpecies = [Fish]
        Shark.prototype.preySpeciesArr = [this.fishes]

    }

    coreLoop(){
        if (this.view.gameFrame % 10 !== 0) return
        this.denizensHuntWhenHungry()
        this.denizensWithMouthsCanFindSomethingElseToEat()
        this.denizensWithMouthsEatPrey()
        this.denizensMate()
        this.fishFleeFromSharks()
        this.deleteDeadDenizens([this.fishes,this.algae,this.sharks,this.eggs,this.effects, this.crabs])
        this.reAssignDataObjs()
    }

    fishFleeFromSharks() {
        for (let i = 0; i < Object.values(this.fishes).length; i++) {
            let fish = Object.values(this.fishes)[i]
            if (fish.mating) continue
            if (fish.fleeing) continue
            this.findNearestPredator(fish, Shark)
        }

    }

    findNearestPredator(prey, predatorSpeciesClass) {
        let nearbyDenizenArray = this.view.quadtree.queryRange(new Rectangle(prey.pos[0] - 100, prey.pos[1] - 100, 200, 200 ))
        let closePredator;
        for (const nearbyDenizen of nearbyDenizenArray) {
            if (nearbyDenizen instanceof predatorSpeciesClass) {
                closePredator = nearbyDenizen
                break
            }
        }

        if (!closePredator) return

        prey.fleeing = true
        prey.fleeFromCoords = closePredator.pos

        setTimeout(() => {
            prey.fleeing = false
            prey.fleeFromCoords = []
        }, 1000)
    }

    findNearestFood(predator) {
        let nearestFoodCords = []
        let nearestFoundDistance = Infinity
        let foodId;

        let allPreyArr = []
        predator.preySpeciesArr.forEach((preyObj) => { allPreyArr = allPreyArr.concat(Object.values(preyObj)) })

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

    denizensMate() {
        let matingDenizenArr = Object.values(this.matingDenizensObj)
        for (let i = 0; i < matingDenizenArr.length; i++) {
            let bachelorFish = matingDenizenArr[i]

            let collisionArray = this.view.quadtree.queryRange(new Rectangle(bachelorFish.pos[0], bachelorFish.pos[1], bachelorFish.width, bachelorFish.height))
            let foundMate;
            for (const bumpedDenizen of collisionArray) {
                if (bachelorFish.id !== bumpedDenizen.id &&
                    bachelorFish.constructor === bumpedDenizen.constructor &&
                    bumpedDenizen.seekingMate) {
                        foundMate = bumpedDenizen
                        break
                    }
            }
            if (foundMate) {
                bachelorFish.mate(true)
                bachelorFish.seekingMate = false
                delete this.matingDenizensObj[bachelorFish.id]

                foundMate.mate()
                foundMate.seekingMate = false
                delete this.matingDenizensObj[foundMate.id]
            }
        }
    }

    denizensWithMouthsCanFindSomethingElseToEat() {
        for (let i = 0; i < this.predatorsWithMouthsArr.length; i++) {
            let predator = this.predatorsWithMouthsArr[i]
            if (!predator.hunting) continue

            let preyStillAlive;
            for (let j = 0; j < predator.preySpeciesArr.length; j++) {
                if (predator.hunting in predator.preySpeciesArr[j]) preyStillAlive = true  
                if (preyStillAlive) break    
            }

            if (preyStillAlive) continue    
            predator.hunting = false
            predator.nearestFoodCords = []
        }
    }

    denizensHuntWhenHungry() {
        while (this.hungryDenizenArr.length) {
            let hungryDenizen = this.hungryDenizenArr.pop()
            this.findNearestFood(hungryDenizen)
        }
    }


    denizensWithMouthsEatPrey() {

        for (let i = 0; i < this.predatorsWithMouthsArr.length; i++) {
            let predator = this.predatorsWithMouthsArr[i]
            if (predator.energy > predator.eatFoodThreshold) continue
            if (predator.mating) continue

            let collisionArray = this.view.quadtree.queryRange(new Rectangle(predator.mouthPos[0], predator.mouthPos[1], predator.mouthSize, predator.mouthSize))

            for (let j = 0; j < collisionArray.length; j++) {
                for (let k = 0; k < predator.preySpecies.length; k++) {
                    if (collisionArray[j] instanceof predator.preySpecies[k])  {
                        let prey = collisionArray[j]
                        if (prey.dead) continue
                        prey.dead = true
                        predator.energy = (predator.energy + prey.energyVal) > predator.maxEnergy ? predator.maxEnergy : predator.energy + prey.energyVal
                        predator.foodEaten++
                        predator.hunting = false
                        predator.afterIEatCB()
                    }
                }
            }
        }
    }

    deleteDeadDenizens(classObjArr){
        for (let classObj of classObjArr) {
            for (const [id, denizen] of Object.entries(classObj)) {
                if (denizen.dead) delete classObj[id]
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



    




    tankPopulator(objnum, className, options) {
        let denizenObj = {}

        while (objnum > 0) {
            denizenObj[className.name + objnum] = new className(objnum, this.ctx, this.canvas, this.view, this, options)
            objnum--
        }
        return denizenObj
    }

}