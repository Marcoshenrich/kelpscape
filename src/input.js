
export default class InputHandler {

    constructor(){
        this.keys = [];
        window.addEventListener('keydown', e => {
            if((e.code === 'ArrowDown' ||
                e.code === 'ArrowUp' ||
                e.code === 'ArrowLeft' ||
                e.code === 'ArrowRight' ||
                e.code === "Space")
            && this.keys.indexOf(e.code) === -1){
                this.keys.push(e.code);
            }
            e.preventDefault();
        });

        window.addEventListener('keyup', e => {
            if (e.code === 'ArrowDown' ||
                e.code === 'ArrowUp' ||
                e.code === 'ArrowLeft' ||
                e.code === 'ArrowRight' ||
                e.code === "Space") {
                this.keys.splice(this.keys.indexOf(e.code), 1);
            }
            e.preventDefault();
        })
    }
}