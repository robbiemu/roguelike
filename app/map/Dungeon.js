import DungeonGenerator from './DungeonGenerator.js'
import RoomsGenerator from './RoomsGenerator.js'

const defRoomDim = {width:6,height:4}

export default class Dungeon {
  constructor ({depth=0, defaultRoomDimensions=defRoomDim}={}) {
    this.depth = depth
    this.defaultRoomDimensions = defaultRoomDimensions
  }
  genMap () {
    const rooms = RoomsGenerator.getRooms()
    this.dg = new DungeonGenerator(0, rooms, this.defaultRoomDimensions)
    this.map = dg.maze
  }
}
