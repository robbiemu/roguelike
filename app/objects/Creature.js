import Container from './Container.js'

import { store } from '../store/index.js'

let creature_ids=0;

export default class Creature extends Container {
  constructor({
    name='A Nameless Creature',
    health=0,
    damage=0.5,
    healthMultiplier=1,
    damageMultiplier=1,
    energy=0,
    inventory=[],
    automated=true,
    visRange=Math.sqrt(6*4)
  }={}) {
    super(arguments[0])
    this.energy=energy
    this.energyBuffs=[]
    this.energyDebuffs=[]
    this.health=health
    this.healthMultiplier = healthMultiplier
    this.healthBuffs=[]
    this.healthDebuffs=[]
    this.damage=damage
    this.weapon=undefined
    this.damageMultiplier = damageMultiplier
    this.visRange=visRange
    this.inventory=inventory
    this.automated=automated // this is a player or a vegetable
  }
  
  hasTurn () { return true }
  
  isDead () { return this.health <= -1 }
  
  isPossessable () { return false }

  
  move(vector) {
    this.position.x += vector.x
    this.position.y += vector.y
  }

  getDamage () {
    let damage
    if (this.weapon) {
      damage = this.weapon.damage * 
        (this.weapon.multipliable? this.damageMultiplier:1)
    } else {
      damage = this.damage * this.damageMultiplier
    }
    return damage
  }
  
  takeDamage (amount) {
    this.health -= amount/this.healthMultiplier
  }
  
  processTurn (gameEngine, map) {
    this.consumeEnergyPerTurn()
    this.processEnergyBuffs()
    this.processEnergyDebuffs()

    this.healPerTurn()
    this.processHealthBuffs()
    this.processHealthDebuffs()
    
    if(this.automated && !this.isDead())
      this.doSomething(gameEngine, map)
  }
  
  doSomething (gameEngine, map) {
    let player = store.getState().player
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
    if (
      vectors.some(p => {
        let x = this.position.x + p.x
        let y = this.position.y + p.y
        return (x>=0 && y>=0)?
          (map[x][y].objects.indexOf(player) !== -1):
          false
      })
    ) {
      gameEngine.processAttack({from:this, to:player})
    }
    return
  }
  
  consumeEnergyPerTurn () {
    this.energy -= 0.0027
    if(this.energy < -1)
      this.energy = -1
  }
  
  processEnergyDebuffs() {
    let cost=0
    this.energyDebuffs.forEach(e => {
      e.turnsRemaining--
      cost += e.energy
    })
    this.energy -= cost
    this.energyDebuffs = this.energyDebuffs.filter(e => e.turnsRemaining > 0)
  }
  
  processEnergyBuffs() {
    let increase=0
    this.energyBuffs.forEach(e => {
      e.turnsRemaining--
      increase += e.energy
    })
    this.energy += increase
    this.energyBuffs = this.energyBuffs.filter(e => e.turnsRemaining > 0)
  }
  
  healPerTurn () {
    if(this.health < this.energy){
      let x = this.health - this.energy
      let amount = x < 0.0027 && x > 0 && this.health < 0? x: 0.0027
      this.health += amount
    }
  }
  
  processHealthDebuffs() {
    let cost=0
    this.healthDebuffs.forEach(h => {
      h.turnsRemaining--
      cost += h.health
    })
    this.health -= cost
    this.healthDebuffs = this.healthDebuffs.filter(h => h.turnsRemaining > 0)
  }
  
  processHealthBuffs() {
    let increase=0
    this.healthBuffs.forEach(h => {
      h.turnsRemaining--
      increase += h.health
    })
    this.health += increase
    this.healthBuffs = this.healthBuffs.filter(h => h.turnsRemaining > 0)
  }
  
  take(o) {
    o.position = {x:undefined, y:undefined}
    o.possess(this)
  }
}