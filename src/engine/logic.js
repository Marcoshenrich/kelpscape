import { Rectangle } from "./quadtree"
import FishBaby from "../denizens/fishbaby"
import Algae from "../denizens/algae"
import Fish from "../denizens/fish"
import Shark from "../denizens/shark"
import Effect from "../denizens/effect"
import Fishegg from "../denizens/fishegg"
import SeaweedCluster from "../environment/seaweedCluster"
import Seaweed from "../environment/seaweed"
import CrabBaby from "../denizens/crabbaby"
import Crab from "../denizens/crab"
import Rock from "../environment/rock"
import DeadCreature from "../denizens/deadCreature"
import Jellyfish from "../denizens/jellyfish"
import Otter from "../denizens/otter"
import SeaUrchin from "../denizens/seaurchin"
import Turtle from "../denizens/turtle"
import TextBox from "./textbox"


export default class Logic {

    constructor(ctx, canvas, view) {
        this.ctx = ctx
        this.canvas = canvas
        this.view = view

        this.scoreTrackObj = {
            "Fish": false,
            "Crab": false,
            "Algae": false,
            "Shark": false,
            "Jellyfish": false,
            "Otter": false,
            "Turtle": false,
            "Sea Urchin": false,
            "Fish Egg": false,
            "Corpse": false,
        }

        this.textContentObj = {
            "Fish": new TextBox(ctx, canvas, view, this, "Fish","The Garibaldi (Hypsypops rubicundus) is a brightly-colored fish that is native to the rocky reefs and kelp forests of the eastern Pacific Ocean. Their bright orange coloration serves as a warning to potential predators that they are venomous, thanks to a coating of mucus on their skin. Garibaldi are also known for their courtship behavior, during which the male will dig a circular depression in the sand or gravel and aggressively guard it from other fish, enticing females to lay their eggs in the nest. These fish are an important part of the kelp forest ecosystem, feeding on small invertebrates and algae, and providing food for larger predators such as sea lions and sharks. Despite being protected in some areas, Garibaldi populations are threatened by overfishing and habitat destruction.", "garabaldi.jpeg"),
            "Algae": new TextBox(ctx, canvas, view, this, "Algae", "Algae are some of the most important organisms in the Pacific kelp forest ecosystem. One of the most iconic species is giant kelp (Macrocystis pyrifera), which can grow up to 100 feet tall and forms dense underwater forests. Giant kelp is a type of brown algae that provides a habitat for a variety of marine life, from small invertebrates to large fish and sea mammals. Another important type of algae is the red algae, which includes species like coralline algae and rhodophytes. These algae provide a source of food and shelter for a variety of organisms in the kelp forest, and can also play an important role in regulating the pH of the ocean. While algae may not be as charismatic as some of the larger animals in the kelp forest, they are an essential component of this complex ecosystem, and help to support a diverse community of marine life.", "algae.webp"),
            "Jellyfish": new TextBox(ctx, canvas, view, this, "jellyfish", "Several species of jellyfish can be found in the Pacific kelp forest, including the lion's mane jellyfish (Cyanea capillata) and the moon jellyfish (Aurelia aurita). These cnidarians are well-adapted to life in the ocean, with their gelatinous bodies and trailing tentacles. While they may seem harmless, some jellyfish species in the kelp forest can deliver a painful sting to humans, making it important to observe them from a safe distance. Despite their somewhat fearsome reputation, jellyfish play a crucial role in the kelp forest ecosystem, feeding on small planktonic organisms and providing food for larger predators such as sea turtles and birds. The moon jellyfish is particularly interesting, as it has a unique way of navigating the ocean - it can sense the Earth's magnetic field and use it to orient itself in the water.", "jellyfish.jpeg"),
            "Otter": new TextBox(ctx, canvas, view, this, "Otter", "The sea otter (Enhydra lutris) is a crucial player in maintaining the health of the kelp forest. These adorable creatures are known for their love of shellfish, which they crack open with rocks using their impressive dexterity. Sea otters also play an important role in keeping the kelp forests healthy. They feed on sea urchins, which can overgraze kelp if left unchecked. Sea otters are one of the few animals that use tools, and they have even been known to hold hands while sleeping to keep from drifting away from each other. Sadly, sea otters were hunted to near extinction for their fur in the 18th and 19th centuries, but conservation efforts have helped their populations rebound in some areas.", "sea_otter.webp"),
            
            "Crab": new TextBox(ctx, canvas, view, this, "Crab", "Crabs are a common sight in the Pacific kelp forest, where they play an important role in the ecosystem. One of the most well-known species is the Dungeness crab (Metacarcinus magister), which is prized by humans for its sweet, tender meat. Dungeness crabs can be found in shallow waters and prefer to feed on small fish and crustaceans, but will also eat kelp and other algae if food is scarce. Another common species is the graceful kelp crab (Pugettia gracilis), which is named for its slender legs and preference for living among the kelp fronds. These crabs are expert at camouflaging themselves among the kelp, making them difficult to spot. Crabs are important predators in the kelp forest, helping to control the populations of smaller invertebrates, and are themselves preyed upon by larger predators such as sea otters and seals.", "crab.jpeg"),
            "Rock": new TextBox(ctx, canvas, view, this, "Rock", "Congratulations, you clicked on a rock. This was very insightful and brave. Most people would just ignore the rock and say “no reason to click on any rocks.” Not you. You’ll click on rocks all day. No stone left unturned, as your dad used to say.", "rock.jpeg"),
            "Shark": new TextBox(ctx, canvas, view, this, "", "", ""),
            "Turtle": new TextBox(ctx, canvas, view, this, "", "", ""),
            "Sea Urchin": new TextBox(ctx, canvas, view, this, "", "", ""),
            "Fish Egg": new TextBox(ctx, canvas, view, this, "", "", ""),
            "Corpse": new TextBox(ctx, canvas, view, this, "", "", ""),
        }

        this.fishCount = 8
        this.fishBabyCount =  4
        this.algaeCount = 100
        this.sharkCount = 2
        this.eggCount = 0
        this.effectCount = 0
        this.turtleCount = 1
        this.seaweedClusterCount = 15
        this.deadCreatureCount = 0
        this.crabCount = 10
        this.crabBabyCount = 0
        this.jellyfishCount = 50
        this.rockCount = 20
        this.otterCount = 0
        this.seaUrchinCount = 0

        this.fishes = this.tankPopulator(this.fishCount, Fish)
        this.fishBabies = this.tankPopulator(this.fishBabyCount, FishBaby)
        this.algae = this.tankPopulator(this.algaeCount, Algae)
        this.sharks = this.tankPopulator(this.sharkCount, Shark)
        this.eggs = this.tankPopulator(this.eggCount, Fishegg)
        this.effects = this.tankPopulator(this.effectCount, Effect)
        this.turtles = this.tankPopulator(this.turtleCount, Turtle)
        this.seaUrchins = this.tankPopulator(this.seaUrchinCount, SeaUrchin)
        this.seaweedClusters = this.tankPopulator(this.seaweedClusterCount, SeaweedCluster)
        this.deadCreatures = {}
        this.crabs = this.tankPopulator(this.crabCount, Crab)
        this.crabBabies = this.tankPopulator(this.crabBabyCount, CrabBaby)
        this.jellyfish = this.tankPopulator(this.jellyfishCount, Jellyfish)
        this.rocks = this.tankPopulator(this.rockCount, Rock)
        this.otters = {}
        

        this.algaeSpawnIncrement = 2000
        this.algaeSpawns()

        this.otterDiveIncrement = 10000
        this.ottersDiveSometimes()
        
        this.hungryDenizenArr = []
        this.assignFoodWeb()
        this.assignSpeciesObjects() 

        this.matingDenizensObj = {}

        this.predatorsWithMouthsArr = [...Object.values(this.fishBabies), ...Object.values(this.fishes), ...Object.values(this.sharks)]
        this.scavengersArr = [...Object.values(this.crabs), ...Object.values(this.crabBabies)]
        this.trappersArr = [...Object.values(this.crabs), ...Object.values(this.jellyfish), ...Object.values(this.otters)]
        this.recentlyDeadDenizens = []

    }

