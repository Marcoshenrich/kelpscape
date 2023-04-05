import Fishegg from "./fishegg"
import Swimmer from "./swimmer"
import TextBox from "../engine/textbox"


export default class Fish extends Swimmer {

    constructor(id, ctx, canvas, view, logic, pos) {
        super(ctx, canvas, view, logic)
        this.spawn = false
        this.textBox = new TextBox(ctx, canvas, view, logic, "The Garibaldi (Hypsypops rubicundus) is a brightly-colored fish that is native to the rocky reefs and kelp forests of the eastern Pacific Ocean. Their bright orange coloration serves as a warning to potential predators that they are venomous, thanks to a coating of mucus on their skin. Garibaldi are also known for their courtship behavior, during which the male will dig a circular depression in the sand or gravel and aggressively guard it from other fish, enticing females to lay their eggs in the nest. These fish are an important part of the kelp forest ecosystem, feeding on small invertebrates and algae, and providing food for larger predators such as sea lions and sharks. Despite being protected in some areas, Garibaldi populations are threatened by overfishing and habitat destruction.", "garabaldi.jpeg")
        this.id = "Fish" + id
        this.leftImg.src = './dist/art/fishleft.png'
        this.rightImg.src = './dist/art/fishright.png'
        this.speed = (Math.floor(Math.random() * 5) + 1) / 10
        this.width = 25
        this.height = 16
        this.pos = pos || this.placer()
        this.oldPos = this.pos
        this.mouthSize = 8
        this.mouthPos = this.mouthPlacer()
        this.movement1 = this.moveSelector()
        this.movement2 = this.moveSelector()
        this.moveChangerOne()
        this.moveChangerTwo()

        this.maxEnergy = 20
        this.energy = this.maxEnergy

        this.fadeThreshold = 7

        this.energyUseCoef = .005
        this.matingThreshold = 15
        this.matingEnergyCost = 5
        this.maxSpeed = .6

        this.energyVal = 20

        this.mating = false
        this.mateThreshold = 10

        this.seekingMate = false

        this.foodEaten = 0
        this.eatFoodThreshold = 15
        this.huntingThreshold = 7

        this.hunting = false
        this.nearestFoodCords = []


        this.fleeDistanceThreshold = 200
        this.fleeing = false
        this.fleeFromCoords = []

        this.afterIEatCB = () => {
            //nothing required, spawn grow up separately
        }
        
    }

    mouthPlacer() {
        let mouthPos = []
        if (!this.right) {
            mouthPos = [this.pos[0], this.pos[1] + (this.height / 2)]
        } else {
            mouthPos = [this.pos[0] + (this.width - this.mouthSize), this.pos[1] + (this.height / 2)]
        }
        return mouthPos
    }

    imgSelector() {
       return this.right ? this.rightImg : this.leftImg 
    }
    
    placer() {
        let pos = []
        pos[0] = Math.floor(Math.random() * (this.arenaWidth- this.width))
        pos[1] = Math.floor(Math.random() * (this.arenaHeight - this.height)) 
        return pos
    }


    draw() {
        this.ctx.fillStyle = 'rgba(0,225,225,1)';
        this.ctx.globalAlpha = this.energy > 7 ? 1 : (this.energy + 3) / 10
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
        if (this.mating) this.ctx.drawImage(this.mateHeart, this.mouthPos[0] + this.offset[0], this.mouthPos[1] + this.offset[1] - this.width, 15, 15)
        if (this.view.debugging) {
            this.drawMouths()
            this.drawId()
        }
        this.ctx.globalAlpha = 1
    }

    drawMouths() {
        //debugging function
        this.ctx.fillRect(this.mouthPos[0] + this.offset[0], this.mouthPos[1] + this.offset[1], this.mouthSize, this.mouthSize)
    }

    drawId() {
        //debugging function
        this.ctx.fillStyle = 'rgba(0,0,0,1)';
        this.ctx.font = "12px serif";
        this.ctx.fillText(`${this.id}`, this.pos[0] + this.offset[0], this.pos[1] +  this.offset[1])
    }

    mate(spawnBool) {
        this.mating = true
        this.speed = 0
        this.energy -= this.matingEnergyCost
        setTimeout(()=>{
            this.speed += .5
            this.mating = false
            if (spawnBool) return
            let i = Math.floor(Math.random() * 6)
            while (i > 0) {
                i--
                this.logic.spawnDenizen(this) 
            }
        }, 1500)
    }
}