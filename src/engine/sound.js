export default class Sound {
    constructor() {
        this.allSounds = this.allSoundsObj()
        this.volume = .5
        this.kickOffIntroScore = false
    }

    allSoundsObj() {
        return {
            intro: { clip: new Audio("./dist/sounds/soundtrack/intro.mp3"), volumePreset: .2 },
        }
    }

    playSound(audiokey) {
        this.allSounds[audiokey].clip.volume = this.volume === 0 ? this.volume : this.allSounds[audiokey].volumePreset || this.volume
        this.allSounds[audiokey].clip.play()
    }


    muteAllSounds() {
        this.volume = 0
        Object.values(this.allSounds).forEach((soundObj) => {
            soundObj.clip.volume = 0
        })
    }

    unmuteAllSounds() {
        this.volume = .5
        Object.values(this.allSounds).forEach((soundObj) => {
            soundObj.clip.volume = soundObj.volumePreset || this.volume
        })
    }

    playIntroScore() {
        this.playSound("intro")
        // dont use set timeout, evaluate play and pause on the sound object
        // will have to continually recheck at other points in the core gameloo
        this.kickOffIntroScore = true
    }
}