
import Effect from "./effect"
import Swimmer from "./swimmer"
import MouthEater from "../behaviors/moutheater"

export default class Shark extends Swimmer {

    constructor(id, ctx, canvas, view, logic, spawn) {
        super(ctx, canvas, view, logic)
        this.textBox = this.logic.textContentObj["Shark"]
        this.type = "Shark"
        this.id = this.type + id

        this.leftImg.src = './dist/art/sharkleft.png'
        this.rightImg.src = './dist/art/sharkright.png'
        this.mateHeart = new Image()
        this.mateHeart.src = './dist/art/red-heart.png'
        this.speed = (Math.floor(Math.random() * 5) + 5) / 10
        this.width = spawn ? 20 : 100
        this.height = spawn ? 8 : 41
        this.pos = this.placer()
        this.oldPos = this.pos
        this.movement1 = this.moveSelector()
        this.movement2 = this.moveSelector()
        this.moveChangerOne()
        this.moveChangerTwo()

        this.seekingMate = false
        this.mateThreshold = 70
        
        this.maxEnergy = 100
        this.energy = this.maxEnergy
        this.fadeThreshold = 7
        this.energyUseCoef = .005
        this.matingThreshold = 15
        this.matingEnergyCost = 5
        this.maxSpeed = spawn ? .3 : 1

        this.mating = false
        this.spawn = spawn ? true : false
        this.foodEaten = 0
        this.huntingThreshold = 60
        this.eatFoodThreshold = 70

        this.hunting = false
        this.nearestFoodCords = []

        this.afterIEatCB = () => {
            this.logic.effectCount++
            this.logic.effects["Effect" + this.logic.effectCount] = new Effect(this.logic.effectCount, this.ctx, this.canvas, this.view, this.logic, {type: "bloodSpurt", pos: [this.mouthEater.mouthPos[0], this.mouthEater.mouthPos[1]], size: 10})
        }

        this.mouthEater = new MouthEater(this, { mouthHeight: 12, mouthWidth: 12, leftMouthYAdjustment: (this.height / 2), leftMouthXAdjustment: 5, rightMouthXAdjustment: (this.width - 12) - 5, rightMouthYAdjustment: (this.height / 2) })

    }

    imgSelector() {
        return this.right ? this.rightImg : this.leftImg
    }

    placer() {
        let pos = []
        pos[0] = Math.floor(Math.random() * (this.arenaWidth - this.width))
        pos[1] = Math.floor(Math.random() * (this.arenaHeight - this.height))
        return pos
    }


    draw() {
        this.ctx.fillStyle = 'rgba(0,225,225,1)';
        this.ctx.globalAlpha = this.energy > this.fadeThreshold ? 1 : (this.energy + Math.abs(this.fadeThreshold - 10)) / 10
        this.drawDenizen()
        this.ctx.globalAlpha = 1
    }


    drawId() {
        //debugging function
        this.ctx.fillStyle = 'rgba(0,0,0,1)';
        this.ctx.font = "12px serif";
        this.ctx.fillText(`${this.energy}`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1])
    }

    mate(){
        
    }

}