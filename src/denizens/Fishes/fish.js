import Swimmer from "../swimmer"



export default class Fish extends Swimmer {

    constructor(ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic)
        this.spawn = false
 
        this.movement1 = this.moveSelector()
        this.movement2 = this.moveSelector()
        this.moveChangerOne()
        this.moveChangerTwo()

        this.width = options.width
        this.height = options.height
        this.mouthSize = options.mouthSize

        this.pos = options.pos || this.placer()

        this.fadeThreshold = 7

        this.mating = false
        this.seekingMate = false
        this.foodEaten = 0

        this.hunting = false
        this.nearestFoodCords = []


        this.fleeDistanceThreshold = 200
        this.fleeing = false
        this.fleeFromCoords = []

        this.afterIEatCB = () => {
            //nothing required, spawn grow up separately
        }
        
    }

    
    placer() {
        let pos = []
        pos[0] = Math.floor(Math.random() * (this.arenaWidth- this.width))
        pos[1] = Math.floor(Math.random() * (this.arenaHeight - this.height)) 
        return pos
    }


    draw() {
        this.ctx.fillStyle = 'rgba(0,225,225,1)';
        this.ctx.globalAlpha = this.energy > 7 ? 1 : (this.energy + 3) / 10
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
        // this.drawMouths()
        if (this.mating) this.ctx.drawImage(this.mateHeart, this.mouthPos[0] + this.offset[0], this.mouthPos[1] + this.offset[1] - this.width, 15, 15)
        if (this.view.debugging) {
        }
        this.drawId()
        this.ctx.globalAlpha = 1
    }

    drawMouths() {
        //debugging function
        this.ctx.fillRect(this.mouthPos[0] + this.offset[0], this.mouthPos[1] + this.offset[1], this.mouthSize, this.mouthSize)
    }

    drawId() {
        //debugging function
        this.ctx.fillStyle = 'rgba(255,255,255,1)';
        this.ctx.font = "12px serif";
        // this.ctx.fillText(`${(Math.round(this.energy * 100) / 100).toFixed(2)}`, this.pos[0] + this.offset[0], this.pos[1] +  this.offset[1])
    }

    mate(spawnBool) {
        this.mating = true
        this.speed = 0
        this.energy -= this.matingEnergyCost
        let id = setTimeout(()=>{
            this.speed += .5
            this.mating = false
            if (spawnBool) return
            let i = Math.floor(Math.random() * 6)
            while (i > 0) {
                i--
                this.logic.spawnDenizen(this) 
            }
        }, 1500)
        this.clearOnDeath.push(id)
    }
}