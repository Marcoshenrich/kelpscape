import CrabBaby from "./crabbaby";
import DeadCreature from "./deadCreature";
import Swimmer from "./swimmer";


export default class Crab extends Swimmer {

    constructor(id, ctx, canvas, view, logic, pos) {

        super(ctx, canvas, view, logic)

        this.id = "Crab" + id
        this.spawn = false
        this.img = new Image()
        this.img.src = './dist/art/crab.png'
        this.height = 15
        this.width = 30
        this.pos = pos || [Math.floor(Math.random() * this.arenaWidth - this.width), this.arenaHeight - this.height]
        this.speed = Math.floor(Math.random() * 4)/10
        this.maxSpeed = .4
        this.up = false
        this.right = [true, false][Math.floor(Math.random() * 2)]
        this.recentlySwitchedDirections = false
        this.dead = false

        this.timeToClimbSeaweed = false
        this.onSeaweed = false

        this.seaweedSpots = this.seaweedFinder()
        this.climbSeaweedTimer()

        this.scavenging = false
        this.consumptionRate = .005
        this.recentlyAte = false

        this.maxEnergy = 10
        this.energy = this.maxEnergy
        this.fadeThreshold = 5
        

        this.energyUseCoef = .0007
        this.matingThreshold = 6
        this.matingEnergyCost = 3
        this.mating = false
        this.carryingEggs = false
        this.seekingMate = false

        this.trapHeight = 6
        this.trapWidth = this.width
        this.trapPos = this.pos
        this.trappedPrey = false

        this.totalEnergyConsumed = 0
    }


    climbSeaweedTimer() {
        setTimeout(() => {
            this.timeToClimbSeaweed = !this.timeToClimbSeaweed
            this.climbSeaweedTimer()
        }, Math.floor(Math.random() * (this.timeToClimbSeaweed ? 60000 : 30000)))
    }

    seaweedFinder() {
        let seaweedSpots = {}
        Object.values(this.logic.seaweedClusters).forEach((seaweedCluster) => {
            seaweedSpots[(seaweedCluster.pos[0] + Object.values(seaweedCluster.seaweed)[0].width / 2)] = seaweedCluster
        })
        return seaweedSpots
    }

    movementSwitchTimer() {
        setTimeout(() => {
            this.timeToSwitchMovement = true
            this.movementSwitchTimer()
        }, Math.floor(Math.random() * 2500) + 7000)
    }

    coreloop() {
        if (this.trappedPrey) {
            this.consumeFod(this.trappedPrey, "trapped")
        } else if (this.scavenging) {
            this.consumeFod(this.scavenging, "scavenge")
        }
        if (!this.scavenging) this.move()

        this.consumeEnergy()
        this.behaviorChanger()
        this.draw()
        // if (this.view.gameFrame % 10 !== 0) return
        // if (this.dead && !(this.spawn && this.totalEnergyConsumed > this.growUpThreshold)) this.becomeCorpse()
        

    } 

    behaviorChanger(){
        if (!this.spawn && !this.seekingMate && this.energy > this.matingThreshold && this.recentlyAte && !this.carryingEggs) {
            this.logic.matingDenizensObj[this.id] = this
            this.seekingMate = true
        } else if (!this.spawn && this.seekingMate && this.energy < this.matingThreshold) {
            delete this.logic.matingDenizensObj[this.id]
            this.seekingMate = false
        }
    }

    mate(spawnBool) {
        this.mating = true
        this.seekingMate = false
        this.speed = 0
        this.energy -= this.matingEnergyCost
    
        setTimeout(() => {
            this.speed += .2
            this.mating = false
            if (spawnBool) return
            this.carryingEggs = true
            this.img.src = './dist/art/crabdad.png'

            setTimeout(() => {
                this.img.src = './dist/art/crab.png'
                this.carryingEggs = false
                let i = Math.floor(Math.random() * 3) + 2
                while (i > 0) {
                    i--
                    this.logic.crabBabyCount += 1
                    this.logic.crabBabies["CrabBaby" + this.logic.crabBabyCount] = new CrabBaby(this.logic.crabBabyCount, this.ctx, this.canvas, this.view, this.logic, [Math.floor(this.pos[0]), Math.floor(this.pos[1])])
                }
            },30000)

        }, 3000)
    }

