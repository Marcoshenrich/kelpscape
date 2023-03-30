import { siTorproject } from "simple-icons"



export default class Intro {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.background = new Image()
        this.background.src = './dist/art/intro.png'
        this.bgHeight = 648
        this.bgWidth = 1440
        this.xOffset = 0
        this.yOffset = 0
        this.animate()
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // this.ctx.drawImage(this.background, this.backgroundPos[0], this.backgroundPos[1], this.arenaWidth, this.arenaHeight)
        this.swiffler()
        // this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height)


        requestAnimationFrame(this.animate.bind(this))
    }



    swiffler() {



            let scaleFactor = Math.max(this.canvas.width / this.bgWidth, this.canvas.height / this.bgHeight);

            let newWidth = this.bgWidth * scaleFactor;
            let newHeight = this.bgHeight * scaleFactor;

            let x = (this.canvas.width / 2) - (newWidth / 2);
            let y = (this.canvas.height / 2) - (newHeight / 2);

            // When drawing the image, we have to scale down the image
            // width and height in order to fit within the canvas
        console.log(x, y, newWidth, newHeight)
        this.ctx.drawImage(this.background, x, y, newWidth, newHeight);
        
    }




}

