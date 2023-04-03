

export default class TextBox {
    constructor(ctx, canvas, view, logic, text) {
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.logic = logic
        this.text = text

        this.startTextAtX = 100
        this.startTextAtY = 100
        this.leading = 50
        this.indexTracker = 0
        this.totalLines = 1

        this.textBoxInnerMargin = 25
        this.textBoxOuterMargin = 100

        this.font = 24

        this.bottomLimitOfText = this.canvas.height - this.textBoxInnerMargin - this.textBoxOuterMargin

    }

    recalculateBounds() {
        this.bottomLimitOfText = this.canvas.height - this.textBoxInnerMargin - this.textBoxOuterMargin
    }

    coreloop() {
        this.ctx.fillStyle = `rgba(0,0,0,.9)`;
        this.ctx.fillRect(this.textBoxOuterMargin, this.textBoxOuterMargin, this.canvas.width - this.textBoxOuterMargin * 2, this.canvas.height - this.textBoxOuterMargin * 2)

        this.textParser()
        this.recalculateBounds()
        console.log("in coreloop")

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
                    //wow...


                    // console.log(this.ctx.measureText(checkSent).fontBoundingBoxAscent + this.startTextAtY + (this.leading * this.totalLines))
                    // console.log(this.bottomLimitOfText);
                    if (this.ctx.measureText(checkSent).fontBoundingBoxAscent + this.startTextAtY + (this.leading * this.totalLines) > this.bottomLimitOfText) {
                        this.font -= 2
                        this.leading -= 5
                    }



                    if (i === textArr.length - 1 && this.ctx.measureText(checkSent + word).width < this.canvas.width - (this.textBoxOuterMargin * 2) - (this.textBoxInnerMargin * 2)) {
                        printSent += word
                    } else {
                        this.ctx.fillText(word, this.startTextAtX + this.textBoxInnerMargin, this.startTextAtY + this.leading * (this.totalLines + 1))
                    }


                    this.ctx.fillText(printSent, this.startTextAtX + this.textBoxInnerMargin, this.startTextAtY + this.leading * this.totalLines)
                    this.totalLines += 1

                    printSent = ""
                    checkSent = ""

                    if (i === textArr.length - 1) {
                        this.indexTracker = i + 1
                        if (this.ctx.measureText(checkSent).fontBoundingBoxAscent + this.startTextAtY + (this.leading * this.totalLines) < this.canvas.height * .6) {
                            this.font += 2
                            this.leading += 5
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