
import Algae from "../denizens/algae"
import Otter from "../denizens/otter"
import SeaweedCluster from "../environment/seaweedCluster"
import Turtle from "../denizens/turtle"

export default class NatureController {
    constructor(logic) {

        this.logic = logic
        this.algaeSpawnInterval= 2000
        // this.algaeSpawnInterval = 5
        this.denizensSpawnInIncrements(this.algaeSpawnInterval, "algaeCount", "algae", Algae, { clustersObj: this.logic.seaweedClusters })

        this.otterDiveInterval = 10000
        this.denizensSpawnInIncrements(this.otterDiveInterval, "otterCount", "otters", Otter)

        this.clusterSpawnInterval = 10000
        // this.clusterSpawnInterval = 1000
        this.denizensSpawnInIncrements(this.clusterSpawnInterval, "seaweedClusterCount", "seaweedClusters", SeaweedCluster, {})

        this.turtleSpawnInterval = 10000
        this.denizensSpawnInIncrements(this.turtleSpawnInterval, "turtleCount", "turtles", Turtle, {})
    }

    denizensSpawnInIncrements(timerIncrement, countName, classObjName, className, options) {
        setTimeout(() => {
            this.logic[countName]++
            this.logic[classObjName][className.name + String(this.logic[countName])] = new className(this.logic[countName], this.logic.ctx, this.logic.canvas, this.logic.view, this.logic, options)
            this.denizensSpawnInIncrements(timerIncrement, countName, classObjName, className, options)
        }, Math.floor(Math.random() * timerIncrement) + timerIncrement)
    }
}