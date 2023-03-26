import Input from "./input"
import { Rectangle } from "./quadtree"
import FishBaby from "../denizens/fishbaby"
import Algae from "../denizens/algae"
import Fish from "../denizens/fish"
import Shark from "../denizens/shark"
import Effect from "../denizens/effect"
import Fishegg from "../denizens/fishegg"
import SeaweedCluster from "../environment/seaweedCluster"
import CrabBaby from "../denizens/crabbaby"
import Crab from "../denizens/crab"
import Rock from "../environment/rock"
import DeadCreature from "../denizens/deadCreature"
import Jellyfish from "../denizens/jellyfish"


export default class Logic {

    constructor(ctx, canvas, view) {

        this.input = new Input()
        this.ctx = ctx
        this.canvas = canvas
        this.view = view

        this.fishCount = 40
        this.fishBabyCount = 0
        this.algaeCount = 100
        this.sharkCount = 2
        this.eggCount = 0
        this.effectCount = 0
        this.seaweedClusterCount = 15
        this.deadCreatureCount = 0
        this.crabCount = 10
        this.crabBabyCount = 0
        this.jellyfishCount = 50
        this.rockCount = 20

        this.fishes = this.tankPopulator(this.fishCount, Fish)
        this.fishBabies = {}
        this.algae = this.tankPopulator(this.algaeCount, Algae)
        this.sharks = this.tankPopulator(this.sharkCount, Shark)
        this.eggs = {}
        this.effects = this.tankPopulator(0, Effect)
        this.seaweedClusters = this.tankPopulator(this.seaweedClusterCount, SeaweedCluster)
        this.deadCreatures = {}
        this.crabs = this.tankPopulator(this.crabCount, Crab)
        this.crabBabies = {}
        this.jellyfish = this.tankPopulator(this.jellyfishCount, Jellyfish)
        this.rocks = this.tankPopulator(this.rockCount, Rock)

        this.algaeSpawnIncrement = 2000
        this.algaeSpawns()
        
        this.hungryDenizenArr = []
        this.assignFoodWeb()
        this.assignSpeciesObjects() 

        this.matingDenizensObj = {}

        this.predatorsWithMouthsArr = [...Object.values(this.fishBabies), ...Object.values(this.fishes), ...Object.values(this.sharks)]
        this.scavengersArr = [...Object.values(this.crabs), ...Object.values(this.crabBabies)]
        this.trappersArr = [...Object.values(this.crabs)]
        this.recentlyDeadDenizens = []

    }

    spawnDenizen(parentDenizen) {
        switch(parentDenizen.constructor) {
            case Fish:
                this.eggCount += 1
                this.eggs["Fishegg" + this.eggCount] = new Fishegg(this.eggCount, this.ctx, this.canvas, this.view, this, [Math.floor(parentDenizen.pos[0]), Math.floor(parentDenizen.pos[1])])
                break
            case FishBaby:
                this.fishCount += 1
                this.fishes["Fish" + this.fishCount] = new Fish(this.fishCount, this.ctx, this.canvas, this.view, this, [parentDenizen.pos[0], parentDenizen.pos[1]])
                break
            case Crab:
                this.crabBabyCount += 1
                this.crabBabies["CrabBaby" + this.crabBabyCount] = new CrabBaby(this.crabBabyCount, this.ctx, this.canvas, this.view, this, [Math.floor(parentDenizen.pos[0]), Math.floor(parentDenizen.pos[1])])
                break
            case CrabBaby:
                this.crabCount += 1
                this.crabs["Crab" + this.fishCount] = new Crab(this.crabCount, this.ctx, this.canvas, this.view, this, [parentDenizen.pos[0], parentDenizen.pos[1]])
                break
        }
    }

    denizenCorpse(deadDenizen) {
        this.deadCreatureCount++
        this.deadCreatures["DeadCreature" + this.deadCreatureCount] = new DeadCreature(this.deadCreatureCount, this.ctx, this.canvas, this.view, this, deadDenizen.pos, deadDenizen)
    }




    trappersTrapFishAndEggs() {
        for (let i = 0; i < this.trappersArr.length; i++) {	
            let trapper = this.trappersArr[i]
            if (trapper.trappedPrey) continue
            if (trapper.mating) continue

            let collisionArray = this.view.quadtree.findOverlaps(new Rectangle(trapper.trapPos[0], trapper.trapPos[1], trapper.trapWidth, trapper.trapHeight), trapper)

            // pretty inneficient -> should look up predators directly
            for (let j = 0; j < collisionArray.length; j++) {
                let prey = collisionArray[j]
                for (let k = 0; k < trapper.preySpecies.length; k++) {
                    if (prey instanceof trapper.preySpecies[k]) {
                        if (prey.dead) continue
                        prey.trapped = trapper
                        prey.trappedPosDelta = [trapper.pos[0] - prey.pos[0], trapper.pos[1] - prey.pos[1]]
                        trapper.trappedPrey = prey
                    }
                }
            }
        }
    }

    reAssignDataObjs() {
        this.predatorsWithMouthsArr = [...Object.values(this.fishBabies),...Object.values(this.fishes), ...Object.values(this.sharks)]
        this.scavengersArr = [...Object.values(this.crabs), ...Object.values(this.crabBabies)]
    }

    
    assignFoodWeb() {
        Fish.prototype.preySpecies = [Algae]
        Fish.prototype.preySpeciesArr = [this.algae]
        FishBaby.prototype.preySpecies = [Algae]
        FishBaby.prototype.preySpeciesArr = [this.algae]
        Shark.prototype.preySpecies = [Fish, FishBaby]
        Shark.prototype.preySpeciesArr = [this.fishes, this.fishBabies]
        Crab.prototype.preySpecies = [FishBaby]
        Crab.prototype.preySpeciesArr = [this.fishBabies]
    }

    assignSpeciesObjects() {
        Fish.prototype.speciesObject = this.fishes
        FishBaby.prototype.speciesObject = this.fishBabies
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
        this.trappersTrapFishAndEggs()
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

            let collisionArray = this.view.quadtree.findOverlaps(new Rectangle(scavenger.pos[0], scavenger.pos[1], scavenger.width, scavenger.height), scavenger)
       
            for (let j = 0; j < collisionArray.length; j++) {

                if (!(collisionArray[j] instanceof DeadCreature)) continue
                let deadCreature = collisionArray[j]
                scavenger.scavenging = deadCreature
                scavenger.speed = 0
            }
        }
    }

    fishFleeFromSharks() {
        let allFish = [...Object.values(this.fishes), ...Object.values(this.fishBabies)]
        for (let i = 0; i < allFish.length; i++) {
            let fish = allFish[i]
            if (fish.mating) continue
            if (fish.fleeing) continue
            this.findNearestPredator(fish, Shark)
        }

    }

    findNearestPredator(prey, predatorSpeciesClass) {
        let nearbyDenizenArray = this.view.quadtree.findOverlaps(new Rectangle(prey.pos[0] - 100, prey.pos[1] - 100, 200, 200 ), prey)
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

            let collisionArray = this.view.quadtree.findOverlaps(new Rectangle(predator.mouthPos[0], predator.mouthPos[1], predator.mouthSize, predator.mouthSize), predator)

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
            delete deadDenizen.speciesObject[deadDenizen.id]
        }
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