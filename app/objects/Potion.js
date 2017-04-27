import Item from './Item.js'

export default class Potion extends Item {
  constructor ({turnsRemaining=1, energy=1}={}) {
    super(arguments[0])
    this.turnsRemaining=turnsRemaining
    this.energy=energy
  }
    giveToPlayer (player) {
    player.energyBuffs.push(this)
  }
}