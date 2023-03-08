import Seaweed from "./seaweed";

export default class SeaweedCluster {
    constructor(id, ctx, canvas, view, logic) {
        this.id = id
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.logic = logic



        this.pos = [Math.floor( Math.random() * this.view.arenaWidth), 0]
        this.seaweedCount = Math.floor(Math.random() * 5) + 10
        this.seaweed = this.logic.tankPopulator(this.seaweedCount, Seaweed, {pos: this.pos})
    }

    coreloop() {
        Object.values(this.seaweed).forEach((seaweed) => {
            seaweed.coreloop()
        }) 
    }


 

}

