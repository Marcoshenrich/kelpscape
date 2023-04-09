Kelpscape simulates a Pacific Kelp Forest ecosystem in a light-hearted 2d environment with a pixel art aesthetic. Each denizen of the biome takes care of its own needs - seeking out food and mating partners, avoiding predators, and impacting the other denizens in the interwoven ecosystem. 

Kelpscape was built using vanilla javascript and the Canvas API. 

## Features

Over a dozen species of inhabitants in the ecosystem
Educational blurbs on each species
Systemically emergent ecosystem 
Music and mute functionality

## Technology and Approach
At the top level, a Pilot controller manages the state changes between the opening cinematic and initializing the Sim. It also contains the Sound class to manage music looping and volume. 

The View class manages the graphical representation of all denizens in the Sim. It manages user inputs which move the camera on the Canvas, as well as the textboxes which appear when a user clicks on a denizen. 

View also continually recreates the Quadtree. The Quadtree data structure organizes the spatial placement of each denizen on the 2d arena, and makes collision detection significantly more effecient. You cna learn more about the Quadtree below. 

Logic is initialized by View, and is the core engine of the Sim. Logic initializes all the starting denizens and sets up various data structures needed for the Sim to run. 

NatureController contains various data structures that must be continually recalculated for denizens to correctly interact with a changing landscape. For example, the shifting placement of Seaweed throughout the course of the sim changes the available area where Algae can spawn and where Crabs can climb. Doing this calculation at the top level prevents each individual Denizen from having to track these changes.

BehaviorController manages the logic denizens use to interact with each other. It models shared behaviors such as hunting for food, eating, finding mates, spawning, etc.

Every entity in the Sim is a Denizen. Different types of core behaviors inherit from Denizen - Floater, Swimmer, Trapper. Each creature inherits from the behavior set it most closely mimics. 






## Behavior Controller

To generalize denizen behavior, I placed shared behavior logic inside of the behaviorController class. When a denizen meets certain conditions, it adds itself to specific objects inside of Logic to signal that it is Ready to Hunt, Ready to Mate, etc. This increases efficiency by only detecting collisions for denizens that are participating in a specific behavior. 

```javascript
    coreloop() {
        this.denizensHuntWhenHungry()
        this.denizensWithMouthsCanFindSomethingElseToEat()
        this.denizensWithMouthsEatPrey()
        this.trappersTrapPrey()
        this.denizensMate()
        this.fishFleeFromSharks()
        this.scavengersEatDeadCreatures()
    }
```

Let's deep dive into the trapper process. 

Logic defines a trappersArr which contains all denizens which can trap. 

If the trapper already has trapped prey or is currently mating, it cannot trap any prey. 

QueryRange checks if any creatures have been trapped. A full overlap is required, which means any dimension of the trapee is fully withen the trap, or vice versa. 

Next, trappersTrapPrey checks that the denizen that is inside the trap is something the trapper actually wants to eat. If it is, the trapped prey records the difference in position between itself and the trapper. Once trapped, the prey ignores all movement logic, and updates its position to match the position of its trapper, modified by the recored position delta. This means wherever the trapper goes, the trapee goes with it.

