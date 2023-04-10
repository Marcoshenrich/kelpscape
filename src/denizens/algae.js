import TextBox from "../engine/textbox"
import { rand } from "../engine/utils"
import Denizen from "./denizen"
import Floater from "../behaviors/floater"

export default class Algae extends Denizen {

    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic)
        this.floater = new Floater(this)
        this.textBox = this.logic.textContentObj["Algae"]

        this.clustersObj = options.clustersObj

        this.type = "Algae"
        this.id = this.type + id
        this.img = new Image()
        this.img.src = './dist/art/algae.png'
        this.height = 8
        this.width = 8
        this.pos = this.placer()
        this.bobCoef = Math.floor(Math.random() * 10) + 4
        this.bobSpeed = (Math.floor(Math.random() * 3) +.1)/30
        this.trackCoef = 0
        this.up = [true, false][Math.floor(Math.random() * 2)]
        this.energyVal = 10
    }

    placer() {
        let pos = []
        let targetCluster = Object.values(this.clustersObj)[rand(Object.values(this.clustersObj).length)]
        pos[0] = rand(targetCluster.pos[0] - targetCluster.width / 2, targetCluster.pos[0] + targetCluster.width/2)
        pos[1] = rand(targetCluster.tallestPoint, this.arenaHeight)
        return pos
    }


    coreloop() {
        this.drawDenizen()
        this.floater.coreloop()
        this.clustersObj = this.logic.seaweedClusters
    }


    

}