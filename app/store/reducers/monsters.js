export default function () { 
  return {
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
}
