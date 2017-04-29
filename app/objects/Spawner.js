import Creature from './Creature.js'

import { store } from '../store/index.js'

export default class Spawner extends Creature {
  constructor(opts) {
    super(opts)
    this.spawnType = opts.spawnType
    this.spawnChance = opts.spawnChance
    this.spawnFunction = opts.spawnFunction
  }
  doSomething (gameEngine) {
    let player = store.getState().player
    let map = store.getState().dungeon.map

    let vectors = [
      {x:1,y:0},
      {x:-1,y:0},
      {x:0,y:1},
      {x:0,y:-1},
      {x:1,y:1},
      {x:-1,y:1},
      {x:1,y:1},
      {x:1,y:-1}
    ]
    let safeVectors = vectors.filter(v => {
      let x = v.x + this.position.x
      let y = v.y + this.position.y
      return x>=0 && y>=0 && x < map.length && y < map[0].length && 
      map[x][y].surface &&
      map[x][y].objects.every(o => !o.isPlayer())
    })

    if (
      safeVectors.length > 0 &&
      Math.random() <= this.spawnChance &&
      // every vector nearby... have no object matching my spawntype:
      safeVectors.every(p => map[this.position.x + p.x][this.position.y + p.y].
        objects.every(o => o.name !== this.spawnType.name))
    ) {
      let vector = safeVectors[~~(Math.random() * safeVectors.length)]
      vector.x += this.position.x
      vector.y += this.position.y
      this.spawnFunction(vector, this.spawnType)
    }
    return
  }
}