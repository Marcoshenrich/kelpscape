
export default class MouthEater {

    constructor(denizen, options) {
        this.denizen = denizen
        this.mouthHeight = options.mouthHeight
        this.mouthWidth = options.mouthWidth
        this.leftMouthYAdjustment = options.leftMouthYAdjustment
        this.leftMouthXAdjustment = options.leftMouthXAdjustment
        this.rightMouthYAdjustment = options.rightMouthYAdjustment
        this.rightMouthXAdjustment = options.rightMouthXAdjustment
        this.mouthPos = [0, 0]
    }

    coreloop() {
        this.mouthPlacer()
        // this.denizen.ctx.fillStyle = 'rgba(0,255,255,1)';
        // this.denizen.ctx.fillRect(this.mouthPos[0] + this.denizen.offset[0], this.mouthPos[1] + this.denizen.offset[1], this.mouthWidth, this.mouthHeight)
    }
    
    mouthPlacer() {
        let mouthPos = []
        if (!this.denizen.right) {
            this.mouthPos[0] = this.denizen.pos[0] + this.leftMouthXAdjustment
            this.mouthPos[1] = this.denizen.pos[1] + this.leftMouthYAdjustment
        } else {
            this.mouthPos[0] = this.denizen.pos[0] + this.rightMouthXAdjustment
            this.mouthPos[1] = this.denizen.pos[1] + this.rightMouthYAdjustment
        }
        return mouthPos
    }

}