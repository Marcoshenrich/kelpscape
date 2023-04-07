import { Rectangle } from "./quadtree"
import FishBaby from "../denizens/Fishes/fishbaby"
import Algae from "../denizens/algae"
import Fish from "../denizens/Fishes/fish"
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
import SeaUrchin from "../denizens/seaurchin"
import Turtle from "../denizens/turtle"
import TextBox from "./textbox"
import BassBaby from "../denizens/Fishes/bassBaby"
import Bass from "../denizens/Fishes/bass"
import BehaviorController from "./behaviorController"


export default class Logic {

    constructor(ctx, canvas, view) {
        this.ctx = ctx
        this.canvas = canvas
        this.view = view

        this.scoreTrackObj = {
            "Fish": false,
            "Algae": false,
            "Jellyfish": false,
            "Otter": false,
            "Crab": false,
            "Rock": false,
            "Shark": false,
            "Turtle": false,
            "Sea Urchin": false,
            "Fish Egg": false,
            "Corpse": false,
        }

        this.textContentObj = {
            "Fish": new TextBox(ctx, canvas, view, this, "Fish", "The Garibaldi (Hypsypops rubicundus) is a brightly-colored fish that is native to the rocky reefs and kelp forests of the eastern Pacific Ocean. Their bright orange coloration serves as a warning to potential predators that they are venomous, thanks to a coating of mucus on their skin. Garibaldi are also known for their courtship behavior, during which the male will dig a circular depression in the sand or gravel and aggressively guard it from other fish, enticing females to lay their eggs in the nest. These fish are an important part of the kelp forest ecosystem, feeding on small invertebrates and algae, and providing food for larger predators such as sea lions and sharks. Despite being protected in some areas, Garibaldi populations are threatened by overfishing and habitat destruction.", "garabaldi.jpeg"),
            "Algae": new TextBox(ctx, canvas, view, this, "Algae", "Algae are some of the most important organisms in the Pacific kelp forest ecosystem. One of the most iconic species is giant kelp (Macrocystis pyrifera), which can grow up to 100 feet tall and forms dense underwater forests. Giant kelp is a type of brown algae that provides a habitat for a variety of marine life, from small invertebrates to large fish and sea mammals. Another important type of algae is the red algae, which includes species like coralline algae and rhodophytes. These algae provide a source of food and shelter for a variety of organisms in the kelp forest, and can also play an important role in regulating the pH of the ocean. While algae may not be as charismatic as some of the larger animals in the kelp forest, they are an essential component of this complex ecosystem, and help to support a diverse community of marine life.", "algae.webp"),
            "Jellyfish": new TextBox(ctx, canvas, view, this, "Jellyfish", "Several species of jellyfish can be found in the Pacific kelp forest, including the lion's mane jellyfish (Cyanea capillata) and the moon jellyfish (Aurelia aurita). These cnidarians are well-adapted to life in the ocean, with their gelatinous bodies and trailing tentacles. While they may seem harmless, some jellyfish species in the kelp forest can deliver a painful sting to humans, making it important to observe them from a safe distance. Despite their somewhat fearsome reputation, jellyfish play a crucial role in the kelp forest ecosystem, feeding on small planktonic organisms and providing food for larger predators such as sea turtles and birds. The moon jellyfish is particularly interesting, as it has a unique way of navigating the ocean - it can sense the Earth's magnetic field and use it to orient itself in the water.", "jellyfish.jpeg"),
            "Otter": new TextBox(ctx, canvas, view, this, "Sea Otter", "The sea otter (Enhydra lutris) is a crucial player in maintaining the health of the kelp forest. These adorable creatures are known for their love of shellfish, which they crack open with rocks using their impressive dexterity. Sea otters also play an important role in keeping the kelp forests healthy. They feed on sea urchins, which can overgraze kelp if left unchecked. Sea otters are one of the few animals that use tools, and they have even been known to hold hands while sleeping to keep from drifting away from each other. Sadly, sea otters were hunted to near extinction for their fur in the 18th and 19th centuries, but conservation efforts have helped their populations rebound in some areas.", "sea_otter.webp"),
            "Crab": new TextBox(ctx, canvas, view, this, "Crab", "Crabs are a common sight in the Pacific kelp forest, where they play an important role in the ecosystem. One of the most well-known species is the Dungeness crab (Metacarcinus magister), which is prized by humans for its sweet, tender meat. Dungeness crabs can be found in shallow waters and prefer to feed on small fish and crustaceans, but will also eat kelp and other algae if food is scarce. Another common species is the graceful kelp crab (Pugettia gracilis), which is named for its slender legs and preference for living among the kelp fronds. These crabs are expert at camouflaging themselves among the kelp, making them difficult to spot. Crabs are important predators in the kelp forest, helping to control the populations of smaller invertebrates, and are themselves preyed upon by larger predators such as sea otters and seals.", "crab.jpeg"),
            "Rock": new TextBox(ctx, canvas, view, this, "Rock", "Congratulations, you clicked on a rock. This was very insightful and brave. Most people would just ignore the rock and say “no reason to click on any rocks.” Not you. You’ll click on rocks all day. No stone left unturned, as your dad used to say.", "rock.png"),
            "Shark": new TextBox(ctx, canvas, view, this, "Shark", "Sharks are some of the most iconic predators of the ocean, and several species can be found in the Pacific kelp forest. One of the most commonly encountered species is the leopard shark (Triakis semifasciata), which is named for its distinctive pattern of dark spots and stripes. Leopard sharks are not considered dangerous to humans, and are commonly seen by divers and snorkelers in shallow waters. Another species that can be found in the kelp forest is the soupfin shark (Galeorhinus galeus), which is sometimes called the school shark. These sharks can grow up to six feet in length, and are known for their ability to form large schools in the ocean. Sharks play an important role in the kelp forest ecosystem, feeding on a variety of prey including fish, squid, and crustaceans, and helping to maintain a healthy balance of predator and prey.", "shark.png"),
            "Turtle": new TextBox(ctx, canvas, view, this, "Turtle", "The sea turtle and loggerhead turtle can both be found in the Pacific kelp forest. These turtles are herbivores and play a critical role in the health and balance of the ecosystem. They consume large quantities of algae, which helps to prevent overgrowth and maintains a healthy population of kelp. Kelp, in turn, provides vital habitat for a diverse range of marine life. Turtles are also important prey for sharks, which helps to maintain a balanced food chain in the kelp forest ecosystem. Additionally, their waste contributes to nutrient cycling, supporting the growth of microorganisms and small plants. Turtles face threats such as habitat loss, pollution, and climate change. As iconic members of this underwater world, green sea turtles and loggerhead turtles serve as a reminder of the beauty and diversity of our oceans and the vital role that every species plays in their ecosystems.", "turtle.jpeg"),
            "Sea Urchin": new TextBox(ctx, canvas, view, this, "Sea Urchin", "Sea urchins are one of the most important species in the Pacific kelp forest. They play a vital role in keeping the ecosystem balanced by eating algae that would otherwise overgrow and harm the kelp. But don't let their spiky exterior fool you – these creatures are surprisingly mobile and can use their tube feet to move around and graze. Did you know that some species of sea urchins have sharp spines that are venomous? While most sea urchins are harmless, it's best to admire them from a safe distance. Fun fact: sea urchins are considered a delicacy in some parts of the world, with their roe (eggs) being a popular sushi ingredient.", "sea_urchin.jpeg"),
            "Fish Egg": new TextBox(ctx, canvas, view, this, "Fish Egg", "Fish eggs are a crucial component of the Pacific kelp forest ecosystem. These tiny, transparent orbs contain the next generation of fish and provide food for a variety of marine creatures, including birds and larger fish. Some species of fish, such as rockfish and lingcod, lay their eggs in kelp fronds to protect them from predators. Other species, like the leopard shark, deposit their eggs directly on the ocean floor. Fish eggs are also a popular food source for humans, with salmon roe being a delicacy in many cultures. However, overfishing and pollution threaten the survival of many fish species and the vital role they play in the kelp forest ecosystem.", "fish_egg.jpeg"),
            "Corpse": new TextBox(ctx, canvas, view, this, "Corpse", "Death is an inevitable part of life in the Pacific kelp forest, and the corpses of the denizens of this underwater world play an important role in sustaining the ecosystem. When a fish or other animal dies, its body sinks to the ocean floor, where it becomes a feast for scavengers like crabs and sea stars. As the corpse decomposes, it releases nutrients into the water, which are absorbed by algae and other plants in the kelp forest. This process, known as nutrient cycling, helps to maintain the health and productivity of the ecosystem. In addition to providing nutrients, dead organisms can also create new habitats for other creatures. For example, the hollow shells of dead snails and clams can provide shelter for small fish and invertebrates. While death may seem like a grim topic, it is an essential part of the natural cycle of life in the Pacific kelp forest.", "corpse.jpeg"),
        }

        this.garabaldiCount = 40
        this.garabaldiBabyCount =  40


        this.bassCount = 10
        this.bassbabyCount = 10


        this.testCount = 0


        this.algaeCount = 100
        this.sharkCount = 2
        this.eggCount = 0
        this.effectCount = 0
        this.turtleCount = 10
        this.seaweedClusterCount = 15
        this.deadCreatureCount = 0
        this.crabCount = 10
        this.crabBabyCount = 0
        this.jellyfishCount = 50
        this.rockCount = 20
        this.otterCount = 0
        this.seaUrchinCount = 0

        this.garabaldi = this.tankPopulator(this.garabaldiCount, Garabaldi, {})
        this.garabaldiBabies = this.tankPopulator(this.garabaldiBabyCount, GarabaldiBaby, {})
        
        this.bass = this.tankPopulator(this.bassCount, Bass, {})
        this.bassBabies = this.tankPopulator(this.bassbabyCount, BassBaby, {})
        
        this.sharks = this.tankPopulator(this.sharkCount, Shark)
        this.eggs = this.tankPopulator(this.eggCount, Fishegg, {})
        this.effects = this.tankPopulator(this.effectCount, Effect)
        this.turtles = this.tankPopulator(this.turtleCount, Turtle)
        this.seaUrchins = this.tankPopulator(this.seaUrchinCount, SeaUrchin)
        this.seaweedClusters = this.tankPopulator(this.seaweedClusterCount, SeaweedCluster, {start: true})
        this.seaweed = {}
        this.algae = this.tankPopulator(this.algaeCount, Algae, { clustersObj: this.seaweedClusters })
        this.deadCreatures = {}
        this.crabs = this.tankPopulator(this.crabCount, Crab)
        this.crabBabies = this.tankPopulator(this.crabBabyCount, CrabBaby)
        this.jellyfish = this.tankPopulator(this.jellyfishCount, Jellyfish)
        this.rocks = this.tankPopulator(this.rockCount, Rock)
        this.otters = {}

        
        this.hungryDenizenArr = []
        this.assignFoodWeb()
        this.assignSpeciesObjects() 

        this.matingDenizensObj = {}

        this.recentlyDeadDenizens = []

        this.behaviorController = new BehaviorController(this)

    }


