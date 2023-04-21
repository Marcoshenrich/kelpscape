
export default class Mater {

    constructor(denizen, options) {
        this.denizen = denizen
        this.mating = false
        this.seekingMate = false
    }

    coreloop() {
        this.evaluateBacherlorhood()
    }

    evaluateBacherlorhood() {
        if (this.denizen.type === "Crab") {
            if (!this.spawn && !this.hasGivenBirth && !this.seekingMate && this.energy > this.matingThreshold && this.recentlyAte && !this.carryingEggs) {
                this.logic.matingDenizensObj[this.id] = this
                this.seekingMate = true
            } else if (!this.spawn && this.seekingMate && this.energy < this.matingThreshold) {
                delete this.logic.matingDenizensObj[this.id]
                this.seekingMate = false
            }
        } else {
            if (!this.denizen.spawn && !this.denizen.seekingMate && this.denizen.energy > this.denizen.matingThreshold) {
                this.denizen.logic.matingDenizensObj[this.denizen.id] = this.denizen
                this.denizen.seekingMate = true
            } else if (!this.denizen.spawn && this.denizen.seekingMate && this.denizen.energy < this.denizen.matingThreshold) {
                delete this.denizen.logic.matingDenizensObj[this.denizen.id]
                this.denizen.seekingMate = false
            }
        }
    }
}