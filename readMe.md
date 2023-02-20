## Live Link

https://marcoshenrich.github.io/ArenaCombat/

## Overview

Demon slayer is a simplified arena combat simulator featuring cards as the primary vehicle for play. This game was designed and implemented in one week using vanilla JavaScript, HTML5, and CSS. No outside libraries were used. It features dynamic sprite animations, procedural game logic, interactive rendering, and an intro cinematic.

## Features
* Randomly generated decks for player and opponent
* Cards with unique and interactive effects
* Card selection and rendering effects for easier reading
* Various animations that play each turn
* Crowd that responds to the player's actions
* Intro cinematic
* Death and Victory cinematics

## How to Play
* Single player experience
* Each turn, the player selects a card by clicking on it. 
* The player and opponent's cards are resolved simultaneously. 
* You can only draw a card when you deal combat damage to the opponent. 
* Get your opponent to 0 health. 
* Refresh the page to play again!

## Implementation

### Cards and Core Gameloop

* The cards contain multiple functions that can be read by the core gameloop and other features. They have associated art to render on the mat and when hovered over. They also contain an associated animation string that is sent to the animation queue (described below). 

* The core game loop clears the played card from the slot, sets and resolves combat, plays status effects from cards, pushes animations into the queue, procedurally reduces the duration of status effects, checks for the end of the game, and resets coefficients and gamestates to prepare for the next turn. 

* There are two evaluation steps to resolve card effects in the core game logic. Instant effects affect game status this combat (prevent damage dealt, deal damage per conditions, etc). Delayed effects affect future turns or game states (apply status effects, force opponent to player certain cards, etc).

```javascript
//inside Deck#PlayerCards()
 parry: {
    // If your opponent attacks this turn, you negate the attack and they take 4 damage.
    id: "parry",
    attack: function () { return 0 },
    block: function () { return 0 },
    src: "art/knight_cards/parry.png",
    animation: "combo",
    instantEffects: function (playedCard, opponentCard) {
    if (opponentCard.attack) {
        opponentCard.attack = function () { return 0 }
        this.opponent.health -= 4
        this.numCardsDraw += 1 
        }
    },
    delayedEffects: function () { 
    }
    },

    //inside game
    coreGameLoop(playerCardId, slotId) {
        this.clearCardFromSlot(slotId)
        this.playedCard = this.knight.allUniqueCards[playerCardId]
        this.opponentCard = this.opponent.nextMove[0]
        this.instantCardEffects()
        this.statCalc()
        this.damageCalc()
        this.resolveStatusEffects.call(this.knight, this.knight)
        this.resolveStatusEffects.call(this.opponent, this.opponent)
        this.delayedCardEffects()

        this.knight.animationQueue.push(this.playedCard.animation)
        this.opponent.animationQueue.push(this.opponentCard.animation)

        this.gameEndCheck()
        this.crowd.excite(0)
        
        setTimeout(() => {
            this.drawCards()
            this.knight.deckObj.thinDeck.call(this.knight)
            this.opponent.nextMove.shift()
            this.knight.attack = 0
            this.knight.block = 0
            this.opponent.attack = this.opponent.nextMove[0].attack.call(this)
            this.opponent.block = this.opponent.nextMove[0].block.call(this)
            this.playedCard = null
            this.opponentCard = null
        },1100)
    }
```

### Animation Queue
* The Animation Queue was set up inside the shared combatant parent class. These shared functions dynamically set the animation states for both characters. They accept an animation string (eg "attack", "roll") that is stored in the card and sent to the animation queue by the core gameloop. 

* The core logic in combatant.draw() manages gameframes and tells the program which square of the sprite sheet should be rendered. Sprite sheets are 0 indexed, and the .draw() function stores the rendered frames in an array. A loop is considered complete once the first and laster value of the array is 0, and any other number is present in the array. This triggers the next animation in the queue to play. 

* This ensures that regardless of animation speed (affected by computer speed), each animation will complete before the next one plays. 

```javascript
  //inside combatant
    animationQueueSetter() {
        if (this.animationQueue.length === 0) {
            this.animation("idle")
        } else {
            let aniStateName = this.animationQueue.shift()
            this.animation(aniStateName)
        } 
    }

    animation = function(aniStateName) {
        this.animationState = aniStateName
        this.image.src = this.animations[aniStateName].src
    }

    // inside combatant.draw()
    this.aniCheckQueue.push(position)
                let unique = this.aniCheckQueue.filter((value, index, self) => { return self.indexOf(value) === index })
                if (unique.length > 1 && this.aniCheckQueue.at(-1) === 0 && this.animationState !== "idle") {
                    this.animationQueueSetter()
                    this.aniCheckQueue = []
                }
  
```

## Future Implementation

Demon slayer is largely extendable, which was a core decider for choosing this project. 

* Additional classes with unique cards (rogue, mystic, gladiator)
* Selectable weapons which add unique cards to your deck (for dynamic playthroughs)
* Basic vs. Class vs. Weapon vs. Other special cards
* Play against multiple opponents of increasing difficulty
* Select new cards to add to your deck at the end of each game phase


