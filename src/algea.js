export default class Algea {

    constructor(ctx) {
        this.ctx = ctx
        this.pos = this.placer()
    }

    placer() {
        let pos = []
        pos[0] = Math.floor(Math.random() * 290)
        pos[1] = Math.floor(Math.random() * 70) + 70
        return pos
    }

    draw() {
        this.ctx.fillStyle = 'rgba(225,0,225,1)';
        this.ctx.fillRect(this.pos[0], this.pos[1], 10, 5)
    }

    

}