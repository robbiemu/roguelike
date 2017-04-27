import Food from '../objects/Food.js'
import Potion from '../objects/Potion.js'
import Weapon from '../objects/Weapon.js'

const weaponM = [
  'sword',
  'hammer',
  'mace',
  'axe',
  'pike'
]
const weaponR = [
  'bola',
  'bow',
  'javelin',
  'sling',
  'wand'
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
  getWeapon: (depth) => {
    let multipliable = Math.random() > 0.5
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
