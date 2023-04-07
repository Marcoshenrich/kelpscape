import Algae from "../denizens/algae"
import DeadCreature from "../denizens/deadCreature"
import Otter from "../denizens/otter"
import Shark from "../denizens/shark"
import Turtle from "../denizens/turtle"
import SeaweedCluster from "../environment/seaweedCluster"
import { Rectangle } from "./quadtree"



export default class BehaviorController {
    constructor(logic) {
        this.logic = logic

        this.algaeSpawnInterval= 2000
        this.denizensSpawnInIncrements(this.algaeSpawnInterval, "algaeCount", "algae", Algae, { clustersObj: this.logic.seaweedClusters })

        this.otterDiveInterval = 10000
        this.denizensSpawnInIncrements(this.otterDiveInterval, "otterCount", "otters", Otter)

        this.clusterSpawnInterval = 10000
        this.denizensSpawnInIncrements(this.clusterSpawnInterval, "seaweedClusterCount", "seaweedClusters", SeaweedCluster, {})

        this.turtleSpawnInterval = 10000
        this.denizensSpawnInIncrements(this.turtleSpawnInterval, "turtleCount", "turtles", Turtle, {})

    }

    denizensSpawnInIncrements(timerIncrement, countName, classObjName, className, options) {
        setTimeout(() => {
            this.logic[countName]++
            this.logic[classObjName][className.name + String(this.logic[countName])] = new className(this.logic[countName], this.logic.ctx, this.logic.canvas, this.logic.view, this.logic, options)
            this.denizensSpawnInIncrements(timerIncrement, countName, classObjName, className, options)
        }, Math.floor(Math.random() * timerIncrement) + timerIncrement)
    }

    coreloop() {
        this.denizensHuntWhenHungry()
        this.denizensWithMouthsCanFindSomethingElseToEat()
        this.denizensWithMouthsEatPrey()
        this.trappersTrapPrey()
        this.denizensMate()
        this.fishFleeFromSharks()
        this.scavengersEatDeadCreatures()
    }


    denizensHuntWhenHungry() {
        while (this.logic.hungryDenizenArr.length) {
            let hungryDenizen = this.logic.hungryDenizenArr.pop()
            this.findNearestFood(hungryDenizen)
        }
    }


    findNearestFood(predator) {
    
        let nearestFoodCords = []
        let nearestFoundDistance = Infinity
        let foundFood;
        let allPreyArr = this.unpackAllPreySpecies(predator)

        for (const prey of allPreyArr) {
            let xDistance = Math.abs(predator.pos[0] - prey.pos[0])
            let yDistance = Math.abs(predator.pos[1] - prey.pos[1])

            if ((xDistance + yDistance) < nearestFoundDistance) {
                nearestFoundDistance = xDistance + yDistance
                nearestFoodCords = prey.pos
                foundFood = prey
            }
        }

        predator.hunting = foundFood
        predator.nearestFoodCords = nearestFoodCords

    }

    seagrassEatersEatSeagrass() {
        //use the hungrydenizensArr and find nearest food to get them to the seagrass, once they collide with the seagrass
        //bring them here
        for (let i = 0; i < this.logic.seagrassEaters.length; i++) {
            let seagrassEaters = this.logic.seagrassEaters[i]
            if (predator.energy > predator.eatFoodThreshold) continue
            if (predator.mating) continue
        }

    }

    unpackAllPreySpecies(denizen) {
        let allPreyArr = []
        Object.values(denizen.preySpecies).forEach((preyObj) => { allPreyArr = allPreyArr.concat(Object.values(preyObj)) })
        return allPreyArr
    }

    denizensWithMouthsCanFindSomethingElseToEat() {
        for (let i = 0; i < this.logic.predatorsWithMouthsArr.length; i++) {
            let predator = this.logic.predatorsWithMouthsArr[i]
            if (!predator.hunting) continue
            if (!(predator.hunting.id in predator.preySpecies[predator.hunting.type])) {
                predator.hunting = false
                predator.nearestFoodCords = []
            }
        }
    }

