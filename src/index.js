import Intro from "./engine/intro"
import Pilot from "./engine/pilot"
import { Rectangle } from "./engine/quadtree"
import View from "./engine/view"

const canvas = document.getElementById('canvas1')
canvas.height = window.innerHeight
canvas.width = window.innerWidth


let ctx = canvas.getContext('2d')

let pilot = new Pilot(canvas)


//mobile size
//w: 980
//h: 1793

canvas.addEventListener("mousedown", (e) => {
    pilot.view.input.mouseIsDownAt = [e.x, e.y]
},true)

canvas.addEventListener("mousemove", (e) => {
    if (pilot.view.input.mouseIsDownAt) {
        pilot.view.input.dragScreen([e.x, e.y])
    }
},true)

canvas.addEventListener("mouseup", (e) => {
    pilot.view.input.mouseIsDownAt = false
},true)

// canvas.addEventListener("touchstart", (e)=>{
//     pilot.view.input.mouseIsDownAt = [e.x, e.y]
// });





canvas.addEventListener("click", (e) => {
    pilot.view.input.mouseIsDownAt = false

    let collisionArr = pilot.view.quadtree.findOverlaps(new Rectangle(e.x - pilot.view.offset[0], e.y - pilot.view.offset[1], 1, 1), "overlaps", { id: null })
    // if (pilot.intro) {
    //     pilot.intro.simTransition = true
    // } else {
    // }
})

// canvas.addEventListener("touchmove", (e) => {
//     let touch = e.touches[0];
//     pilot.view.input.mouseIsDownAt = [e.clientX, e.clientY]
//     let mouseEvent = new MouseEvent("mousemove", {
//         x: touch.clientX,
//         y: touch.clientY
//     });
//     canvas.dispatchEvent(mouseEvent);
// }, false);

// canvas.addEventListener("touchend", (e) => {
//     pilot.view.input.mouseIsDownAt = false

//     let collisionArr = pilot.view.quadtree.findOverlaps(new Rectangle(e.x - pilot.view.offset[0], e.y - pilot.view.offset[1], 1, 1), "overlaps", { id: null })
//     // if (pilot.intro) {
//     //     pilot.intro.simTransition = true
//     // } else {
//     // }
// })

// canvas.addEventListener("touchstart", handleTouchStart, false);
// canvas.addEventListener("touchmove", handleTouchMove, false);
// canvas.addEventListener("touchend", handleTouchEnd, false);

// function handleTouchStart(event) {
//     // Get the touch coordinates
//     var touchX = event.touches[0].clientX;
//     var touchY = event.touches[0].clientY;

//     // Convert touch coordinates to canvas coordinates
//     var canvasX = touchX - canvas.offsetLeft;
//     var canvasY = touchY - canvas.offsetTop;

//     // Handle touch start event
//     // ...
// }



// var isDragging = false;
// var startX = 0;
// var startY = 0;

// function handleTouchStart(event) {
//     // Get the touch coordinates
//     var touchX = event.touches[0].clientX;
//     var touchY = event.touches[0].clientY;

//     // Convert touch coordinates to canvas coordinates
//     var canvasX = touchX - canvas.offsetLeft;
//     var canvasY = touchY - canvas.offsetTop;

//     // Save the initial touch position and set the flag
//     startX = canvasX;
//     startY = canvasY;
//     isDragging = true;
// }






// function handleTouchMove(event) {
//     // Get the touch coordinates
//     var touchX = event.touches[0].clientX;
//     var touchY = event.touches[0].clientY;

//     // Convert touch coordinates to canvas coordinates
//     var canvasX = touchX - canvas.offsetLeft;
//     var canvasY = touchY - canvas.offsetTop;

//     // Handle touch move event
//     // ...
// }

// function handleTouchEnd(event) {
//     // Handle touch end event
//     // ...
// }






window.addEventListener("resize", (e) => {
    canvas.height = e.currentTarget.innerHeight
    canvas.width = e.currentTarget.innerWidth
})
