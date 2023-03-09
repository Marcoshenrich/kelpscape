import Floater from "./floater"


export default class Algae extends Floater {

    constructor(id, ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.id = "Algae" + id
        this.img = new Image()
        this.img.src = './dist/art/algae.png'
        this.height = 8
        this.width = 8
        this.pos = this.placer()
        this.bobCoef = Math.floor(Math.random() * 10) + 4
        this.bobSpeed = (Math.floor(Math.random() * 3) +.1)/30
        this.trackCoef = 0
        this.up = [true, false][Math.floor(Math.random() * 2)]
        this.energyVal = 10
    }

    placer() {
        let pos = []
        pos[0] = Math.floor(Math.random() * this.arenaWidth) - this.width
        pos[1] = Math.floor(Math.random() * this.arenaHeight / 2) + (this.arenaHeight / 2) - this.height
        return pos
    }

    

}