![trappedFish](https://user-images.githubusercontent.com/110189879/230758713-5e989d0c-e1c5-497c-a7d2-88ad03f5a857.gif)

```javascript
    //logic.behaviorController
    trappersTrapPrey() {
        for (let i = 0; i < this.logic.trappersArr.length; i++) {
            let trapper = this.logic.trappersArr[i]
            if (trapper.trappedPrey) continue
            if (trapper.mating) continue

            let collisionArray = this.logic.view.quadtree.queryRange(new Rectangle(trapper.trapPos[0], trapper.trapPos[1], trapper.trapWidth, trapper.trapHeight), "fullyOverlaps", trapper)

            for (const prey of collisionArray) {
                if (trapper.preySpecies[prey.type]) {
                    if (prey.dead) continue
                    prey.trapped = trapper.trapPos
                    prey.trappedPosDelta = [trapper.trapPos[0] - prey.pos[0], trapper.trapPos[1] - prey.pos[1]]
                    trapper.trappedPrey = prey
                    trapper.afterITrapCB()
                }
            }
        }
    }

    //prey.move()
    move() {
        if (this.trapped) {
            this.pos[0] = this.trapped[0] - this.trappedPosDelta[0]
            this.pos[1] = this.trapped[1] - this.trappedPosDelta[1]
            return
        }
        //other movement logic
    }
```























Quadtree

The first type of collision detection I built was a brute force method where each denizen of the sim checked its position against every other denizen on each game frame - But I knew this would be unstustainable as the biosphere grew. I researched alternative data structures, and found that the Quadtree data structure was the perfect solution - it is specifically designed to maximize efficiency for 2d rectangle collisions in a shared area. 

I asked ChatGPT for an example and it gladly gave me broken code. I examined the code example, parsed what it was trying to do, and fixed the bugs (subdivision logic and rectangle collision logic were broken). I then extended it to detect different types of collision. 

How it Works

A Quadtree is made of two classes, Quadtree and Rectangle.

Quadtree - Its area is defined by a rectangle. It holds references to the denizens within its area, OR it holds 4 child quadtrees that partition it. A Quadtree can never have both denizens and child Quadtrees. 
Rectangle - Defines an area by an XY coordinate, a width, and a length. Mangages collision logic.

The Quadtree has a defined limit on how many denizens can be within its area before it subdivides. If a Quadtree with a cap of 6 receives a 7th denizen, it will subdivide itself into 4 child Quadtrees, and pass its denizens onto the appropriate child based on spatial location and area.

To Query collisions in a Quadtree, you pass in a Rectangle to the query, which is compared against the Quadtree's Rectangle (and those of its children) until an appropriate match is found. All Quadtrees that spatially match query their Denizens (or or those of its children), and are then returned in an Array.

Chat GPT's Basic Quadtree

```javascript

export default class Quadtree {
    constructor(bounds, capacity, view) {
        this.bounds = bounds;
        this.capacity = capacity;
        this.denizens = [];
        this.nodes = [];
        this.ctx = view.ctx
        this.view = view
    }

    insert(denizen) {
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
```
With this basis, I was able to extend the functions of both these classes in order to detect different types of collision, and leverage the data structure for other uses. 

Quadtree Extensions
queryType allows me to pull all of a specific species out of a quadtree. 

```javascript

    queryType(denizenClass) {
        const foundDenizens = [];

        for (const denizen of this.denizens) {
            if (denizen.constructor === denizenClass) {
                foundDenizens.push(denizen);
            }
        }

        for (const node of this.nodes) {
            foundDenizens.push(...node.queryType(denizenClass));
        }
        return foundDenizens;
    }

```

A refactor of QueryRange allows me to extend the functionality of Rectangle collision detection, and dynamically call Rectangle methods by dynamically keying into the function using the type parameter. 

```javascript

    queryRange(range, type, opDenizen) {
        if (!opDenizen) console.log(range, type, opDenizen)
        const foundDenizens = [];

        if (!this.bounds.intersects(range)) return foundDenizens;

        for (const denizen of this.denizens) {
            if (opDenizen.id !== denizen.id && range[type](denizen)) foundDenizens.push(denizen);
        }

        for (const node of this.nodes) {
            foundDenizens.push(...node.queryRange(range, type, opDenizen));
        }

        return foundDenizens;
    }

```
Rectangle Extensions
The original Quadtree came with the contains method, which evaluates whether a specific point is inside a rectangle. Since the XY Coordinate on canvas refers to the top-left point of the Denizen, this caused visual bugs and undesired behavior. I built the overlaps and fullyOverlaps methods to detect partial and full overlaps, which are useful for behavior such as a shark eating prey vs a jellyfish trapping a fish. 

```javascript

    rectangleDefiner(denizen) {
        return [
            { left: this.x, right: this.x + this.width, top: this.y, bottom: this.y + this.height },
            { left: denizen.pos[0], right: denizen.pos[0] + denizen.width, top: denizen.pos[1], bottom: denizen.pos[1]}
            ]
    }

    overlaps(denizen) {
        let [recA, recB] = this.rectangleDefiner(denizen)
        return this.recOverlapCheck(recA, recB) || this.recOverlapCheck(recB, recA)
    }

    fullyOverlaps(denizen) {
        let [recA, recB] = this.rectangleDefiner(denizen)
        return this.rectFullyInside(recA, recB) || this.rectFullyInside(recB, recA)
    }

    recOverlapCheck(a, b) {
        return ((b.left <= a.right) && (b.right >= a.left) && (b.top <= a.bottom) && (b.bottom >= a.top))
    }

    rectFullyInside(a, b) {
        return (a.left >= b.left && a.right <= b.right && a.top >= b.top && a.bottom <= b.bottom);
    }
```

<br />