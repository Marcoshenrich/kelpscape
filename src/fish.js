import Fishegg from "./fishegg"
import { Rectangle } from "./quadtree"
import Swimmer from "./swimmer"


export default class Fish extends Swimmer {

    constructor(id, ctx, canvas, view, logic, pos, spawn) {
        super(ctx, canvas, view, logic)
        this.spawn = !!spawn
        this.id = "Fish" + id
        this.leftImg.src = './dist/art/fishleft.png'
        this.rightImg.src = './dist/art/fishright.png'
        this.mateHeart = new Image()
        this.mateHeart.src = './dist/art/red-heart.png'
        this.speed = (Math.floor(Math.random() * 5) + 1) / 10
        this.width = spawn ? 12 : 25
        this.height = spawn ? 8 : 16
        this.pos = pos || this.placer()
        this.oldPos = this.pos
        this.mouthSize = spawn ? 4 : 8
        this.mouthPos = this.mouthPlacer()
        this.movement1 = this.moveSelector()
        this.movement2 = this.moveSelector()
        this.moveChangerOne()
        this.moveChangerTwo()

        this.maxEnergy = 1
        this.energy = this.maxEnergy
        this.energyUseCoef = .005
        this.matingThreshold = 15
        this.matingEnergyCost = 5
        this.maxSpeed = spawn ? .3 : .6

        this.energyVal = spawn ? 5 : 20

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
            if (this.spawn && this.foodEaten > 4) {
                this.growUp()
            }
        }
        
    }

    growUp() {
        this.spawn = false
        this.maxSpeed = .6
        this.mouthSize = 8
        this.width = 25
        this.height = 16
        this.energyVal = 20
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
                this.logic.eggCount += 1
                this.logic.eggs[this.logic.eggCount] = new Fishegg(this.logic.eggCount, [Math.floor(this.pos[0]), Math.floor(this.pos[1])], this.ctx, this.canvas, this.view, this.logic)
            }
        }, 1500)
    }
}