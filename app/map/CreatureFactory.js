import { store } from '../store/index.js'
import { atRandom } from '../ArrayUtils.js'

import Creature from '../objects/Creature.js'

export default {
  getBoss: (depth) => new Creature(getBoss(depth)),
  getMonster: (depth) => new Creature(getMonster(depth)),
  getSpawner: (depth) => new Creature({name:'spawner'})
}

let bossAdjectives = store.getState().bossAdjectives
bossAdjectives.atRandom = atRandom
let bossNames = store.getState().bossNames
bossNames.atRandom = atRandom
let monsters = store.getState().monsters

function getBossName() {
  return `${bossNames.atRandom()} the ${bossAdjectives.atRandom()}`
}

function getBoss(depth) {
  return {
    name:getBossName(),
    healthMultiplier:3,
    damageMultiplier:2, 
    damage:0.67
  }
}

function getMonster(depth) {
  let selection = {}
  Object.entries(monsters)
    .filter(e => Object.entries(e[1])
      .reduce((p,c) => c[0]==='visRange'? p*Math.sqrt(c[1]) : p*c[1], 1) 
      - 1 <= depth)
    .forEach(e => selection[e[0]]=e[1])

  let keys = Object.keys(selection)
  let key = keys[~~(keys.length * Math.random())]
  
  let monster = Object.assign({}, selection[key])
  monster.name = key

  return monster
}