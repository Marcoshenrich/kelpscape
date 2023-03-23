import Seaweed from "./seaweed";

export default class SeaweedCluster {
    constructor(id, ctx, canvas, view, logic) {
        this.id = id
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.logic = logic

        this.pos = [Math.floor( Math.random() * this.view.arenaWidth), 0]
        this.seaweedCount = Math.floor(Math.random() * 15) + 10
        this.seaweed = this.logic.tankPopulator(this.seaweedCount, Seaweed, {pos: this.pos})
        this.tallestPoint = this.tallestPointFinder()
    }

    tallestPointFinder() {
        return Object.values(this.seaweed)[0].pos[1] + 10
    }

    coreloop() {
        Object.values(this.seaweed).forEach((seaweed) => {
            seaweed.coreloop()
        }) 
        this.ctx.fillStyle = 'rgba(255,0,0,1)';
        if (this.view.debugging) this.ctx.fillRect(this.pos[0] + 30 + this.view.offset[0], this.tallestPoint + this.view.offset[1], 10,10)
    }


 

}

