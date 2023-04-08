import Fish from "./fish";

export default class Rockfish extends Fish {
    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic, { ...options, width: 30, height: 19, mouthSize: 8 })
        this.type = "Rockfish"
        this.id = this.type + id
        this.leftImg.src = './dist/art/fishes/fishleft.png'
        this.rightImg.src = './dist/art/fishes/fishright.png'
        this.speed = (Math.floor(Math.random() * 5) + 1) / 10
        this.textBox = this.logic.textContentObj["Rockfish"]


        this.oldPos = this.pos
        this.maxEnergy = 20
        this.energy = this.maxEnergy

        this.energyUseCoef = .005
        this.matingThreshold = 15
        this.matingEnergyCost = 5
        this.maxSpeed = .4

        this.energyVal = 20
        this.mateThreshold = 10

        this.eatFoodThreshold = 15
        this.huntingThreshold = 7
    }

}