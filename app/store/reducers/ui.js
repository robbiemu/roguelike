let ui={ 
  mouseCell:undefined,
  gameEngine: undefined,
  squareSize:undefined, 
  winCondition: undefined
}

export default function (state=ui, action) {
  if(action.reducer !== 'ui')
    return state
  switch (action.type) {
    case 'SET MOUSECELL':
      ui.mouseCell = action.mouseCell
      break
    case 'SET GAME ENGINE':
      ui.gameEngine = action.gameEngine
      break
    case 'SET SQUARE SIZE':
      ui.squareSize = action.squareSize
      break
    case 'SET WIN CONDITION':
      ui.winCondition = action.condition
      break
    default:
      return state
  }
  return ui
}