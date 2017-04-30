import Creature from './Creature.js'

import { store } from '../store/index.js'

export default class Player extends Creature {
  constructor(opts) {
      opts.automated=false
      super(opts)

      let set = (t,p,v) => {
        t[p] = v
        if(typeof p === 'number' && 
            Number.isInteger(p) && p < Number.MAX_SAFE_INTEGER)
          store.dispatch({
            reducer: 'infoPanelKey', 
            type: 'SET KEY', 
            key: Math.random()
          })

        return true
      }

      this.livingState.energyBuffs = 
        new Proxy(this.livingState.energyBuffs,{set})
      this.livingState.energyDebuffs = 
        new Proxy(this.livingState.energyDebuffs,{set})
      this.livingState.healthBuffs = 
        new Proxy(this.livingState.healthBuffs,{set})
      this.livingState.healthDebuffs = 
        new Proxy(this.livingState.healthDebuffs,{set})

      set = (t,p,v) => {
        t[p] = v
        store.dispatch({
          reducer: 'infoPanelKey', 
          type: 'SET KEY', 
          key: Math.random()
        })
        if(p === 'health' && v < -1)
          store.dispatch({ reducer: 'ui', type: 'SET WIN CONDITION', 
            condition: false})

        return true
      }

      this.livingState=new Proxy(this.livingState, {set})
//      this.health, this.healthMultiplier, this.damage, 
//     this.weapon, this.damageMultiplier
  }
  isPlayer () {
    return true
  }
  /* for info panel - find the effective damage for an item or the current */
  getEffectiveDamage(weapon=this.livingState.weapon ||
      {damage:this.livingState.damage, multipliable:true}) {
    let damage = weapon.damage
    if(weapon.multipliable) {
      damage = this.livingState.damageMultiplier * damage + 
        (this.livingState.energy**2)*(this.livingState.energy<0?-1:1)
      damage = damage > 0.0027? damage: 0.0027
    }
    return damage
  }
  getDamage() {
  /* we could expire ranged weapons for a maximum to their benefit  
  if (this.livingState.weapon && 
        this.livingState.weapon.multipliable &&        
        this.livingState.energy < this.livingState.weapon.damage &&
        this.livingState.weapon.damage < this.livingState.damageMultiplier * 
          Math.random())
      this.livingState.weapon = undefined */
    return this.getEffectiveDamage() * Math.random()
  }
  move(vector) {
    store.dispatch({reducer: 'dungeon', type: 'MOVE OBJECT', 
      object:this, vector})
    store.dispatch({reducer: 'player', type: 'MOVE', vector})
  }
}