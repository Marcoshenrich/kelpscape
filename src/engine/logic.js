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
import BehaviorController from "./behaviorController"
import NatureController from "./natureController"
import Polyp from "../denizens/polyp"
import { rand } from "./utils"
import Rockfish from "../denizens/Fishes/rockfish"
import RockfishBaby from "../denizens/Fishes/rockfishbaby"

export default class Logic {

    constructor(ctx, canvas, view) {
        this.ctx = ctx
        this.canvas = canvas
        this.view = view

        this.score = 0
        this.scoreTrackObj = {
            "Garibaldi": false,
            "Rockfish": false,
            "Kelp Bass": false,
            "Algae": false,
            "Jellyfish": false,
            "Otter": false,
            "Crab": false,
            "Rock": false,
            "Shark": false,
            "Turtle": false,
            "Sea Urchin": false,
            "Kelp": false,
            "Fish Egg": false,
            "Corpse": false,
        }

        this.textContentObj = {
            //new
            "Kelp Bass": new TextBox(ctx, canvas, view, this, "Kelp Bass", "The kelp bass (Paralabrax clathratus) is a striking fish found in the Pacific kelp biome. These fish are voracious predators, feeding on a variety of invertebrates and small fish. They are often seen swimming near the surface of the water, using their excellent eyesight to hunt for prey. Interestingly, kelp bass can change their coloration to blend in with their surroundings, making them excellent at camouflaging themselves from both predators and prey. Despite their name, kelp bass don't actually eat kelp – instead, they rely on the kelp forest's many inhabitants for sustenance. Kelp bass are an important species in the kelp forest ecosystem, helping to keep populations of smaller organisms in check.", "kelpBass.jpeg"),
            "Rockfish": new TextBox(ctx, canvas, view, this, "Rockfish", "Rockfish inhabit the rocky reefs of the Pacific kelp biome. These fish come in a variety of colors and patterns, from vibrant oranges and reds to more muted grays and browns. They are an important part of the kelp forest ecosystem, serving as both predator and prey. Rockfish are known for their longevity – some species can live for up to 100 years. They also have a unique reproductive strategy called live birth, where the female carries her young inside her body until they are fully developed. Unfortunately, many species of rockfish are overfished, leading to population declines and concerns for their conservation.", "rockfish.jpeg"),
            "Kelp": new TextBox(ctx, canvas, view, this, "Kelp", "Kelp is one of the defining features of the Pacific kelp forest biome, forming dense forests of long, leafy fronds that provide a complex and vital habitat for a variety of marine organisms. Kelp is a type of seaweed that can grow up to 100 feet tall and is anchored to the ocean floor by a holdfast. In addition to providing food and shelter for countless species, kelp also helps to mitigate the effects of climate change by sequestering carbon dioxide from the atmosphere. However, rising ocean temperatures and ocean acidification, both of which are caused by climate change, are posing a threat to kelp populations. As the oceans warm and become more acidic, kelp growth rates are slowing down, and some areas are experiencing mass die-offs of kelp forests.", "kelp.jpeg"),
            
            "Algae": new TextBox(ctx, canvas, view, this, "Algae", "Algae are some of the most important organisms in the Pacific kelp forest ecosystem. A crucial type of algae is the red algae, which includes species like coralline algae and rhodophytes. These algae provide a source of food and shelter for a variety of organisms in the kelp forest, and can also play an important role in regulating the pH of the ocean. While algae may not be as charismatic as some of the larger animals in the kelp forest, they are an essential component of this complex ecosystem, and help to support a diverse community of marine life.", "algae.webp"),
            "Sea Urchin": new TextBox(ctx, canvas, view, this, "Sea Urchin", "Sea urchins are one of the most important species in the Pacific kelp forest. These spiky creatures play a crucial role in controlling the growth of algae, which could otherwise overtake and harm the kelp. Unfortunately, rising sea temperatures and ocean acidification are causing a decline in sea urchin populations, which is having a cascading effect on the entire kelp forest ecosystem. Despite their importance, sea urchins are often misunderstood and seen as a nuisance, with some species having venomous spines that can be harmful to humans. It's essential to handle them with care and appreciate their vital role in the ocean.", "sea_urchin.jpeg"),
            "Fish Egg": new TextBox(ctx, canvas, view, this, "Fish Egg", "Fish eggs are a crucial component of the Pacific kelp forest ecosystem. These tiny, transparent orbs contain the next generation of fish and provide food for a variety of marine creatures, including birds and larger fish. Some species of fish, such as rockfish and lingcod, lay their eggs in kelp fronds to protect them from predators. Other species, like the leopard shark, deposit their eggs directly on the ocean floor. Fish eggs are also a popular food source for humans, with salmon roe being a delicacy in many cultures. However, overfishing and pollution threaten the survival of many fish species and the vital role they play in the kelp forest ecosystem.", "fish_egg.jpeg"),
            
            "Turtle": new TextBox(ctx, canvas, view, this, "Turtle", "The sea turtle and loggerhead turtle can both be found in the Pacific kelp forest. These turtles are herbivores and play a critical role in the health and balance of the ecosystem. They consume large quantities of algae, which helps to prevent overgrowth and maintains a healthy population of kelp. Turtles are also important prey for sharks. Additionally, their waste contributes to nutrient cycling, supporting the growth of microorganisms and small plants. Turtles face threats such as habitat loss, pollution, and climate change. As iconic members of this underwater world, green sea turtles and loggerhead turtles serve as a reminder of the beauty and diversity of our oceans and the vital role that every species plays in their ecosystems.", "turtle.jpeg"),
            "Corpse": new TextBox(ctx, canvas, view, this, "Corpse", "Death is an inevitable part of life in the Pacific kelp forest, and the corpses of the denizens of this underwater world play an important role in sustaining the ecosystem. When a fish or other animal dies, its body sinks to the ocean floor, where it becomes a feast for scavengers like crabs and sea stars. As the corpse decomposes, it releases nutrients into the water, which are absorbed by algae and other plants in the kelp forest. This process, known as nutrient cycling, helps to maintain the health and productivity of the ecosystem. In addition to providing nutrients, dead organisms can also create new habitats for other creatures. ", "corpse.jpeg"),
            "Shark": new TextBox(ctx, canvas, view, this, "Shark", "Sharks are some of the most iconic predators of the ocean, and several species can be found in the Pacific kelp forest. One of the most commonly encountered species is the leopard shark (Triakis semifasciata), which is named for its distinctive pattern of dark spots and stripes. Leopard sharks are not considered dangerous to humans, and are commonly seen by divers and snorkelers in shallow waters. Another species that can be found in the kelp forest is the soupfin shark (Galeorhinus galeus), which is sometimes called the school shark. These sharks can grow up to six feet in length, and are known for their ability to form large schools in the ocean.", "shark.png"),
            
            "Otter": new TextBox(ctx, canvas, view, this, "Otter", "The sea otter (Enhydra lutris) is a crucial player in maintaining the health of the kelp forest. These adorable creatures are known for their love of shellfish, which they crack open with rocks using their impressive dexterity. Sea otters also play an important role in keeping the kelp forests healthy. They feed on sea urchins, which can overgraze kelp if left unchecked. Sea otters are one of the few animals that use tools, and they have even been known to hold hands while sleeping to keep from drifting away from each other. Sadly, sea otters were hunted to near extinction for their fur in the 18th and 19th centuries, but conservation efforts have helped their populations rebound in some areas.", "sea_otter.webp"),
            "Rock": new TextBox(ctx, canvas, view, this, "Rock", "Congratulations, you clicked on a rock. This was very insightful and brave. Most people would just ignore the rock and say “no reason to click on any rocks.” Not you. You’ll click on rocks all day. No stone left unturned, as your dad used to say.", "rock.png"),
            
            "Garibaldi": new TextBox(ctx, canvas, view, this, "Garibaldi", "The Garibaldi (Hypsypops rubicundus) is a brightly-colored fish that is native to the rocky reefs and kelp forests of the eastern Pacific Ocean. Their bright orange coloration serves as a warning to potential predators that they are venomous, thanks to a coating of mucus on their skin. These fish are an important part of the kelp forest ecosystem, feeding on small invertebrates and algae, and providing food for larger predators such as sea lions and sharks. Despite being protected in some areas, Garibaldi populations are threatened by overfishing and habitat destruction.", "garabaldi.jpeg"),
            "Jellyfish": new TextBox(ctx, canvas, view, this, "Jellyfish", "The Pacific kelp forest is home to a diverse array of jellyfish species, including the lion's mane jellyfish (Cyanea capillata) and the moon jellyfish (Aurelia aurita). These creatures reproduce by spreading gametes which drift to the ocean floor and become polyps - little plant-like structures which spawn new Jellyfish medusa. Jellyfish populations in the Pacific kelp forest are facing increasing threats due to climate change. Rising ocean temperatures and changes in ocean currents are affecting the distribution and abundance of jellyfish, with some species expanding their ranges and others declining in numbers.", "jellyfish.jpeg"),
            "Crab": new TextBox(ctx, canvas, view, this, "Crab", "Crabs are a common sight in the Pacific kelp forest, where they play an important role in the ecosystem. One of the most well-known species is the Dungeness crab (Metacarcinus magister), which is prized by humans for its sweet, tender meat. Dungeness crabs can be found in shallow waters and prefer to feed on small fish and crustaceans, but will also eat kelp and other algae if food is scarce. Another common species is the graceful kelp crab (Pugettia gracilis), which is named for its slender legs and preference for living among the kelp fronds. These crabs are expert at camouflaging themselves among the kelp, making them difficult to spot. ", "crab.jpeg"),
        }

        this.seaweedClusterCount = 25
        this.seaUrchinCount = 0
        this.seaUrchins = {}
        this.seaweedClusters = this.tankPopulator(this.seaweedClusterCount, SeaweedCluster, { start: true })
        this.seaweed = {}
        this.seaweedSpots = {}
        this.behaviorController = new BehaviorController(this)
        this.natureController = new NatureController(this)



        this.garabaldiCount = 40
        this.garabaldiBabyCount =  100

        this.bassCount = 10
        this.bassBabyCount = 10

        this.rockfishCount = 10
        this.rockfishBabyCount = 10

        this.algaeCount = 100
        this.sharkCount = 2
        this.eggCount = 0
        this.effectCount = 0
        this.turtleCount = 1
        this.deadCreatureCount = 0
        this.crabCount = 40
        this.crabBabyCount = 6
        this.jellyfishCount = 50
        this.rockCount = 20
        this.otterCount = 0
        this.polypCount = 0

        this.garabaldi = this.tankPopulator(this.garabaldiCount, Garabaldi, {})
        this.garabaldiBabies = this.tankPopulator(this.garabaldiBabyCount, GarabaldiBaby, {})
        
        this.bass = this.tankPopulator(this.bassCount, Bass, {})
        this.bassBabies = this.tankPopulator(this.bassBabyCount, BassBaby, {})

        this.rockfish = this.tankPopulator(this.rockfishCount, Rockfish, {})
        this.rockfishBabies = this.tankPopulator(this.rockfishBabyCount, RockfishBaby, {})
        
        this.sharks = this.tankPopulator(this.sharkCount, Shark)
        this.eggs = this.tankPopulator(this.eggCount, Fishegg, {})
        this.effects = this.tankPopulator(this.effectCount, Effect,{})
        this.turtles = this.tankPopulator(this.turtleCount, Turtle,{})
        this.algae = this.tankPopulator(this.algaeCount, Algae, { clustersObj: this.seaweedClusters })
        this.deadCreatures = {}
        this.crabs = this.tankPopulator(this.crabCount, Crab,{})
        this.crabBabies = this.tankPopulator(this.crabBabyCount, CrabBaby,{pos:[rand(50, this.view.arenaWidth - 50)]})
        this.jellyfish = this.tankPopulator(this.jellyfishCount, Jellyfish,{})
        this.rocks = this.tankPopulator(this.rockCount, Rock,{})
        this.polyps = {}
        this.otters = {}

        
        this.hungryDenizenArr = []
        this.natureController.assignFoodWeb()
        this.natureController.assignSpeciesObjects() 

        this.matingDenizensObj = {}

        this.recentlyDeadDenizens = []
    }


