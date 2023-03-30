import Logic from "./logic"
import Quadtree, { Rectangle } from "./quadtree"


export default class View {

    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.background = new Image()
        this.background.src = './dist/art/background.jpeg'

        this.arenaCoef = 2
        this.arenaWidth = 1000 * this.arenaCoef
        this.arenaHeight = 666 * this.arenaCoef
        this.backgroundPos = [-this.arenaWidth/3, -this.arenaHeight/3]
        this.offset = [-this.arenaWidth / 3, -this.arenaHeight / 3]
        this.logic = new Logic(this.ctx, this.canvas, this)
        this.fishes = this.logic.fishes
        this.fishBabies = this.logic.fishBabies
        this.algae = this.logic.algae
        this.eggs = this.logic.eggs
        this.sharks = this.logic.sharks
        this.effects = this.logic.effects
        this.seaweedClusters = this.logic.seaweedClusters
        this.deadCreatures = this.logic.deadCreatures
        this.crabs = this.logic.crabs
        this.crabBabies = this.logic.crabBabies
        this.jellyfish = this.logic.jellyfish
        this.rocks = this.logic.rocks

        this.allDenizensArr = [this.fishes, this.fishBabies, this.algae, this.eggs, this.sharks, this.effects, this.seaweedClusters, this.crabs, this.deadCreatures, this.crabBabies, this.jellyfish, this.rocks]
        this.allDenizensinQuadArr = [this.fishes, this.fishBabies, this.algae, this.eggs, this.sharks, this.effects, this.crabs, this.deadCreatures, this.jellyfish]

        this.bounds = new Rectangle(0, 0, this.arenaWidth, this.arenaHeight)
        this.quadtree = {}
        this.ecosystemGraphData = []

        this.populateQuad()
        this.animate()
        this.debugging = false
        this.gameFrame = 0





    }

    populateQuad() {
        this.quadtree = new Quadtree(this.bounds, 6, this);
        this.allDenizensinQuadArr.forEach((denizenObj)=>{
            Object.values(denizenObj).forEach((denizen) => {
                this.quadtree.insert(denizen)
            })
        })

    }




    animate() {
        this.gameFrame++ 
        // if (this.gameFrame % 100 === 0) this.populateQuad() 
        this.populateQuad() 
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.updateCamera(this.logic.input.keys) 
        this.drawBackround()
        this.drawTextBox()
        this.drawDenizens()
        if (this.gameFrame % 10 === 0) this.captureEcosystemGraphData()
        this.drawEcosystemGraph()
        this.logic.coreLoop()
        if (this.debugging) this.quadtree.draw()
        requestAnimationFrame(this.animate.bind(this))
    }

    drawBackround() {
        this.ctx.drawImage(this.background, this.backgroundPos[0], this.backgroundPos[1], this.arenaWidth, this.arenaHeight)
        this.ctx.fillStyle = 'rgba(0,0,0,.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    captureEcosystemGraphData() { 

        if (this.ecosystemGraphData.length > 100) this.ecosystemGraphData.shift()

        let totalDenizens = Object.values(this.algae).length + Object.values(this.fishes).length + Object.values(this.fishBabies).length + Object.values(this.crabs).length + + Object.values(this.crabBabies).length
        const graphData = {
            totalDenizens,
            algaeRatio: (Object.values(this.algae).length / totalDenizens),
            fishRatio: (Object.values(this.fishes).length + Object.values(this.fishBabies).length) / totalDenizens,
            crabRatio: (Object.values(this.crabs).length + Object.values(this.crabBabies).length) / totalDenizens
        }
        
        this.ecosystemGraphData.push(graphData)
        
    }

    drawEcosystemGraph() {
        this.ctx.fillStyle = 'rgba(0,0,0,.3)';
        this.ctx.fillRect(this.canvas.width - 220, 10, 202, 220) 

        for (let i = 0; i < this.ecosystemGraphData.length; i++) {
            let { algaeRatio, fishRatio, crabRatio } = this.ecosystemGraphData[i]
            let nextStartHeight = 10

            this.ctx.fillStyle = 'rgba(0,255,0,.1)';
            nextStartHeight += this.drawEcoLine(i, nextStartHeight, algaeRatio)

            this.ctx.fillStyle = 'rgba(0,255,255,.1)';
            nextStartHeight += this.drawEcoLine(i, nextStartHeight, fishRatio)

            this.ctx.fillStyle = 'rgba(255,0,0,.1)';
            nextStartHeight += this.drawEcoLine(i, nextStartHeight, crabRatio)
        }
    }

    drawEcoLine(i, nextStartHeight, ratio) {
        this.ctx.fillRect(this.canvas.width - 220 + (i * 2), nextStartHeight, 2, 220 * ratio)
        return 220 * ratio
    }

    drawTextBox() {
        this.ctx.fillStyle = 'rgba(0,0,0,.3)';
        this.ctx.fillRect(10, 10, 150, 250)

        this.ctx.fillStyle = 'rgba(250,110,0,1)';
        this.ctx.font = "24px serif";
        this.ctx.fillText(`Algae: ${Object.values(this.algae).length}`, 25, 50)
        this.ctx.fillText(`Fishes: ${Object.values(this.fishes).length + Object.values(this.fishBabies).length}`, 25, 80)
        this.ctx.fillText(`Eggs: ${Object.values(this.eggs).length}`, 25, 110)
        this.ctx.fillText(`Sharks: ${Object.values(this.sharks).length}`, 25, 140)
        this.ctx.fillText(`Crabs: ${Object.values(this.crabs).length + Object.values(this.crabBabies).length}`, 25, 170)
        this.ctx.fillText(`Jellies: ${Object.values(this.jellyfish).length}`, 25, 200)
        this.ctx.fillText(`Corpses: ${Object.values(this.deadCreatures).length}`, 25, 230)

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


