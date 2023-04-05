

export default class TextBox {
    constructor(ctx, canvas, view, logic, type, text, path) {
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.logic = logic
        this.type = type
        this.text = text

        this.startTextAtX = 100
        this.startTextAtY = 100
        this.leading = 50
        this.indexTracker = 0
        this.totalLines = 1

        this.textBoxInnerMargin = 25
        this.textBoxOuterMargin = 100

        this.font = 24

        
        this.img = new Image()
        this.img.src = `./dist/images/${path}`
        this.imgWidth = this.canvas.width/4
        this.imgHeight = this.imgWidth * .66

        this.topPlacementOfImage = this.canvas.height - this.textBoxInnerMargin - this.textBoxOuterMargin - this.imgHeight

        this.bottomLimitOfText = this.topPlacementOfImage - this.textBoxInnerMargin
    }

    recalculateBounds() {
        this.topPlacementOfImage = this.canvas.height - this.textBoxInnerMargin - this.textBoxOuterMargin - this.imgHeight
        this.bottomLimitOfText = this.topPlacementOfImage - this.textBoxInnerMargin
        this.imgWidth = this.canvas.width / 4
        this.imgHeight = this.imgWidth * .66
    }

    coreloop() {
        this.ctx.fillStyle = `rgba(0,0,0,.9)`;
        this.ctx.fillRect(this.textBoxOuterMargin, this.textBoxOuterMargin, this.canvas.width - this.textBoxOuterMargin * 2, this.canvas.height - this.textBoxOuterMargin * 2)
        this.ctx.drawImage(this.img, (this.canvas.width/2) - (this.imgWidth/2), this.topPlacementOfImage, this.imgWidth, this.imgHeight)
        this.textParser()
        this.recalculateBounds()
        this.totalLines = 1
        this.indexTracker = 0
    }

    textParser() {
        let textArr = this.text.split(" ")
        let printSent = ""
        let checkSent = ""

        this.ctx.fillStyle = `rgba(255,255,255,1)`;
        this.ctx.font = `${this.font}px serif`;


        while (this.indexTracker < textArr.length) {

            for (let i = this.indexTracker; i < textArr.length; i++) {
                let word = textArr[i]
                checkSent += word

                if (this.ctx.measureText(checkSent).width > this.canvas.width - (this.textBoxOuterMargin * 2) - (this.textBoxInnerMargin * 2) || i === textArr.length - 1) {

                    let bottomPosOfText = this.ctx.measureText(checkSent).actualBoundingBoxDescent + this.startTextAtY + (this.leading * (this.totalLines))

                    if (bottomPosOfText > this.bottomLimitOfText) {
                        this.font -= 1
                        this.leading -= 2.5
                        this.indexTracker = 0
                        break
                    }

                    if (i === textArr.length - 1 && this.ctx.measureText(checkSent + word).width < this.canvas.width - (this.textBoxOuterMargin * 2) - (this.textBoxInnerMargin * 2)) {
                        printSent += word
                    } else {
                        this.ctx.fillText(word, this.startTextAtX + this.textBoxInnerMargin, this.startTextAtY  + this.leading * (this.totalLines + 1))
                    }


                    this.ctx.fillText(printSent, this.startTextAtX + this.textBoxInnerMargin, this.startTextAtY + this.leading * this.totalLines)
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