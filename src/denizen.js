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
    }
    

    collisionDetector(pos1, pos2) {
        let [[pos1x, pos1y], [dim1x, dim1y]] = pos1
        let [[pos2x, pos2y], [dim2x, dim2y]] = pos2

        if (
            pos1x < pos2x + dim2x &&
            pos1x + dim1x > pos2x &&
            pos1y < pos2y + dim2y &&
            dim1y + pos1y > pos2y
        ) {
            return true
        }
        return false
    }

}