    spawnDenizen(parentDenizen) {
        switch(parentDenizen.constructor) {
            case Bass || Garabaldi:
                this.eggCount += 1
                this.eggs["Fishegg" + this.eggCount] = new Fishegg(this.eggCount, this.ctx, this.canvas, this.view, this, { pos: [Math.floor(parentDenizen.pos[0]), Math.floor(parentDenizen.pos[1])], parent: parentDenizen.constructor })
                break
            case BassBaby:
                this.bassCount += 1
                this.bass["Bass" + this.bassCount] = new Bass(this.bassCount, this.ctx, this.canvas, this.view, this, {pos: [parentDenizen.pos[0], parentDenizen.pos[1]]})
                break
            case GarabaldiBaby:
                this.garabaldiCount += 1
                this.garabaldi["Garabaldi" + this.garabaldiCount] = new Garabaldi(this.garabaldiCount, this.ctx, this.canvas, this.view, this, { pos: [parentDenizen.pos[0], parentDenizen.pos[1]] })
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
            case Fishegg:
                this.spawnDenizenFish(parentDenizen)
                break
        }
    }

    spawnDenizenFish(parentDenizen) {
        switch (parentDenizen.parent) {
            case Garabaldi:
                this.garabaldiBabyCount += 1
                this.garabaldiBabies["GarabaldiBaby" + this.garabaldiBabyCount] = new GarabaldiBaby(this.garabaldiBabyCount, this.ctx, this.canvas, this.view, this, {pos:[Math.floor(parentDenizen.pos[0]), Math.floor(parentDenizen.pos[1])]})
                break
            case Bass:
                this.bassBaByCount += 1
                this.bassBabies["BassBaby" + this.bassBaByCount] = new BassBaby(this.bassBaByCount, this.ctx, this.canvas, this.view, this, { pos: [Math.floor(parentDenizen.pos[0]), Math.floor(parentDenizen.pos[1])] })
                break
        }
    }

