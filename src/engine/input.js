
export default class InputHandler {

    constructor(view){
        this.view = view
        this.keys = [];
        this.mouseIsDownAt = false

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

    dragScreen(moveArr) {
        this.view.offset[0] += moveArr[0] - this.mouseIsDownAt[0]
        this.view.offset[1] += moveArr[1] - this.mouseIsDownAt[1]

        this.mouseIsDownAt = [moveArr[0], moveArr[1]] 
    }


}