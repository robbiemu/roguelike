import { PermissiveFov } from 'permissive-fov'

export default class FoV {
  constructor (map) {
    this.map = map
    this.fov = new PermissiveFov(map.length, map[0].length, 
      this.isTransparent.bind(this))
  }

  isTransparent (x, y) {
    return this.map[x][y].surface
  }
  setVisible (x, y) {
    this.contextMap[x][y] = {visible:true}
  }
  getVisible (creature) {
    this.contextMap = [...Array(this.map.length)]
      .map(r => [...Array(this.map[0].length)].map(c => {return {}}))    
    this.fov.compute(creature.position.x, creature.position.y,
      ~~creature.livingState.visRange, this.setVisible.bind(this))
    return this.contextMap
  }
  isVisibleTo (creature, position) {
    this.getVisible(creature)
    return this.contextMap[position.x][position.y].visible    
  }
}
