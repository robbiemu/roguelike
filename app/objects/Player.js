import Creature from './Creature.js'

import { store } from '../store/index.js'

export default class Player extends Creature {
  constructor(opts) {
      opts.automated=false
      super(opts)
  }
  isPlayer () {
    return true
  }
  /* for info panel - find the effective damage for an item or the current */
  getEffectiveDamage(weapon=this.weapon ||
      {damage:this.damage, multipliable:true}) {
    let damage = weapon.damage
    if(weapon.multipliable) {
      damage = this.damageMultiplier * damage + 
        (this.energy**2)*(this.energy<0?-1:1)
      damage = damage > 0.0027? damage: 0.0027
    }
    return damage
  }
  getDamage() { // so the way the above is written, it is better to reuse it
    return this.getEffectiveDamage()
  }
  move(vector) {
    store.dispatch({reducer: 'dungeon', type: 'MOVE OBJECT', 
      object:this, vector})
    store.dispatch({reducer: 'player', type: 'MOVE', vector})
  }
}