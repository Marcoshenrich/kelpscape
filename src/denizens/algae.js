import TextBox from "../engine/textbox"
import Floater from "./floater"


export default class Algae extends Floater {

    constructor(id, ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.textBox = new TextBox(ctx, canvas, view, logic, "Algae are some of the most important organisms in the Pacific kelp forest ecosystem. One of the most iconic species is giant kelp (Macrocystis pyrifera), which can grow up to 100 feet tall and forms dense underwater forests. Giant kelp is a type of brown algae that provides a habitat for a variety of marine life, from small invertebrates to large fish and sea mammals. Another important type of algae is the red algae, which includes species like coralline algae and rhodophytes. These algae provide a source of food and shelter for a variety of organisms in the kelp forest, and can also play an important role in regulating the pH of the ocean. While algae may not be as charismatic as some of the larger animals in the kelp forest, they are an essential component of this complex ecosystem, and help to support a diverse community of marine life.", "algae.webp")

        this.id = "Algae" + id
        this.img = new Image()
        this.img.src = './dist/art/algae.png'
        this.height = 8
        this.width = 8
        this.pos = this.placer()
        this.bobCoef = Math.floor(Math.random() * 10) + 4
        this.bobSpeed = (Math.floor(Math.random() * 3) +.1)/30
        this.trackCoef = 0
        this.up = [true, false][Math.floor(Math.random() * 2)]
        this.energyVal = 10
    }

    placer() {
        let pos = []
        pos[0] = Math.floor(Math.random() * this.arenaWidth) - this.width
        pos[1] = Math.floor(Math.random() * this.arenaHeight / 2) + (this.arenaHeight / 2) - this.height
        return pos
    }

    

}