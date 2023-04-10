
import { rand } from "../engine/utils";
import Denizen from "./denizen";


export default class Polyp extends Denizen {
    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic)
        this.type = "Polyp"
        this.id = this.type + id
        this.width = 1
        this.height = 1
        this.pos = [options.pos[0], this.arenaHeight - this.height]
        this.img = new Image()
        this.img.src = './dist/art/polyp.png'
        this.mature = false

        
    }

    growUp() {
        this.width += .005
        this.height += .005
        this.pos[1] = [this.arenaHeight - this.height]

        if (this.width > 20) {
            this.mature = true
            this.dieEventually()
            this.spawnJellyFish()
        }
    }

    spawnJellyFish() {
        let id = setTimeout(() => {
            this.logic.spawnDenizen(this)
            this.spawnJellyFish() 
        }, rand(10000) + 10000)
        this.clearOnDeath.push(id)
    }

    dieEventually() {
        setTimeout(()=>{
            this.dead = true
            this.logic.recentlyDeadDenizens.push(this)
        }, rand(60000) + 60000)
    }

    coreloop(){
        if (!this.mature) this.growUp() 
        this.drawDenizen()
    }

}