import Logic from "./logic"

export default class View {

    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.background = new Image()
        this.background.src = './dist/art/background.jpeg'

        this.arenaCoef = 2
        this.arenaWidth = this.canvas.width * this.arenaCoef
        this.arenaHeight = this.canvas.height * this.arenaCoef
        this.backgroundPos = [-this.arenaWidth/3, -this.arenaHeight/3]
        this.offset = [-this.arenaWidth / 3, -this.arenaHeight / 3]


        this.logic = new Logic(this.ctx, this.canvas, this)
        this.fishes = this.logic.fishes
        this.algae = this.logic.algae
        this.eggs = this.logic.eggs
        this.sharks = this.logic.sharks
        this.effects = this.logic.effects
        this.seaweedClusters = this.logic.seaweedClusters
        this.deadCreatures = this.logic.deadCreatures
        this.crabs = this.logic.crabs

        this.allDenizensArr = [this.fishes, this.algae, this.eggs, this.sharks, this.effects, this.seaweedClusters, this.crabs, this.deadCreatures]

        this.animate()
        this.debugging = false

    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.updateCamera(this.logic.input.keys) 
        this.drawBackround()
        this.drawTextBox()
        this.drawDenizens()
        this.logic.coreLoop()
        requestAnimationFrame(this.animate.bind(this))
    }

    drawBackround() {
        this.ctx.drawImage(this.background, this.backgroundPos[0], this.backgroundPos[1], this.arenaWidth, this.arenaHeight)
        this.ctx.fillStyle = 'rgba(0,0,0,.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    drawTextBox() {
        this.ctx.fillStyle = 'rgba(0,0,0,.3)';
        this.ctx.fillRect(10, 10, 200, 120)

        this.ctx.fillStyle = 'rgba(250,110,0,1)';
        this.ctx.font = "36px serif";
        this.ctx.fillText(`Fishes: ${Object.values(this.logic.fishes).length}`, 25, 50)
        this.ctx.fillText(`Algae: ${Object.values(this.logic.algae).length}`, 25, 100)
    }


    updateCamera(input) {
        let xSpeed = 0;
        let ySpeed = 0;

        if (input.includes('ArrowRight')) {
            xSpeed = -(1.5)
        } else if (input.includes('ArrowLeft')) {
            xSpeed = (1.5)
        } else {
            xSpeed = (0)
        }

        if (input.includes('ArrowUp')) {
            ySpeed = (1.5)
        } else if (input.includes('ArrowDown')) {
            ySpeed = -(1.5)
        } else {
            ySpeed = (0)
        }

        this.offset[0] += xSpeed;
        this.offset[1] += ySpeed;

        if (this.offset[0] >= 0) this.offset[0] = 0;
        if (this.offset[0] <= (-this.arenaWidth + this.canvas.width)) this.offset[0] = (-this.arenaWidth + this.canvas.width);
        if (this.offset[1] >= 0) this.offset[1] = 0;
        if (this.offset[1] <= (-this.arenaHeight + this.canvas.height)) this.offset[1] = (-this.arenaHeight+ this.canvas.height);

        this.backgroundPos[0] = this.offset[0];
        this.backgroundPos[1] = this.offset[1];
    }

    drawDenizens() {
        this.allDenizensArr.forEach((denizenObj)=>{
            Object.values(denizenObj).forEach((denizen) => {
                denizen.coreloop()
            })
        })
    }
}


