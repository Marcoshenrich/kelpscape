import Denizen from "../denizens/denizen";
import { rand } from "../engine/utils";
class Rock extends Denizen {

    constructor(id, ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.textBox = this.logic.textContentObj["Rock"]

        this.type = "Rock"
        this.id = "Rock" + id
        this.img = new Image()
        this.rockKeys = ["small_rock", "small_rock_2", "small_green", "med_rock", "med_rock_2", "rock_pile", "tall_med", "boulder_1", "boulder_2", "arch"]
        this.rockRoll = this.rockKeys[rand(this.rockKeys.length)]

        this.width;
        this.height;
        this.rockSelector()
        this.pos = [Math.floor(Math.random() * this.arenaWidth - (this.width / 2)), this.arenaHeight - this.height]
    }

    coreloop(){
        this.draw()
    }

    draw() {
        this.drawDenizen()
    }

    
    rockSelector() {
        switch (this.rockRoll) {
            case "small_rock":
                this.img.src = './dist/art/rocks/small_rock.png'
                this.width = rand(20,50)
                this.height = this.width * .4
                break

            case "small_rock_2":
                this.img.src = './dist/art/rocks/small_rock_2.png'
                this.width = rand(10, 50)
                this.height = this.width * .7
                break

            case "small_green":
                this.img.src = './dist/art/rocks/small_rock_green.png'
                this.width = rand(20, 60)
                this.height = this.width * 1.1
                break

            case "med_rock":
                this.img.src = './dist/art/rocks/med_rock.png'
                this.width = rand(40, 80)
                this.height = this.width * .6
                break

            case "med_rock_2":
                this.img.src = './dist/art/rocks/med_rock_2.png'
                this.width = rand(20, 60)
                this.height = this.width * 1.1
                break


            case "rock_pile":
                this.img.src = './dist/art/rocks/rock_pile.png'
                this.width = rand(20, 60)
                this.height = this.width * .9
                break

            case "tall_med":
                this.img.src = './dist/art/rocks/tall_med.png'
                this.width = rand(15, 35)
                this.height = this.width * 2
                break

            case "boulder_1":
                this.img.src = './dist/art/rocks/boulder_1.png'
                this.width = rand(40, 120)
                this.height = this.width * .5
                break

            case "boulder_2":
                this.img.src = './dist/art/rocks/boulder_2.png'
                this.width = rand(20, 100)
                this.height = this.width *.65
                break

            case "arch":
                this.img.src = './dist/art/rocks/arch.png'
                this.width = rand(100, 140)
                this.height = this.width * .45
                break
        }
    }

}

export default Rock