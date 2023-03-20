import Denizen from "./denizen";
import { rand } from "./utils";
class Rock extends Denizen {

    constructor(id, ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.id = "Rock" + id
        this.img = new Image()
        // this.rockRoll = ["small", "med", "small_green", "boulder_1", "boulder_2"][Math.floor(Math.random() * 5)]
        this.rockRoll = "med"

        this.width;
        this.height;
        this.rockSelector()
        this.pos = [Math.floor(Math.random() * this.arenaWidth - (this.width / 2)), this.arenaHeight - this.height]
    }

    coreloop(){
        this.draw()
    }

    draw() {
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
    }

    
    rockSelector() {
        switch (this.rockRoll) {
            case "small":
                this.img.src = './dist/art/rocks/small_rock.png'
                this.width = rand(50,20)
                this.height = this.width * .4
                break

            case "med":
                this.img.src = './dist/art/rocks/med_rock.png'
                this.width = 25
                this.height = 15
                this.energyVal = 10
                break

            case "small_green":
                this.img.src = './dist/art/rocks/small_rock_green.png'
                this.width = 30
                this.height = 15
                break

            case "boulder_1":
                this.img.src = './dist/art/rocks/boulder_1.png'
                this.width = 100
                this.height = 50
                break

            case "boulder_2":
                this.img.src = './dist/art/rocks/boulder_2.png'
                this.width = 200
                this.height = 100
                break
        }
    }

}

export default Rock