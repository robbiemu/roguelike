import RoomsSpec from './RoomsSpec.js'

export default {
  getRooms: (depth) => {
    let rooms = []
    depth = (depth+1)/26<1?(depth+1)/26:1
    while (RoomsSpec.required.some(r => rooms.indexOf(r) === -1)) {
      let r = Math.random()
      let type = Object.entries(RoomsSpec.probabilities).find(e => {
        let factor = e[0]==='Boss'? e[1]*depth: e[1]
        return r <= factor? true: ((r -= e[1]) && false)
      })[0]
      rooms.push(type)
    }
    console.log('>> rooms set generated', 
      JSON.stringify(rooms).replace(/"/g,''))
    return rooms
  }
}