import RoomsSpec from './RoomsSpec.js'

export default {
  getRooms: () => {
    let rooms = []
    
    while (RoomsSpec.required.some(r => rooms.indexOf(r) === -1)) {
      let r = Math.random()
      let type = Object.entries(RoomsSpec.probabilities).find(e =>
        r <= e[1]? true: ((r -= e[1]) && false))[0]
      rooms.push(type)
    }
    console.log('>> rooms set generated', rooms)
    return rooms
  }
}