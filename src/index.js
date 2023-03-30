import Intro from "./engine/intro"
import View from "./engine/view"

const canvas = document.getElementById('canvas1')
canvas.height = window.innerHeight
canvas.width = window.innerWidth


const intro = new Intro(canvas)





// const view = new View(canvas)


window.addEventListener("resize", (e)=> {
    canvas.height = e.currentTarget.innerHeight
    canvas.width = e.currentTarget.innerWidth
})