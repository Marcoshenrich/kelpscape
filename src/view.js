import Floater from "./floater"
import Algea from "./algea"

export default class View {

    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.floaters = this.floaterMaker(10)
        this.algea = this.algeaMaker(10)
        this.animate()
    }

    animate() {
        this.ctx.clearRect(0, 0, 700, 700)

        this.ctx.fillStyle = 'rgba(225,225,225,0.9)';
        this.ctx.fillRect(0, 0, 1700, 1700)
        this.drawFloaters()

        requestAnimationFrame(this.animate.bind(this))
    }

    floaterMaker(floaterNum) {
        let floaterArr = []

        while (floaterNum > 0) {
            floaterArr.push(new Floater(this.ctx))
            floaterNum--
        }
        return floaterArr
    }

    algeaMaker(algeaNum) {
        let algeaArr = []

        while (algeaNum > 0) {
            algeaArr.push(new Algea(this.ctx))
            algeaNum--
        }
        return algeaArr
    }

    drawFloaters() {
        this.floaters.forEach((floater)=>{
            floater.draw()
        })
        this.algea.forEach((algea) => {
            algea.draw()
        })
    }
}


