import FishBaby from "./fishbaby";


export default class GarabaldiBaby extends FishBaby {
    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic, { ...options, width: 12, height: 8, mouthSize: 4 })
        this.id = "GarabaldiBaby" + id
        this.leftImg.src = './dist/art/fishes/fishleft.png'
        this.rightImg.src = './dist/art/fishes/fishright.png'

        this.speed = (Math.floor(Math.random() * 5) + 1) / 10
   
        this.mouthPos = this.mouthPlacer()

        this.maxEnergy = 10
        this.energy = this.maxEnergy

        this.energyUseCoef = .0025
        this.maxSpeed = .3
        this.energyVal = 5

        this.mateThreshold = 10

        this.eatFoodThreshold = 8
        this.huntingThreshold = 6

    }
}