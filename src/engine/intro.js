
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
        this.looptracker = 0 

        this.animate()

    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.updatePos()
        this.drawDynamicBackground()

        this.ctx.font = "25px Georgia";

        this.drawTitle("kelpscape")
        requestAnimationFrame(this.animate.bind(this))
    }

    updatePos() {
        this.looptracker += .5
    }

    drawTitle(text) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        const textWidth = this.ctx.measureText(text).width;
        const textHeight = 10;

        const x = centerX - (textWidth / 2);
        const y = centerY + (textHeight / 2);

        this.ctx.beginPath();
        this.ctx.moveTo(centerX + 25, centerY + 50);
        this.ctx.lineTo(centerX - 25, centerY + 25);
        this.ctx.lineTo(centerX - 25, centerY + 75);
        this.ctx.fill();

        this.ctx.fillText(text, x, y);
    }



    drawDynamicBackground() {
        let scaleFactor = Math.max(this.canvas.width / this.bgWidth, this.canvas.height / this.bgHeight);
        let newWidth = this.bgWidth * scaleFactor;
        let newHeight = this.bgHeight * scaleFactor;
        let x = (this.canvas.width / 2) - (newWidth / 2);
        let y = (this.canvas.height / 2) - (newHeight / 2);
        this.ctx.drawImage(this.background, x + this.looptracker, y, newWidth, newHeight);

        if (x + this.looptracker >= 0) {
            let secondX = (x + this.looptracker - newWidth)
            this.ctx.drawImage(this.background, secondX + 1, y, newWidth, newHeight);
        } 

        if (x + this.looptracker - newWidth > 0)  {
            this.looptracker = -x + 1
        }
    }




}

