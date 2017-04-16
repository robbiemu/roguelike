function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Monster {}
class Item {}
class Weapon {}
class Container {}
class Key {}
class Stairs {}
class Down extends Stairs {}
class Up extends Stairs {}
class Spawner {}
class Boss extends Monster {}

class Room {
  constructor(ofType) {
    this.width = 7 + getRandomInt(-3,+6)
    this.height = 5 + getRandomInt(-2,+5)
    let type = ofType || ObjectFactory.types[
      getRandomInt(0,Object.keys(ObjectFactory.types).length-1)]
    this.type = ObjectFactory.getNew(type)
  }
}
Room.types = {
  'EMPTY': 0.3,
  Monster: 0.5,
  Item: 0.05,
  Weapon: 0.0075,
  Container: 0.0075,
  Key: 0.005,
  Down: 0.05,
  Up: 0.05,
  Spawner: 0.025,
  Boss: 0.005
}

class Map {
  constructor(x=0, y=0, rooms=[]) {
    this.x = x
    this.y = y
  }
}

RoomFactory = {
  getRoom: () => {
    let r = Math.random()
    return new Room(Object.entries(Room.types).find(e => {
      if(r < e[1]) 
        return e[0] 
      r -= e[1];
      return false
    })[0])
  },
  mapHasRooms: (map, qualifications=RoomFactory.qualifications) => 
    qualifications.filter(qual => Array.isArray(qual)?
      qual.every(anyof => {
        return map.every(room => room.type.constructor !== anyof)}):
      map.every(room => room.type.constructor !== qual)
    ).length === 0,

  getRooms: (qualifications=RoomFactory.qualifications) => {
    let rooms = []
    let iterations = 0, max = 100
    do {
      rooms.push(RoomFactory.getRoom())
    } while(!RoomFactory.mapHasRooms(rooms, qualifications) && iterations++ < max)

    return rooms

    let [ minwidth, minheight ] = rooms.reduce((p,c) => {
      p[0]+=c.width
      p[1]+=c.height
      return p
    }, 
      [Number.parseInt(Math.sqrt(rooms.length-1)), 
       Number.parseInt(Math.sqrt(rooms.length-1))])

    let midpoint = {
      x: Number.parseInt(minwidth/2), 
      y: Number.parseInt(minheight/2)
    }

    map = new Map()
    rooms.forEach(room => {
      let roommidwidth, roommidheight, xfactor, yfactor
      roommidwidth = Number.parseInt(room.width/2)
      roommidheight = Number.parseInt(room.height/2)
      xfactor getRandomInt( -1*(midpoint.x - roommidwidth), 
        midpoint.x - roommidwidth )
      room.x = midpoint.x + xfactor  
      yfactor = getRandomInt( -1*(midpoint.y - roommidheight), 
        midpoint.y - roommidheight )
      room.y = midpoint.y + yfactor
    })

    console.log(map.map(r => r.type))
    return map
  }
}
RoomFactory.qualifications = [ Up, Down, Spawner, [Item, Weapon, Container, Key, Monster, Boss]]

ObjectFactory = {
  getNew(type) {
    return type==='EMPTY'? 'EMPTY': new ObjectFactory.types[type]()
  }
}
ObjectFactory.types = {
  Monster,
  Item,
  Weapon,
  Container,
  Key,
  Down,
  Up,
  Spawner,
  Boss
}