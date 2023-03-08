import Denizen from "./denizen";

export default class Seaweed extends Denizen {
    constructor(id, ctx, canvas, view, logic, {pos}) {
        super(ctx, canvas, view, logic)
        this.id = id
        this.width = 60 
        this.height = 80 
        this.sizeCoef = Math.floor(Math.random() * 15)
        this.pos = [pos[0] + Math.floor(Math.random() * 10), (this.arenaHeight - this.height) - ((id - 1) * 25)]
        // this.pos[0] = Math.floor(Math.random() * this.arenaWidth - this.width/2)
        // this.pos[1] = this.arenaHeight - this.height - Math.floor(Math.random() * 200)

        this.img = new Image()
        this.img.src = './dist/art/seaweed.png'
        this.aniStateNames = ["sway1", "sway2", "swish", "swoosh"]
        this.animationState = this.aniStateNames[Math.floor(Math.random() * 2)]
        this.animations = [];

        //what if seaweed clusters could grow? and then be eaten by something over time.

        this.animationStates = [
            { name: "sway1", frames: 8},
            { name: "sway2", frames: 8},
            { name: "swish", frames: 8 },
            { name: "swoosh", frames: 8 }
        ];

        this.gameFrame = Math.floor(Math.random() * 100)
        this.staggerFrame = 40

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

    coreloop() {

        let position = Math.floor((this.gameFrame / this.staggerFrame) % this.animations[this.animationState].loc.length)
        let frameX = this.width * position;
        let frameY = this.animations[this.animationState].loc[position].y
        this.ctx.drawImage(this.img, frameX, frameY, this.width, this.height, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width + this.sizeCoef, this.height + this.sizeCoef)
        this.gameFrame++
    }


    

    
}