    spawnDenizen(parentDenizen) {
        let count;
        let babyObj;
        let typeString;
        let className;
        let options;

        switch(parentDenizen.constructor) {
            case Garabaldi:
                this.eggCount += 1
                count = this.eggCount
                babyObj = this.eggs
                typeString = "Fishegg"
                className = Fishegg
                options = { pos: [Math.floor(parentDenizen.pos[0]), Math.floor(parentDenizen.pos[1])], parent: parentDenizen.constructor }
                break

            case Bass:
                this.eggCount += 1
                count = this.eggCount
                babyObj = this.eggs
                typeString = "Fishegg"
                className = Fishegg
                options = { pos: [Math.floor(parentDenizen.pos[0]), Math.floor(parentDenizen.pos[1])], parent: parentDenizen.constructor }
                break

            case Rockfish:
                this.eggCount += 1
                count = this.eggCount
                babyObj = this.eggs
                typeString = "Fishegg"
                className = Fishegg
                options = { pos: [Math.floor(parentDenizen.pos[0]), Math.floor(parentDenizen.pos[1])], parent: parentDenizen.constructor }
                break

            case RockfishBaby:
                this.rockCount += 1            
                count = this.rockCount
                babyObj = this.rockfish
                typeString = "Rockfish"
                className = Rockfish
                options = { pos: [parentDenizen.pos[0], parentDenizen.pos[1]] }
                break
                
            case BassBaby:
                this.bassCount += 1
                count = this.bassCount
                babyObj = this.bass
                typeString = "Bass"
                className = Bass
                options = { pos: [parentDenizen.pos[0], parentDenizen.pos[1]] }
                break

            case GarabaldiBaby:
                this.garabaldiCount += 1
                count = this.garabaldiCount
                babyObj = this.garabaldi
                typeString = "Garabaldi"
                className = Garabaldi
                options = { pos: [parentDenizen.pos[0], parentDenizen.pos[1]] }
                break

            case Crab:
                this.crabBabyCount += 1
                count = this.crabBabyCount
                babyObj = this.crabBabies
                typeString = "CrabBaby"
                className = CrabBaby
                options = { pos: [Math.floor(parentDenizen.pos[0]), Math.floor(parentDenizen.pos[1])] }
                break

            case CrabBaby:
                this.crabCount += 1
                count = this.crabCount
                babyObj = this.crabs
                typeString = "Crab"
                className = Crab
                options = { pos: [parentDenizen.pos[0], parentDenizen.pos[1]] }
                break

            case Seaweed:
                this.seaUrchinCount += 1
                count = this.seaUrchinCount
                babyObj = this.seaUrchins
                typeString = "SeaUrchin"
                className = SeaUrchin
                options = { parent: parentDenizen, pos: [parentDenizen.pos[0], parentDenizen.pos[1]] }
                break

            case Polyp:
                this.jellyfishCount += 1
                count = this.jellyfishCount
                babyObj = this.jellyfish
                typeString = "Jellyfish"
                className = Jellyfish
                options = { pos: [parentDenizen.pos[0], parentDenizen.pos[1]] }
                break


            case Effect:
                this.polypCount += 1
                count = this.polypCount
                babyObj = this.polyps
                typeString = "Polyp"
                className = Polyp
                options = { pos: [parentDenizen.pos[0], parentDenizen.pos[1]] }
                break

            case Fishegg:
                this.spawnDenizenFish(parentDenizen)
                return
        }

        babyObj[typeString + count] = new className(count, this.ctx, this.canvas, this.view, this, options)
    }

