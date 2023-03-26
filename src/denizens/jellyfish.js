import { rand } from "../engine/utils";
import Denizen from "./denizen";
import Floater from "./floater";
import Swimmer from "./swimmer";

export default class Jellyfish extends Floater {
    constructor(id, ctx, canvas, view, logic){
        super(ctx, canvas, view, logic)
        this.id = "Jellyfish" + id
        this.img = new Image()
        this.img.src = ['./dist/art/jelly1.png', './dist/art/jelly2.png'][rand(2)]
        this.height = 25
        this.width =  15
        this.pos = this.placer()

        this.maxSpeed = .2
        this.speed = rand(1, 20) / 100

        this.up = [true,false][rand(2)]
        this.right = [true, false][rand(2)]

        this.movement1 = this.moveSelector()
        this.movement2 = this.moveSelector()
        this.moveChangerOne()
        this.moveChangerTwo()
    }

    moveSelector = () => {
        return Object.values(this.movementPatterns)[Math.floor(Math.random() * 2)]
    }

    moveChangerOne() {
        this.movement1 = this.moveSelector()
        setTimeout(() => {
            this.moveChangerOne()
        }, Math.floor(Math.random() * 3000))
    }

    moveChangerTwo() {
        this.movement2 = this.moveSelector()
        setTimeout(() => {
            this.moveChangerTwo()
        }, Math.floor(Math.random() * 3000))
    }

    movementSwitchTimer() {
        setTimeout(() => {
            this.timeToSwitchMovement = true
            this.movementSwitchTimer()
        }, Math.floor(Math.random() * 25000) + 7000)
    }

    movementPatterns = {
        scan: () => {
            if (this.right) {
                this.pos[0] += (this.speed / 2)
            } else {
                this.pos[0] -= (this.speed / 2)
            }
        },

        crissCross: () => {
            this.movementPatterns.scan()
            this.movementPatterns.bob()
        },

        bob: () => {
            if (this.up) {
                this.pos[1] += (this.speed / 2)
            } else {
                this.pos[1] -= (this.speed / 2)
            }
        }
    }

    movementSwitches = {
        reverseUp: () => {
            this.up = !this.up
        },

        reverseSide: () => {
            this.right = !this.right;
            this.img = this.imgSelector();
        },

        speedUp: () => {
            if (this.speed < this.maxSpeed) this.speed += .1
        },

        slowDown: () => {
            if (this.speed > .3) this.speed -= .1
        }
    }



    placer() {
        let pos = [rand(1, this.arenaWidth - this.width), rand(1, this.arenaHeight - this.height)]
        return pos
    }

    coreloop() {
        this.bob()
        this.move()
        this.draw()
        if (this.view.debugging) {
            this.ctx.fillStyle = 'rgba(0,0,0,1)';
            this.ctx.font = "12px serif";
            this.ctx.fillText(`${this.pos[1]}`, this.pos[0], this.pos[1])
        }
    }
    
    move() {
        if (this.timeToSwitchMovement) {
            Object.values(this.movementSwitches)[Math.floor(Math.random() * Object.values(this.movementSwitches).length)]()
            this.timeToSwitchMovement = false
        }    
        this.movement1();
        this.movement2();
    }

    draw() {
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
    }
}