    denizensWithMouthsEatPrey() {
        for (let i = 0; i < this.logic.predatorsWithMouthsArr.length; i++) {
            let predator = this.logic.predatorsWithMouthsArr[i]
            if (predator.energy > predator.eatFoodThreshold) continue
            if (predator.mating) continue

            let collisionArray = this.logic.view.quadtree.findOverlaps(new Rectangle(predator.mouthPos[0], predator.mouthPos[1], predator.mouthSize, predator.mouthSize), "overlaps", predator)

            for (const prey of collisionArray) {
                if (predator.preySpecies[prey.type]) {
                    if (prey.type === "Seaweed") {
                        predator.eatingSeagrass = true
                        predator.hunting = prey
                        continue
                    }
                    if (prey.dead) continue
                    prey.dead = true
                    this.logic.recentlyDeadDenizens.push(prey)
                    predator.energy = (predator.energy + prey.energyVal) > predator.maxEnergy ? predator.maxEnergy : predator.energy + prey.energyVal
                    predator.foodEaten++
                    predator.hunting = false
                    predator.afterIEatCB()
                }   
            }
        }
    }

    trappersTrapPrey() {
        for (let i = 0; i < this.logic.trappersArr.length; i++) {
            let trapper = this.logic.trappersArr[i]
            if (trapper.trappedPrey) continue
            if (trapper.mating) continue

            let collisionArray = this.logic.view.quadtree.findOverlaps(new Rectangle(trapper.trapPos[0], trapper.trapPos[1], trapper.trapWidth, trapper.trapHeight), "fullyOverlaps", trapper)

            for (const prey of collisionArray) {
                if (trapper.preySpecies[prey.type]) {
                    if (prey.dead) continue
                    prey.trapped = trapper.trapPos
                    prey.trappedPosDelta = [trapper.trapPos[0] - prey.pos[0], trapper.trapPos[1] - prey.pos[1]]
                    trapper.trappedPrey = prey
                    trapper.afterITrapCB()
                }
            }
        }
    }

    denizensMate() {
        let matingDenizenArr = Object.values(this.logic.matingDenizensObj)
        for (let i = 0; i < matingDenizenArr.length; i++) {
            let bachelorFish = matingDenizenArr[i]

            let collisionArray = this.logic.view.quadtree.findOverlaps(new Rectangle(bachelorFish.pos[0], bachelorFish.pos[1], bachelorFish.width, bachelorFish.height), "contains", bachelorFish)
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
                delete this.logic.matingDenizensObj[bachelorFish.id]

                foundMate.mate()
                foundMate.seekingMate = false
                delete this.logic.matingDenizensObj[foundMate.id]
            }
        }
    }

    fishFleeFromSharks() {
        let allFish = [...Object.values(this.logic.garabaldi), ...Object.values(this.logic.garabaldiBabies), ...Object.values(this.logic.bass), ...Object.values(this.logic.bassBabies)]
        for (let i = 0; i < allFish.length; i++) {
            let fish = allFish[i]
            if (fish.mating) continue
            if (fish.fleeing) continue
            this.findNearestPredator(fish, Shark)
        }

    }

    findNearestPredator(prey, predatorSpeciesClass) {
        let nearbyDenizenArray = this.logic.view.quadtree.findOverlaps(new Rectangle(prey.pos[0] - 100, prey.pos[1] - 100, 200, 200), "overlaps", prey)
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

    scavengersEatDeadCreatures() {
        for (let i = 0; i < this.logic.scavengersArr.length; i++) {
            let scavenger = this.logic.scavengersArr[i]
            if (scavenger.scavenging) continue
            if (scavenger.mating) continue

            let collisionArray = this.logic.view.quadtree.findOverlaps(new Rectangle(scavenger.pos[0], scavenger.pos[1], scavenger.width, scavenger.height), "overlaps", scavenger)

            for (let j = 0; j < collisionArray.length; j++) {
                if (!(collisionArray[j] instanceof DeadCreature)) continue
                let deadCreature = collisionArray[j]
                scavenger.scavenging = deadCreature
                scavenger.speed = 0
            }
        }
    }



}