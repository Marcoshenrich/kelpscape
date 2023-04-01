import Denizen from "./denizen"

export default class SeaUrchin extends Denizen {
    constructor(id, ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.id = "SeaUrchin" + id
        this.img = new Image()
        this.img.src = './dist/art/sea_urchin.png'
    }
}