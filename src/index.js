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

const mobile = mobileDetector()
let pilot = new Pilot(canvas, mobile)


const soundButton = document.getElementById('sound-button')


soundButton.addEventListener("click", (e) => {
    e.stopPropagation()

    if (soundButton.classList[1] === "sound-on") {
        soundButton.classList.remove("sound-on")
        soundButton.classList.add("sound-off")
        soundButton.innerHTML = `<i class="fa-solid fa-volume-xmark">`
        pilot.sound.muteAllSounds()
    } else {
        soundButton.classList.remove("sound-off")
        soundButton.classList.add("sound-on")
        soundButton.innerHTML = `<i class="fa-solid fa-volume-high">`
        pilot.sound.unmuteAllSounds()
    }

})

window.addEventListener('keydown', e => {
    if (pilot.sound.kickOffIntroScore) return
    if(e.code === 'Space') {
        e.preventDefault();
        pilot.sound.playIntroScore()
        pilot.intro.sequenceStep = 1
    }
});



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



canvas.addEventListener("click", (e) => {
    pilot.view.input.mouseIsDownAt = false

    if (!pilot.sound.kickOffIntroScore && pilot.showIntro) {
        pilot.sound.playIntroScore()
        pilot.intro.sequenceStep = 1
        return
    }

    if (!pilot.viewStart && pilot.showIntro) {
        if (pilot.intro.skipped) return
        pilot.intro.sequenceStep = 6
        pilot.intro.fader = 0
        pilot.intro.textFader = 0
        pilot.intro.skipped = true
    }
    
    if (pilot.intro && !pilot.intro.simStart && pilot.showIntro) return

    if (pilot.view.textBox) {
        pilot.view.textBox.resetTextBox()
        pilot.view.textBox = null
    } else {
        let collisionArr = pilot.view.mouseCollisionDetector(e.x, e.y)
        if (collisionArr.length) {
            let textBox;
            for (let i = 0; i < collisionArr.length; i++) {
                if (collisionArr[i].type !== "Seaweed" || i === collisionArr.length - 1 ) {
                    textBox = collisionArr[i].textBox
                    break
                }
            }

            pilot.view.textBox = textBox
            pilot.view.fadeInScore = .5
            pilot.view.showScore = true
            if (!pilot.view.logic.scoreTrackObj[textBox.type]) {
                pilot.view.logic.scoreTrackObj[textBox.type] = true
                pilot.view.logic.score += 1
                pilot.view.scoreFontSize = 42
            }
        }
    }
})

const enableHover = () => {
    var style = document.createElement('style');
    console.log("yo")
    style.innerHTML = `
        #canvas {
            width:500
        }
        `;
    document.head.appendChild(style);
}

window.addEventListener("resize", (e) => {
    canvas.height = e.currentTarget.innerHeight
    canvas.width = e.currentTarget.innerWidth
    buttonHider(window.innerWidth)
})


const buttonHider = (width) => {
    const gitButton = document.getElementById('github-button')
    const linkButton = document.getElementById('linkedin-button')

    if (width < 700 || pilot.mobile) { // If media query matches
        gitButton.classList.add("hide")
        linkButton.classList.add("hide")
    } else {
        gitButton.classList.remove("hide")
        linkButton.classList.remove("hide")
    }
}

buttonHider()


canvas.addEventListener("touchstart", (e) => {
    e.preventDefault()
    let touch = e.touches[0]
    pilot.view.input.mouseIsDownAt = [touch.clientX, touch.clientY]

    if (!pilot.sound.kickOffIntroScore) {
        pilot.sound.playIntroScore()
        pilot.intro.sequenceStep = 1
    }

    if (pilot.intro && !pilot.intro.simStart && pilot.showIntro) return


    if (pilot.view.textBox) {
        pilot.view.textBox.resetTextBox()
        pilot.view.textBox = null
    } else {
        // pilot.touchRect = [touch.clientX - 25, touch.clientY - 25, 500]
        let collisionArr = pilot.view.quadtree.queryRange(new Rectangle(touch.clientX - pilot.view.offset[0] - 25, touch.clientY - pilot.view.offset[1] - 25, 50, 50), "overlaps", { id: null }, true)
        if (collisionArr.length) {
            let textBox;
            for (let i = 0; i < collisionArr.length; i++) {
                if (collisionArr[i].type !== "Seaweed" || i === collisionArr.length - 1) {
                    textBox = collisionArr[i].textBox
                    break
                }
            }

            pilot.view.textBox = textBox
            pilot.view.fadeInScore = .5
            pilot.view.showScore = true
            if (!pilot.view.logic.scoreTrackObj[textBox.type]) {
                pilot.view.logic.scoreTrackObj[textBox.type] = true
                pilot.view.logic.score += 1
                pilot.view.scoreFontSize = 42
            }
        }
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