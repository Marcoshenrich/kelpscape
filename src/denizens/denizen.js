import { rand } from "../engine/utils"


export default class Denizen {

    constructor(ctx, canvas, view, logic) {
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.logic = logic
        this.dead = false
        this.arenaHeight = this.view.arenaHeight
        this.arenaWidth = this.view.arenaWidth
        this.offset = this.view.offset

        this.mateHeart = new Image()
        this.mateHeart.src = './dist/art/red-heart.png'

        this.clearOnDeath = []
        this.trapped = false
        this.trappedPosDelta = []
    }

    beforeIDieCB() {
        this.clearOnDeath.forEach((timerId)=>{
            clearTimeout(timerId)
        })
    }

    placer() {
        let pos = []
        pos[0] = rand(this.arenaWidth - this.width)
        pos[1] = rand(this.arenaHeight - this.height)
        return pos
    }

    drawDenizen() {
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], + this.pos[1] +  this.offset[1], this.width, this.height)
    }

    afterIEatCB() {

    }

    afterITrapCB() {

    }

}
