import fish from "./fish"
import Algea from "./algea"

export default class View {

    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.fishes = this.fishMaker(10)
        this.algea = this.algeaMaker(10)
        this.animate()
    }

    animate() {
        this.ctx.clearRect(0, 0, 700, 700)

        this.ctx.fillStyle = 'rgba(225,225,225,0.9)';
        this.ctx.fillRect(0, 0, 1700, 1700)
        this.drawfishes()

        requestAnimationFrame(this.animate.bind(this))
    }

    fishMaker(fishNum) {
        let fishArr = []

        while (fishNum > 0) {
            fishArr.push(new fish(this.ctx))
            fishNum--
        }
        return fishArr
    }

    algeaMaker(algeaNum) {
        let algeaArr = []

        while (algeaNum > 0) {
            algeaArr.push(new Algea(this.ctx))
            algeaNum--
        }
        return algeaArr
    }

    drawfishes() {
        this.fishes.forEach((fish)=>{
            fish.draw()
        })
        this.algea.forEach((algea) => {
            algea.draw()
        })
    }
}


