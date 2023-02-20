export default class Fish {

    constructor(ctx, canvas) {
        this.ctx = ctx
        this.canvas = canvas
        this.up = [true, false][Math.floor(Math.random() * 2)]
        this.right = [true, false][Math.floor(Math.random() * 2)]
        this.leftImg = new Image()
        this.leftImg.src = './dist/art/fishleft.png'
        this.rightImg = new Image()
        this.rightImg.src = './dist/art/fishright.png'
        this.img = this.imgSelector()
        this.speed = (Math.floor(Math.random() * 5) +1 )/10
        this.x = 25
        this.y = 16
        this.pos = this.placer()
    }


    imgSelector() {
       return this.right ? this.rightImg : this.leftImg 
    }
    
    placer() {
        let pos = []
        pos[0] = Math.floor(Math.random() * (this.canvas.width - this.x))
        pos[1] = Math.floor(Math.random() * (this.canvas.height - this.y)) 
        return pos
    }

    draw() {
        this.drift()
        this.ctx.fillStyle = 'rgba(0,225,225,1)';
        this.ctx.drawImage(this.img, this.pos[0], this.pos[1], this.x, this.y)
        if (!this.right) {
            this.ctx.fillRect(this.pos[0], this.pos[1] + (this.y/2), 8, 8)
        } else {
            this.ctx.fillRect(this.pos[0] + (this.x - 8), this.pos[1] + (this.y / 2), 8, 8)
        }

    }

    drift() {
        if (this.pos[0] > 700 - 25 || this.pos[0] < 0) this.right = !this.right; this.img = this.imgSelector();
        if (this.pos[1] > 700 - 16 || this.pos[1] < 0) this.up = !this.up


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

}