import Logic from "./logic"
import Quadtree, { Rectangle } from "./quadtree"
import Input from "./input"

export default class View {

    constructor(canvas, mobile) {
        this.canvas = canvas
        this.mobile = !!mobile
        this.ctx = canvas.getContext('2d')
        this.background = new Image()
        this.background.src = './dist/art/background.jpeg'

        this.arenaHeight = Math.max(window.innerHeight, 1700)
        this.arenaWidth = this.arenaHeight * 1.5
        this.backgroundPos = [(this.canvas.width / 2) - (this.arenaWidth / 2), (this.canvas.height / 2) - (this.arenaHeight / 2),]
        this.offset = [(this.canvas.width / 2) - (this.arenaWidth / 2), (this.canvas.height / 2) - (this.arenaHeight / 2),]

        this.logic = new Logic(this.ctx, this.canvas, this)
        this.input = new Input(this)

        this.scoreFontSize = 24
        this.showScore = false
        setTimeout(() => { this.showScore = true}, 60000)
        this.fadeInScore = 0

        this.allDenizensArr = [
            this.logic.garabaldi, 
            this.logic.garabaldiBabies, 
            this.logic.bass,
            this.logic.bassBabies,
            this.logic.algae, 
            this.logic.eggs, 
            this.logic.sharks, 
            this.logic.effects, 
            this.logic.turtles,
            this.logic.seaweedClusters,
            this.logic.seaweed,
            this.logic.crabs, 
            this.logic.crabBabies, 
            this.logic.deadCreatures, 
            this.logic.otters, 
            this.logic.seaUrchins,
            this.logic.jellyfish, 
            this.logic.rocks, 
            this.logic.polyps
        ]


        this.bounds = new Rectangle(0, 0, this.arenaWidth, this.arenaHeight)
        this.quadtree = {}
        this.ecosystemGraphData = []

        this.populateQuad()
        this.debugging = false
        this.gameFrame = 0

        this.introFader = 1

        this.textBox = null
        // this.textBox = this.logic.textContentObj["Fish"]



    }

    populateQuad() {
        this.quadtree = new Quadtree(this.bounds, 6, this);
        this.allDenizensArr.forEach((denizenObj)=>{
            Object.values(denizenObj).forEach((denizen) => {
                this.quadtree.insert(denizen)
            })
        })

    }

    fadeInStart() {
        this.ctx.fillStyle = `rgba(0,0,0,${this.introFader})`;
        this.introFader -= .005
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = `rgba(255,255,255,${this.introFader})`;
        this.ctx.fillText("mobile intro test", this.canvas.width / 2, this.canvas.height / 2)

    }

    drawInfoText() {
        if (this.textBox) this.textBox.coreloop()
    }


    animate() {
        this.gameFrame++ 
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // if (this.gameFrame % 100 === 0) this.populateQuad() 
        this.populateQuad() 
        this.updateCamera(this.input.keys) 
        this.drawBackround()
        // this.drawTextBox()
        this.denizenCoreloop()
        this.drawInfoText()
        // if (this.gameFrame % 10 === 0) this.captureEcosystemGraphData()
        // this.drawEcosystemGraph()


        if (this.showScore && !this.textBox) this.drawScore()

        if (this.introFader > 0) this.fadeInStart()
        this.logic.coreloop()
        if (this.debugging) this.quadtree.draw()
    }

    drawScore() {
        if (this.fadeInScore < 1) this.fadeInScore += .0025
        this.ctx.globalAlpha = this.fadeInScore
  
        let startX = 50
        let startY = 75

        //title
        let text = "Denizens Found"
        this.ctx.fillStyle = `rgba(255,255,255,${.9 * this.fadeInScore})`;
        this.ctx.font = `24px Georgia`;
        this.ctx.fillText(text, startX, startY)
        let centerText = this.ctx.measureText(text).width / 2

        
        //score
        let maxScore = Object.values(this.logic.scoreTrackObj).length
        let score = 0
        Object.values(this.logic.scoreTrackObj).forEach((found) => {
            if (found) score++
        })

        if (this.scoreFontSize > 24) this.scoreFontSize -= .1
        this.ctx.font = `${this.scoreFontSize}px Georgia`;
        this.ctx.fillText(score, startX + 67, startY + 67)
       
        this.ctx.font = `24px Georgia`;
        this.ctx.fillText(maxScore, startX + 93, startY + 93)


        //score line
        this.ctx.beginPath();
        this.ctx.moveTo(startX + 67, startY + 93);
        this.ctx.lineTo(startX + 103, startY + 57);
        // this.ctx.fillStyle = `rgba(255,255,255,${.1 * this.fadeInScore})`;

        this.ctx.lineWidth = 3
        this.ctx.stroke();


        //fill circle

        this.ctx.beginPath();
        this.ctx.arc(startX + centerText, startY + 75, 50 + this.scoreFontSize/2 - 12, 0, 2 * Math.PI);
        this.ctx.fillStyle = `rgba(255,255,255,${.4 * this.fadeInScore})`;
        this.ctx.fill();
        this.ctx.globalAlpha = 1
    }

