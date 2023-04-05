import Fish from "./fish"
import { rand, miniRandomizer } from "../engine/utils"
import TextBox from "../engine/textbox"

export default class FishBaby extends Fish {

    constructor(id, ctx, canvas, view, logic, pos) {
        super(id, ctx, canvas, view, logic, pos)
        this.textBox = new TextBox(ctx, canvas, view, logic, "The Garibaldi (Hypsypops rubicundus) is a brightly-colored fish that is native to the rocky reefs and kelp forests of the eastern Pacific Ocean. Their bright orange coloration serves as a warning to potential predators that they are venomous, thanks to a coating of mucus on their skin. Garibaldi are also known for their courtship behavior, during which the male will dig a circular depression in the sand or gravel and aggressively guard it from other fish, enticing females to lay their eggs in the nest. These fish are an important part of the kelp forest ecosystem, feeding on small invertebrates and algae, and providing food for larger predators such as sea lions and sharks. Despite being protected in some areas, Garibaldi populations are threatened by overfishing and habitat destruction.", "garabaldi.jpeg")

        this.spawn = true
        this.id = "FishBaby" + id
        this.leftImg.src = './dist/art/fishleft.png'
        this.rightImg.src = './dist/art/fishright.png'
        this.speed = (Math.floor(Math.random() * 5) + 1) / 10
        this.width = 12
        this.height = 8
        this.pos = pos ? [pos[0] + miniRandomizer(), pos[1] + miniRandomizer()] : this.placer()
        this.oldPos = this.pos
        this.mouthSize = 4

        this.maxEnergy = 10
        this.energy = this.maxEnergy
        this.energyUseCoef = .0025
        this.maxSpeed = .3

        this.energyVal = 5
        this.fadeThreshold = 3

        this.foodEaten = 0
        this.growUpThreshold = 4
        this.eatFoodThreshold = 8
        this.huntingThreshold = 6

        this.hunting = false
        this.nearestFoodCords = []

        this.fleeDistanceThreshold = 200
        this.fleeing = false
        this.fleeFromCoords = []

        this.afterIEatCB = () => {
            if (this.foodEaten === this.growUpThreshold) this.growUp()
        }
    }

    growUp() {
        this.dead = true
        this.logic.recentlyDeadDenizens.push(this)
        this.logic.spawnDenizen(this)
    }

}

    