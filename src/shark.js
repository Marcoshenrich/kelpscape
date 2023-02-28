
import Swimmer from "./swimmer"

export default class Shark extends Swimmer {

    constructor(id, ctx, canvas, view, posMatrix, logic, spawn) {
        super(ctx, canvas, view, posMatrix, logic)
        this.id = "Shark" + id

        this.leftImg.src = './dist/art/sharkleft.png'
        this.rightImg.src = './dist/art/sharkright.png'
        this.mateHeart = new Image()
        this.mateHeart.src = './dist/art/red-heart.png'
        this.speed = (Math.floor(Math.random() * 5) + 5) / 10
        this.width = spawn ? 20 : 100
        this.height = spawn ? 8 : 41
        this.pos = this.placer()
        this.oldPos = this.pos
        this.mouthSize = spawn ? 4 : 12
        this.mouthPos = this.mouthPlacer()
        this.movement1 = this.moveSelector()
        this.movement2 = this.moveSelector()
        this.moveChangerOne()
        this.moveChangerTwo()

        this.maxEnergy = 30
        this.energy = this.maxEnergy
        this.energyUseCoef = .025
        this.matingThreshold = 15
        this.matingEnergyCost = 5
        this.dead = false
        this.maxSpeed = spawn ? .3 : 1

        this.mating = false
        this.spawn = spawn ? true : false
        this.foodEaten = 0
        this.eatFoodThreshold = 60

        this.hunting = false
        this.nearestFoodCords = []

    }

    growUp() {
        this.spawn = false
        this.maxSpeed = .6
        this.mouthSize = 8
        this.width = 25
        this.height = 16
    }

    mouthPlacer() {
        let mouthPos = []
        if (!this.right) {
            mouthPos = [this.pos[0] + 5, this.pos[1] + (this.height / 2)]
        } else {
            mouthPos = [this.pos[0] + (this.width - this.mouthSize) - 5, this.pos[1] + (this.height / 2)]
        }
        return mouthPos
    }

    imgSelector() {
        return this.right ? this.rightImg : this.leftImg
    }

    placer() {
        let pos = []
        pos[0] = Math.floor(Math.random() * (this.canvas.width - this.width))
        pos[1] = Math.floor(Math.random() * (this.canvas.height - this.height))
        return pos
    }

    draw() {
        this.move()
        this.consumeEnergy()
        this.ctx.fillStyle = 'rgba(0,225,225,1)';
        this.ctx.globalAlpha = this.energy > 7 ? 1 : (this.energy + 3) / 10
        this.ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height)
   

        // if (this.view.debugging) {
        //     this.drawMouths()
        //     this.drawId()
        // }

        // this.drawMouths()
        // this.drawId()
    
        this.ctx.globalAlpha = 1

    }

    drawMouths() {
        //debugging function
        this.ctx.fillRect(this.mouthPos[0], this.mouthPos[1], this.mouthSize, this.mouthSize)
    }

    drawId() {
        //debugging function
        this.ctx.fillStyle = 'rgba(0,0,0,1)';
        this.ctx.font = "12px serif";
        this.ctx.fillText(`${this.energy}`, this.pos[0], this.pos[1])
    }

}