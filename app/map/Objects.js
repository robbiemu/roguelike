import OrderedMap from '../OrderedMap.js'
import CreatureFactory from './CreatureFactory.js'
import ItemFactory from './ItemFactory.js'

export default Object.assign({}, OrderedMap, {
  arrayMap: [
    {corpse: '#666666'},
    {creature: '#ff0000'},
    {boss: '#990000'},
    {player: '#ffffff'},
    {food: '#449900'},
    {potion: '#6600ff'},
    {weapon: '#ffff00'},
    {source: '#0000ff'},
    {armor: '#333333'}
  ],
  altNames: {
    Boss: 'boss',
    Spawner: 'source',
    Monster: 'creature',
    Treasure: () => {
      const roll = Math.random()
      if (roll > 0.9) {
        return 'food'
      } else if (roll > 0.6) {
        return 'potion'
      } else if (roll > 0.3) {
        return 'armor'
      } else {
        return 'weapon'
      }
    }
  },
  factories: {
    boss: (depth) => CreatureFactory.getBoss(depth),
    creature: (depth) => CreatureFactory.getMonster(depth),
    source: (depth) => CreatureFactory.getSpawner(depth),
    food: (depth) => ItemFactory.getFood(depth),
    potion: (depth) => ItemFactory.getPotion(depth),
    armor: (depth) => ItemFactory.getArmor(depth),
    weapon: (depth) => ItemFactory.getWeapon(depth),
  },
  areAdjacent: (l,r) => (Math.abs(l.position.x - r.position.x) <= 1) && 
    (Math.abs(l.position.y - r.position.y) <= 1) 
})
