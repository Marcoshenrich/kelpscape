import Fish from "./fish"
import Algae from "./algae"
import Logic from "./logic"

export default class View {

    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.logic = new Logic(this.ctx, this.canvas, this)
        this.fishes = this.logic.fishes
        this.algae = this.logic.algae
        this.animate()
        this.debugging = false
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = 'rgba(200,225,255,1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = 'rgba(0,0,0,.3)';
        this.ctx.fillRect(10, 10, 200, 120)

        this.ctx.fillStyle = 'rgba(250,110,0,1)';
        this.ctx.font = "36px serif";
        this.ctx.fillText(`Fishes: ${Object.values(this.logic.fishes).length}`, 25, 50)
        this.ctx.fillText(`Algae: ${ Object.values(this.logic.algae).length }`, 25, 100)

        this.drawfishes()
        this.logic.fishEatAlgae()
        this.logic.fishDieFromNoFood()
        if (this.debugging) this.drawMatrix()
        requestAnimationFrame(this.animate.bind(this))
    }

    drawfishes() {
        Object.values(this.fishes).forEach((fish)=>{
            fish.draw()
        })
        Object.values(this.algae).forEach((algae) => {
            algae.draw()
        })
    }

    drawMatrix() {
        // debugging function 
        this.ctx.fillStyle = 'rgba(0,0,0,1)';

        let i = 9
        let steppedHeight = this.canvas.height/10
        let step = steppedHeight
        while (i > 0) {
            this.ctx.fillRect(0, step, this.canvas.width, 1)
            step += steppedHeight
            i--
        }

        i = 9
        let steppedWidth = this.canvas.width / 10
        console.log(steppedWidth)
        step = steppedWidth
        while (i > 0) {
            this.ctx.fillRect(step, 0, 1, this.canvas.height)
            step += steppedHeight
            i--
        }
    }
}


