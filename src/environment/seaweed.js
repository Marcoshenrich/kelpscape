import Denizen from "../denizens/denizen";
import TextBox from "../engine/textbox";
import { rand } from "../engine/utils";


export default class Seaweed extends Denizen {
    constructor(id, ctx, canvas, view, logic, {pos}) {
        super(ctx, canvas, view, logic)
        this.textBox = new TextBox(ctx, canvas, view, logic, "Algae are some of the most important organisms in the Pacific kelp forest ecosystem. One of the most iconic species is giant kelp (Macrocystis pyrifera), which can grow up to 100 feet tall and forms dense underwater forests. Giant kelp is a type of brown algae that provides a habitat for a variety of marine life, from small invertebrates to large fish and sea mammals. Another important type of algae is the red algae, which includes species like coralline algae and rhodophytes. These algae provide a source of food and shelter for a variety of organisms in the kelp forest, and can also play an important role in regulating the pH of the ocean. While algae may not be as charismatic as some of the larger animals in the kelp forest, they are an essential component of this complex ecosystem, and help to support a diverse community of marine life.", "algae.webp")

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
    }


    

    
}



