import Intro from "./intro"
import View from "./view"

export default class Pilot {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d')
        this.canvas = canvas
        this.view = new View(canvas)
        this.intro = new Intro(canvas)
        
        this.startTextAtX = 125
        this.startTextAtY = 125
        this.leading = 50
        this.indexTracker = 0
        this.totalLines = 1
        
        this.text = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur ? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur ?"
        this.animate()

    }

    animate() {
        // if (!this.intro.simStart) {
        //     this.intro.animate()
        // } else {
        //     this.view.animate()
        // }
        this.view.animate()

        this.ctx.fillStyle = `rgba(0,0,0,.9)`;
        this.ctx.fillRect(100, 100, this.canvas.width - 200, this.canvas.height - 200)
    
        

        this.textParser()

        this.totalLines = 1
        this.indexTracker = 0
        requestAnimationFrame(this.animate.bind(this))
    }

    textParser() {
        let textArr = this.text.split(" ")
        let printSent = ""
        let checkSent = ""

        this.ctx.fillStyle = `rgba(255,255,255,1)`;
        this.ctx.font = "24px serif";


        while (this.indexTracker < textArr.length) { 
           
            for (let i = this.indexTracker; i < textArr.length; i++) {
                let word = textArr[i]
                checkSent += word

                if (this.ctx.measureText(checkSent).width > this.canvas.width - 250 || i === textArr.length - 1 ) {
                    //wow...
                    if (i === textArr.length - 1 && this.ctx.measureText(checkSent +  word).width < this.canvas.width - 250) {
                        printSent += word
                    } else{
                        this.ctx.fillText(word, this.startTextAtX, this.startTextAtY + this.leading * (this.totalLines + 1) )
                    }

                    this.ctx.fillText(printSent, this.startTextAtX, this.startTextAtY + this.leading * this.totalLines)
                    this.totalLines += 1
                   
                    printSent = ""
                    checkSent = ""

                    if (i === textArr.length - 1) {
                        this.indexTracker = i + 1
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