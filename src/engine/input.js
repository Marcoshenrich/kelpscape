
export default class InputHandler {

    constructor(view){
        this.view = view
        this.keys = [];
        this.mouseIsDownAt = false
        this.mouseIsAt = []
        this.cursorIsPointer = false

        window.addEventListener('mousemove', e => {
            this.mouseIsAt = [e.x, e.y]
        });

        window.addEventListener('keydown', e => {
            if((e.code === 'ArrowDown' ||
                e.code === 'ArrowUp' ||
                e.code === 'ArrowLeft' ||
                e.code === 'ArrowRight')
            && this.keys.indexOf(e.code) === -1){
                this.keys.push(e.code);
            }
            e.preventDefault();
        });

        window.addEventListener('keyup', e => {
            if (e.code === 'ArrowDown' ||
                e.code === 'ArrowUp' ||
                e.code === 'ArrowLeft' ||
                e.code === 'ArrowRight') {
                this.keys.splice(this.keys.indexOf(e.code), 1);
            }
            e.preventDefault();
        })
    }

    coreloop() {
        this.cursorPointsWhenOverADenizen() 
    }

    cursorPointsWhenOverADenizen() {
        const canvasEle = document.getElementById('canvas1');
        let collisionArr = this.view.mouseCollisionDetector(this.mouseIsAt[0], this.mouseIsAt[1])
        if (collisionArr.length &&
            collisionArr[0].type !== "Rock"
        ) {
            if (this.cursorIsPointer) return
            canvasEle.classList.add('hover-class');
            this.cursorIsPointer = true
        } else {
            if (!this.cursorIsPointer) return
            canvasEle.classList.remove('hover-class');
            this.cursorIsPointer = false
        }

    }

    dragScreen(moveArr) {
        let cameraInput = []
        this.view.offset[0] += moveArr[0] - this.mouseIsDownAt[0]
        this.view.offset[1] += moveArr[1] - this.mouseIsDownAt[1]

        this.mouseIsDownAt = [moveArr[0], moveArr[1]] 
        this.view.updateCamera(cameraInput)
    }


}