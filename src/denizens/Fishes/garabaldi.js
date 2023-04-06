import Fish from "./fish";

export default class Garabaldi extends Fish{
    constructor(id, ctx, canvas, view, logic, options) {
        super(ctx, canvas, view, logic, { ...options, width: 25, height: 16, mouthSize : 8})
        this.id = "Garabaldi" + id
        this.leftImg.src = './dist/art/fishes/fishleft.png'
        this.rightImg.src = './dist/art/fishes/fishright.png'
        this.speed = (Math.floor(Math.random() * 5) + 1) / 10
        
        this.oldPos = this.pos
        this.maxEnergy = 20
        this.energy = this.maxEnergy

        this.energyUseCoef = .005
        this.matingThreshold = 15
        this.matingEnergyCost = 5
        this.maxSpeed = .6

        this.energyVal = 20
        this.mateThreshold = 10

        this.eatFoodThreshold = 15
        this.huntingThreshold = 7
    }

}