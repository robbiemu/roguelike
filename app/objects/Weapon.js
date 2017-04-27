import Item from './Item.js'

export default class Weapon extends Item {
  constructor ({damage, multipliable=true}={}) {
    super(arguments[0])
    this.damage=damage
    this.multipliable=multipliable
  }
  giveToPlayer (player) {
    if (!player.weapon || 
        player.weapon.damage * player.weapon.multipliable < 
        this.damage * this.multipliable)
      player.weapon=this
  }
  isRanged () { return !this.multipliable }
}