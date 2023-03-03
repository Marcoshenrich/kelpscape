import Denizen from "./denizen";

export default class Seaweed extends Denizen {
    constructor(ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.pos = [100,100]
        this.width = 60
        this.height = 80

        this.img = new Image()
        this.img.src = './dist/art/seaweed.png'

        this.animationState = "sway1"
        this.animations = [];

        this.animationStates = [
            { name: "sway1", frames: 8},
            { name: "sway2", frames: 8},
            { name: "swish", frames: 8 },
            { name: "swoosh", frames: 8 }
        ];

        this.animationFramesSetter()
    }


    animationFramesSetter() {
        this.animationStates.forEach((spriteState) => {
            let frames = {
                loc: [],
            }
            for (let j = 0; j < spriteState.frames; j++) {
                let positionX = j * this.width;
                let positionY = j * this.height;
                frames.loc.push({ x: positionX, y: positionY });
            }
            this.animations[spriteState.name] = frames;
        });
    }

    draw(ctx, gameFrame, staggerFrames, heightOffset) {
        let rawPosition = (gameFrame / staggerFrames) % this.animations[this.animationState].loc.length
        let position = Math.floor(rawPosition)


        let frameX = this.spriteWidth * position;
        let frameY = 0

        if (this.animationState !== "dead") {
            if (this.animationState !== "idle") {
                this.aniCheckQueue.push(position)
                let unique = this.aniCheckQueue.filter((value, index, self) => { return self.indexOf(value) === index })
                if (unique.length > 1 && this.aniCheckQueue.at(-1) === 0 && this.animationState !== "idle") {
                    this.animationQueueSetter()
                    this.aniCheckQueue = []
                    gameFrame = 0
                }

            }

            if (this.animationQueue.length > 0 && this.animationState === "idle") {
                this.animationQueueSetter()
                gameFrame = 0
            }
        }

        ctx.drawImage(this.image, frameX, frameY, this.spriteWidth, this.spriteHeight, this.xPosition, this.yPosition - heightOffset, Math.floor(this.spriteWidth * this.sizeCoef), Math.floor(this.spriteHeight * this.sizeCoef))

    }


    draw() {
        this.ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height)
    }

    

    
}



