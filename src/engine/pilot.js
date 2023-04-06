import Intro from "./intro"
import Sound from "./sound"
import View from "./view"

export default class Pilot {
    constructor(canvas,mobile) {
        this.ctx = canvas.getContext('2d')
        this.canvas = canvas
        this.sound = new Sound()
        this.view = new View(canvas, mobile)
        this.intro = new Intro(canvas, mobile)
        this.mobile = mobile

        this.touch = null
        this.collisionArr = null
        
        this.animate()

    }

    animate() {
        if (!this.intro.simStart) {
            this.intro.animate()
        } else {
            this.view.animate()
        }
        // this.view.animate()
        // this.ctx.fillStyle = `rgba(255,255,255,1`;
        // this.ctx.font = "25px Georgia";

        // this.ctx.fillText(`t: ${this.touch}`, 200, 200)
        // this.ctx.fillText(`w: ${this.collisionArr}`, 200, 250)
        // this.ctx.fillText(`m: ${this.mobile}`, 200, 300)


        requestAnimationFrame(this.animate.bind(this))
    }

}