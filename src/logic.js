import Fish from "./fish"
import Algae from "./algae"

export default class Logic {

    constructor(ctx, canvas, view) {
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.posMatrix = this.matrixMaker()
        this.fishes = this.tankPopulator(10, Fish)
        this.algae = this.tankPopulator(50, Algae)
    }


    fishDieFromNoFood() {
        for (const [key, fish] of Object.entries(this.fishes)) {
            if (fish.dead) delete this.fishes[key]
        }
    }


    fishEatAlgae() {
        Object.values(this.fishes).forEach((fish)=>{
            for (const [key, algae] of Object.entries(this.algae)) {
                let eat = fish.collisionDetector([fish.mouthPos, [fish.mouthSize, fish.mouthSize]], [algae.pos, [algae.height, algae.width]])
                if (eat) delete this.algae[key]
            }
        })
    }

    tankPopulator(objnum, className) {
        let denizenObj = {}

        while (objnum > 0) {
            denizenObj[objnum] = new className(objnum, this.ctx, this.canvas, this.view, this.posMatrix)
            objnum--
        }
        return denizenObj
    }

    matrixMaker() {
        let matrix = {}
        let i = 100
        while (i > 0) {
            matrix[i] = new Set()
            i--
        }
        return matrix
    }

}