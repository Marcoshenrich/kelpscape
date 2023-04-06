

export default class TextBox {
    constructor(ctx, canvas, view, logic, type, text, path) {
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.logic = logic
        this.type = type
        this.text = text

        this.leading = 50
        this.indexTracker = 0
        this.totalLines = 0
        
        this.textBoxInnerMargin = 25
        this.textBoxOuterMargin = Math.floor(this.canvas.width/12)

        this.startTextAtX = this.textBoxOuterMargin + this.textBoxInnerMargin
        this.startHeaderAtY = this.startTextAtX
        this.startTextAtY = this.ctx.measureText(this.type).actualBoundingBoxDescent + this.textBoxInnerMargin

        this.font = 24

        
        this.img = new Image()
        this.img.src = `./dist/images/${path}`
        this.imgWidth = this.canvas.width/4
        this.imgHeight = this.imgWidth * .66

        this.topPlacementOfImage = this.canvas.height - this.textBoxInnerMargin - this.textBoxOuterMargin - this.imgHeight

        this.bottomLimitOfText = this.topPlacementOfImage - this.textBoxInnerMargin
        this.rightLimitOfText = this.canvas.width - this.textBoxInnerMargin - this.textBoxOuterMargin

        this.textR = 234
        this.textB = 221
        this.textG = 212

        this.textFader = 0
        this.fadeInSpeed = .005
    }

    resetTextBox() {
        this.leading = 50
        this.indexTracker = 0
        this.totalLines = 0
        this.font = 24
        this.textFader = 0
    }

    recalculateBounds() {
        this.topPlacementOfImage = this.canvas.height - this.textBoxInnerMargin - this.textBoxOuterMargin - this.imgHeight
        this.rightLimitOfText = this.canvas.width - this.textBoxInnerMargin - this.textBoxOuterMargin
        this.bottomLimitOfText = this.topPlacementOfImage - this.textBoxInnerMargin
        this.imgWidth = this.canvas.width / 4
        this.imgHeight = this.imgWidth * .66
        this.startTextAtX = this.textBoxOuterMargin + this.textBoxInnerMargin
        this.startHeaderAtY = this.startTextAtX + 15
        this.startTextAtY = this.ctx.measureText(this.type).actualBoundingBoxDescent + this.textBoxInnerMargin/2 + this.startHeaderAtY
    }

    coreloop() {
        this.ctx.fillStyle = `rgba(0,64,100,.85)`;
        this.ctx.fillRect(this.textBoxOuterMargin, this.textBoxOuterMargin, this.canvas.width - this.textBoxOuterMargin * 2, this.canvas.height - this.textBoxOuterMargin * 2)
        this.ctx.drawImage(this.img, (this.canvas.width/2) - (this.imgWidth/2), this.topPlacementOfImage, this.imgWidth, this.imgHeight)
       

        this.ctx.measureText(this.type).width

        this.ctx.fillStyle = `rgba(${this.textR},${this.textB},${this.textG},${this.textFader})`;
        if (this.textFader < 1) this.textFader += this.fadeInSpeed
        this.ctx.font = `${this.font * 1.4}px serif`;


        this.ctx.fillText(this.type, (this.canvas.width / 2) - (this.ctx.measureText(this.type).width / 2), this.startHeaderAtY)


        this.textParser()
        this.recalculateBounds()
        this.totalLines = 1
        this.indexTracker = 0
    }

    textParser() {
        let textArr = this.text.split(" ")
        let printSent = ""
        let checkSent = ""
        this.ctx.font = `${this.font}px serif`;

        while (this.indexTracker < textArr.length) {

            for (let i = this.indexTracker; i < textArr.length; i++) {
                let word = textArr[i]
                checkSent += word

                // this.ctx.fillRect(this.rightLimitOfText, 0, 1, this.canvas.height)
                // this.ctx.fillRect(0, this.startTextAtY, this.canvas.width, 1)


                if (this.startTextAtX + this.ctx.measureText(checkSent).width > this.rightLimitOfText || i === textArr.length - 1) {

                    let bottomPosOfText = this.ctx.measureText(checkSent).actualBoundingBoxDescent + this.startTextAtY + (this.leading * (this.totalLines))

                    if (bottomPosOfText > this.bottomLimitOfText) {
                        this.font -= 1
                        this.leading -= 2.5
                        this.indexTracker = 0
                        break
                    }

                    if (i === textArr.length - 1 && this.ctx.measureText(checkSent + word).width < this.canvas.width - (this.textBoxOuterMargin * 2) - (this.textBoxInnerMargin * 2)) {
                        printSent += word
                    } else if (i === textArr.length - 1) {
                        this.ctx.fillText(word, this.startTextAtX, this.startTextAtY  + this.leading * (this.totalLines + 1))
                    }


                    this.ctx.fillText(printSent, this.startTextAtX, this.startTextAtY + (this.leading * this.totalLines))
                    this.totalLines += 1

                    printSent = ""
                    checkSent = ""

                    if (i === textArr.length - 1) {
                        this.indexTracker = i + 1
                        if (bottomPosOfText < this.bottomLimitOfText - this.textBoxInnerMargin * 3) {
                            this.font += 1
                            this.leading += 2.5
                        }
                    } else {
                        this.indexTracker = i
                    }

                    break
                }

                printSent += word

                checkSent += " "
                printSent += " "
            }

        }

    }



}