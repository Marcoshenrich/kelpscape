Kelpscape simulates a Pacific Kelp Forest ecosystem in a light-hearted 2d environment with a pixel art aesthetic. Each denizen of the biome takes care of its own needs - they seek out food and mates, they avoid predators, and their actions impact the other denizens in an interwoven ecosystem. 

Kelpscape was built using vanilla javascript and the Canvas API. 

## Features
20 species of inhabitants in the ecosystem
Discoverable educational text on most species
Systemically emergent ecosystem 
Music and mute functionality
Chill vibes

## Technology and Approach
At the top level, a Pilot controller manages the state changes between the opening cinematic and initializing the Sim. It also contains the Sound class to manage music looping and volume. 

The View class manages the graphical representation of all denizens in the Sim. It manages user inputs which move the camera on the Canvas, as well as the textboxes which appear when a user clicks on a denizen. 

View also continually recreates the Quadtree. The Quadtree data structure organizes the spatial placement of each denizen on the 2d arena, and makes collision detection significantly more effecient. You can learn more about the Quadtree below. 

Logic is initialized by View. It is the core engine of the Sim. Logic initializes all the starting denizens and sets up various data structures needed for the Sim to run. 

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

Let's take a look at how Denizens mate. 

Each frame, denizens that can mate evalute if they meet their mating conditions. For Fish to mate, they only need to have their energy above a certain threshold (and not be a lil baby).

Once these conditions are met, they add themselves to Logic's matingDenizensObj where they can be checked for collisions. They also delete themsleves from the mating object when they no longer meet the required conditions. 

```javascript
    //Swimmer.behaviorChanger()
    behaviorChanger() {
        //... 
        if (!this.spawn && !this.seekingMate && this.energy > this.matingThreshold) {
            this.logic.matingDenizensObj[this.id] = this
            this.seekingMate = true
        } else if (!this.spawn && this.seekingMate && this.energy < this.matingThreshold) {
            delete this.logic.matingDenizensObj[this.id]
            this.seekingMate = false
        }
    }
```

On each frame, BehaviorController loops through the mating object and checks collisions for all eligible bachelors using the Quadtree. The type of collision being detected is point insertion, which checks that the XY (top left) coordinate of denizen A is inside the full rectanlge of denizen B. This was the most visually appealing approach. 

The Quadtree returns an array of all creatures the bachelor is colliding with. We loop through the array and check if they are colliding with a member of the same species, and if that denizen is also ready to mate. 

If so, the mate function is called on both, and they are both deleted from matingDenizensObj.

```javascript
    //BehaviorController.denizensMate()
    denizensMate() {
        let matingDenizenArr = Object.values(this.logic.matingDenizensObj)
        for (let i = 0; i < matingDenizenArr.length; i++) {
            let bachelorFish = matingDenizenArr[i]

            let collisionArray = this.logic.view.quadtree.queryRange(new Rectangle(bachelorFish.pos[0], bachelorFish.pos[1], bachelorFish.width, bachelorFish.height), "contains", bachelorFish)
            let foundMate;

            for (const bumpedDenizen of collisionArray) {
                if (bachelorFish.constructor === bumpedDenizen.constructor &&
                    bumpedDenizen.seekingMate) {
                    foundMate = bumpedDenizen
                    break
                }
            }
            if (foundMate) {
                bachelorFish.mate(true)
                bachelorFish.seekingMate = false
                delete this.logic.matingDenizensObj[bachelorFish.id]

                foundMate.mate()
                foundMate.seekingMate = false
                delete this.logic.matingDenizensObj[foundMate.id]
            }
        }
    }
```

When mating, fish will temporarily stop in place and trigger a heart animation (because they are in love). A timeout is triggered to reactivate fish movement and spawn the fish eggs using the Logic.spawnDenizen() factory method.

``` javascript
    //Fish.mate()
    mate(spawnBool) {
        this.mating = true
        this.speed = 0
        this.energy -= this.matingEnergyCost
        setTimeout(()=>{
            this.speed += .5
            this.mating = false
            if (spawnBool) return
            let i = Math.floor(Math.random() * 6)
            while (i > 0) {
                i--
                this.logic.spawnDenizen(this) 
            }
        }, 1500)
    }
```

spawnDenizen is a factory method that manages all the reproductive cycles in Kelpscape. A switch case evaluates the parent and sets variables that trickle down to a catch-all spawn pattern.

Most denizens only spawn one other type of denizen, but all fish can spawn fish eggs, which can spawn various types of baby fish. A helper method is needed that evaluates the parent of the fishegg, and spawns the appropiate baby fish.

```javascript
//Logic.spawnDenizen()
 spawnDenizen(parentDenizen) {
        let count;
        let babyObj;
        let typeString;
        let className;
        let options;

        switch(parentDenizen.constructor) {
            case Garabaldi:
                this.eggCount += 1
                count = this.eggCount
                babyObj = this.eggs
                typeString = "Fishegg"
                className = Fishegg
                options = { pos: [Math.floor(parentDenizen.pos[0]), Math.floor(parentDenizen.pos[1])], parent: parentDenizen.constructor }
                break

            case GarabaldiBaby:
                this.garabaldiCount += 1
                count = this.garabaldiCount
                babyObj = this.garabaldi
                typeString = "Garabaldi"
                className = Garabaldi
                options = { pos: [parentDenizen.pos[0], parentDenizen.pos[1]] }
                break

        //...
            case Fishegg:
                this.spawnDenizenFish(parentDenizen)
                return
        //...
        }
            
        babyObj[typeString + count] = new className(count, this.ctx, this.canvas, this.view, this, options)

    }

    spawnDenizenFish(parentDenizen) {
        let count;
        let babyObj;
        let typeString;
        let className;
        let options = { pos: [Math.floor(parentDenizen.pos[0]), Math.floor(parentDenizen.pos[1])] }

        switch (parentDenizen.parent) {
            case Garabaldi:
                this.garabaldiBabyCount++
                count = this.garabaldiBabyCount
                babyObj = this.garabaldiBabies
                typeString = "GarabaldiBaby"
                className = GarabaldiBaby
                break
        //...

        }

        babyObj[typeString + count] = new className(count, this.ctx, this.canvas, this.view, this, options)
    }

```

