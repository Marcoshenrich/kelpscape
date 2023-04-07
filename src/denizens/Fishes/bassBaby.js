import FishBaby from "./fishbaby";


export default class BassBaby extends FishBaby {
    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic, { ...options, width: 20, height: 17, mouthSize: 4 })
        this.type = "BassBaby"
        this.id = this.type + id
        this.leftImg.src = './dist/art/fishes/bassleft.png'
        this.rightImg.src = './dist/art/fishes/bassright.png'

        this.speed = (Math.floor(Math.random() * 5) + 1) / 10

        this.mouthPos = this.mouthPlacer()

        this.maxEnergy = 12
        this.energy = this.maxEnergy

        this.energyUseCoef = .003
        this.maxSpeed = .3
        this.energyVal = 5


        this.eatFoodThreshold = 9
        this.huntingThreshold = 7

    }
}