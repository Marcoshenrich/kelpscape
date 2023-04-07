Kelpscape simulates a Pacific Kelp Forest ecosystem in a light-hearted 2d environment with a pixel art aesthetic. Each denizen of the biome takes care of its own needs - seeking out food and mating partners, avoiding predators, and impacting the other denizens in the interwoven ecosystem. 

Kelpscape was built using vanilla javascript and the Canvas API. 

## Features

Over a dozen species of inhabitants in the ecosystem
Educational blurbs on each species
Music and mute functionality

## Technology and Approach

At the top level, a Pilot controller manages the state changes between the opening cinematic and initializing the Sim. It also contains the Sound class to manage music looping and volume. 

The View class manages the graphical representation of all denizens in the Sim. It manages user inputs which can change the slice of the Sim represented by the Canvas, as well as the textboxes which appear when a user clicks on a denizen. 

View also continually recreates the Quadtree. The Quadtree data structure organizes the spatial placement of each denizen on the 2d arena, and makes collision detection significantly more effecient. The Quadtree has a more detailed section below. 

Logic is initialized by View, and is the core engine of the Sim. Logic initializes all the starting denizens and sets up various data structures needed for the Sim to run. 

NatureController contains various data structures that need to be continually recalculated for denizens to correctly interact with a changing landscape. For example, the shifting placement of Seaweed throughout the course of the sim changes the available area where Algae can spawn, and where Crabs can climb. Doing this calculation at the top level prevents each individual Denizen from having to track these changes.

BehaviorController manages the logic denizens use to interact with each other. It models shared behaviors such as seeking out food, eating, finding mates, spawning, etc.

Every entity in the Sim is a Denizen. Different types of core behaviors inherit from Denizen - Floater, Swimmer, Trapper. Each creature inherits from the behavior set it most closely mimics. 








Quadtree

The first type of collision detection I built was a brute force method where 


<br />