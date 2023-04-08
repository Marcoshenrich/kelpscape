import Denizen from "./denizen"
import CrabBaby from "./crabbaby"
import Crab from "./crab"
import Fish from "./Fishes/fish"
import FishBaby from "./Fishes/fishbaby"
import Shark from "./shark"
import GarabaldiBaby from "./Fishes/garabaldiBaby"
import Garabaldi from "./Fishes/garabaldi"
import BassBaby from "./Fishes/bassBaby"
import Bass from "./Fishes/bass"
import Rockfish from "./Fishes/rockfish"
import RockfishBaby from "./Fishes/rockfishbaby"

export default class DeadCreature extends Denizen {
    constructor(id, ctx, canvas, view, logic, pos, deadDenizen) {
        super(ctx, canvas, view, logic)
        this.textBox = this.logic.textContentObj["Corpse"]
        this.type = "DeadCreature"
        this.id = this.type + id
        this.pos = [pos[0], pos[1]]
        this.driftSpeed = .2
        this.img = new Image()
        this.deadDenizen = deadDenizen
        this.width;
        this.height;
        this.energyVal;
        this.typeSelector()
        this.dead = false
    }

    coreloop() {
        if (this.pos[1] < this.arenaHeight - this.height) this.pos[1] += this.driftSpeed
        this.draw()
        if (this.energyVal < 0) {
            this.dead = true
            this.logic.recentlyDeadDenizens.push(this)
        }
    }

    draw() {
        this.ctx.globalAlpha = this.energyVal > 5 ? 1 : (this.energyVal + 5) / 10
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
        this.ctx.globalAlpha = 1

        if (this.view.debugging) {
            this.ctx.fillStyle = 'rgba(255,255,255,1)';
            this.ctx.font = "12px serif";
            this.ctx.fillText(`${this.energyVal}`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1])
            this.ctx.fillText(`[${Math.floor(this.pos[0])},${Math.floor(this.pos[1])}]`, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1] - this.height)

        }
    }


    typeSelector() {
        switch (this.deadDenizen.constructor) {
            case Shark:
                this.img.src = './dist/art/sharkdead.png'
                this.width = 100
                this.height = 30
                this.energyVal = 40
                break


            case Garabaldi:
                this.img.src = './dist/art/fishes/garabaldidead.png'
                this.width = 30
                this.height = 15
                this.energyVal = 10
                break

            case GarabaldiBaby : // temp until new image can be found
                this.img.src = './dist/art/fishes/garabaldidead.png'
                this.width = 15
                this.height = 8
                this.energyVal = 4
                break


            case Bass:
                this.img.src = './dist/art/fishes/bassdead.png'
                this.width = 45
                this.height = 35
                this.energyVal = 10
                break


            case BassBaby: // temp until new image can be found
                this.img.src = './dist/art/fishes/bassdead.png'
                this.width = 20
                this.height = 17
                this.energyVal = 5
                break


            case Rockfish:
                this.img.src = './dist/art/fishes/fishdead.png'
                this.width = 30
                this.height = 19
                this.energyVal = 7
                break

            case RockfishBaby: 
                this.img.src = './dist/art/fishes/fishdead.png'
                this.width = 30
                this.height = 19
                this.energyVal = 4
                break

            case Crab:
                this.img.src = './dist/art/crabdead.png'
                this.width = 30
                this.height = 15
                this.energyVal = 5
                break

            case CrabBaby:
                this.img.src = './dist/art/crabdead.png'
                this.width = 15
                this.height = 7
                this.energyVal = 2.5
                break

            default: 
                this.img.src = './dist/art/fishes/fishdead.png'
        }

    }


}