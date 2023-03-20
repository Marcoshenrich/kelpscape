import Fish from "./fish"
import Algae from "./algae"
import Shark from "./shark"
import Effect from "./effect"
import Input from "./input"
import SeaweedCluster from "./seaweedCluster"
import Crab from "./crab"
import { Rectangle } from "./quadtree"
import DeadCreature from "./deadCreature"
import Fishegg from "./fishegg"


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
        this.crabCount = 10

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
        this.assignSpeciesObjects() 

        this.matingDenizensObj = {}

        this.predatorsWithMouthsArr = [...Object.values(this.fishes), ...Object.values(this.sharks)]
        this.scavengersArr = [...Object.values(this.crabs)]
        this.recentlyDeadDenizens = []

    }

    reAssignDataObjs() {
        this.predatorsWithMouthsArr = [...Object.values(this.fishes), ...Object.values(this.sharks)]
        this.scavengersArr = [...Object.values(this.crabs)]
    }


    assignFoodWeb() {
        Fish.prototype.preySpecies = [Algae]
        Fish.prototype.preySpeciesArr = [this.algae]
        Shark.prototype.preySpecies = [Fish]
        Shark.prototype.preySpeciesArr = [this.fishes]
        Crab.prototype.preySpecies = [DeadCreature]
        Crab.prototype.preySpeciesArr = [this.deadCreatures]
    }

    assignSpeciesObjects() {
        Fish.prototype.speciesObject = this.fishes
        Algae.prototype.speciesObject = this.algae
        Shark.prototype.speciesObject = this.sharks
        Fishegg.prototype.speciesObject = this.eggs
        Effect.prototype.speciesObject = this.effects
        SeaweedCluster.prototype.speciesObject = this.seaweedClusters
        DeadCreature.prototype.speciesObject = this.deadCreatures
        Crab.prototype.speciesObject = this.crabs
    }

    coreLoop(){
        // if (this.view.gameFrame % 10 !== 0) return
        this.denizensHuntWhenHungry()
        this.denizensWithMouthsCanFindSomethingElseToEat()
        this.denizensWithMouthsEatPrey()
        this.denizensMate()
        this.fishFleeFromSharks()
        this.scavengersEatDeadCreatures()
        // this.deadCreatureDebugLoop()
        this.deleteDeadDenizens()

        this.reAssignDataObjs()
    }

    scavengersEatDeadCreatures() {
        for (let i = 0; i < this.scavengersArr.length; i++) {
            let scavenger = this.scavengersArr[i]
            if (scavenger.scavenging) continue
            if (scavenger.mating) continue

            let collisionArray = this.view.quadtree.queryRange(new Rectangle(scavenger.pos[0], scavenger.pos[1], scavenger.width, scavenger.height), scavenger)
       
            for (let j = 0; j < collisionArray.length; j++) {

                if (!(collisionArray[j] instanceof DeadCreature)) continue
                let deadCreature = collisionArray[j]
                scavenger.scavenging = deadCreature
                scavenger.speed = 0
            }
        }
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
        let nearbyDenizenArray = this.view.quadtree.queryRange(new Rectangle(prey.pos[0] - 100, prey.pos[1] - 100, 200, 200 ), prey)
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

            let collisionArray = this.view.quadtree.queryRange(new Rectangle(bachelorFish.pos[0], bachelorFish.pos[1], bachelorFish.width, bachelorFish.height), bachelorFish)
            let foundMate;
            for (const bumpedDenizen of collisionArray) {
                if (bachelorFish.constructor === bumpedDenizen.constructor &&
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
                if (predator.hunting in predator.preySpeciesArr[j]) {
                    preyStillAlive = true  
                    break
                }
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

            let collisionArray = this.view.quadtree.queryRange(new Rectangle(predator.mouthPos[0], predator.mouthPos[1], predator.mouthSize, predator.mouthSize), predator)

            // pretty inneficient -> should look up predators directly
            for (let j = 0; j < collisionArray.length; j++) {
                for (let k = 0; k < predator.preySpecies.length; k++) {
                    if (collisionArray[j] instanceof predator.preySpecies[k])  {
                        let prey = collisionArray[j]

                        if (prey.dead) continue
                        prey.dead = true
                        this.recentlyDeadDenizens.push(prey)
                        predator.energy = (predator.energy + prey.energyVal) > predator.maxEnergy ? predator.maxEnergy : predator.energy + prey.energyVal
                        predator.foodEaten++
                        predator.hunting = false
                        predator.afterIEatCB()
                    }
                }
            }
        }
    }

    deleteDeadDenizens(){
        while (this.recentlyDeadDenizens.length) {
            let deadDenizen = this.recentlyDeadDenizens.pop()
            deadDenizen.clearCallbacksOnDeath()
            console.log(deadDenizen)
            console.log(deadDenizen.speciesObject)
            delete deadDenizen.speciesObject[deadDenizen.id]
        }
        
        // for (let classObj of classObjArr) {

        //     for (const [id, denizen] of Object.entries(classObj)) {
        //         if (denizen.dead) {
        //             denizen.clearCallbacksOnDeath()
        //             delete classObj[id]
        //         }
        //     }
        // }
    }



    algaeSpawns() {
        setTimeout(()=>{
            this.algaeCount++
            this.algae["Algae" + this.algaeCount] = new Algae(this.algaeCount, this.ctx, this.canvas, this.view, this)
            this.algaeSpawns()
        }, Math.floor(Math.random() * this.algaeSpawnIncrement) + this.algaeSpawnIncrement)
    }



    deadCreatureDebugLoop() {
        for (let i = 0; i < Object.values(this.deadCreatures).length; i++) {
            let deadc = Object.values(this.deadCreatures)[i]
            let collisionArray = this.view.quadtree.queryRange(new Rectangle(deadc.pos[0], deadc.pos[1], deadc.width, deadc.height), deadc)
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