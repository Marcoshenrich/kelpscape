import Denizen from "./denizen"
import Fishegg from "./fishegg"

export default class Fish extends Denizen {

    constructor(id, ctx, canvas, view, posMatrix, logic, pos, spawn) {
        super(ctx, canvas, view, posMatrix, logic)

        this.id = "Fish" + id
        this.up = [true, false][Math.floor(Math.random() * 2)]
        this.right = [true, false][Math.floor(Math.random() * 2)]
        this.leftImg = new Image()
        this.leftImg.src = './dist/art/fishleft.png'
        this.rightImg = new Image()
        this.rightImg.src = './dist/art/fishright.png'
        this.mateHeart = new Image()
        this.mateHeart.src = './dist/art/red-heart.png'
        this.img = this.imgSelector()
        this.speed = (Math.floor(Math.random() * 5) +1 )/10
        this.width = spawn ? 12 : 25
        this.height = spawn ? 8 : 16
        this.pos = pos || this.placer()
        this.oldPos = this.pos
        this.mouthSize = spawn ? 4 : 8
        this.mouthPos = this.mouthPlacer()
        this.movement1 = this.moveSelector()
        this.movement2 = this.moveSelector()
        this.moveChangerOne()
        this.moveChangerTwo()

        this.maxEnergy = 20
        this.energy = this.maxEnergy
        this.matingThreshold = 15
        this.matingEnergyCost = 5
        this.dead = false
        this.maxSpeed = spawn ? .3 : .6

        this.mating = false
        this.spawn = spawn ? true : false
        this.foodEaten = 0
        this.eatFoodThreshold = 15

        this.hunting = false
        this.nearestFoodCords = []

        
    }

    growUp() {
        this.spawn = false
        this.maxSpeed = .6
        this.mouthSize = 8
        this.width = 25
        this.height = 16
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

    imgSelector() {
       return this.right ? this.rightImg : this.leftImg 
    }
    
    placer() {
        let pos = []
        pos[0] = Math.floor(Math.random() * (this.canvas.width - this.width))
        pos[1] = Math.floor(Math.random() * (this.canvas.height - this.height)) 
        return pos
    }

    draw() {
        this.move()
        this.consumeEnergy()
        this.ctx.fillStyle = 'rgba(0,225,225,1)';
        this.ctx.globalAlpha = this.energy > 7 ? 1 : (this.energy +3) /10
        this.ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height)
        if (this.mating) this.ctx.drawImage(this.mateHeart, this.mouthPos[0], this.mouthPos[1] - 25, 15, 15)
        if (this.view.debugging) {
            this.drawMouths()
            this.drawId()
        }
        this.ctx.globalAlpha = 1
 
    }

    drawMouths() {
        //debugging function
        this.ctx.fillRect(this.mouthPos[0], this.mouthPos[1], this.mouthSize, this.mouthSize)
    }

    drawId() {
        //debugging function
        this.ctx.fillStyle = 'rgba(0,0,0,1)';
        this.ctx.font = "12px serif";
        this.ctx.fillText(`${this.id}`, this.pos[0], this.pos[1])
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
            let movementSwitch = Math.floor(Math.random()*1000)
            if (movementSwitch === 1) Object.values(this.movementSwitches)[Math.floor(Math.random() * Object.values(this.movementSwitches).length)]()

            this.movement1();
            this.movement2();
        }

        // if (!this.mating) this.fishOrienter()
        // this.oldPos = [this.pos[0], this.pos[1]]

        

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
            this.pos[0] += .4
        } else {
            this.pos[0] -= .4
        }

        if (this.pos[1] < this.nearestFoodCords[1]) {
            this.pos[1] += .4
        } else {
            this.pos[1] -= .4
        }
    }


    movementPatterns = {
        scan: ()=>{
            if (this.right) {
                this.pos[0] += (this.speed / 2)
            } else {
                this.pos[0] -= (this.speed / 2)
            }
        },

        crissCross: ()=>{
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
        reverseUp:() => {
            this.up = !this.up
        },

        reverseSide:() => {
            this.right = !this.right;
            this.img = this.imgSelector();
        },

        speedUp:() =>{
            if (this.speed < this.maxSpeed) this.speed += .1
        },

        slowDown:() => {
            if (this.speed > .3)this.speed -= .1
        },

        dash: () => {
            this.speed += .5
            setTimeout(() => this.speed -= .5 ,500)
        }
    }

    moveSelector = () => {
        return Object.values(this.movementPatterns)[Math.floor(Math.random() * 2)]
    }

    moveChangerOne() {
        this.movement1 = this.moveSelector()
        setTimeout(()=>{
            this.moveChangerOne()
        }, Math.floor(Math.random() * 5000))
    }

    moveChangerTwo() {
        this.movement2 = this.moveSelector()
        setTimeout(() => {
            this.moveChangerTwo()
        }, Math.floor(Math.random() * 5000))
    }
    
    consumeEnergy(){
        this.energy -= .005 * this.speed
        if (this.energy < .05) this.dead = true
    }

    mate(spawnBool) {
        this.mating = true
        this.speed = 0
        this.energy -= this.matingEnergyCost
        setTimeout(()=>{
            this.speed += .5
            this.mating = false
            if (spawnBool) return
            let i = Math.floor(Math.random() * 6)
            while (i > 0) {
                i--
                this.logic.eggCount += 1
                this.logic.eggs[this.logic.eggCount] = new Fishegg(this.logic.eggCount, [this.pos[0], this.pos[1]], this.ctx, this.canvas, this.view, this.posMatrix, this.logic)
            }
        }, 1500)
    }
}