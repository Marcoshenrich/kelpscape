import Denizen from "../denizens/denizen";
import { rand } from "../engine/utils";
import Seaweed from "./seaweed";



export default class SeaweedCluster extends Denizen{
    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic)
        this.id = id
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.logic = logic

        this.animationStates = [
            { name: "sway1", frames: 8},
            { name: "sway2", frames: 8},
            { name: "swish", frames: 8 },
            { name: "swoosh", frames: 8 }
        ];

        this.animations = []
        this.animationFramesSetter()

        this.width = 60
        this.pos = [rand(this.width, this.view.arenaWidth - this.width), 0]
        this.seaweedCount = options.start ? Math.floor(Math.random() * 35) + 10 : 1
        this.growSeaweedInterval = 40000
        this.maxHeight = 100
        this.seaweed = this.tankPopulator(this.seaweedCount, Seaweed, {pos: this.pos, cluster: this})
        this.bounds = {}
        this.tallestPoint = this.tallestPointFinder()
        this.newSeaweed = false
        this.growSeaweed()
    }

    shrinkSeaweed() {
        let seaweed = this.seaweed[Object.values(this.seaweed)[Object.values(this.seaweed).length - 1].id]
        delete this.seaweed[seaweed.id]
        this.seaweedCount -= 1
        seaweed.dead = true
        this.logic.recentlyDeadDenizens.push(seaweed)
    }


    tankPopulator(objnum, className, options) {
        let denizenObj = {}

        let i = 1
        while (i <= objnum) {
            denizenObj["Cluster" + this.id + className.name + i] = new className(i, this.ctx, this.canvas, this.view, this.logic, options)
            i++
        }
        return denizenObj
    }

    growSeaweed() {
        let id = setTimeout(()=>{
            this.seaweedCount++
            this.seaweed["Cluster" + this.id + "Seaweed" + this.seaweedCount] = new Seaweed(this.seaweedCount, this.ctx, this.canvas, this.view, this.logic, { pos: this.pos, cluster: this })
            this.newSeaweed = true
            if (this.tallestPoint > this.maxHeight) this.growSeaweed()
        }, rand(this.growSeaweedInterval) + this.growSeaweedInterval)
        this.clearOnDeath.push(id)
    }

    tallestPointFinder() {
        return Object.values(this.seaweed)[Object.values(this.seaweed).length - 1].pos[1] + 10
    }

    dieWhenNoSeaweed() {
        if (this.seaweedCount === 0) {
            this.dead = true
            this.seaweed = {}
            this.logic.recentlyDeadDenizens.push(this)
        }
    }

    coreloop() {
        if (this.newSeaweed) {
            this.tallestPoint = this.tallestPointFinder()
            this.newSeaweed = false
        }
        this.dieWhenNoSeaweed()
        // this.ctx.fillStyle = 'rgba(255,0,0,1)';
        // this.ctx.fillRect(this.pos[0] + 30 + this.view.offset[0], this.tallestPoint + this.view.offset[1], 10,10)
        // this.ctx.fillRect(this.pos[0] + this.view.offset[0], this.tallestPoint + this.view.offset[1], Object.values(this.seaweed)[0].width,10)

    }

    
    animationFramesSetter() {
        this.animationStates.forEach((spriteState,index) => {
            let frames = {
                loc: [],
            }
            for (let j = 0; j < spriteState.frames; j++) {
                let positionX = (j * 25) + 17.5 + (35 * j)
                let positionY = (index * 75) + 2.5 + (5 * index)
                frames.loc.push({ x: positionX, y: positionY });
            }
            this.animations[spriteState.name] = frames;
        });
    }

 

}

