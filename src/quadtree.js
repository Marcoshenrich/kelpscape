



export default class Quadtree {
    constructor(bounds, capacity, view) {
        this.bounds = bounds;
        this.capacity = capacity;
        this.points = [];
        this.nodes = [];
        this.ctx = view.ctx
        this.view = view
    }


    draw(){
        console.log(this.ctx)
        this.ctx.fillStyle = 'rgba(0,0,0,.5)';
        this.ctx.fillRect(this.bounds.x + this.view.offset[0], this.bounds.y + this.view.offset[1], this.bounds.width, 1)
        this.ctx.fillRect(this.bounds.x + this.view.offset[0], this.bounds.y + this.view.offset[1], 1, this.bounds.height)
        for (const node of this.nodes) {
            node.draw()
        }
    }

    insert(point) {
        if (this.nodes.length) {
            for (const node of this.nodes) {
                if (node.insert(point)) {
                    return true;
                }
            }
        }
        
        if (!this.bounds.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }

        if (!this.nodes.length) {
            this.subdivide();
        }

        for (const node of this.nodes) {
            if (node.insert(point)) {
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

        for (const point of this.points) {
            for (const node of this.nodes) {
                node.insert(point);
            }
        }

        this.points = [];
    }

    queryRange(range) {
        const foundPoints = [];

        if (!this.bounds.intersects(range)) {
            return foundPoints;
        }

        for (const point of this.points) {
            if (range.contains(point)) {
                foundPoints.push(point);
            }
        }

        for (const node of this.nodes) {
            foundPoints.push(...node.queryRange(range));
        }

        return foundPoints;
    }
}

export class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(point) {
        return (
            point.x >= this.x &&
            point.x <= this.x + this.width &&
            point.y >= this.y &&
            point.y <= this.y + this.height
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