To complete the cycle, let's look at how baby fish become big fish. 

All denizens have an afterIEatCB() which triggers specific events after a meal. Baby fish grow into big fish after they eat a set number of times. 

FishBaby.growUp() inserts the instance to logic.recentlyDeadDenizens() which removes it from memory. It leverages the logic.spawnDenizen() factory to spawn a brand-new adult fish in its current position.

```javascript

    //FishBaby.afterIEatCB
    afterIEatCB = () => {
        if (this.foodEaten === this.growUpThreshold) this.growUp()
    }

    //FishBaby.growUp
    growUp() {
        this.dead = true
        this.logic.recentlyDeadDenizens.push(this)
        this.logic.spawnDenizen(this)
    }

```

On each frame, any denizens that have added themselves to logic.recentlyDeadDenizens are removed from their species object, deleting them from memory. DeadDenizen.beforeIDieCB() clears up any unfinished business, like removing setTimeouts and freeing trapped prey. 

Honestly, these four lines of code are probably what I'm proudest of in the whole project. It's so clean!

```javascript

    deleteDeadDenizens(){
        while (this.recentlyDeadDenizens.length) {
            let deadDenizen = this.recentlyDeadDenizens.pop()
            deadDenizen.beforeIDieCB()
            delete deadDenizen.speciesObject[deadDenizen.id]
        }
    }

```

But wait! did you notice that some creatures leave behind corpses when they die? How is that handled?

We call a different logic method under death conditions where we want to leave a corpse behind. A DeadCreature instance is created, and the dynamic attributes are set in a factory-like pattern.

Dead creatures will slowly drift to the bottom of the sea where they will be eaten by scavengers. Gnarly!

```javascript
    //Swimmer.consumeEnergy
    consumeEnergy() {
        this.energy -= this.energyUseCoef * this.speed
        if (this.energy < .05) {
            this.dead = true
            this.logic.recentlyDeadDenizens.push(this)
            this.logic.denizenCorpse(this)
        }
    }

    //Logic.denizenCorpse
    denizenCorpse(deadDenizen) {
        this.deadCreatureCount++
        this.deadCreatures["DeadCreature" + this.deadCreatureCount] = new DeadCreature(this.deadCreatureCount, this.ctx, this.canvas, this.view, this, deadDenizen.pos, deadDenizen)
    }

    //DeadCreature.typeSelector
    typeSelector() {
        switch (this.deadDenizen.constructor) {
            case Shark:
                this.img.src = './dist/art/sharkdead.png'
                this.width = 100
                this.height = 30
                this.energyVal = 40
                break


            case Garabaldi:
                this.img.src = './dist/art/fishes/garabaldidead.png'
                this.width = 30
                this.height = 15
                this.energyVal = 10
                break
        //...
        }
    }
```


We talked about trappers freeing prey - But how does trapping work?

Logic defines a trappersArr which contains all denizens which can trap. Trappers are always ready to trap, so they don't add themselves to an object the way bachelor fish do.  

If the trapper already has trapped prey or is currently mating, it cannot trap any prey. 

Quadtree.QueryRange checks if any creatures fully overlap the trap, which means any dimension of the prey is fully inside the trap, or vice versa. 

Next, we check that the denizen inside the trap is something the trapper actually wants to eat. If it is, the trapped prey records the difference in position between itself and the trapper. Once trapped, the prey ignores all movement logic, and updates its position to match the position of its trapper, modified by the recored position delta. This means wherever the trapper goes, the trapped prey goes with it.

Finally, the trapper calls afterITrapCB(), which allows for any variances or specific behaviors needed from specific trappers. For example, Otters have rotating images, and therefore need rotating traps. This extra callback allows me to encapsulate the additional Otter trap logic. 

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


Quadtree and Collision Detection

Enough about simulating ecosystem behavior, let's talk about the Quadtree!

The first type of collision detection I built was a brute force method where each denizen of the sim checked its position against every other denizen on each game frame - But I knew this would be unstustainable as the biosphere grew. I researched alternative data structures, and found that the Quadtree data structure was the perfect solution - it is specifically designed to maximize efficiency for 2d rectangle collisions in a shared area. 

I asked ChatGPT for an example and it gladly gave me broken code. I examined the code example, parsed what it was trying to do, and fixed the bugs (subdivision logic and rectangle collision logic were broken). I then extended it to detect different types of collision. 

How it Works

A Quadtree is made of two classes, Quadtree and Rectangle.

Rectangle - Defines an area by an XY coordinate, a width, and a length. Mangages collision logic.
Quadtree - Its area is defined by a rectangle. It holds references to the denizens within its area, OR it holds 4 child quadtrees that partition it. A Quadtree can never have both denizens and child Quadtrees. 

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

A refactor of QueryRange allows me to extend the functionality of Rectangle collision detection, and dynamically call different collision methods on the Rectnagle by using the type parameter.

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
Thanks for reading. This was such a challenging and fun project, and I'm excited to release it in the wild. 