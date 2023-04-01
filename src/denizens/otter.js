
import { rand } from "../engine/utils";
import Denizen from "./denizen";


export default class Otter extends Denizen{
    constructor(id, ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.id = "Otter" + id
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
        this.xCoef = 0
        this.returnToSurface = false

        this.maxSpeed = 1
        this.divingForFood = false
        this.pos = [rand(this.arenaWidth - this.width),0-this.height]

        this.trapHeight = 6
        this.trapWidth = 4
        this.trappedPrey = false

        this.trapPlacer()
        this.findCrab()
        this.imgSelector()

    }

    imgSelector() {
        if (this.trappedPrey || this.returnToSurface) {
            this.img = [this.upRight, this.upLeft][rand(0,1)]
        } else {
            if (this.pos[0] >= this.divingForFood.pos[0]) {
                this.img = this.downLeft
            } else {
                this.img = this.downRight
            } 
        }
    }

    coreloop() {
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)

        if (this.trappedPrey || this.returnToSurface) {
            this.moveTowardsSurface()
        } else {
            this.moveTowardsFood()
        }

        this.trapPlacer()

    }


    afterITrapCB() {
        this.imgSelector()
        this.trappedPrey.trappedPosDelta = [0,0]
    }

    trapPlacer() {
        if (this.trappedPrey || this.returnToSurface) {
            this.trapPos = [this.pos[0] + (this.width / 2) - (this.trapWidth / 2), this.pos[1] - this.trapHeight]
        } else {
            this.trapPos = [this.pos[0] + (this.width / 2) - (this.trapWidth / 2), this.pos[1] + this.height - this.trapHeight]
        }
    }

    findCrab() {
        let crabArr = Object.values(this.logic.crabs)
        this.divingForFood = crabArr[rand(crabArr.length)]
    }

    moveTowardsSurface() {
        this.pos[1] -= this.maxSpeed
    }
    
    moveTowardsFood() {
        
        let [xhigh, xlow, yhigh, ylow] = this.inBounds()

        if (this.trapPos[0] < this.divingForFood.pos[0]) {
            if (xhigh) this.pos[0] += this.maxSpeed
        } else {
            if (xlow) this.pos[0] -= this.maxSpeed
        }

        if (this.trapPos[1] < this.divingForFood.pos[1]) {
            if (yhigh) this.pos[1] += this.maxSpeed
        } else {
            if (ylow) this.pos[1] -= this.maxSpeed
        }

    }

    inBounds() {
        let xhigh = true
        let xlow = true
        let yhigh = true
        let ylow = true
        if (this.pos[0] < 0) xlow = false
        if (this.pos[0] > this.view.arenaWidth - this.width) xhigh = false
        if (this.pos[1] < 0) ylow = false
        if (this.pos[1] > this.view.arenaHeight - this.height) yhigh = false
        return [xhigh, xlow, yhigh, ylow]
    }


}