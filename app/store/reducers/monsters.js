import Creature from '../../objects/Creature.js'

export default function () { 
  return {
    minotaur: Object.assign({},Creature.defaultLevelParameters,
      {healthMultiplier: 2, damageMultiplier: 1.25, damage: 0.67}),
    griffin: Object.assign({},Creature.defaultLevelParameters,
      {damageMultiplier: 1.5, damage: 0.67}),
    scylla: Object.assign({},Creature.defaultLevelParameters,
      {visRange: 8, healthMultiplier: 0.5}),
    cyclops: Object.assign({},Creature.defaultLevelParameters,
      {visRange: Math.sqrt(12), healthMultiplier: 3, damageMultiplier: 2}),
    centaur: Object.assign({},Creature.defaultLevelParameters,
      {visRange: 6, healthMultiplier: 2, damageMultiplier: 1.5}),
    thunderbird: Object.assign({},Creature.defaultLevelParameters,
      {visRange: 5, damage: 0.75}),
    manticore: Object.assign({},Creature.defaultLevelParameters,
      {damageMultiplier: 2, damage: 0.55}),
    satyr: Object.assign({},Creature.defaultLevelParameters,
      {visRange: 5}),
    harpy: Object.assign({},Creature.defaultLevelParameters,
      {visRange: 5, healthMultiplier: 0.75, damage: 0.6}),
    mercenary: Object.assign({},Creature.defaultLevelParameters)
  }
}
