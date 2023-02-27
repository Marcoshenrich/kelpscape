import Denizen from "./denizen"

export default class Swimmer extends Denizen {

    constructor(ctx, canvas, view, posMatrix, logic) {
        super(ctx, canvas, view, posMatrix, logic)
        this.up = [true, false][Math.floor(Math.random() * 2)]
        this.right = [true, false][Math.floor(Math.random() * 2)]
        this.leftImg = new Image()
        this.rightImg = new Image()
        this.img = this.imgSelector()
    }

    imgSelector() {
        return this.right ? this.rightImg : this.leftImg
    }

    move() {
        if (this.pos[0] > this.canvas.width - this.width || this.pos[0] < 0) {
            this.right = !this.right;
            this.img = this.imgSelector();
        }
        if (this.pos[1] > this.canvas.height - this.height || this.pos[1] < 0) this.up = !this.up
        this.mouthPos = this.mouthPlacer();

        if (this.speed < .01) this.speed = .3

        if (!this.mating && this.hunting) {
            this.moveTowardsFood()
        }

        if (!this.mating && !this.hunting) {
            let movementSwitch = Math.floor(Math.random() * 1000)
            if (movementSwitch === 1) Object.values(this.movementSwitches)[Math.floor(Math.random() * Object.values(this.movementSwitches).length)]()

            this.movement1();
            this.movement2();
        }

        // if (!this.mating) this.fishOrienter()
        // this.oldPos = [this.pos[0], this.pos[1]]
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
        },

        dash: () => {
            this.speed += .5
            setTimeout(() => this.speed -= .5, 500)
        }
    }

    fishOrienter() {

        if (this.oldPos[0] < this.pos[0]) {
            this.right = true
            this.img = this.imgSelector();
        } else {
            this.right = false
            this.img = this.imgSelector();
        }
    }

    moveTowardsFood() {
        if (this.mouthPos[0] < this.nearestFoodCords[0]) {
            this.pos[0] += this.maxSpeed 
        } else {
            this.pos[0] -= this.maxSpeed
        }

        if (this.pos[1] < this.nearestFoodCords[1]) {
            this.pos[1] += this.maxSpeed
        } else {
            this.pos[1] -= this.maxSpeed
        }
    }

    moveSelector = () => {
        return Object.values(this.movementPatterns)[Math.floor(Math.random() * 2)]
    }

    moveChangerOne() {
        this.movement1 = this.moveSelector()
        setTimeout(() => {
            this.moveChangerOne()
        }, Math.floor(Math.random() * 5000))
    }

    moveChangerTwo() {
        this.movement2 = this.moveSelector()
        setTimeout(() => {
            this.moveChangerTwo()
        }, Math.floor(Math.random() * 5000))
    }

    consumeEnergy() {
        this.energy -= .005 * this.speed
        if (this.energy < .05) this.dead = true
    }



}