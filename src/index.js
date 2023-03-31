import Intro from "./engine/intro"
import Pilot from "./engine/pilot"
import View from "./engine/view"

const canvas = document.getElementById('canvas1')
canvas.height = window.innerHeight
canvas.width = window.innerWidth



let pilot = new Pilot(canvas)




canvas.addEventListener("mousemove", (e) => {
    if (pilot.view.input.mouseIsDownAt) {
        pilot.view.input.dragScreen([e.x, e.y])
    }
})

canvas.addEventListener("mousedown", (e) => {
    pilot.view.input.mouseIsDownAt = [e.x, e.y]
})

canvas.addEventListener("click", (e) => {
    console.log("click")
    pilot.view.input.mouseIsDownAt = false
    // console.log(e.x)
    // console.log(e.y)







    // if (pilot.intro) {
    //     pilot.intro.simTransition = true
    // } else {
    // }
})



window.addEventListener("resize", (e)=> {
    canvas.height = e.currentTarget.innerHeight
    canvas.width = e.currentTarget.innerWidth
})