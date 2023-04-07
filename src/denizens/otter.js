
import { rand } from "../engine/utils";
import Denizen from "./denizen";

export default class Otter extends Denizen{
    constructor(id, ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.textBox = this.logic.textContentObj["Otter"]
        this.type = "Otter"
        this.id = this.type + id
        this.ctx = ctx
        this.canvas = canvas
        this.view = view
        this.logic = logic

        this.upRight = new Image()
        this.upRight.src = './dist/art/otter/otterUpRight.png'
        this.upLeft = new Image()
        this.upLeft.src = './dist/art/otter/otterUpLeft.png'
        this.downRight = new Image()
        this.downRight.src = './dist/art/otter/otterDownRight.png'
        this.downLeft = new Image()
        this.downLeft.src = './dist/art/otter/otterDownLeft.png'
        this.height = 60
        this.width = 30

        this.maxSpeed = 1
        this.appearedOnScreen = false
        
        this.pos = []

        this.centerX = rand(this.arenaWidth)
        this.centerY = 0;



        this.radius = rand(this.arenaHeight/2, this.arenaHeight - 50)

        this.right = [true,false][rand(2)]

        this.angle = this.right ? 135 : 0
        this.trapPos = [null,null]

        this.trapHeight = 6
        this.trapWidth = 4
        this.trappedPrey = false

        this.trapPlacer()
        this.imgSelector()
    }

    imgSelector() {
        this.img = this.right ? this.downRight : this.downLeft
    }

    moveInACircle() {
        if (this.right) {
            this.angle -= 0.001;
        } else {
            this.angle += 0.001;

        }
        this.pos[0] = this.centerX + this.radius * Math.cos(this.angle);
        this.pos[1] = this.centerY + this.radius * Math.sin(this.angle)
    }

    coreloop() {
        this.rotateImage(this.img, this.pos[0], this.pos[1], this.width, this.height)
        this.moveInACircle()

        if (!this.appearedOnScreen && this.pos[0] > 0 && this.pos[1] > 0 && this.pos[0] + this.width < this.arenaWidth)  {
            this.appearedOnScreen = true
        }

        this.trapPlacer()
        if (this.appearedOnScreen && this.pos[1] + this.height < 0 || (this.pos[0] + this.width < 0 || this.pos[0] - this.width > this.arenaWidth)) {
            this.dead = true
            this.logic.recentlyDeadDenizens.push(this)

            if (this.trappedPrey) {
                this.trappedPrey.dead = true
                this.logic.recentlyDeadDenizens.push(this.trappedPrey)
            }
        }
    }

    rotateImage() {
        this.ctx.save();
        this.ctx.translate(this.pos[0] + this.width / 2 + this.offset[0], this.pos[1] + this.height / 2 + this.offset[1]);

        if (this.right) {
            this.ctx.rotate(((this.angle - 135) * 45) * Math.PI / 180.0);
        }else {
            this.ctx.rotate((this.angle * 45) * Math.PI / 180.0);
        }

        this.ctx.translate(-this.pos[0] - this.width / 2 - this.offset[0], -this.pos[1] - this.height / 2 - this.offset[1]);
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height);
        
        this.ctx.restore();
    }

    trapPlacer() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        let bottomX;
        let bottomY;
        if (this.right) {
            bottomX = (this.width / 2) - 10
            bottomY = (-this.height / 2) + 15
        } else {
            bottomX = (-this.width / 2) + 20
            bottomY = (this.height / 2) - 10
        }
       
        const rotatedBottomX = bottomX * Math.cos(this.angle) - bottomY * Math.sin(this.angle);
        const rotatedBottomY = bottomX * Math.sin(this.angle) + bottomY * Math.cos(this.angle);

        const bottomPosX = this.pos[0] + centerX + rotatedBottomX
        const bottomPosY = this.pos[1] + centerY + rotatedBottomY

        this.trapPos[0] = bottomPosX;
        this.trapPos[1] = bottomPosY;

        // this.ctx.fillStyle = 'rgba(0,255,255,1)';
        // this.ctx.fillRect(this.trapPos[0] + this.offset[0], this.trapPos[1] + this.offset[1], this.trapWidth, this.trapHeight)
    }

}