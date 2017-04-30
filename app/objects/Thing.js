/* why Thing? because Object is already taken */
export default class Thing {
  constructor({name='Something', position={x:undefined,y:undefined}}={}) {
    this.position=position
    this.name=name
  }
  isPlayer() { return false }
  hasTurn() { return false }
}