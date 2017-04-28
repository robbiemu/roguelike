import Dungeon from '../../map/Dungeon.js'

export default function (state=new Dungeon(), action) {
  if(action.reducer !== 'dungeon')
    return state
  switch (action.type) {
    case 'NEW':
      state.genMap()
    case 'SET SPAWN LOCATION': // this passes through from previous on purpose
      state.spawnPosition = state.dg.setSpawn()
      break
    case 'SET DEPTH':
      state.depth=action.depth
      break
    case 'SET DEFAULT ROOM':
      state.defaultRoomDimensions = action.defaultRoomDimensions
      break
  }
  return state
}