    ottersDiveSometimes() {
        setTimeout(() => {
            // console.log("new otter")
            this.otterCount++
            this.otters["Otter" + this.otterCount] = new Otter(this.otterCount, this.ctx, this.canvas, this.view, this)
            this.ottersDiveSometimes()
        }, Math.floor(Math.random() * this.otterDiveIncrement) + this.otterDiveIncrement)
    }

    spawnDenizen(parentDenizen) {
        switch(parentDenizen.constructor) {
            case Fish:
                this.eggCount += 1
                this.eggs["Fishegg" + this.eggCount] = new Fishegg(this.eggCount, this.ctx, this.canvas, this.view, this, [Math.floor(parentDenizen.pos[0]), Math.floor(parentDenizen.pos[1])])
                break
            case Fishegg:
                this.fishBabyCount += 1
                this.fishBabies["FishBaby" + this.fishBabyCount] = new FishBaby(this.fishBabyCount, this.ctx, this.canvas, this.view, this, [Math.floor(parentDenizen.pos[0]), Math.floor(parentDenizen.pos[1])])
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
                this.crabs["Crab" + this.crabCount] = new Crab(this.crabCount, this.ctx, this.canvas, this.view, this, [parentDenizen.pos[0], parentDenizen.pos[1]])
                break
            case Seaweed:
                this.seaUrchinCount += 1
                this.seaUrchins["SeaUrchin" + this.seaUrchinCount] = new SeaUrchin(this.seaUrchinCount, this.ctx, this.canvas, this.view, this, [parentDenizen.pos[0], parentDenizen.pos[1]])
                break
        }
    }

