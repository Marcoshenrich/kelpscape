import Denizen from "./denizen";
import Swimmer from "./swimmer";

export default class Crab extends Swimmer {

    constructor(id, ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.id = "Crab" + id
        this.img = new Image()
        this.img.src = './dist/art/crab.png'
        this.height = 15
        this.width = 30
        this.pos = [Math.floor(Math.random() * this.arenaWidth - this.width), this.arenaHeight - this.height]
        this.speed = Math.floor(Math.random() * 4)/10
        this.maxSpeed = .4
        this.right = [true, false][Math.floor(Math.random() * 2)]
        this.recentlySwitchedDirections = false
        this.climbSeaweed = false
    }

    movementSwitchTimer() {
        setTimeout(() => {
            this.timeToSwitchMovement = true
            this.movementSwitchTimer()
        }, Math.floor(Math.random() * 2500) + 7000)
    }

    coreloop() {
        this.move()
        this.draw()
    }


    draw(){
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
    }

    move() {

        if (this.pos[0] > this.arenaWidth - this.width || this.pos[0] < 0) {
            this.switchDirections()
        }

        if (this.right) {
            this.pos[0] += this.speed
        } else {
            this.pos[0] -= this.speed 
        }

        if (this.timeToSwitchMovement) {
            console.log("move Time")
            Object.values(this.movementSwitches)[Math.floor(Math.random() * Object.values(this.movementSwitches).length)]()
            this.timeToSwitchMovement = false
        }
        
    }

    movementSwitches = {

        reverseSide: () => {
            console.log(this)
            this.right = !this.right;
        },

        speedUp: () => {
            console.log(this)
            if (this.speed < this.maxSpeed) this.speed += .05
        },

        slowDown: () => {
            console.log(this)
            if (this.speed > .1) this.speed -= .05
        },

        chill: () => {
            console.log(this)
            this.speed = 0
            setTimeout(()=>{
                this.speed = .3
            },Math.floor(Math.random() * 9000) +  1000)
        }
    }

    switchDirections() {
        if (this.recentlySwitchedDirections) return
        this.right = !this.right;
        this.recentlySwitchedDirections = true
        setTimeout(() => { this.recentlySwitchedDirections = false }, 350)
    }




}

