import Objects from './Objects.js'

import Creature from '../objects/Creature.js'
import Spawner from '../objects/Spawner.js'

import { store } from '../store/index.js'
import { atRandom } from '../ArrayUtils.js'

export default {
  getBoss: (depth) => new Creature(getBoss(depth)),
  getMonster: (depth) => new Creature(getMonster(depth, true)),
  getSpawner: (depth) => new Spawner({
    name:'spawner', 
    spawnType: getMonster(depth,true),
    spawnChance: 0.1,
    spawnFunction: ((where, what) => {
      let object = new Creature(what)
      object.position = where
      object.i = Objects.indexOf('creature')
      store.dispatch({reducer:'dungeon', type: 'PLACE OBJECT', position: where,
        object})
    }),
    inventory:getItems(depth)
  })
}

function getBossName() {
  let bossAdjectives = store.getState().bossAdjectives
  bossAdjectives.atRandom = atRandom
  let bossNames = store.getState().bossNames
  bossNames.atRandom = atRandom
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

function getItems (depth) {
  return []
}

function getMonster(depth, withoutItems) {
  let monsters = store.getState().monsters
  let selection = {}
  Object.entries(monsters)
    .filter(e => Object.entries(e[1]).reduce((p,c) => 
      p * (c[1]/ Creature.defaultLevelParameters[c[0]]), 1)**2
      <= depth+1+(Math.random() * 2 - 1))
    .forEach(e => selection[e[0]]=e[1])

  let keys = Object.keys(selection)
  let key = keys[~~(keys.length * Math.random())]
  
  let monster = Object.assign({}, selection[key])
  monster.name = key

  if(!withoutItems)
    monster.inventory = getItems(depth)

  return monster
}