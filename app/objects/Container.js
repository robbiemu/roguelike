import Thing from './Thing.js'

export default class Container extends Thing {
  constructor({ name='A Container', inventory=[] }={}) {
    super(arguments[0])
    this.inventory=inventory
  }
  hasTurn () { return false }
  isPossessable () {
    return false
  }
}