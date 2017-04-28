import Item from './Item.js'

export default class Food extends Item {
  constructor ({turnsRemaining=1, health=1}={}) {
    super(arguments[0])
    this.turnsRemaining=turnsRemaining
    this.health=health
  }
  giveToPlayer (player) {
    player.livingState.healthBuffs.push(this)
  }
}