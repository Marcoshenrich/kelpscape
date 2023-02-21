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


    tankPopulator(objnum, className) {
        let objArr = []

        while (objnum > 0) {
            objArr.push(new className(objnum, this.ctx, this.canvas, this.view, this.posMatrix))
            objnum--
        }
        return objArr
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