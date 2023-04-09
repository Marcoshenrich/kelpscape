
export default class Trapper {

    constructor(denizen, options) {
        this.denizen = denizen
        this.trapHeight = options.trapHeight
        this.trapWidth = options.trapWidth
        this.trapYAdjustment = options.trapYAdjustment
        this.trapXAdjustment = options.trapXAdjustment
        this.denizenEatsImmediately = options.denizenEatsImmediately
        this.trapPos = [0,0]
    }

    coreloop() {
        if (this.denizen.trapPlacer) {
            this.denizen.trapPlacer()
        } else {
            this.trapPlacer()
        }
        if (!this.denizenEatsImmediately) return
        if (this.denizen.trappedPrey) this.eatTrappedPrey(this.denizen.trappedPrey)

        // this.denizen.ctx.fillStyle = 'rgba(0,255,255,1)';
        // this.denizen.ctx.fillRect(this.trapPos[0] + this.denizen.offset[0], this.trapPos[1] + this.denizen.offset[1], this.trapWidth, this.trapHeight)
    }

    eatTrappedPrey(foodSource) {
        this.denizen.energy = Math.min(this.denizen.maxEnergy, this.denizen.energy + this.denizen.consumptionRate)
        foodSource.energy -= this.denizen.consumptionRate
        this.denizen.totalEnergyConsumed += this.denizen.consumptionRate

        if (foodSource.dead) {
            this.denizen.speed = .2
            this.denizen.trappedPrey = false
        }
    }


    trapPlacer() {
        this.trapPos[0] = this.denizen.pos[0] + this.trapXAdjustment
        this.trapPos[1] = this.denizen.pos[1] + this.trapYAdjustment
    }



}