import Player from '../../objects/Player.js'

let player = undefined
let name = 'O Patife'

export default (state, action) => {
  if(action.reducer !== 'player')
    return state
  switch (action.type) {
    case 'NEW':
      return player = new Player(Object.assign({}, {name}, action.options))
      break
    case 'SET NAME':
      return name = action.name
      break
    default:
      return state
  }
}