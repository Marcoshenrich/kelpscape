
import { rand } from "../engine/utils";
import Denizen from "./denizen";


export default class Polyp extends Denizen {
    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic)
        this.type = "Polyp"
        this.id = this.type + id
        this.width = 20
        this.height = 20
        this.pos = [100, this.arenaHeight - this.height]
        this.img = new Image()
        this.img.src = './dist/art/polyp.png'
        this.dieEventually()
        this.spawnJellyFish()
    }

    clearCallbacksOnDeath() {

    }

    spawnJellyFish() {
        setTimeout(() => {
            this.logic.spawnDenizen(this)
            this.spawnJellyFish() 
        }, rand(1000) + 1000)
    }

    dieEventually() {
        setTimeout(()=>{
            this.dead = true
            console.log(this)
            this.logic.recentlyDeadDenizens.push(this)
        }, rand(60000) + 60000)
    }

    coreloop(){
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
    }

}