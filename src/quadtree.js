import Fishegg from "./fishegg";




export default class Quadtree {
    constructor(bounds, capacity, view) {
        this.bounds = bounds;
        this.capacity = capacity;
        this.denizens = [];
        this.nodes = [];
        this.ctx = view.ctx
        this.view = view
    }


    draw(){
        this.ctx.fillStyle = 'rgba(255,0,0,.5)';
        this.ctx.fillRect(this.bounds.x + this.view.offset[0], this.bounds.y + this.view.offset[1], this.bounds.width, 2)
        this.ctx.fillRect(this.bounds.x + this.view.offset[0], this.bounds.y + this.view.offset[1], 2, this.bounds.height)
        for (const node of this.nodes) {
            node.draw()
        }
    }

    insert(denizen) {
        if (this.nodes.length) {
            for (const node of this.nodes) {
                if (node.insert(denizen)) {
                    return true;
                }
            }
        }
        
        if (!this.bounds.contains(denizen)) {
            return false;
        }

        if (this.denizens.length < this.capacity) {
            this.denizens.push(denizen);
            return true;
        }

        if (!this.nodes.length) {
            this.subdivide();
        }

        for (const node of this.nodes) {
            if (node.insert(denizen)) {
                return true;
            }
        }
        return false;
    }


    subdivide() {
        const x = this.bounds.x;
        const y = this.bounds.y;
        const halfWidth = this.bounds.width / 2;
        const halfHeight = this.bounds.height / 2;

        const nw = new Quadtree(new Rectangle(x, y, halfWidth, halfHeight), this.capacity, this.view);
        const ne = new Quadtree(new Rectangle(x + halfWidth, y, halfWidth, halfHeight), this.capacity, this.view);
        const sw = new Quadtree(new Rectangle(x, y + halfHeight, halfWidth, halfHeight), this.capacity, this.view);
        const se = new Quadtree(new Rectangle(x + halfWidth, y + halfHeight, halfWidth, halfHeight), this.capacity, this.view);

        this.nodes = [nw, ne, sw, se];

        for (const denizen of this.denizens) {
            for (const node of this.nodes) {
                node.insert(denizen);
            }
        }

        this.denizens = [];
    }

    queryRange(range) {
        const foundDenizens = [];
    
        if (!this.bounds.intersects(range)) {
            return foundDenizens;
        }

        for (const denizen of this.denizens) {
            if (range.contains(denizen)) {
                foundDenizens.push(denizen);
            }
        }

        for (const node of this.nodes) {
            foundDenizens.push(...node.queryRange(range));
        }

        return foundDenizens;
    }
}

export class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }


    contains(denizen) {
        let [x,y] = denizen.pos
        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );
    }

    intersects(range) {
        return !(
            range.x - range.width > this.x + this.width ||
            range.x + range.width < this.x - this.width ||
            range.y - range.height > this.y + this.height ||
            range.y + range.height < this.y - this.height
        );
    }
}