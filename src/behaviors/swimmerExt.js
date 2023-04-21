import Denizen from "../denizens/denizen"

export default class SwimmerExt {

    constructor(denizen, options) {
        this.denizen = denizen
        this.recentlySwitchedDirections = false
        this.movementSwitchTimer()
        this.timeToSwitchMovement = false
        this.dangerZone = [this.width + 10, this.arenaWidth - this.width - 10]
        this.evaluateDangerZone = false
        this.inDangerZone = false
        this.escapingDangerZone = false
        this.facing = options.facing

        if (this.facing) {
            this.denizen.img = this.imgSelector()
        }

        this.movement1 = this.moveSelector()
        this.movement2 = this.moveSelector()
        this.moveChangerOne()
        this.moveChangerTwo()
    }

    coreloop() {
        if (this.facing) this.dangerZoneProtocol()
        if (this.facing && this.inDangerZone && this.escapingDangerZone) {
            if (this.denizen.pos[0] < 0 + this.denizen.width) {
                this.denizen.pos[0] += .3
            } else {
                this.denizen.pos[0] -= .3
            }
        } else {
            this.move()
        }

        if (this.denizen.dead && !(this.denizen.spawn && this.denizen.foodEaten === this.denizen.growUpThreshold)) this.denizen.logic.denizenCorpse(this.denizen)
        this.behaviorChanger()
    }


    dangerZoneProtocol() {
        if (this.denizen.pos[0] < this.dangerZone[0] || this.denizen.pos[1] > this.dangerZone[1]) {
            if (!this.inDangerZone) {
                setTimeout(() => {
                    if (this.inDangerZone) this.escapingDangerZone = true
                    setTimeout(() => {
                        this.escapingDangerZone = false
                    }, 2000)
                }, 1000)

                this.inDangerZone = true
            }
        } else {
            this.inDangerZone = false
        }
    }


    behaviorChanger() {
        if (!this.denizen.hunting && this.denizen.energy < this.denizen.huntingThreshold) this.denizen.logic.hungryDenizenArr.push(this.denizen)
       
        if (this.denizen.energy > this.denizen.maxEnergy - 1) {
            this.denizen.hunting = false
            this.denizen.eatingSeagrass = false
        }

    }

    movementSwitchTimer() {
        let id = setTimeout(() => {
            this.timeToSwitchMovement = true
            this.movementSwitchTimer()
        }, Math.floor(Math.random() * 25000) + 7000)
        this.denizen.clearOnDeath.push(id)
    }

    imgSelector() {
        return this.denizen.right ? this.denizen.rightImg : this.denizen.leftImg
    }


    switchDirections() {
        if (this.recentlySwitchedDirections) return
        this.denizen.right = !this.denizen.right;
        this.denizen.img = this.imgSelector();
        this.recentlySwitchedDirections = true
        setTimeout(() => { this.recentlySwitchedDirections = false }, 1500)
    }

    move() {

        if (this.denizen.trapped) {
            this.denizen.pos[0] = this.denizen.trapped[0] - this.denizen.trappedPosDelta[0]
            this.denizen.pos[1] = this.denizen.trapped[1] - this.denizen.trappedPosDelta[1]
            return
        }

        if (this.denizen.pos[0] > this.denizen.arenaWidth - this.denizen.width || this.denizen.pos[0] < 0) {
            this.switchDirections()
        }

        if (this.denizen.mater && this.denizen.mater.mating) return
        
        if (this.denizen.pos[1] > this.denizen.arenaHeight - this.denizen.height || this.denizen.pos[1] < 0) this.up = !this.up
        if (this.denizen.speed < .01) this.denizen.speed = (this.denizen.maxSpeed * .25) 

        this.denizen.oldPos = [this.denizen.pos[0], this.denizen.pos[1]]

        if (this.denizen.hunting) {
            this.moveTowardsFood()
            this.swimmerOrienter()
            return
        }

        if (this.denizen.fleeing) {
            this.fleeFromPredator()
            this.swimmerOrienter()
            return
        }

        if (this.timeToSwitchMovement) {
            Object.values(this.movementSwitches)[Math.floor(Math.random() * Object.values(this.movementSwitches).length)]()
            this.timeToSwitchMovement = false
        }

        this.movement1();
        this.movement2();
        this.swimmerOrienter()
    }

