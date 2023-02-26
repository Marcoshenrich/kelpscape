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

    fishMeetOtherFish() {

        for (let i = 0; i < Object.values(this.fishes).length; i++) {
            let fish1 = Object.values(this.fishes)[i]
            if (fish1.energy < 10) continue
            if (fish1.mating) continue

            for (let j = 0; j < Object.values(this.fishes).length; j++) {
                if (i === j) continue
                let fish2 = Object.values(this.fishes)[j]
                if (fish2.energy < 10) continue
                if (fish2.mating) continue
                
                let bump = fish1.collisionDetector([[fish1.pos[0], fish1.pos[1]], [fish1.width, fish1.height]], [[fish2.pos[0], fish2.pos[1]], [fish2.width, fish2.height]])
                if (bump) {
                    fish1.mate(fish2)
                }
            }
        }

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
                if (eat) {
                    delete this.algae[key]
                    fish.energy = 15
                }
                
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