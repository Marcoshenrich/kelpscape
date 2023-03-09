import View from "./view"
import Quadtree, {Rectangle}from "./quadtree"

const canvas = document.getElementById('canvas1')
canvas.height = 666
canvas.width = 1000

// const bounds = new Rectangle(0, 0, 1000, 1000);
// const quadtree = new Quadtree(bounds, 10);



// function populateQuad(i) {
//     let x = i
//     let y = i
//     return {x, y}
// }

// console.log(quadtree)

const view = new View(canvas)


