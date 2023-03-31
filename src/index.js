import Intro from "./engine/intro"
import Pilot from "./engine/pilot"
import View from "./engine/view"

const canvas = document.getElementById('canvas1')
canvas.height = window.innerHeight
canvas.width = window.innerWidth



let pilot = new Pilot(canvas)



canvas.addEventListener("click", () => {
    if (pilot.intro) {
        pilot.intro.simTransition = true
    }
})



window.addEventListener("resize", (e)=> {
    canvas.height = e.currentTarget.innerHeight
    canvas.width = e.currentTarget.innerWidth
})