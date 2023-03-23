import View from "./engine/view"

const canvas = document.getElementById('canvas1')
canvas.height = 666
canvas.width = 1000

const view = new View(canvas)


// window.addEventListener("resize", (e)=> {

//     canvas.height = e.currentTarget.innerHeight
//     canvas.width = e.currentTarget.innerWidth
//     view.arenaWidth = e.currentTarget.innerWidth * view.arenaCoef
//     view.arenaHeight = e.currentTarget.innerHeight * view.arenaCoef

// })