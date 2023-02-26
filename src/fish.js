import Denizen from "./denizen"

export default class Fish extends Denizen {

    constructor(id, ctx, canvas, view, posMatrix) {
        super(ctx, canvas, view, posMatrix)
        this.id = "Fish" + id
        this.up = [true, false][Math.floor(Math.random() * 2)]
        this.right = [true, false][Math.floor(Math.random() * 2)]
        this.leftImg = new Image()
        this.leftImg.src = './dist/art/fishleft.png'
        this.rightImg = new Image()
        this.rightImg.src = './dist/art/fishright.png'
        this.img = this.imgSelector()
        this.speed = (Math.floor(Math.random() * 5) +1 )/10
        this.width = 25
        this.height = 16
        this.pos = this.placer()
        this.mouthSize = 8
        this.mouthPos = this.mouthPlacer()
        this.movement1 = this.moveSelector()
        this.movement2 = this.moveSelector()
        this.moveChangerOne()
        this.moveChangerTwo()

        this.energy = 15
        this.dead = false
        
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
        if (this.view.debugging) this.drawMouths()
        this.ctx.globalAlpha = 1
 
    }

    drawMouths() {
        //debugging function in draw()
        this.ctx.fillRect(this.mouthPos[0], this.mouthPos[1], this.mouthSize, this.mouthSize)
  
    }

    move() {
        if (this.pos[0] > this.canvas.width - this.width || this.pos[0] < 0) {
            this.right = !this.right;
            this.img = this.imgSelector();
        }
        if (this.pos[1] > this.canvas.height - this.height || this.pos[1] < 0) this.up = !this.up
        this.mouthPos = this.mouthPlacer();

        let changeDirection = Math.floor(Math.random() * 5000);
        if (changeDirection < 5) [this.reverseSide(), this.reverseUp()][Math.floor(Math.random() * 2)]
        this.movement1();
        this.movement2();

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

    

    reverseUp() {
        this.up = !this.up
    }

    reverseSide() {
        this.right = !this.right;
        this.img = this.imgSelector();
    }



    scan() {
        if (this.right) {
            this.pos[0] += (this.speed/2)
        } else {
            this.pos[0] -= (this.speed/2)
        }
    }

    dash() {

    }
    
    consumeEnergy(){
        this.energy -= .01 * this.speed
        if (this.energy < .05) this.dead = true
    }
}