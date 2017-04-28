let key=Math.random()

export default function (state=Math.random(), action) {
  if(action.reducer !== 'infoPanelKey')
    return state
  switch (action.type) {
    case 'SET KEY':
      key = action.key
      break
    default:
      return state
  }
  return key
}