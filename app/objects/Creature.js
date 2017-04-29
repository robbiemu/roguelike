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
    this.livingState = {
      energy,
      energyBuffs:[],
      energyDebuffs:[],
      health,
      healthMultiplier,
      healthBuffs:[],
      healthDebuffs:[],
      damage,
      weapon:undefined,
      damageMultiplier,
      visRange,
      inventory,
      automated // this is a player or a vegetable
    }
  }
  
  hasTurn () { return true }
  
  isDead () { return this.livingState.health <= -1 }
  
  isPossessable () { return false }

  
  move(vector) {
    store.dispatch({
      reducer: 'dungeon', 
      type: 'MOVE OBJECT', 
      object:this, 
      vector
    })
  }

  getDamage () {
    let damage
    if (this.livingState.weapon) {
      damage = this.livingState.weapon.damage * 
        (this.livingState.weapon.multipliable? 
          this.livingState.damageMultiplier:1)
    } else {
      damage = this.livingState.damage * this.livingState.damageMultiplier
    }
    return damage * Math.random()
  }
  
  takeDamage (amount) {
    this.livingState.health -= amount/this.livingState.healthMultiplier
  }

  apparentHealth () {
    if(this.livingState.health >= 1)
      return 'perfect'
    if(this.livingState.health >= 0.997)
      return 'exceptional'
    if(this.livingState.health >= 0.95)
      return 'remarkable'
    if(this.livingState.health >= 0.68)
      return 'outstanding'
    if(this.livingState.health >= 0)
      return 'healthy'
    if(this.livingState.health >= -0.68)
      return 'fine'
    if(this.livingState.health >= -0.95)
      return 'wounded'
    if(this.livingState.health >= -0.997)
      return 'mortal danger'
    if(this.livingState.health > -1)
      return 'final throws'
    return 'should be dead now'
  }
  
  processTurn (gameEngine) {
    this.consumeEnergyPerTurn()
    this.processEnergyBuffs()
    this.processEnergyDebuffs()

    this.healPerTurn()
    this.processHealthBuffs()
    this.processHealthDebuffs()
    
    if(this.livingState.automated && !this.isDead())
      this.doSomething(gameEngine)
  }
  
  doSomething (gameEngine) {
    let player = store.getState().player
    let map = store.getState().dungeon.map

    let vectors = [
      {x:1,y:0},
      {x:-1,y:0},
      {x:0,y:1},
      {x:0,y:-1},
      {x:1,y:1},
      {x:-1,y:1},
      {x:-1,y:-1},
      {x:1,y:-1}
    ]
    if (
      vectors.some(p => {
        let x = this.position.x + p.x
        let y = this.position.y + p.y
        return (x>=0 && y>=0 && x < map.length && y < map[0].length)?
          (map[x][y].objects.indexOf(player) !== -1):
          false
      })
    ) {
      gameEngine.processAttack({from:this, to:player})
    }
    return
  }
  
  consumeEnergyPerTurn () {
    this.livingState.energy -= 	1 / 1316
    if(this.livingState.energy < -1)
      this.livingState.energy = -1
  }
  
  processEnergyDebuffs() {
    let cost=0
    this.livingState.energyDebuffs.forEach(e => {
      e.turnsRemaining--
      cost += e.energy
    })
    this.livingState.energy -= cost
    this.livingState.energyDebuffs = this.livingState.energyDebuffs
      .filter(e => e.turnsRemaining > 0)
  }
  
  processEnergyBuffs() {
    let increase=0
    this.livingState.energyBuffs.forEach(e => {
      e.turnsRemaining--
      increase += e.energy
    })
    this.livingState.energy += increase
    this.livingState.energyBuffs = this.livingState.energyBuffs
      .filter(e => e.turnsRemaining > 0)
  }
  
  healPerTurn () {
    if(this.livingState.health < this.livingState.energy){
      let x = Math.random() * (this.livingState.health - 
        this.livingState.energy)
      let amount = x < 0.0027 && x > 0 && this.livingState.health < 0? x: 0.0027
      this.livingState.health += amount
    }
  }
  
  processHealthDebuffs() {
    let cost=0
    this.livingState.healthDebuffs.forEach(h => {
      h.turnsRemaining--
      cost += h.health
    })
    this.livingState.health -= cost
    this.livingState.healthDebuffs = this.livingState.healthDebuffs
      .filter(h => h.turnsRemaining > 0)
  }
  
  processHealthBuffs() {
    let increase=0
    this.livingState.healthBuffs.forEach(h => {
      h.turnsRemaining--
      increase += h.health
    })
    this.livingState.health += increase
    this.livingState.healthBuffs = this.livingState.healthBuffs
      .filter(h => h.turnsRemaining > 0)
  }
  
  take(o) {
    if(o.position.x && o.position.y)
      store.dispatch({reducer: 'dungeon', type: 'REMOVE OBJECT', object:o})
    o.position = {x:undefined, y:undefined}
    o.possess(this)
  }
}

Creature.defaultLevelParameters = {
  damage:0.5,
  healthMultiplier:1,
  damageMultiplier:1,
  visRange:Math.sqrt(6*4)
}