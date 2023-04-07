
export default class Intro {
    constructor(canvas, view) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.view = view
        this.background = new Image()
        this.background.src = './dist/art/intro.png'
        this.bgHeight = 648
        this.bgWidth = 1440
        this.xOffset = 0
        this.yOffset = 0
        this.looptracker = 0 
        this.simTransition = false
        this.simStart = false
        this.fader = 0
        this.textMargin = 100

        this.sequenceStep = 0
        this.fontSize = 42
        this.leading = 50

        this.animate()
        this.textFader = 1
        this.fadeText = true
        this.fadeTransitionSpeed = .008

    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.updatePos()
        this.drawDynamicBackground()
        this.drawIntroSequence()
        if (this.simTransition) this.simStarter()
    }

    fadeManger() { 
        if (this.textFader > 5) {
            this.textFader = 1
            this.fadeText = true
        }

        if (this.fadeText) {
            this.textFader -= this.fadeTransitionSpeed
        } else {
            this.textFader += this.fadeTransitionSpeed
        }

        if (this.textFader < 0) {
            this.sequenceStep++
            this.textFader = 0
            this.fadeText = false
            this.font = 42
        }
    }

    fontAndLeadingManager(textWidth, centerBool) {
        if (centerBool) {
            if (textWidth > this.canvas.width - this.textMargin * 2) {
                this.fontSize -= 1
                this.leading -= 1
            } else if (textWidth < this.canvas.width - this.textMargin * 3) {
                this.fontSize += 1
                this.leading += 1
            }
        } else {
            if (textWidth > this.canvas.width / 2 + this.textMargin) {
                this.fontSize -= 1
                this.leading -= 1
            } else if (textWidth < this.canvas.width / 2) {
                this.fontSize += 1
                this.leading += 1
            }
        }
    }

    drawIntroSequence() {
        if (this.sequenceStep === 0) {
            this.ctx.fillStyle = `rgba(0,0,0,${this.textFader})`
            this.ctx.font = `${this.fontSize}px Georgia`;
            this.drawText("Start", true)
            
        } else if(this.sequenceStep === 1) {
            this.ctx.fillStyle = `rgba(0,0,0,${this.textFader})`
            this.ctx.font = `${this.fontSize}px Georgia`;
            this.drawText("Start",true)

            if (this.fadeText) {
                this.textFader -= this.fadeTransitionSpeed
            } else {
                this.textFader += this.fadeTransitionSpeed
            }

            if (this.textFader < 0) {
                this.sequenceStep++
                this.textFader = 0
                this.fadeText = false
            }
        } else if (this.sequenceStep === 2) {
            this.ctx.font = `${this.fontSize}px Georgia`;
            this.ctx.fillStyle = `rgba(0,0,0,${this.textFader})`
            this.fontAndLeadingManager(this.ctx.measureText("Pacific Kelp Forests stretch from Baja California,").width)
            this.ctx.fillText("Pacific Kelp Forests stretch from Baja California,", this.textMargin, this.textMargin);
            this.ctx.fillText("up through the Bering Sea,", this.textMargin, this.textMargin + this.leading);
            this.ctx.fillText("down to the southern coast of Japan.", this.textMargin, this.textMargin + this.leading * 2);
            this.fadeManger()
        } else if (this.sequenceStep === 3) {

            this.ctx.font = `${this.fontSize}px Georgia`;
            this.ctx.fillStyle = `rgba(0,0,0,${this.textFader})`
            this.fontAndLeadingManager(this.ctx.measureText("and were once teeming with life.").width)
            this.ctx.fillText("These massive marine ecosystems", this.textMargin, this.textMargin);
            this.ctx.fillText("are home to hundreds of species", this.textMargin, this.textMargin + this.leading);
            this.ctx.fillText("and were once teeming with life.", this.textMargin, this.textMargin + this.leading * 2);
            this.fadeManger()

        } else if (this.sequenceStep === 4) {
            this.ctx.font = `${this.fontSize}px Georgia`;
            this.ctx.fillStyle = `rgba(0,0,0,${this.textFader})`
            const line1Width = this.ctx.measureText("Today, climate change and overfishing").width
            const line2Width = this.ctx.measureText("threaten these incredible biospheres.").width
            const centerX = this.canvas.width / 2
            const centerY = this.canvas.height / 2
            this.fontAndLeadingManager(this.ctx.measureText(line2Width, true))
            this.ctx.fillText("Today, climate change and overfishing", centerX - line1Width/2, centerY - this.leading/2);
            this.ctx.fillText("threaten these incredible biospheres.", centerX - line2Width/2, centerY + this.leading / 2);
            this.fadeManger()

        } else if (this.sequenceStep === 5) {

            this.ctx.font = `${this.fontSize}px Georgia`;
            this.ctx.fillStyle = `rgba(0,0,0,${this.textFader})`
            const line1Width = this.ctx.measureText("Welcome to").width
            const line2Width = this.ctx.measureText("Kelpscape").width
            const centerX = this.canvas.width / 2
            const centerY = this.canvas.height / 2
            this.ctx.fillText("Welcome to", centerX - line1Width / 2, centerY - this.leading / 2);
            this.ctx.fillText("Kelpscape", centerX - line2Width / 2, centerY + this.leading / 2);
            this.fadeManger()
            
        } else if (this.sequenceStep === 6) {

            this.ctx.fillStyle = `rgba(0,0,0,${this.fader})`;
            this.fader += .005
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            if (this.fader > 1) this.sequenceStep += 1

        } else if (this.sequenceStep === 7) {
            this.ctx.fillStyle = `rgba(0,0,0,${this.fader})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.font = `${this.fontSize * .5}px Georgia`;
            this.ctx.fillStyle = `rgba(255,255,255,${this.textFader})`
            const line1Width = this.ctx.measureText("Use the arrow keys or mouse to move around.").width
            const line2Width = this.ctx.measureText("Click on a denizen to learn more about them.").width
            const centerX = this.canvas.width / 2
            const centerY = this.canvas.height / 2
            this.fontAndLeadingManager(this.ctx.measureText(line2Width, true))
            this.ctx.fillText("Use the arrow keys or mouse to move around.", centerX - line1Width / 2, centerY - this.leading);
            this.ctx.fillText("Click on a denizen to learn more about them.", centerX - line2Width / 2, centerY + this.leading);
            this.fadeManger()
        } else if (this.sequenceStep === 8) {
            this.ctx.fillStyle = `rgba(0,0,0,${this.fader})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            this.simStart = true
        }






    }

    updatePos() {
        this.looptracker += .5
    }

    drawText(text, triangleBool) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        const textWidth = this.ctx.measureText(text).width;
        const textHeight = 10;

        const x = centerX - (textWidth / 2);
        const y = centerY + (textHeight / 2);

        if (triangleBool) {
            this.ctx.beginPath();
            this.ctx.moveTo(centerX + 25, centerY + 50);
            this.ctx.lineTo(centerX - 25, centerY + 25);
            this.ctx.lineTo(centerX - 25, centerY + 75);
            this.ctx.fill();
        }


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

