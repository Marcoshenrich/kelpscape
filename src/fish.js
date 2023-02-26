export default class Fish {

    constructor(id, ctx, canvas, view, posMatrix) {
        this.id = "Fish" + id
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.posMatrix = posMatrix
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
        this.drift()
        this.ctx.fillStyle = 'rgba(0,225,225,1)';
        this.ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height)
        if (this.view.debugging) this.drawMouths()
        // this.collisionDetector()
    }

    drawMouths() {
        //debugging function in draw()
        if (!this.right) {
            this.ctx.fillRect(this.pos[0], this.pos[1] + (this.height / 2), 8, 8)
        } else {
            this.ctx.fillRect(this.pos[0] + (this.width - 8), this.pos[1] + (this.height / 2), 8, 8)
        }
    }

    drift() {
        if (this.pos[0] > this.canvas.width - this.width || this.pos[0] < 0) this.right = !this.right; this.img = this.imgSelector(); this.mouthPos = this.mouthPlacer()
        if (this.pos[1] > this.canvas.height - this.height || this.pos[1] < 0) this.up = !this.up


        if (this.right) {
            this.pos[0] += this.speed
        } else {
            this.pos[0] -= this.speed
        }

        if (this.up) {
            this.pos[1] += this.speed
        } else {
            this.pos[1] -= this.speed
        }

    }


    collisionDetector(pos1, pos2) {
        // console.log(pos2)
        let [[pos1x, pos1y], [dim1x, dim1y]] = pos1
        let [[pos2x, pos2y], [dim2x, dim2y]] = pos2

        if (
            pos1x < pos2x + dim2x &&
            pos1x + dim1x > pos2x &&
            pos1y < pos2y + dim2y &&
            dim1y + pos1y > pos2y
        ) {
            console.log("eat")
        }
    }
}