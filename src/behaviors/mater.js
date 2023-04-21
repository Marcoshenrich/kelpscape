
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
        // fish, crab is likely different
        if (!this.denizen.spawn && !this.denizen.seekingMate && this.denizen.energy > this.denizen.matingThreshold) {
            this.denizen.logic.matingDenizensObj[this.denizen.id] = this.denizen
            this.denizen.seekingMate = true
        } else if (!this.denizen.spawn && this.denizen.seekingMate && this.denizen.energy < this.denizen.matingThreshold) {
            delete this.denizen.logic.matingDenizensObj[this.denizen.id]
            this.denizen.seekingMate = false
        }
    }
}