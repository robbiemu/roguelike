import Creature from '../objects/Creature.js'

export default {
  getBoss: (depth) => new Creature(getBoss(depth)),
  getMonster: (depth) => new Creature(getMonster(depth)),
  getSpawner: (depth) => new Creature({name:'spawner'})
}

const bossNames = [
'Akivasha',
'Bane',
'Dante',
'Demona',
'Ganon',
'Kane',
'Misty',
'Nemesis',
'Ronan',
'Sephiroth',
'Sodom'
]
const bossAdjectives = [
'bald',
'evil',
'depraved',
'maleficent',
'glorious',
'undying',
'vile',
'disgusting',
'great',
'herculean',
'brilliant',
'retarded'
]

function getBossName() {
  return `${bossNames[~~(bossNames.length * Math.random())]} the ${bossAdjectives[~~(bossAdjectives.length * Math.random())]}`
}

function getBoss(depth) {
  return {
    name:getBossName(),
    healthMultiplier:3,
    damageMultiplier:2, 
    damage:0.67
  }
}


const monsters = {
minotaur: {healthMultiplier: 2, damageMultiplier: 1.25, damage: 0.67},
griffin: {damageMultiplier: 1.5, damage: 0.67},
scylla: {visRange: 8, healthMultipler: 0.5, damageMultiplier: 0.5},
cyclops: {visRange: Math.sqrt(12), healthMultipler: 3, damageMultiplier: 2},
centaur: {visRange: 6, healthMultipler: 2, damageMultiplier: 1.5},
thunderbird: {visRange: 5, damage: 0.75},
manticore: {damageMultiplier: 2, damage: 0.55},
satyr: {visRange: 5},
harpy: {visRange: 5, healthMultiplier: 0.75, damage: 0.6},
mercenary: {}
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