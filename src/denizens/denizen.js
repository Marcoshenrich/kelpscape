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

    clearCallbacksOnDeath() {
        this.clearOnDeath.forEach((timerId)=>{
            clearTimeout(timerId)
        })
    }

}
