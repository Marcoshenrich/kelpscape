import Fish from "./fish"
import Algae from "./algae"

export default class View {

    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.fishes = this.tankPopulator(10, Fish)
        this.algae = this.tankPopulator(50, Algae)
        this.animate()
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = 'rgba(200,225,255,1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawfishes()

        requestAnimationFrame(this.animate.bind(this))
    }


    tankPopulator(objnum, className) {
        let objArr = []

        while (objnum > 0) {
            objArr.push(new className(this.ctx, this.canvas))
            objnum--
        }
        return objArr
    }

    drawfishes() {
        this.fishes.forEach((fish)=>{
            fish.draw()
        })
        this.algae.forEach((algae) => {
            algae.draw()
        })
    }
}


