import { rand } from "../engine/utils";
import Seaweed from "./seaweed";


export default class SeaweedCluster {
    constructor(id, ctx, canvas, view, logic, options) {
        this.id = id
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.logic = logic

        this.width = 60
        this.pos = [Math.floor( Math.random() * this.view.arenaWidth -  this.width), 0]
        this.seaweedCount = options.start ? Math.floor(Math.random() * 15) + 10 : 1
        this.growSeaweedInterval = 10000
        this.maxHeight = 100
        this.seaweed = this.logic.tankPopulator(this.seaweedCount, Seaweed, {pos: this.pos, cluster: this})
        this.bounds = {}
        this.reframeSeaweedIds()
        this.tallestPoint = this.tallestPointFinder()
        this.newSeaweed = false
        this.growSeaweed()
    }

    shrinkSeaweed() {
        let seaweed = this.seaweed[Object.values(this.seaweed)[Object.values(this.seaweed).length - 1].id]
        delete this.seaweed[seaweed.id]
        this.seaweedCount -= 1
        this.logic.recentlyDeadDenizens.push(seaweed)

    }



    reframeSeaweedIds() {
        for (let i = 0; i < Object.values(this.seaweed).length; i++) {
            let seaweed = this.seaweed["Seaweed" + (i + 1)]
            this.seaweed["Cluster" + this.id + "Seaweed" + seaweed.numInCluster] = seaweed
            delete this.seaweed["Seaweed" + seaweed.numInCluster]
        }
    }

    growSeaweed() {
        setTimeout(()=>{
            this.seaweedCount++
            this.seaweed["Cluster" + this.id + "Seaweed" + this.seaweedCount] = new Seaweed(this.seaweedCount, this.ctx, this.canvas, this.view, this.logic, { pos: this.pos, cluster: this })
            this.newSeaweed = true
            if (this.tallestPoint > this.maxHeight) this.growSeaweed()
        }, rand(this.growSeaweedInterval) + this.growSeaweedInterval)
    }

    tallestPointFinder() {
        return Object.values(this.seaweed)[Object.values(this.seaweed).length - 1].pos[1] + 10
    }

    coreloop() {
        if (this.newSeaweed) {
            this.tallestPoint = this.tallestPointFinder()
            this.newSeaweed = false
        }
        this.ctx.fillStyle = 'rgba(255,0,0,1)';
        // this.ctx.fillRect(this.pos[0] + 30 + this.view.offset[0], this.tallestPoint + this.view.offset[1], 10,10)
        // this.ctx.fillRect(this.pos[0] + this.view.offset[0], this.tallestPoint + this.view.offset[1], Object.values(this.seaweed)[0].width,10)

    }

    


 

}

