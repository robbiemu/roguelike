import Thing from './Thing.js'
export default class Item extends Thing {
  isPossessable() {
    return true
  }
  possess(byWhom) {
    if (byWhom.isPlayer()) {
      this.giveToPlayer(byWhom)
    } else {
      byWhom.livingState.inventory.push(this)
    }
  }
  giveToPlayer() {
   // no-op
  }
}