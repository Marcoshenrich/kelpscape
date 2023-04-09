
export default class Floater {

    //algae, fishegg -> direct
    //jellyfish, turtle -> indirect

    constructor(denizen) {
        this.denizen = denizen
        this.bobCoef = Math.floor(Math.random() * 10) + 4
        this.bobSpeed = (Math.floor(Math.random() * 3) + .1) / 30
        this.trackCoef = 0
        this.bobUp = [true, false][Math.floor(Math.random() * 2)]
    }

    coreloop() {
        this.bob()
    }


    bob() {
        if (this.denizen.trapped) {
            this.denizen.pos[0] = this.denizen.trapped[0] - this.denizen.trappedPosDelta[0]
            this.denizen.pos[1] = this.denizen.trapped[1] - this.denizen.trappedPosDelta[1]
            return
        }

        if (this.bobUp) {
            this.trackCoef -= this.bobSpeed
            this.denizen.pos[1] -= this.bobSpeed
        } else {
            this.trackCoef += this.bobSpeed
            
            if (!(this.denizen.pos[1] > (this.arenaHeight - this.height))) {
                this.denizen.pos[1] += this.bobSpeed
            }
        }

        if (this.trackCoef > this.bobCoef) {
            this.bobUp = true
        }

        if (this.trackCoef < 0) {
            this.bobUp = false
        }

    }


}