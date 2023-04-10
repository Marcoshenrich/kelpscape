import Denizen from "./denizen"

export default class SwimmerExtension {

    constructor(denizen) {
        this.denizen = denizen
        this.up = [true, false][Math.floor(Math.random() * 2)]
        this.right = [true, false][Math.floor(Math.random() * 2)]
        this.leftImg = new Image()
        this.rightImg = new Image()
        this.img = this.imgSelector()
        this.recentlySwitchedDirections = false
        this.movementSwitchTimer()
        this.timeToSwitchMovement = false
        this.dangerZone = [this.width + 10, this.arenaWidth - this.width - 10]
        this.evaluateDangerZone = false
        this.inDangerZone = false
        this.escapingDangerZone = false
    }

    coreloop() {
        if (this.inDangerZone && this.escapingDangerZone) {
            if (this.pos[0] < 0 + this.width) {
                this.pos[0] += .3
            } else {
                this.pos[0] -= .3
            }
        } else {
            this.move()
        }
        if (this.mouthEater) {
            this.mouthEater.coreloop()
        } else {
            this.mouthPos = this.mouthPlacer();
        }
        this.consumeEnergy()
        this.draw()
        // if (this.view.gameFrame % 10 !== 0) return
        if (this.dead && !(this.spawn && this.foodEaten === this.growUpThreshold)) this.logic.denizenCorpse(this)
        this.behaviorChanger()
        this.dangerZoneProtocol()
    }


    dangerZoneProtocol() {
        if (this.pos[0] < this.dangerZone[0] || this.pos[1] > this.dangerZone[1]) {
            if (!this.inDangerZone) {
                setTimeout(() => {
                    if (this.inDangerZone) this.escapingDangerZone = true
                    setTimeout(() => {
                        this.escapingDangerZone = false
                    }, 1000)
                }, 1000)

                this.inDangerZone = true
            }
        } else {
            this.inDangerZone = false
        }
    }


    behaviorChanger() {
        if (!this.hunting && this.energy < this.huntingThreshold) this.logic.hungryDenizenArr.push(this)

        if (!this.spawn && !this.seekingMate && this.energy > this.matingThreshold) {
            this.logic.matingDenizensObj[this.id] = this
            this.seekingMate = true
        } else if (!this.spawn && this.seekingMate && this.energy < this.matingThreshold) {
            delete this.logic.matingDenizensObj[this.id]
            this.seekingMate = false
        }

        if (this.energy > this.maxEnergy - 1) {
            this.hunting = false
            this.eatingSeagrass = false
        }

    }

    movementSwitchTimer() {
        let id = setTimeout(() => {
            this.timeToSwitchMovement = true
            this.movementSwitchTimer()
        }, Math.floor(Math.random() * 25000) + 7000)
        this.clearOnDeath.push(id)
    }

    imgSelector() {
        return this.right ? this.rightImg : this.leftImg
    }


    switchDirections() {
        if (this.recentlySwitchedDirections) return
        this.right = !this.right;
        this.img = this.imgSelector();
        this.recentlySwitchedDirections = true
        setTimeout(() => { this.recentlySwitchedDirections = false }, 1500)
    }

    imgSelector() {
        return this.right ? this.rightImg : this.leftImg
    }

    move() {

        if (this.trapped) {
            this.pos[0] = this.trapped[0] - this.trappedPosDelta[0]
            this.pos[1] = this.trapped[1] - this.trappedPosDelta[1]
            return
        }

        if (this.pos[0] > this.arenaWidth - this.width || this.pos[0] < 0) {
            this.switchDirections()
        }
        if (this.pos[1] > this.arenaHeight - this.height || this.pos[1] < 0) this.up = !this.up

        if (this.speed < .01) this.speed = .3

        this.oldPos = [this.pos[0], this.pos[1]]

        if (!this.mating && this.hunting) {
            this.moveTowardsFood()
            this.swimmerOrienter()
            return
        }

        if (this.fleeing) {
            this.fleeFromPredator()
            this.swimmerOrienter()
            return
        }

        if (!this.mating && !this.hunting) {
            if (this.timeToSwitchMovement) {
                Object.values(this.movementSwitches)[Math.floor(Math.random() * Object.values(this.movementSwitches).length)]()
                this.timeToSwitchMovement = false
            }

            this.movement1();
            this.movement2();
            this.swimmerOrienter()
        }


    }

    fleeFromPredator() {
        let [xhigh, xlow, yhigh, ylow] = this.inBounds()


        if (this.pos[0] > this.fleeFromCoords[0]) {
            if (xhigh) {
                this.pos[0] += this.maxSpeed
            } else {
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

    inBounds() {
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

    swimmerOrienter() {
        if (this.recentlySwitchedDirections) return
        if (this.oldPos[0] < this.pos[0]) {
            this.right = true
            this.img = this.imgSelector();
            this.recentlySwitchedDirections = true
            setTimeout(() => { this.recentlySwitchedDirections = false }, 1500)
        } else {
            this.right = false
            this.img = this.imgSelector();
            this.recentlySwitchedDirections = true
            setTimeout(() => { this.recentlySwitchedDirections = false }, 1500)
        }
    }

    moveTowardsFood() {

        let [xhigh, xlow, yhigh, ylow] = this.inBounds()

        if (this.mouthEater) {
            if (this.mouthEater.mouthPos[0] < this.nearestFoodCords[0]) {
                if (xhigh) this.pos[0] += this.maxSpeed
            } else {
                if (xlow) this.pos[0] -= this.maxSpeed
            }

            if (this.mouthEater.mouthPos[1] < this.nearestFoodCords[1]) {
                if (yhigh) this.pos[1] += this.maxSpeed
            } else {
                if (ylow) this.pos[1] -= this.maxSpeed
            }
        } else {
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



    }

    moveSelector = () => {
        return Object.values(this.movementPatterns)[Math.floor(Math.random() * 2)]
    }

    moveChangerOne() {
        this.movement1 = this.moveSelector()
        let id = setTimeout(() => {
            this.moveChangerOne()
        }, Math.floor(Math.random() * 3000))
        this.clearOnDeath.push(id)
    }

    moveChangerTwo() {
        this.movement2 = this.moveSelector()
        let id = setTimeout(() => {
            this.moveChangerTwo()
        }, Math.floor(Math.random() * 3000))
        this.clearOnDeath.push(id)
    }

    consumeEnergy() {
        this.energy -= this.energyUseCoef * this.speed
        if (this.energy < .05) {
            this.dead = true
            this.logic.recentlyDeadDenizens.push(this)
            this.logic.denizenCorpse(this)
        }
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


}