    denizenCorpse(deadDenizen) {
        this.deadCreatureCount++
        this.deadCreatures["DeadCreature" + this.deadCreatureCount] = new DeadCreature(this.deadCreatureCount, this.ctx, this.canvas, this.view, this, deadDenizen.pos, deadDenizen)
    }




    trappersTrapPrey() {
        for (let i = 0; i < this.trappersArr.length; i++) {	
            let trapper = this.trappersArr[i]
            if (trapper.trappedPrey) continue
            if (trapper.mating) continue

            let collisionArray = this.view.quadtree.findOverlaps(new Rectangle(trapper.trapPos[0], trapper.trapPos[1], trapper.trapWidth, trapper.trapHeight),"fullyOverlaps", trapper)

            // pretty inneficient -> should look up predators directly
            for (let j = 0; j < collisionArray.length; j++) {
                let prey = collisionArray[j]
                for (let k = 0; k < trapper.preySpecies.length; k++) {
                    if (prey instanceof trapper.preySpecies[k]) {
                        if (prey.dead) continue
                        
                        prey.trapped = trapper.trapPos
                        prey.trappedPosDelta = [trapper.trapPos[0] - prey.pos[0], trapper.trapPos[1] - prey.pos[1]]
                        trapper.trappedPrey = prey
                        trapper.afterITrapCB()
                    }
                }
            }
        }
    }

    reAssignDataObjs() {
        this.predatorsWithMouthsArr = [...Object.values(this.fishBabies),...Object.values(this.fishes), ...Object.values(this.sharks)]
        this.scavengersArr = [...Object.values(this.crabs), ...Object.values(this.crabBabies)]
        this.trappersArr = [...Object.values(this.crabs), ...Object.values(this.jellyfish), ...Object.values(this.otters)]
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
        Jellyfish.prototype.preySpecies = [FishBaby, Fishegg]
        Jellyfish.prototype.preySpeciesArr = [this.fishBabies, this.eggs]
        Otter.prototype.preySpecies = [Crab, CrabBaby, SeaUrchin]
        Otter.prototype.preySpeciesArr = [this.crabs, this.crabBabies, this.seaUrchins]
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
        Jellyfish.prototype.speciesObject = this.jellyfish
        Crab.prototype.speciesObject = this.crabs
        CrabBaby.prototype.speciesObject = this.crabBabies

        Otter.prototype.speciesObject = this.otters
        SeaUrchin.prototype.speciesObject = this.seaUrchins
    }

    coreloop(){

        // if (this.view.gameFrame % 10 !== 0) return
        this.deleteDeadDenizens()
        this.reAssignDataObjs()
        this.denizensHuntWhenHungry()
        this.denizensWithMouthsCanFindSomethingElseToEat()
        this.denizensWithMouthsEatPrey()
        this.trappersTrapPrey()
        this.denizensMate()
        this.fishFleeFromSharks()
        this.scavengersEatDeadCreatures()
        this.deleteDeadDenizens()
        // this.deadCreatureDebugLoop()
    }

    scavengersEatDeadCreatures() {
        for (let i = 0; i < this.scavengersArr.length; i++) {
            let scavenger = this.scavengersArr[i]
            if (scavenger.scavenging) continue
            if (scavenger.mating) continue

            let collisionArray = this.view.quadtree.findOverlaps(new Rectangle(scavenger.pos[0], scavenger.pos[1], scavenger.width, scavenger.height), "overlaps", scavenger)
       
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
        let nearbyDenizenArray = this.view.quadtree.findOverlaps(new Rectangle(prey.pos[0] - 100, prey.pos[1] - 100, 200, 200 ), "overlaps", prey)
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

    unpackAllPreySpecies(denizen) {
        let allPreyArr = []
        denizen.preySpeciesArr.forEach((preyObj) => { allPreyArr = allPreyArr.concat(Object.values(preyObj)) })
        return allPreyArr
    }

    findNearestFood(predator) {
        let nearestFoodCords = []
        let nearestFoundDistance = Infinity
        let foodId;

        let allPreyArr = this.unpackAllPreySpecies(predator)

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

            let collisionArray = this.view.quadtree.findOverlaps(new Rectangle(predator.mouthPos[0], predator.mouthPos[1], predator.mouthSize, predator.mouthSize),"overlaps", predator)

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