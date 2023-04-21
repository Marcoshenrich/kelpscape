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

            let collisionArray = this.logic.view.quadtree.queryRange(new Rectangle(predator.mouthEater.mouthPos[0], predator.mouthEater.mouthPos[1], predator.mouthEater.mouthWidth, predator.mouthEater.mouthHeight), "overlaps", predator)

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
            let trapperDenizen = this.logic.trappersArr[i]
            let trap = trapperDenizen.trapper
            if (trapperDenizen.trappedPrey) continue
            if (trapperDenizen.mating) continue

            let collisionArray = this.logic.view.quadtree.queryRange(new Rectangle(trap.trapPos[0], trap.trapPos[1], trap.trapWidth, trap.trapHeight), "fullyOverlaps", trapperDenizen)

            for (const prey of collisionArray) {
                if (trapperDenizen.preySpecies[prey.type]) {
                    if (prey.dead) continue
                    prey.trapped = trap.trapPos
                    prey.trappedPosDelta = [trap.trapPos[0] - prey.pos[0], trap.trapPos[1] - prey.pos[1]]
                    trapperDenizen.trappedPrey = prey
                    trapperDenizen.afterITrapCB()
                }
            }
        }
    }

    // trappersTrapPrey() {
    //     for (let i = 0; i < this.logic.trappersArr.length; i++) {
    //         let trapper = this.logic.trappersArr[i]
    //         if (trapper.trappedPrey) continue
    //         if (trapper.mating) continue

    //         let collisionArray = this.logic.view.quadtree.queryRange(new Rectangle(trapper.trapPos[0], trapper.trapPos[1], trapper.trapWidth, trapper.trapHeight), "fullyOverlaps", trapper)

    //         for (const prey of collisionArray) {
    //             if (trapper.preySpecies[prey.type]) {
    //                 if (prey.dead) continue
    //                 prey.trapped = trapper.trapPos
    //                 prey.trappedPosDelta = [trapper.trapPos[0] - prey.pos[0], trapper.trapPos[1] - prey.pos[1]]
    //                 trapper.trappedPrey = prey
    //                 trapper.afterITrapCB()
    //             }
    //         }
    //     }
    // }

    denizensMate() {
        let matingDenizenArr = Object.values(this.logic.matingDenizensObj)
        for (let i = 0; i < matingDenizenArr.length; i++) {
            let bachelorFish = matingDenizenArr[i]

            let collisionArray = this.logic.view.quadtree.queryRange(new Rectangle(bachelorFish.pos[0], bachelorFish.pos[1], bachelorFish.width, bachelorFish.height), "contains", bachelorFish)
            let foundMate;

            for (const bumpedDenizen of collisionArray) {
                if (bachelorFish.constructor === bumpedDenizen.constructor &&
                    bumpedDenizen.mater.seekingMate) {
                    foundMate = bumpedDenizen
                    break
                }
            }
            if (foundMate) {
                bachelorFish.mate(true)
                bachelorFish.mater.seekingMate = false
                delete this.logic.matingDenizensObj[bachelorFish.id]

                foundMate.mate()
                foundMate.mater.seekingMate = false
                delete this.logic.matingDenizensObj[foundMate.id]
            }
        }
    }

    fishFleeFromSharks() {
        let allFish = [...Object.values(this.logic.garabaldi), ...Object.values(this.logic.garabaldiBabies), ...Object.values(this.logic.bass), ...Object.values(this.logic.bassBabies), ...Object.values(this.logic.garabaldiBabies), ...Object.values(this.logic.rockfish), ...Object.values(this.logic.rockfishBabies)]
        for (let i = 0; i < allFish.length; i++) {
            let fish = allFish[i]
            if (fish.mating) continue
            if (fish.fleeing) continue
            this.findNearestPredator(fish, Shark)
        }

    }

    findNearestPredator(prey, predatorSpeciesClass) {
        let nearbyDenizenArray = this.logic.view.quadtree.queryRange(new Rectangle(prey.pos[0] - 100, prey.pos[1] - 100, 200, 200), "overlaps", prey)
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

            let collisionArray = this.logic.view.quadtree.queryRange(new Rectangle(scavenger.pos[0], scavenger.pos[1], scavenger.width, scavenger.height), "overlaps", scavenger)

            for (let j = 0; j < collisionArray.length; j++) {
                if (!(collisionArray[j] instanceof DeadCreature)) continue
                let deadCreature = collisionArray[j]
                scavenger.scavenging = deadCreature
                scavenger.speed = 0
            }
        }
    }



}