    fleeFromPredator() {
        let [xhigh, xlow, yhigh, ylow] = this.inBounds()

        if (this.denizen.pos[0] > this.denizen.fleeFromCoords[0]) {
            if (xhigh) {
                this.denizen.pos[0] += this.denizen.maxSpeed
            } else {
                this.denizen.pos[0] = this.denizen.arenaWidth - this.denizen.width
            }
        } else {
            if (xlow) {
                this.denizen.pos[0] -= this.denizen.maxSpeed
            } else {
                this.denizen.pos[0] = 0
            }
        }

        if (this.denizen.pos[1] > this.denizen.fleeFromCoords[1]) {
            if (yhigh) {
                this.denizen.pos[1] += this.denizen.maxSpeed
            } else {
                this.denizen.pos[1] = this.denizen.arenaHeight - this.denizen.height
            }
        } else {
            if (ylow) {
                this.denizen.pos[1] -= this.denizen.maxSpeed
            } else {
                this.denizen.pos[1] = 0
            }
        }

    }

    inBounds() {
        let xhigh = true
        let xlow = true
        let yhigh = true
        let ylow = true
        if (this.denizen.pos[0] < 0) xlow = false
        if (this.denizen.pos[0] > this.denizen.arenaWidth - this.denizen.width) xhigh = false
        if (this.denizen.pos[1] < 0) ylow = false
        if (this.denizen.pos[1] > this.denizen.arenaHeight - this.denizen.height) yhigh = false
        return [xhigh, xlow, yhigh, ylow]
    }

    movementPatterns = {
        scan: () => {
            if (this.denizen.right) {
                this.denizen.pos[0] += (this.denizen.speed / 2)
            } else {
                this.denizen.pos[0] -= (this.denizen.speed / 2)
            }
        },

        crissCross: () => {
            this.movementPatterns.scan()
            this.movementPatterns.bob()
        },

        bob: () => {
            if (this.up) {
                this.denizen.pos[1] += (this.denizen.speed / 2)
            } else {
                this.denizen.pos[1] -= (this.denizen.speed / 2)
            }
        }
    }

    movementSwitches = {
        reverseUp: () => {
            this.up = !this.up
        },

        reverseSide: () => {
            this.denizen.right = !this.denizen.right;
            this.denizen.img = this.imgSelector();
        },

        speedUp: () => {
            if (this.denizen.speed < this.denizen.maxSpeed) this.denizen.speed += .1
        },

        slowDown: () => {
            if (this.denizen.speed > .3) this.denizen.speed -= .1
        },

        dash: () => {
            this.denizen.speed += .5
            setTimeout(() => this.denizen.speed -= .5, 500)
        }
    }

    swimmerOrienter() {
        if (this.recentlySwitchedDirections) return
        if (this.denizen.oldPos[0] < this.denizen.pos[0]) {
            this.denizen.right = true
            this.denizen.img = this.imgSelector();
            this.recentlySwitchedDirections = true
            setTimeout(() => { this.recentlySwitchedDirections = false }, 1500)
        } else {
            this.denizen.right = false
            this.denizen.img = this.imgSelector();
            this.recentlySwitchedDirections = true
            setTimeout(() => { this.recentlySwitchedDirections = false }, 1500)
        }
    }

    moveTowardsFood() {

        let [xhigh, xlow, yhigh, ylow] = this.inBounds()

            if (this.denizen.mouthEater.mouthPos[0] < this.denizen.nearestFoodCords[0]) {
                if (xhigh) this.denizen.pos[0] += this.denizen.maxSpeed
            } else {
                if (xlow) this.denizen.pos[0] -= this.denizen.maxSpeed
            }

            if (this.denizen.mouthEater.mouthPos[1] < this.denizen.nearestFoodCords[1]) {
                if (yhigh) this.denizen.pos[1] += this.denizen.maxSpeed
            } else {
                if (ylow) this.denizen.pos[1] -= this.denizen.maxSpeed
            }



    }

    moveSelector = () => {
        return Object.values(this.movementPatterns)[Math.floor(Math.random() * 2)]
    }

    moveChangerOne() {
        this.movement1 = this.moveSelector()
        let id = setTimeout(() => {
            this.moveChangerOne()
        }, Math.floor(Math.random() * 3000))
        this.denizen.clearOnDeath.push(id)
    }

    moveChangerTwo() {
        this.movement2 = this.moveSelector()
        let id = setTimeout(() => {
            this.moveChangerTwo()
        }, Math.floor(Math.random() * 3000))
        this.denizen.clearOnDeath.push(id)
    }



}