    denizenCorpse(deadDenizen) {
        this.deadCreatureCount++
        this.deadCreatures["DeadCreature" + this.deadCreatureCount] = new DeadCreature(this.deadCreatureCount, this.ctx, this.canvas, this.view, this, deadDenizen.pos, deadDenizen)
    }

    seaweedUpdater() {
        for (let cluster of Object.values(this.seaweedClusters)) {
            for (let seaweed of Object.values(cluster.seaweed)) {
                this.seaweed[seaweed.id] = seaweed
            }
        }
    }

    reAssignDataObjs() {
        this.seaweedUpdater()
        this.predatorsWithMouthsArr = [...Object.values(this.turtles),...Object.values(this.bassBabies), ...Object.values(this.bass) ,...Object.values(this.garabaldiBabies),...Object.values(this.garabaldi), ...Object.values(this.sharks)]
        this.scavengersArr = [...Object.values(this.crabs), ...Object.values(this.crabBabies)]
        this.trappersArr = [...Object.values(this.crabs), ...Object.values(this.jellyfish), ...Object.values(this.otters)]
    }

    assignFoodWeb() {
        Garabaldi.prototype.preySpecies = 
        {
            "Algae": this.algae
        }

        GarabaldiBaby.prototype.preySpecies = 
        {
            "Algae": this.algae
        }

        Bass.prototype.preySpecies =
        {
            "GarabaldiBaby": this.garabaldiBabies,
            "CrabBaby": this.crabBabies,
        }

        BassBaby.prototype.preySpecies =
        {
            "Algae": this.algae
        }

        Shark.prototype.preySpecies = {
            "Garabaldi": this.garabaldi, 
            "GarabaldiBaby": this.garabaldiBabies,
            "Bass": this.bass,
            "BassBaby": this.bassBabies
        }

        Crab.prototype.preySpecies = 
        {
            "GarabaldiBaby": this.garabaldiBabies,
            "BassBaby": this.bassBabies
        }

        Jellyfish.prototype.preySpecies = 
        {
            "GarabaldiBaby": this.garabaldiBabies,
            "BassBaby": this.bassBabies,
            "FishEgg": this.eggs
        }

        Otter.prototype.preySpecies = 
        {
            "Crab": this.crabs,
            "CrabBaby": this.crabBabies,
            "SeaUrchin": this.seaUrchins
        }

        Turtle.prototype.preySpecies =
        {
            "Seaweed": this.seaweed,
            "Jellyfish": this.jellyfish
        }
    }

    assignSpeciesObjects() {
        Garabaldi.prototype.speciesObject = this.garabaldi
        GarabaldiBaby.prototype.speciesObject = this.garabaldiBabies
        Bass.prototype.speciesObject = this.bass
        BassBaby.prototype.speciesObject = this.bassBabies
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
        Turtle.prototype.speciesObject = this.turtles
    }

    coreloop(){

        // if (this.view.gameFrame % 10 !== 0) return
        this.deleteDeadDenizens()
        this.reAssignDataObjs()
        this.behaviorController.coreloop()
        this.deleteDeadDenizens()
        // this.deadCreatureDebugLoop()
    }

    deleteDeadDenizens(){
        while (this.recentlyDeadDenizens.length) {
            let deadDenizen = this.recentlyDeadDenizens.pop()
            deadDenizen.clearCallbacksOnDeath()
            delete deadDenizen.speciesObject[deadDenizen.id]
        }
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