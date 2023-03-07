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

        this.animate()
        this.debugging = false

    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.updateCamera(this.logic.input.keys) 

        this.ctx.drawImage(this.background, this.backgroundPos[0], this.backgroundPos[1], this.arenaWidth, this.arenaHeight)

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


    updateCamera(input) {
        let xSpeed = 0;
        let ySpeed = 0;

        //horizontal movementf
        if (input.includes('ArrowRight')) {
            // this.lastMovingLeft = false
            // this.xVelocity = Math.min(1, this.xVelocity + 0.05)
            // xSpeed = (this.maxSpeed * this.xVelocity);
            xSpeed = -(1) // my code
        } else if (input.includes('ArrowLeft')) {
            // this.lastMovingLeft = true
            // this.xVelocity = Math.min(1, this.xVelocity + 0.05)
            // xSpeed = -(this.maxSpeed * this.xVelocity);
            xSpeed = (1) // my code
        } else {
            // this.xVelocity = Math.max(0, this.xVelocity - 0.1)
            // xSpeed = (this.maxSpeed * this.xVelocity);
            xSpeed = (0) // my code
            // if (this.lastMovingLeft) {
            //     xSpeed *= -1
            // }
        }

        // vertical movement
        if (input.includes('ArrowUp')) {
            // this.lastMovingUp = true
            // this.yVelocity = Math.min(1, this.yVelocity + 0.05)
            // ySpeed = -(this.maxSpeed * this.yVelocity);
            ySpeed = (1) // my code
        } else if (input.includes('ArrowDown')) {
            // this.lastMovingUp = false
            // this.yVelocity = Math.min(1, this.yVelocity + 0.05)
            // ySpeed = (this.maxSpeed * this.yVelocity);
            ySpeed = -(1) // my code
        } else {
            // this.yVelocity = Math.max(0, this.yVelocity - 0.1)
            // ySpeed = (this.maxSpeed * this.yVelocity);
            // if (this.lastMovingUp) {
            //     ySpeed *= -1
            // }
            ySpeed = (0) // my code
        }

        // if (this.xVelocity != 0 || this.yVelocity != 0) {
        //     this.timer++;
        //     if (this.timer % 5 === 0) {
        //         this.frame > 6 ? this.frame = 0 : this.frame++;
        //     }
        // }

  

        let desiredX = this.offset[0] + xSpeed;
        let desiredY = this.offset[1] + ySpeed;

        this.offset[0] += xSpeed;
        this.offset[1] += ySpeed;

        if (desiredX >= 0) this.offset[0] = 0;
        if (desiredX <= (-this.arenaWidth + this.canvas.width)) this.offset[0] = (-this.arenaWidth + this.canvas.width);
        if (desiredY >= 0) this.offset[1] = 0;
        if (desiredY <= (-this.arenaHeight + this.canvas.height)) this.offset[1] = (-this.arenaHeight+ this.canvas.height);

        this.backgroundPos[0] = this.offset[0];
        this.backgroundPos[1] = this.offset[1];

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
        Object.values(this.seaweedClusters).forEach((seaweedCluster) => {
            seaweedCluster.draw()
        })

    }
}


