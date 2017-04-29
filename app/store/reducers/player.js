import Player from '../../objects/Player.js'

let name = 'O Patife'
let player=new Player({name})

export default function (state=player, action) {
  if(action.reducer !== 'player')
    return state
  switch (action.type) {
    case 'NEW':
      player = new Player(Object.assign({name}, action.options))
      break
    case 'NOTE CURRENT DEPTH':
      player.maxDepth = player.maxDepth > action.depth? 
        player.maxDepth : action.depth
      break
    case 'MOVE':
      player.position.x += action.vector.x
      player.position.y += action.vector.y
      break
    case 'SET POSITION':
      player.position = action.position
      break
    case 'SET NAME':
      player.name = action.name
      name = action.name
      break
    default:
      return state
  }
  return player
}