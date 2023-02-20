export default class Fish {

    constructor(ctx) {
        this.ctx = ctx
        this.pos = this.placer()
        this.up = [true, false][Math.floor(Math.random() * 2)]
        this.right = [true, false][Math.floor(Math.random() * 2)]
        this.leftImg = new Image()
        this.leftImg.src = './dist/art/fishleft.png'
        this.rightImg = new Image()
        this.rightImg.src = './dist/art/fishright.png'
        this.img = this.right ? this.rightImg : this.leftImg 
    }
    
    placer() {
        let pos = []
        pos[0] = Math.floor(Math.random() * 700)
        pos[1] = Math.floor(Math.random() * 700)
        return pos
    }

    draw() {
        this.drift()
        this.ctx.fillStyle = 'rgba(0,225,225,1)';
        this.ctx.drawImage(this.img, this.pos[0], this.pos[1], 25, 16)

    }

    drift() {
        if (this.pos[0] > 700 - 25 || this.pos[0] < 0) this.right = !this.right
        if (this.pos[1] > 700 - 16 || this.pos[1] < 0) this.up = !this.up


        if (this.right) {
            this.pos[0] += .3
        } else {
            this.pos[0] -= .3
        }

        if (this.up) {
            this.pos[1] += .3
        } else {
            this.pos[1] -= .3
        }
    }

}