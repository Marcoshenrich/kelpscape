export default class Floater {

    constructor(ctx) {
        this.ctx = ctx
        this.pos = this.placer()
        this.up = [true, false][Math.floor(Math.random() * 2)]
        this.right = [true, false][Math.floor(Math.random() * 2)]
    }
    
    placer() {
        let pos = []
        pos[0] = Math.floor(Math.random() * 290)
        pos[1] = Math.floor(Math.random() * 145)
        return pos
    }

    draw() {
        this.drift()
        this.ctx.fillStyle = 'rgba(0,225,225,1)';
        this.ctx.fillRect(this.pos[0], this.pos[1], 10, 5)
    }

    drift() {
        if (this.pos[0] > 290 || this.pos[0] < 0) this.right = !this.right
        if (this.pos[1] > 145 || this.pos[1] < 0) this.up = !this.up


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