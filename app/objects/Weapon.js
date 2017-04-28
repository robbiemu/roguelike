import Item from './Item.js'

import { store } from '../store/index.js'

export default class Weapon extends Item {
  constructor ({damage, multipliable=true}={}) {
    super(arguments[0])
    this.damage=damage
    this.multipliable=multipliable
  }
  giveToPlayer (player) {
    if (!player.weapon || 
        (player.weapon.damage * 
          (player.weapon.multipliable?player.damageMultiplier:1) 
          < 
          this.damage * (this.multipliable?player.damageMultiplier:1)) ||
        (player.weapon.mutliable !== this.multipliable))
      player.weapon=this
    store.dispatch({ reducer: 'infoPanelKey', 
      type: 'SET KEY', key: Math.random() })
  }
  isRanged () { return !this.multipliable }
}