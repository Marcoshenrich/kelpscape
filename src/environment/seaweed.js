import Denizen from "../denizens/denizen";
import TextBox from "../engine/textbox";
import { rand } from "../engine/utils";


export default class Seaweed extends Denizen {
    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic)
        this.textBox = this.logic.textContentObj["Algae"]
        this.cluster = options.cluster
        this.numInCluster = id
        this.type = "Seaweed"
        this.id = "Cluster" + this.cluster.id + "Seaweed" + this.numInCluster
        this.width = 60 
        this.height = 80 
        this.sizeCoef = Math.floor(Math.random() * 15)
        this.pos = [options.pos[0] + Math.floor(Math.random() * 5) - 10, (this.arenaHeight - this.height) - ((id - 1) * 25)]

        // this.pos[0] = Math.floor(Math.random() * this.arenaWidth - this.width/2)
        // this.pos[1] = this.arenaHeight - this.height - Math.floor(Math.random() * 200)

        this.img = new Image()
        this.img.src = './dist/art/seaweed.png'
        this.aniStateNames = ["sway1", "sway2", "swish", "swoosh"]
        this.animationState = this.aniStateNames[Math.floor(Math.random() * 2)]
        this.animations = [];

        //what if seaweed clusters could grow? and then be eaten by something over time.

        this.energyVal = 5

        this.animationStates = [
            { name: "sway1", frames: 8},
            { name: "sway2", frames: 8},
            { name: "swish", frames: 8 },
            { name: "swoosh", frames: 8 }
        ];

        this.gameFrame = Math.floor(Math.random() * 100)
        this.staggerFrame = 40

        this.animationFramesSetter()
        this.placeUrchin()
    }

    placeUrchin() {
        if (rand(10)) return

        this.logic.spawnDenizen(this)
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
        if (this.energyVal < 0) {
            this.energyVal = 5
            this.cluster.shrinkSeaweed()
        }
    }


    

    
}



