export default class Algae {

    constructor(id, ctx, canvas, view, posMatrix) {
        this.id = "Algae" + id
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.posMatrix = posMatrix
        this.img = new Image()
        this.img.src = './dist/art/algae.png'
        this.height = 8
        this.width = 8
        this.pos = this.placer()
    }

    placer() {
        let pos = []
        pos[0] = Math.floor(Math.random() * this.canvas.width) - this.height
        pos[1] = Math.floor(Math.random() * this.canvas.height / 2) + (this.canvas.height / 2) - this.width
        return pos
    }

    draw() {
        this.ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height)

    }

    

}