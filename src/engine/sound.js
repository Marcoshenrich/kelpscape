export default class Sound {
    constructor() {
        this.allSounds = this.allSoundsObj()
        this.volume = .5
        this.kickOffIntroScore = false
        this.playingSong = false
        this.songIndexTracker = 0
    }

    allSoundsObj() {
        return {
            intro: { clip: new Audio("./dist/sounds/soundtrack/intro.mp3"), volumePreset: .2 },
            celestia: { clip: new Audio("./dist/sounds/soundtrack/celestia.mp3"), volumePreset: .2 },
            wavesTake: { clip: new Audio("./dist/sounds/soundtrack/waves_take.mp3"), volumePreset: .2 },
        }
    }

    playNextTrack() {
        this.songIndexTracker += 1
        let audiokey = Object.keys(this.allSounds)[this.songIndexTracker % Object.keys(this.allSounds).length] 
        this.playSound(audiokey)
    }

    playSound(audiokey) {
        this.allSounds[audiokey].clip.volume = this.volume === 0 ? this.volume : this.allSounds[audiokey].volumePreset || this.volume
        this.playingSong = this.allSounds[audiokey].clip
        this.playingSong.play()
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