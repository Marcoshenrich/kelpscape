
export default class Metabolism {

    constructor(denizen) {
        this.denizen = denizen
    }

    coreloop() {
        this.consumeEnergy()
    }

    consumeEnergy() {
        this.denizen.energy -= this.denizen.energyUseCoef * this.denizen.speed
        if (this.denizen.energy < .01) {
            this.denizen.dead = true
            this.denizen.logic.recentlyDeadDenizens.push(this.denizen)
            this.denizen.logic.denizenCorpse(this.denizen)
        }
    }

}