export default class Algae {

    constructor(ctx, canvas) {
        this.ctx = ctx
        this.canvas = canvas
        this.img = new Image()
        this.img.src = './dist/art/algae.png'
        this.y = 8
        this.x = 8
        this.pos = this.placer()
    }

    placer() {
        let pos = []
        pos[0] = Math.floor(Math.random() * this.canvas.width) - this.y
        pos[1] = Math.floor(Math.random() * this.canvas.height / 2) + (this.canvas.height / 2) - this.x
        return pos
    }

    draw() {
        this.ctx.drawImage(this.img, this.pos[0], this.pos[1], this.x, this.y)

    }

    

}