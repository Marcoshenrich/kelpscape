import Intro from "./engine/intro"
import Pilot from "./engine/pilot"
import { Rectangle } from "./engine/quadtree"
import View from "./engine/view"

const canvas = document.getElementById('canvas1')
canvas.height = window.innerHeight
canvas.width = window.innerWidth


const mobileDetector = () => {
    return (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i))
}


let pilot = new Pilot(canvas, mobileDetector())


//mobile size
//w: 980
//h: 1793



canvas.addEventListener("mousedown", (e) => {
    e.preventDefault()
    pilot.view.input.mouseIsDownAt = [e.x, e.y]
})

canvas.addEventListener("mousemove", (e) => {
    e.preventDefault()
    if (pilot.view.input.mouseIsDownAt) {
        pilot.view.input.dragScreen([e.x, e.y])
    }
})

canvas.addEventListener("mouseup", (e) => {
    e.preventDefault()
    pilot.view.input.mouseIsDownAt = false
})

canvas.addEventListener("touchstart", (e)=>{
    e.preventDefault()
    let touch = e.touches[0]
    pilot.view.input.mouseIsDownAt = [touch.clientX, touch.clientY]

    if (pilot.view.textBox) {
        pilot.view.textBox.resetTextBox()
        pilot.view.textBox = null
    } else {
        let touch = e.touches[0]
        pilot.touch = touch

        let collisionArr = pilot.view.quadtree.findOverlaps(new Rectangle(touch.clientX - pilot.view.offset[0], touch.clientY - pilot.view.offset[1], 1, 1), "overlaps", { id: null })
        if (collisionArr[0]) {
            textBox = collisionArr[0].textBox
            pilot.view.textBox = textBox
            pilot.view.logic.scoreTrackObj[textBox.type] = true
        }
        pilot.collisionArr = `${Math.floor(touch.clientX)},${Math.floor(touch.clientY)}`
    }
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault()
    let touch = e.touches[0]
    if (pilot.view.input.mouseIsDownAt) {
        pilot.view.input.dragScreen([touch.clientX, touch.clientY])
    }
});

canvas.addEventListener("touchend", (e) => {
    e.preventDefault()
    pilot.view.input.mouseIsDownAt = false
})





canvas.addEventListener("click", (e) => {
    pilot.view.input.mouseIsDownAt = false

    if (pilot.view.textBox) {
        pilot.view.textBox.resetTextBox()
        pilot.view.textBox = null
    } else {
        let collisionArr = pilot.view.quadtree.findOverlaps(new Rectangle(e.x - pilot.view.offset[0], e.y - pilot.view.offset[1], 1, 1), "overlaps", { id: null })
        if (collisionArr[0]) {
            let textBox = collisionArr[0].textBox
            pilot.view.textBox = textBox
            pilot.view.logic.scoreTrackObj[textBox.type] = true
        }
    }

    if (!pilot.kickOffScore) {
        // pilot.sound.playIntroScore()
        pilot.intro.sequenceStep = 1
    }



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
