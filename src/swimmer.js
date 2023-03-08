import Denizen from "./denizen"
import DeadCreature from "./deadCreature"

export default class Swimmer extends Denizen {

    constructor(ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.up = [true, false][Math.floor(Math.random() * 2)]
        this.right = [true, false][Math.floor(Math.random() * 2)]
        this.leftImg = new Image()
        this.rightImg = new Image()
        this.img = this.imgSelector()
        this.recentlySwitchedDirections = false
        this.movementSwitchTimer()
        this.timeToSwitchMovement = false
    }

    movementSwitchTimer() {
        setTimeout(()=>{
            this.timeToSwitchMovement = true
            this.movementSwitchTimer()
        },Math.floor(Math.random() * 25000) + 7000)
    }

    imgSelector() {
        return this.right ? this.rightImg : this.leftImg
    }

    //maybe refactor so that moving left and right is an intrinsic state, and the switch happens accordingly to movement 
    // one issue is that the mouthpos changes, which is partially causing the bug

    switchDirections() {
        if (this.recentlySwitchedDirections) return
        this.right = !this.right;
        this.img = this.imgSelector();
        this.recentlySwitchedDirections = true
        setTimeout(() => { this.recentlySwitchedDirections = false },350)
    }

    move() {
        if (this.pos[0] > this.arenaWidth - this.width || this.pos[0] < 0) {
            this.switchDirections()
        }
        if (this.pos[1] > this.arenaHeight - this.height || this.pos[1] < 0) this.up = !this.up
        this.mouthPos = this.mouthPlacer();

        if (this.speed < .01) this.speed = .3

        this.oldPos = [this.pos[0], this.pos[1]]

        if (!this.mating && this.hunting) {
            this.moveTowardsFood()
            this.fishOrienter()
            return
        }

        if (this.fleeing) {
            this.fleeFromPredator()
            this.fishOrienter()
            return
        }

        if (!this.mating && !this.hunting) {
            if (this.timeToSwitchMovement){
                Object.values(this.movementSwitches)[Math.floor(Math.random() * Object.values(this.movementSwitches).length)]()
                this.timeToSwitchMovement = false
            }    

            this.movement1();
            this.movement2();
            this.fishOrienter()
        }


    }

    fleeFromPredator() {
        let [xhigh, xlow, yhigh, ylow] = this.inBounds()


        if (this.pos[0] > this.fleeFromCoords[0]) {
            if (xhigh) {
                this.pos[0] += this.maxSpeed
            }else {
                this.pos[0] = this.arenaWidth - this.width
            }
        } else {
            if (xlow) {
                this.pos[0] -= this.maxSpeed
            } else {
                this.pos[0] = 0
            }
        }

        if (this.pos[1] > this.fleeFromCoords[1]) {
            if (yhigh) {
                this.pos[1] += this.maxSpeed
            } else {
                this.pos[1] = this.arenaHeight - this.height
            }
        } else {
            if (ylow) {
                this.pos[1] -= this.maxSpeed
            } else {
                this.pos[1] = 0
            }
        }

    }

    inBounds(){
        let xhigh = true
        let xlow = true
        let yhigh = true
        let ylow = true
        if (this.pos[0] < 0) xlow = false
        if (this.pos[0] > this.arenaWidth - this.width) xhigh = false
        if (this.pos[1] < 0) ylow = false
        if (this.pos[1] > this.arenaHeight - this.height) yhigh = false
        return [xhigh, xlow, yhigh, ylow]
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
        if (this.recentlySwitchedDirections) return
        if (this.oldPos[0] < this.pos[0]) {
            this.right = true
            this.img = this.imgSelector();
            this.recentlySwitchedDirections = true
            setTimeout(() => { this.recentlySwitchedDirections = false }, 350)
        } else {
            this.right = false
            this.img = this.imgSelector();
            this.recentlySwitchedDirections = true
            setTimeout(() => { this.recentlySwitchedDirections = false }, 350)
        }
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

    consumeEnergy() {
        this.energy -= this.energyUseCoef * this.speed
        if (this.energy < .05) this.dead = true
    }

    becomeCorpse() {
        this.logic.deadCreatureCount++
        this.logic.deadCreatures[this.logic.deadCreatureCount] = new DeadCreature(this.logic.deadCreatureCount, this.ctx, this.canvas, this.view, this.logic, this.pos, { type: (this.spawn ? "Spawn": "Fish")})
    }



}