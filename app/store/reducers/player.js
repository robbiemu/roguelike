import Player from '../../objects/Player.js'

let player = undefined
let name = 'O Patife'

export default function (state=new Player({name}), action) {
  if(action.reducer !== 'player')
    return state
  switch (action.type) {
    case 'NEW':
      player = new Player(Object.assign({name}, action.options))
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