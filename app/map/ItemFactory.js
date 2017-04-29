import Food from '../objects/Food.js'
import Potion from '../objects/Potion.js'
import Weapon from '../objects/Weapon.js'
import Armor from '../objects/Armor.js'

const weaponM = [
  'sword',
  'hammer',
  'mace',
  'axe',
  'pike',
  'pole',
  'morning star'
]
const weaponR = [
  'bola',
  'bow',
  'javelin',
  'sling',
  'wand'
]
const armors = [
  'suitable armor',
  'heavy cotton armor',
  'leather jacket',
  'ancient armor',
  'rusty chainmail',
  'forelorn shield',
  'mystical paper shield',
  'strange orb'
]

export default {
  getFood: (depth) => new Food({
    name:'food', 
    health:1/(depth>26?1:26-depth), 
    turnsRemaining:2*(depth+1)
  }),
  getPotion: (depth) => new Potion({
    name:'potion', 
    energy:1/(depth>26?1:26-depth), 
    turnsRemaining:~~Math.sqrt(depth)+1
  }),
  getArmor: (depth) => {
    let healthMultiplier = 0
    let c = depth+1
    while(c-->0){
      let max = ((1-healthMultiplier)/2)+healthMultiplier
      let min = healthMultiplier
      healthMultiplier += Math.random()*(max-min)
    }
    healthMultiplier+=1.0
    return new Armor({
      healthMultiplier, 
      name:armors[~~(Math.random() * armors.length)]
    })
  },
  getWeapon: (depth) => {
    let multipliable = Math.random() > 1/(depth+1)
    let damage = multipliable? 0.5: 0
    let c = depth+1
    while(c-->0){
      let max = ((1-damage)/2)+damage
      let min = damage
      damage += Math.random()*(max-min)
    }
    
    return new Weapon({
      name: multipliable? 
        weaponM[~~(Math.random() * weaponM.length)]:
        weaponR[~~(Math.random() * weaponR.length)], 
      damage,
      multipliable
    })
  }
}
