import ItemFactory from './ItemFactory.js'
import Objects from './Objects.js'

import Creature from '../objects/Creature.js'
import Spawner from '../objects/Spawner.js'

import { store } from '../store/index.js'
import { atRandom } from '../ArrayUtils.js'

export default {
  getMonsterLevel,
  getBoss: (depth) => new Creature(getBoss(depth)),
  getMonster: (depth) => new Creature(getMonster(depth)),
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
  let chance = 0
  let items = []
  while((chance+=1+Math.random() * 10) < depth+2) {
    const roll = Math.random()
    let item
    if (roll > 0.9) {
      item = ItemFactory.getFood(depth)
    } else if (roll > 0.6) {
      item = ItemFactory.getPotion(depth)
    } else if (roll > 0.3) {
      item = ItemFactory.getArmor(depth)
    } else {
      item = ItemFactory.getWeapon(depth)
    }

    items.push(item)
  }
  return items
}

function getMonsterLevel(e) {
  return 2 * Object.entries(e[1]).reduce((p,c) => { 
      if(!Object.keys(Creature.defaultLevelParameters).includes(c[0]))
        return p
      let comp 
      switch (c[0]) {
        case 'visRange':
         comp = p * (c[1]/ Creature.defaultLevelParameters[c[0]])  
        default:
         comp = p * (c[1]/ Creature.defaultLevelParameters[c[0]])**(3/2)
      }
      return comp
    },1)
}

function getMonster(depth, withoutItems) {
  let monsters = store.getState().monsters
  let selection = {}
  Object.entries(monsters)
    .filter(e => getMonsterLevel(e) <= depth+1+(Math.random() * 2 - 1))
    .forEach(e => selection[e[0]]=e[1])

  if (Object.keys(selection).length === 0) { // make sure we have at least the easiest monster
    let entry = Object.entries(monsters)
      .reduce((prev,curr) => getMonsterLevel(prev) <= getMonsterLevel(curr)?
        prev:curr, 
        Object.entries({'default':Creature.defaultLevelParameters})[0])  
    selection[entry[0]] = entry[1]
  }

  let keys = Object.keys(selection)
  let key = keys[~~(keys.length * Math.random())]

  let monster = Object.assign({}, selection[key])
  monster.name = key

  if(!withoutItems)
    monster.inventory = getItems(depth)

  return monster
}