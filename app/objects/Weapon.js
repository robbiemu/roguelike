import Item from './Item.js'

export default class Weapon extends Item {
  constructor ({damage, multipliable=true}={}) {
    super(arguments[0])
    this.damage=damage
    this.multipliable=multipliable
  }
  giveToPlayer (player) {
    if (!player.livingState.weapon || 
        (player.livingState.weapon.damage * 
          (player.livingState.weapon.multipliable?
            player.livingState.damageMultiplier:1) 
          < 
          this.damage * (this.multipliable?
            player.livingState.damageMultiplier:1)) ||
        (player.livingState.weapon.mutliable !== this.multipliable))
      player.livingState.weapon=this
  }
  isRanged () { return !this.multipliable }
}