    drawBackround() {
        this.ctx.drawImage(this.background, this.backgroundPos[0], this.backgroundPos[1], this.arenaWidth, this.arenaHeight)
        this.ctx.fillStyle = 'rgba(0,0,0,.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    captureEcosystemGraphData() { 

        // if (this.ecosystemGraphData.length > 100) this.ecosystemGraphData.shift()

        // let totalDenizens = Object.values(this.logic.algae).length + Object.values(this.logic.fishes).length + Object.values(this.logic.fishBabies).length + Object.values(this.logic.crabs).length + + Object.values(this.logic.crabBabies).length
        // const graphData = {
        //     totalDenizens,
        //     algaeRatio: (Object.values(this.logic.algae).length / totalDenizens),
        //     fishRatio: (Object.values(this.logic.fishes).length + Object.values(this.logic.fishBabies).length) / totalDenizens,
        //     crabRatio: (Object.values(this.logic.crabs).length + Object.values(this.logic.crabBabies).length) / totalDenizens
        // }
        
        // this.ecosystemGraphData.push(graphData)
        
    }

    drawEcosystemGraph() {
        // this.ctx.fillStyle = 'rgba(0,0,0,.3)';
        // this.ctx.fillRect(this.canvas.width - 220, 10, 202, 220) 

        // for (let i = 0; i < this.ecosystemGraphData.length; i++) {
        //     let { algaeRatio, fishRatio, crabRatio } = this.ecosystemGraphData[i]
        //     let nextStartHeight = 10

        //     this.ctx.fillStyle = 'rgba(0,255,0,.1)';
        //     nextStartHeight += this.drawEcoLine(i, nextStartHeight, algaeRatio)

        //     this.ctx.fillStyle = 'rgba(0,255,255,.1)';
        //     nextStartHeight += this.drawEcoLine(i, nextStartHeight, fishRatio)

        //     this.ctx.fillStyle = 'rgba(255,0,0,.1)';
        //     nextStartHeight += this.drawEcoLine(i, nextStartHeight, crabRatio)
        // }
    }

    drawEcoLine(i, nextStartHeight, ratio) {
        // this.ctx.fillRect(this.canvas.width - 220 + (i * 2), nextStartHeight, 2, 220 * ratio)
        // return 220 * ratio
    }

    drawTextBox() {
        // this.ctx.fillStyle = 'rgba(0,0,0,.3)';
        // this.ctx.fillRect(10, 10, 150, 250)

        // this.ctx.fillStyle = 'rgba(250,110,0,1)';
        // this.ctx.font = "24px serif";
        // this.ctx.fillText(`Algae: ${Object.values(this.logic.algae).length}`, 25, 50)
        // this.ctx.fillText(`Fishes: ${Object.values(this.logic.fishes).length + Object.values(this.logic.fishBabies).length}`, 25, 80)
        // this.ctx.fillText(`Eggs: ${Object.values(this.logic.eggs).length}`, 25, 110)
        // this.ctx.fillText(`Sharks: ${Object.values(this.logic.sharks).length}`, 25, 140)
        // this.ctx.fillText(`Crabs: ${Object.values(this.logic.crabs).length + Object.values(this.logic.crabBabies).length}`, 25, 170)
        // this.ctx.fillText(`Jellies: ${Object.values(this.logic.jellyfish).length}`, 25, 200)
        // this.ctx.fillText(`Corpses: ${Object.values(this.logic.deadCreatures).length}`, 25, 230)

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

    denizenCoreloop() {
        this.allDenizensArr.forEach((denizenObj)=>{
            Object.values(denizenObj).forEach((denizen) => {
                denizen.coreloop()
            })
        })
    }
}


