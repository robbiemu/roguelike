import Item from './Item.js'

export default class Armor extends Item {
  constructor ({healthMultiplier=1}={}) {
    super(arguments[0])
    this.healthMultiplier=healthMultiplier
  }
  giveToPlayer (player) {
    if (!player.livingState.healthMultiplier < this.healthMultiplier)
      player.livingState.healthMultiplier=this.healthMultiplier
  }
}