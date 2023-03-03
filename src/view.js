import Logic from "./logic"

export default class View {

    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.background = new Image()
        this.background.src = './dist/art/background.jpeg'
        this.logic = new Logic(this.ctx, this.canvas, this)
        this.fishes = this.logic.fishes
        this.algae = this.logic.algae
        this.eggs = this.logic.eggs
        this.sharks = this.logic.sharks
        this.effects = this.logic.effects
        this.seaweed = this.logic.seaweed
        this.animate()
        this.debugging = false

        this.gameFrame = 0
        this.staggerFrame = 8
    }

    animate() {
        this.gameFrame++
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)


        this.ctx.drawImage(this.background,0,0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = 'rgba(0,0,0,.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = 'rgba(0,0,0,.3)';
        this.ctx.fillRect(10, 10, 200, 120)

        this.ctx.fillStyle = 'rgba(250,110,0,1)';
        this.ctx.font = "36px serif";
        this.ctx.fillText(`Fishes: ${Object.values(this.logic.fishes).length}`, 25, 50)
        this.ctx.fillText(`Algae: ${ Object.values(this.logic.algae).length }`, 25, 100)

        this.drawDenizens()
        this.logic.coreLoop()
        requestAnimationFrame(this.animate.bind(this))
    }

    drawDenizens() {
        Object.values(this.fishes).forEach((fish)=>{
            fish.draw()
        })
        Object.values(this.algae).forEach((algae) => {
            algae.draw()
        })
        Object.values(this.eggs).forEach((egg) => {
            egg.draw()
        })
        Object.values(this.sharks).forEach((shark) => {
            shark.draw()
        })
        Object.values(this.effects).forEach((effect) => {
            effect.draw()
        })
        Object.values(this.seaweed).forEach((effect) => {
            effect.draw()
        })

    }
}


