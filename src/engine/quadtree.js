
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

    insert(denizen, level=0) {
        if (level > 1000) console.log(denizen)
        if (this.nodes.length) {
            for (const node of this.nodes) {
                if (node.insert(denizen, level + 1)) {
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
            if (node.insert(denizen, level + 1)) {
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

    queryType(denizenClass, debugbool) {
        const foundDenizens = [];

        for (const denizen of this.denizens) {
            if (denizen.constructor === denizenClass) {
                foundDenizens.push(denizen);
            }
        }

        for (const node of this.nodes) {
            foundDenizens.push(...node.queryType(denizenClass));
        }

        if (debugbool) {
            foundDenizens.forEach((denizen)=>{
                this.view.ctx.fillRect(denizen.pos[0] + this.view.offset[0], denizen.pos[1] + this.view.offset[1], denizen.width, denizen.height)
            })
        }

        return foundDenizens;
    }

    queryRange(range, opDenizen) {
        const foundDenizens = [];

    
        if (!this.bounds.intersects(range)) {
            return foundDenizens;
        }

        for (const denizen of this.denizens) {
            if (range.contains(denizen) && opDenizen.id !== denizen.id) {
                foundDenizens.push(denizen);
            }
        }


        for (const node of this.nodes) {
            foundDenizens.push(...node.queryRange(range, opDenizen));
        }

        return foundDenizens;
    }

    findOverlaps(range, opDenizen) {
        const foundDenizens = [];

        if (!this.bounds.intersects(range)) {
            return foundDenizens;
        }

        for (const denizen of this.denizens) {
            if (opDenizen.id !== denizen.id && range.overlaps(denizen)) {
                foundDenizens.push(denizen);
            }
        }


        for (const node of this.nodes) {
            foundDenizens.push(...node.findOverlaps(range, opDenizen));
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

    overlaps(denizen) {
        let recA = { left: this.x, right: this.x + this.width, top: this.y, bottom: this.y + this.height }
        let recB = { left: denizen.pos[0], right: denizen.pos[0] + denizen.width, top: denizen.pos[1], bottom: denizen.pos[1] + denizen.height }
        return this.recOverlapCheck(recA, recB) || this.recOverlapCheck(recB, recA)
    }


    recOverlapCheck(a, b) {
        return ((b.left <= a.right) && (b.right >= a.left) && (b.top <= a.bottom) && (b.bottom >= a.top))
    }


    contains(denizen) {
        let [x, y] = denizen.pos
        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );
    }

    intersects(range, view) {

        // if (view) {
        //     // view.ctx.globalAlpha = .1;
        //     // view.ctx.fillStyle = 'rgba(255,0,0,.1)';
        //     // view.ctx.fillRect(this.x + view.offset[0], this.y + view.offset[1], this.width, this.height)
        //     // view.ctx.globalAlpha = 1;

        //     // console.log({ x: range.x + view.offset[0], y: range.y + view.offset[1], width: range.width, height: range.height })
        //     view.ctx.globalAlpha = .1;
        //     view.ctx.fillStyle = 'rgba(0,200,255,.1)';
        //     view.ctx.fillRect(range.x + view.offset[0], range.y + view.offset[1], range.width, range.height)
        //     view.ctx.globalAlpha = 1;
        // }


        return !(
            range.x - range.width > this.x + this.width ||
            range.x + range.width < this.x - this.width ||
            range.y - range.height > this.y + this.height ||
            range.y + range.height < this.y - this.height
        );
    }
}