    consumeFod(foodSource, foodType) {
        this.energy = Math.min(this.maxEnergy, this.energy + this.consumptionRate)
        if (foodType === "scavenge") {
            foodSource.energyVal -= this.consumptionRate
        } else {
            foodSource.energy -= this.consumptionRate
        }
        
        this.totalEnergyConsumed += this.consumptionRate
        if (foodSource.dead) {
            this.speed = .3
            foodType === "scavenge" ? this.scavenging = false : this.trappedPrey = false
        }

        if (this.spawn && this.totalEnergyConsumed > this.growUpThreshold) {
            this.growUp()
        }

        if (!this.recentlyAte && !this.scavenging) {
            this.recentlyAte = true
            setTimeout(() =>  this.recentlyAte = false, 10000) 
        }
    }

    becomeCorpse() {
        this.logic.deadCreatureCount++
        this.logic.deadCreatures["DeadCreature" + this.logic.deadCreatureCount] = new DeadCreature(this.logic.deadCreatureCount, this.ctx, this.canvas, this.view, this.logic, this.pos, { type: "Crab" })
    }

    consumeEnergy() {

        this.energy -= this.energyUseCoef * this.speed
        if (this.energy < .01) {
            this.dead = true
            this.logic.recentlyDeadDenizens.push(this)
        }

    }


    draw(){
        this.ctx.globalAlpha = this.energy > this.fadeThreshold ? 1 : (this.energy + Math.abs(this.fadeThreshold - 10)) / 10
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
        this.ctx.globalAlpha = 1

        if (this.mating) this.ctx.drawImage(this.mateHeart, this.pos[0] + 8.5 + this.offset[0], this.pos[1] + this.offset[1] - 17, 15, 15)

        this.ctx.fillStyle = 'rgba(255,255,255,1)';
        this.ctx.font = "12px serif";
        this.ctx.fillText(`${this.energy}`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1])

        if (this.view.debugging) {
            this.ctx.fillStyle = 'rgba(255,255,255,1)';
            this.ctx.font = "12px serif";
            this.ctx.fillText(`${this.id}`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1])
            this.ctx.fillText(`[${Math.floor(this.pos[0])},${Math.floor(this.pos[1])}]`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1] - this.height)
            this.ctx.fillRect(this.trapPos[0] + this.offset[0], this.trapPos[1] + this.offset[1], this.trapWidth, this.trapHeight)
        }
        
    }


    travelLand() {

        if (this.pos[0] > this.arenaWidth - this.width || this.pos[0] < 0) {
            this.switchDirections()
        }

        if (this.pos[1] + this.height > this.arenaHeight) this.pos[1] = this.arenaHeight - this.height 

        if (this.right) {
            this.pos[0] += this.speed
        } else {
            this.pos[0] -= this.speed
        }
    }


    climbSeaweed(climbBool) {
        if (climbBool) {
            if (this.pos[1] < this.onSeaweed.tallestPoint + this.height || this.pos[1] > this.arenaHeight - this.height) {
                this.switchDirections()
            }

            if (!this.right) {
                this.pos[1] += this.speed
            } else {
                this.pos[1] -= this.speed
            }
            return
        }

        this.pos[1] += this.speed
        if (this.pos[1] > this.arenaHeight - this.height) {
            this.onSeaweed = false
        }
    }







    move() {
        if (!this.onSeaweed && this.timeToClimbSeaweed && (Math.floor(this.pos[0]) in this.seaweedSpots) ) {
            this.onSeaweed = this.seaweedSpots[Math.floor(this.pos[0])]
        }

        if (this.onSeaweed && !this.timeToClimbSeaweed) {
            this.climbSeaweed(false)
            return
        }

        if (this.onSeaweed) {
            this.climbSeaweed(true)
        } else {
            this.travelLand()
        }

        if (this.timeToSwitchMovement) {
            Object.values(this.movementSwitches)[Math.floor(Math.random() * Object.values(this.movementSwitches).length)]()
            this.timeToSwitchMovement = false
        }
        
    }

    movementSwitches = {

        reverseSide: () => {
            this.right = !this.right;
        },

        reverseSide2: () => {
            this.right = !this.right;
        },

        speedUp: () => {
            if (this.speed < this.maxSpeed) this.speed += .05
        },

        slowDown: () => {
            if (this.speed > .1) this.speed -= .05
        },

        chill: () => {
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

