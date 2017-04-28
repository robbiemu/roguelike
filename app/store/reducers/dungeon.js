import Dungeon from '../../map/Dungeon.js'

let dungeon=new Dungeon()

function placeObject ({object, position}) {
  dungeon.map[position.x][position.y].objects.unshift(object)
}

function replaceObject ({from, to, position}) {
  let c = dungeon.map[position.x][position.y]
  c.objects[c.objects.indexOf(from)] = to
}

function removeObject ({object, position}) {
  let c = dungeon.map[position.x][position.y]
  c.objects.splice(c.objects.indexOf(object), 1)
}

function moveObject ({object, vector}) {
  let objects = dungeon.map[object.position.x][object.position.y].objects
  console.log(objects.length)

  objects.splice(objects.indexOf(object),1)

  console.log(objects.length)

  dungeon.map[object.position.x+vector.x][object.position.y+vector.y]
    .objects.unshift(object)
}

export default function (state=dungeon, action) {
  if(action.reducer !== 'dungeon')
    return state
  switch (action.type) {
    case 'NEW':
      dungeon = new Dungeon()
      break
    case 'GENERATE MAP':
      dungeon.genMap()
      break
    case 'SET SPAWN LOCATION': 
      dungeon.spawnPosition = dungeon.dg.setSpawn()
      break
    case 'PLACE OBJECT':
      placeObject(action)
      break
    case 'REPLACE OBJECT':
      replaceObject(action)
      break
    case 'REMOVE OBJECT':
      removeObject(action)
      break
    case 'MOVE OBJECT':
      moveObject(action)
      break
    case 'SET DEPTH':
      dungeon.depth=action.depth
      break
    case 'SET DEFAULT ROOM':
      dungeon.defaultRoomDimensions = action.defaultRoomDimensions
      break
    default:
      return state
  }
  return dungeon
}
