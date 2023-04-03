import Intro from "./engine/intro"
import Pilot from "./engine/pilot"
import { Rectangle } from "./engine/quadtree"
import View from "./engine/view"

const canvas = document.getElementById('canvas1')
canvas.height = window.innerHeight
canvas.width = window.innerWidth


let ctx = canvas.getContext('2d')


// let image = new Image()
// image.src = './dist/art/otter/otterDownLeft.png'

// let rotObj = {}
// rotObj["rotation"] = 0



// const animate = () => {
//     ctx.clearRect(0, 0, canvas.width, canvas.height)

//     rotateImage(ctx, image, 100, 100, 100, 200, 180)
//     rotObj["rotation"] += .1
//     requestAnimationFrame(animate)
// }

// function rotateImage(ctx, image, x, y, w, h, degrees) {
//     ctx.save();
//     ctx.translate(x + w / 2, y + h / 2);
//     // to rotate the image the other way, you add/subtract rotObj[rot]
//     ctx.rotate(degrees + rotObj["rotation"] * Math.PI / 180.0);
//     ctx.translate(-x - w / 2, -y - h / 2);
//     ctx.drawImage(image, x, y, w, h);
//     ctx.restore();
// }

// animate()






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
    pilot.view.input.mouseIsDownAt = false

    let collisionArr = pilot.view.quadtree.findOverlaps(new Rectangle(e.x - pilot.view.offset[0], e.y - pilot.view.offset[1],1,1),{id:null})
    // if (pilot.intro) {
    //     pilot.intro.simTransition = true
    // } else {
    // }
})



window.addEventListener("resize", (e)=> {
    canvas.height = e.currentTarget.innerHeight
    canvas.width = e.currentTarget.innerWidth
})