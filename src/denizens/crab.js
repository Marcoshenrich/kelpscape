import Trapper from "../behaviors/trapper";
import Denizen from "./denizen";
import Metabolism from "../behaviors/metabolism";
import Mater from "../behaviors/mater";

export default class Crab extends Denizen {

    constructor(id, ctx, canvas, view, logic, options) {

        super(ctx, canvas, view, logic)

        this.textBox = this.logic.textContentObj["Crab"]
        this.type = "Crab"
        this.id = this.type + id
        this.spawn = false
        this.img = new Image()
        this.img.src = './dist/art/crab.png'
        this.height = 15
        this.width = 30
        this.pos = options.pos || [Math.floor(Math.random() * this.arenaWidth - this.width), this.arenaHeight - this.height]
        this.speed = Math.floor(Math.random() * 4)/10
        this.maxSpeed = .4
        this.up = false
        this.right = [true, false][Math.floor(Math.random() * 2)]
        this.recentlySwitchedDirections = false
        this.dead = false

        this.timeToClimbSeaweed = false
        this.onSeaweed = false

        this.seaweedSpots = this.logic.seaweedSpots
        this.climbSeaweedTimer()

        this.scavenging = false
        this.consumptionRate = .005
        this.recentlyAte = false

        this.maxEnergy = 10
        this.energy = this.maxEnergy
        this.fadeThreshold = 5
        this.energyVal = 10

        this.energyUseCoef = .0007
        this.matingThreshold = 6
        this.matingEnergyCost = 3
        this.mating = false
        this.carryingEggs = false
        this.seekingMate = false

        this.hasGivenBirth = false

        this.trappedPrey = false

        this.totalEnergyConsumed = 0

        this.trapper = options.spawn ? null : new Trapper(this, { trapHeight: 10, trapWidth: this.width + 10, trapYAdjustment: 0, trapXAdjustment: -5, denizenEatsImmediately: true })
        this.metabolism =  new Metabolism(this)
        this.mater = new Mater(this)

    }


    climbSeaweedTimer() {
        let id = setTimeout(() => {
            this.timeToClimbSeaweed = !this.timeToClimbSeaweed
            this.climbSeaweedTimer()
        }, Math.floor(Math.random() * (this.timeToClimbSeaweed ? 60000 : 30000)))
        this.clearOnDeath.push(id)
    }


    movementSwitchTimer() {
        let id = setTimeout(() => {
            this.timeToSwitchMovement = true
            this.movementSwitchTimer()
        }, Math.floor(Math.random() * 2500) + 7000)
        this.clearOnDeath.push(id)
    }

    coreloop() {

        if (this.trapper)this.trapper.coreloop()
        if (this.scavenging) {
            this.consumeFod(this.scavenging, "scavenge")
        }
        if (!this.scavenging) this.move()

        this.mater.coreloop()
        this.metabolism.coreloop()  
        
        this.draw()
        // if (this.view.gameFrame % 10 !== 0) return
        if (this.dead && !(this.spawn && this.totalEnergyConsumed > this.growUpThreshold)) this.logic.denizenCorpse(this)
        

    } 

    mate(spawnBool) {
        this.mating = true
        this.seekingMate = false
        this.speed = 0
        this.energy -= this.matingEnergyCost
    
        let baseId = setTimeout(() => {
            this.speed += .2
            this.mating = false
            if (spawnBool) return
            this.carryingEggs = true
            this.img.src = './dist/art/crabdad.png'

            let secId = setTimeout(() => {
                if (this.trapped) return
                this.img.src = './dist/art/crab.png'
                this.carryingEggs = false
                this.hasGivenBirth = true
                let i = Math.floor(Math.random() * 3) + 2
                while (i > 0) {
                    i--
                    this.logic.spawnDenizen(this)
                }
            },30000)
            this.clearOnDeath.push(secId)

        }, 3000)

        this.clearOnDeath.push(baseId)
    }


    draw(){
        this.ctx.globalAlpha = this.energy > this.fadeThreshold ? 1 : (this.energy + Math.abs(this.fadeThreshold - 10)) / 10
        this.drawDenizen()
        this.ctx.globalAlpha = 1

        if (this.mating) this.ctx.drawImage(this.mateHeart, this.pos[0] + 8.5 + this.offset[0], this.pos[1] + this.offset[1] - 17, 15, 15)

        if (this.view.debugging) {
            this.ctx.fillStyle = 'rgba(255,255,255,1)';
            this.ctx.font = "12px serif";
            this.ctx.fillRect(this.trapPos[0] + this.offset[0], this.trapPos[1] + this.offset[1], this.trapWidth, this.trapHeight)
            this.ctx.fillText(`${this.id}`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1])
            this.ctx.fillText(`[${Math.floor(this.pos[0])},${Math.floor(this.pos[1])}]`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1] - this.height)
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
        if (this.trapped) {
            this.pos[0] = this.trapped[0] - this.trappedPosDelta[0]
            this.pos[1] = this.trapped[1] - this.trappedPosDelta[1]
            return
        }
        
        if (this.mating) return
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

    beforeIDieCB() {
        if (this.trappedPrey) this.trappedPrey.trapped = false
        this.clearOnDeath.forEach((timerId) => {
            clearTimeout(timerId)
        })
    }



    consumeFod(foodSource, foodType) {
        this.energy = Math.min(this.maxEnergy, this.energy + this.consumptionRate)

        foodSource.energyVal -= this.consumptionRate
        this.totalEnergyConsumed += this.consumptionRate

        if (foodSource.pos[1] > this.pos[1] + this.height) this.scavenging = false


        if (foodSource.dead) {
            this.speed = .3
            this.scavenging = false
        }

        if (this.spawn && this.totalEnergyConsumed > this.growUpThreshold) {
            this.growUp()
        }

        if (!this.recentlyAte && !this.scavenging) {
            this.recentlyAte = true
            setTimeout(() => this.recentlyAte = false, 10000)
        }
    }



}

