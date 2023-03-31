import Intro from "./intro"
import View from "./view"

export default class Pilot {
    constructor(canvas) {
        this.view = new View(canvas)
        this.intro = new Intro(canvas)
        this.animate()
    }

    animate() {
        if (!this.intro.simStart) {
            this.intro.animate()
        } else {
            this.view.animate()
        }
        this.view.animate()
        requestAnimationFrame(this.animate.bind(this))
    }
}