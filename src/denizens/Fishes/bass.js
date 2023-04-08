import Fish from "./fish";

export default class Bass extends Fish {
    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic, { ...options, width: 45, height: 35, mouthSize: 10 })
        this.type = "Bass"
        this.id = this.type + id
        this.leftImg.src = './dist/art/fishes/bassleft.png'
        this.rightImg.src = './dist/art/fishes/bassright.png'
        this.speed = (Math.floor(Math.random() * 5) + 1) / 10

        this.textBox = this.logic.textContentObj["Kelp Bass"]


        this.oldPos = this.pos
        this.maxEnergy = 25
        this.energy = this.maxEnergy

        this.energyUseCoef = .005
        this.matingThreshold = 18
        this.matingEnergyCost = 6
        this.maxSpeed = .45

        this.energyVal = 25
        this.mateThreshold = 20

        this.eatFoodThreshold = 17
        this.huntingThreshold = 15
    }

}