    spawnDenizenFish(parentDenizen) {
        let count;
        let babyObj;
        let typeString;
        let className;
        let options = { pos: [Math.floor(parentDenizen.pos[0]), Math.floor(parentDenizen.pos[1])] }

        switch (parentDenizen.parent) {
            case Garabaldi:
                this.garabaldiBabyCount++
                count = this.garabaldiBabyCount
                babyObj = this.garabaldiBabies
                typeString = "GarabaldiBaby"
                className = GarabaldiBaby

                break
            case Bass:
                this.bassBabyCount++
                count = this.bassBabyCount
                babyObj = this.bassBabies
                typeString = "BassBaby"
                className = BassBaby

                break
            case Rockfish:
                this.rockfishBabyCount++
                count = this.rockfishBabyCount
                babyObj = this.rockfishBabies
                typeString = "RockfishBaby"
                className = RockfishBaby
                break
        }

        babyObj[typeString + count] = new className(count, this.ctx, this.canvas, this.view, this, options)
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
        this.predatorsWithMouthsArr = [...Object.values(this.turtles), ...Object.values(this.bassBabies), ...Object.values(this.bass), ...Object.values(this.garabaldiBabies), ...Object.values(this.garabaldi), ...Object.values(this.sharks), ...Object.values(this.rockfish), ...Object.values(this.rockfishBabies)]
        this.scavengersArr = [...Object.values(this.crabs), ...Object.values(this.crabBabies)]
        this.trappersArr = [...Object.values(this.crabs), ...Object.values(this.jellyfish), ...Object.values(this.otters)]

    }

    coreloop(){

        // if (this.view.gameFrame % 10 !== 0) return
        this.deleteDeadDenizens()
        this.reAssignDataObjs()
        this.natureController.coreloop()
        this.behaviorController.coreloop()
        this.deleteDeadDenizens()
        // this.deadCreatureDebugLoop()
    }

    deleteDeadDenizens(){
        while (this.recentlyDeadDenizens.length) {
            let deadDenizen = this.recentlyDeadDenizens.pop()
            delete deadDenizen.speciesObject[deadDenizen.id]
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