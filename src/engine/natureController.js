
import FishBaby from "../denizens/Fishes/fishbaby"
import Fish from "../denizens/Fishes/fish"
import SeaUrchin from "../denizens/seaurchin"
import Algae from "../denizens/algae"
import Garabaldi from "../denizens/Fishes/garabaldi"
import GarabaldiBaby from "../denizens/Fishes/garabaldiBaby"
import Shark from "../denizens/shark"
import Effect from "../denizens/effect"
import Fishegg from "../denizens/Fishes/fishegg"
import SeaweedCluster from "../environment/seaweedCluster"
import Seaweed from "../environment/seaweed"
import CrabBaby from "../denizens/crabbaby"
import Crab from "../denizens/crab"
import Rock from "../environment/rock"
import DeadCreature from "../denizens/deadCreature"
import Jellyfish from "../denizens/jellyfish"
import Otter from "../denizens/otter"
import Turtle from "../denizens/turtle"
import TextBox from "./textbox"
import BassBaby from "../denizens/Fishes/bassBaby"
import Bass from "../denizens/Fishes/bass"
import Polyp from "../denizens/polyp"
import { rand } from "./utils"
import Rockfish from "../denizens/Fishes/rockfish"
import RockfishBaby from "../denizens/Fishes/rockfishbaby"


export default class NatureController {
    constructor(logic) {

        this.logic = logic
        this.algaeSpawnInterval= 1200
        // this.algaeSpawnInterval = 5
        this.denizensSpawnInIncrements(this.algaeSpawnInterval, "algaeCount", "algae", Algae, { clustersObj: this.logic.seaweedClusters })

        this.otterDiveInterval = 1000
        this.denizensSpawnInIncrements(this.otterDiveInterval, "otterCount", "otters", Otter)

        this.clusterSpawnInterval = 20000
        // this.clusterSpawnInterval = 1000
        this.denizensSpawnInIncrements(this.clusterSpawnInterval, "seaweedClusterCount", "seaweedClusters", SeaweedCluster, {})

        this.turtleSpawnInterval = 20000
        this.denizensSpawnInIncrements(this.turtleSpawnInterval, "turtleCount", "turtles", Turtle, {})

        
    }

    coreloop () {
        //does not account for when a cluster is destroyed by the last bit being eaten
        //frankly that doesn't happen yet anyway
        this.seaweedFinder()
    }

    seaweedFinder() {
        if (!this.logic.seaweedClusters) return
        Object.values(this.logic.seaweedClusters).forEach((seaweedCluster) => {
            this.logic.seaweedSpots[(seaweedCluster.pos[0]) + rand(-10, 0)] = seaweedCluster
        })
    }

    denizensSpawnInIncrements(timerIncrement, countName, classObjName, className, options) {
        setTimeout(() => {
            this.logic[countName]++
            this.logic[classObjName][className.name + String(this.logic[countName])] = new className(this.logic[countName], this.logic.ctx, this.logic.canvas, this.logic.view, this.logic, options)
            this.denizensSpawnInIncrements(timerIncrement, countName, classObjName, className, options)
        }, Math.floor(Math.random() * timerIncrement) + timerIncrement)
    }


    assignFoodWeb() {
        Garabaldi.prototype.preySpecies =
        {
            "Algae": this.logic.algae
        }

        GarabaldiBaby.prototype.preySpecies =
        {
            "Algae": this.logic.algae
        }

        Rockfish.prototype.preySpecies =
        {
            "Algae": this.logic.algae,
            "GarabaldiBaby": this.logic.garabaldiBabies,
            "CrabBaby": this.logic.crabBabies,
        }

        RockfishBaby.prototype.preySpecies =
        {
            "Algae": this.logic.algae
        }

        Bass.prototype.preySpecies =
        {
            "RockfishBaby": this.logic.rockfishBabies,
            "GarabaldiBaby": this.logic.garabaldiBabies,
            "CrabBaby": this.logic.crabBabies,
        }

        BassBaby.prototype.preySpecies =
        {
            "Algae": this.logic.algae
        }

        Shark.prototype.preySpecies = {
            "Garabaldi": this.logic.garabaldi,
            "GarabaldiBaby": this.logic.garabaldiBabies,
            "Bass": this.logic.bass,
            "BassBaby": this.logic.bassBabies,
            "Turtle": this.logic.turtles
        }

        Crab.prototype.preySpecies =
        {
            "GarabaldiBaby": this.logic.garabaldiBabies,
            "BassBaby": this.logic.bassBabies
        }

        Jellyfish.prototype.preySpecies =
        {
            "GarabaldiBaby": this.logic.garabaldiBabies,
            "BassBaby": this.logic.bassBabies,
            "FishEgg": this.logic.eggs
        }

        Otter.prototype.preySpecies =
        {
            "Crab": this.logic.crabs,
            "CrabBaby": this.logic.crabBabies,
            "SeaUrchin": this.logic.seaUrchins
        }

        Turtle.prototype.preySpecies =
        {
            "Seaweed": this.logic.seaweed,
            "Jellyfish": this.logic.jellyfish
        }
    }

    assignSpeciesObjects() {
        Garabaldi.prototype.speciesObject = this.logic.garabaldi
        GarabaldiBaby.prototype.speciesObject = this.logic.garabaldiBabies
        Rockfish.prototype.speciesObject = this.logic.rockfish
        RockfishBaby.prototype.speciesObject = this.logic.rockfishBabies
        Bass.prototype.speciesObject = this.logic.bass
        BassBaby.prototype.speciesObject = this.logic.bassBabies
        Algae.prototype.speciesObject = this.logic.algae
        Shark.prototype.speciesObject = this.logic.sharks
        Fishegg.prototype.speciesObject = this.logic.eggs
        Effect.prototype.speciesObject = this.logic.effects
        SeaweedCluster.prototype.speciesObject = this.logic.seaweedClusters
        DeadCreature.prototype.speciesObject = this.logic.deadCreatures
        Jellyfish.prototype.speciesObject = this.logic.jellyfish
        Crab.prototype.speciesObject = this.logic.crabs
        CrabBaby.prototype.speciesObject = this.logic.crabBabies
        Otter.prototype.speciesObject = this.logic.otters
        SeaUrchin.prototype.speciesObject = this.logic.seaUrchins
        Turtle.prototype.speciesObject = this.logic.turtles
        Seaweed.prototype.speciesObject = this.logic.seaweed
        Polyp.prototype.speciesObject = this.logic.polyps
    }

}