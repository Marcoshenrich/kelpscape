import { siTorproject } from "simple-icons"



export default class Intro {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.background = new Image()
        this.background.src = './dist/art/intro.png'
        this.animate()
        this.bgHeight = 648
        this.bgWidth = 1440
        this.xOffset = 0
        this.yOffset = 0
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)


        this.positionRecalc()    
        console.log(this.xOffset)
        // this.ctx.drawImage(this.background, this.backgroundPos[0], this.backgroundPos[1], this.arenaWidth, this.arenaHeight)
        this.ctx.drawImage(this.background, this.xOffset, this.yOffset, this.bgWidth - this.xOffset, this.bgHeight - this.yOffset, 0, 0, this.canvas.width, this.canvas.height)
        // this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height)


        requestAnimationFrame(this.animate.bind(this))
    }

    positionRecalc() {


        let screenRatio = this.canvas.height / this.canvas.width
        //need to make it so the virtual space between the undrawn image width == the image ratio of .45


        
    }



}