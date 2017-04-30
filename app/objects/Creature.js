import Container from './Container.js'

import { store } from '../store/index.js'

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

  isSeeingDanger (fovres, map) {
    return fovres.some((r,x) => r.some((c,y) => {
      if (c.visible && map[x][y].objects.some(o => 
          o instanceof Creature && o.isPlayer() !== this.isPlayer())) {
        return true
      }
    }))
  }

  isAdjacentTo (object) {
    return (Math.abs(this.position.x - object.position.x) <= 1) && 
    (Math.abs(this.position.y - object.position.y) <= 1)
  }

  move(vector) {
    store.dispatch({
      reducer: 'dungeon', 
      type: 'MOVE OBJECT', 
      object:this, 
      vector
    })
    this.position.x = this.position.x + vector.x
    this.position.y = this.position.y + vector.y
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
  
  processTurn (turn) {
    if((this.turn === turn) && !this.isPlayer())
      return
    this.turn = turn
    this.consumeEnergyPerTurn()
    this.processEnergyBuffs()
    this.processEnergyDebuffs()

    this.healPerTurn()
    this.processHealthBuffs()
    this.processHealthDebuffs()

    this.livingState.energy = this.boundStat(this.livingState.energy)
    this.livingState.health = this.boundStat(this.livingState.health)
    
    if(this.livingState.automated && !this.isDead())
      this.doSomething()
  }
  
  doSomething () {
    let state = store.getState()
    let player = state.player
    let map = state.dungeon.map
    let fov = state.dungeon.dg.fov
    let gameEngine = state.ui.gameEngine
    let fovres = fov.safelyGetVisible(this)

    if (this.isAdjacentTo(player)) {
      gameEngine.processAttack({from:this, to:player})
    } else if (this.isSeeingDanger(fovres, map)) {
      if(this.livingState.health > -0.68) {
        // move towards player
        gameEngine.moveTowardDest(this, player.position)
      } else {
        // move away from player
        gameEngine.moveAwayFrom(this, player)
      }
    }
    return
  }

  boundStat(stat) {
    if(stat < -1)
      stat = -1.00000000001
    if(stat > 1)
      stat = 1
    return stat
  }
  
  consumeEnergyPerTurn () {
    this.livingState.energy -= 	1 / 1316
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