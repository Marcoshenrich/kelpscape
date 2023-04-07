import { rand } from "../engine/utils";
import Swimmer from "./swimmer";

export default class Turtle extends Swimmer {
    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic)
        this.textBox = this.logic.textContentObj["Turtle"]
        this.type = "Turtle"
        this.id = this.type + id
        this.leftImg.src = './dist/art/turtleleft.png'
        this.rightImg.src = './dist/art/turtleright.png'
        this.img = this.imgSelector()

        this.inArena = false

        this.maxEnergy = 20
        this.energy = rand(10,20)
        this.energyUseCoef = .004

        this.huntingThreshold = 13
        this.mouthSize = 8

        
        this.width = 80
        this.height = 32
        this.maxSpeed = 1
        this.speed = 1
        this.pos = this.placer()
        this.timeToLeave = false
        this.leaveTimer()

        this.mouthPos = this.mouthPlacer()

        this.eatingSeagrass = false
        this.consumptionRate = .005
        this.recentlyAte = false

        this.movement1 = this.moveSelector()
        this.movement2 = this.moveSelector()
        this.moveChangerOne()
        this.moveChangerTwo()
    }

    mouthPlacer() {
        let mouthPos = []
        if (!this.right) {
            mouthPos = [this.pos[0], this.pos[1] + (this.height / 2) - 8]
        } else {
            mouthPos = [this.pos[0] + (this.width - this.mouthSize), this.pos[1] + (this.height / 2) - 8]
        }
        return mouthPos
    }

    leaveTimer() {
        setTimeout(() => {
            this.timeToLeave = true
        }, Math.floor(Math.random() * 60000) + 60000)
    }

    placer() {
        let x = this.right ? 0 - this.width : this.arenaWidth
        return [x, rand(this.arenaHeight - this.height)]
    }

    enterArena() {
        if (this.right) {
            if (this.pos[0] > 0) this.inArena = true
            this.pos[0] += this.speed
        } else {
            if (this.pos[0] < this.arenaWidth - this.width) this.inArena = true
            this.pos[0] -= this.speed
        }
    }

    coreloop() {
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
        this.speedModulator()
        this.ctx.fillText(`${(Math.round(this.energy * 100) / 100).toFixed(2)}`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1] + 10)
        if (this.timeToLeave) {
            this.enterArena()
            return
        }

        if (this.inArena) {
            if (!this.eatingSeagrass) this.move()
        } else {
            this.enterArena()
        }

        this.consumeEnergy()
        if (this.hunting) this.consumeFood()
        this.behaviorChanger()

        this.ctx.fillRect(this.mouthPos[0] + this.offset[0], this.mouthPos[1] + this.offset[1], this.mouthSize, this.mouthSize)
    }

    moveTowardsFood() {

        let [xhigh, xlow, yhigh, ylow] = this.inBounds()

        if (this.mouthPos[0] < this.nearestFoodCords[0]) {
            if (xhigh) this.pos[0] += this.maxSpeed
        } else {
            if (xlow) this.pos[0] -= this.maxSpeed
        }

        if (this.mouthPos[1] < this.nearestFoodCords[1]) {
            if (yhigh) this.pos[1] += this.maxSpeed
        } else {
            if (ylow) this.pos[1] -= this.maxSpeed
        }

    }

    consumeFood() {
        if (!this.eatingSeagrass || this.hunting.type !== "Seaweed") return
        this.energy = Math.min(this.maxEnergy, this.energy + this.consumptionRate)
        this.hunting.energyVal -= this.consumptionRate
    }

    speedModulator() {
        this.speed -= .005
        if (this.speed < .2) this.speed = this.maxSpeed
    }
}