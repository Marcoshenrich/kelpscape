import Denizen from "./denizen";

export default class Seaweed extends Denizen {
    constructor(ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.width = 60
        this.height = 80
        this.pos = [500, this.canvas.height - this.height + 10]

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
        this.animationStates.forEach((spriteState,index) => {
            let frames = {
                loc: [],
            }
            for (let j = 0; j < spriteState.frames; j++) {
                let positionX = j * this.width;
                let positionY = index * this.height;
                frames.loc.push({ x: positionX, y: positionY });
            }
            this.animations[spriteState.name] = frames;
        });
    }

    draw(ctx, gameFrame, staggerFrame) {
        let position = Math.floor((gameFrame / staggerFrame) % this.animations[this.animationState].loc.length)
        let frameX = this.width * position;
        let frameY = this.animations[this.animationState].loc[position].y
        ctx.drawImage(this.img, frameX, frameY, this.width, this.height, this.pos[0], this.pos[1], this.width, this.height)

        // ctx.drawImage(this.img, frameX, frameY, this.width, this.height, this.xPosition, this.yPosition, this.width, this.height)
    }


    

    
}



