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
    this.x = undefined
    this.y = undefined
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
  setHasRooms: (roomsSet, qualifications=RoomFactory.qualifications) => 
    qualifications.filter(qual => Array.isArray(qual)?
      qual.every(anyof => {
        return roomsSet.every(room => room.type.constructor !== anyof)}):
      roomsSet.every(room => room.type.constructor !== qual)
    ).length === 0,

  getRooms: (qualifications=RoomFactory.qualifications) => {
    let rooms = []
    let iterations = 0, max = 100
    do {
      rooms.push(RoomFactory.getRoom())
    } while(!RoomFactory.setHasRooms(rooms, qualifications) && iterations++ < max)

    return rooms
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

var Dungeon = {
  map: null,
  rooms: [],
  Generate: function () {
    let rooms = RoomFactory.getRooms()

    console.log(rooms.map(r => r.type))

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

    let increasingwidth={pos:0, neg:0}, increasingheight={pos:0, neg:0}
    this.rooms = rooms.map(room => {
      room.x = getRandomInt(-1, 1)
      room.y = getRandomInt(-1, 1)
      return room
    }).sort((a,b) => Math.abs(a.x) > Math.abs(b.x)).map((room, idx) => {
      if (room.x>0) {
        room.x = increasingwidth.pos
        increasingwidth.pos += room.width + 1
      } else {
        room.x = increasingwidth.neg
        increasingwidth.neg += room.width + 1
      }
      room.x += midpoint.x
      return room
    }).sort((a,b) => Math.abs(a.y) > Math.abs(b.y)).map((room, idx) => {
      if (room.y>0) {
        room.y = increasingheight.pos
        increasingheight.pos += room.height + 1
      } else {
        room.y = increasingheight.neg
        increasingheight.neg += room.height + 1
      }
      room.y += midpoint.y
      return room
    })
    
    minwidth = this.rooms.reduce((p,c) => (c.x+c.width)>p?(c.x+c.width):p, 0)+1
    minheight = this.rooms.reduce((p,c) => (c.y+c.height)>p?(c.y+c.height):p, 0)+1
    
    this.map = [];
    for (let x = 0; x < minwidth; x++) {
      this.map[x] = [];
      for (let y = 0; y < minheight; y++) {
        this.map[x][y] = 0;
      }
    }
    
    // generate hallways
    let roomA, roomB
    for (let roomA of this.rooms) {
      roomB = this.FindClosestRoom(roomA);

      pointA = {
        x: getRandomInt(roomA.x, roomA.x + roomA.width),
        y: getRandomInt(roomA.y, roomA.y + roomA.height)
      };
      pointB = {
        x: getRandomInt(roomB.x, roomB.x + roomB.width),
        y: getRandomInt(roomB.y, roomB.y + roomB.height)
      };

      while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
        if (pointB.x != pointA.x) {
          (pointB.x > pointA.x)? pointB.x--: pointB.x++
        } else if (pointB.y != pointA.y) {
          (pointB.y > pointA.y)? pointB.y--: pointB.y++
        }
       
        this.map[pointB.x][pointB.y] = 1;
      }
    }

    for (let room of this.rooms) {
      for (var x = room.x; x < room.x + room.width; x++) {
        for (var y = room.y; y < room.y + room.height; y++) {
          this.map[x][y] = 1;
        }
      }
    }

    for (var x = 0; x < minwidth; x++) {
      for (var y = 0; y < minheight; y++) {
        if (this.map[x][y] == 1) {
          for (var xx = x - 1; xx <= x + 1; xx++) {
            for (var yy = y - 1; yy <= y + 1; yy++) {
              if (this.map[xx][yy] == 0) this.map[xx][yy] = 2;
            }
          }
        }
      }
    }
  },
  FindClosestRoom: function (room) {
    var mid = {
      x: room.x + (room.width / 2),
      y: room.y + (room.height / 2)
    };
    var closest = null;
    var closest_distance = Infinity;
    for (let check of this.rooms) {
      if (check == room) continue;
      var check_mid = {
        x: check.x + (check.width / 2),
        y: check.y + (check.height / 2)
      };
      var distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.width / 2) - (check.width / 2), Math.abs(mid.y - check_mid.y) - (room.height / 2) - (check.height / 2));
      if (distance < closest_distance) {
        closest_distance = distance;
        closest = check;
      }
    }
    return closest;
  },
  DoesCollide: function (room, ignore) {
    for (var i = 0; i < this.rooms.length; i++) {
      if (i == ignore) continue;
      var check = this.rooms[i];
      if (!((room.x + room.width < check.x) || (room.x > check.x + check.width) || (room.y + room.height < check.y) || (room.y > check.y + check.height))) return true;
    }

    return false;
  }
}

var Renderer = {
  canvas: null,
  ctx: null,
  scale: 0,
  Initialize: function (width, height, scale=3) {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = width * scale;
    this.canvas.height = height * scale;
    this.ctx = canvas.getContext('2d');
    this.scale = scale;
  },
  Update: function (map) {
    for (var x = 0; x < map.length; x++) {
      for (var y = 0; y < map[0].length; y++) {
        var tile = Dungeon.map[x][y];
        if (tile == 0) this.ctx.fillStyle = '#351330';
        else if (tile == 1) this.ctx.fillStyle = '#64908A';
        else this.ctx.fillStyle = '#424254';
        this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
      }
    }
  }
};

Dungeon.Generate();
Renderer.Initialize(Dungeon.map.length, Dungeon.map[0].length);
Renderer.Update(Dungeon.map);
