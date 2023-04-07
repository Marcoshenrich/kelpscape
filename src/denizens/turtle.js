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
        
        this.width = 80
        this.height = 32
        this.maxSpeed = 1
        this.speed = 1
        this.pos = this.placer()
        this.timeToLeave = false
        this.leaveTimer()

        this.movement1 = this.moveSelector()
        this.movement2 = this.moveSelector()
        this.moveChangerOne()
        this.moveChangerTwo()
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
        if (this.timeToLeave) {
            this.enterArena()
            return
        }

        if (this.inArena) {
            this.move()
        } else {
            this.enterArena()
        }
        this.consumeEnergy()
        this.behaviorChanger()
    }

    speedModulator() {
        this.speed -= .005
        if (this.speed < .2) this.speed = this.maxSpeed
    }
}