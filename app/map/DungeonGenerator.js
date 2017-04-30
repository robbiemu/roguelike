/* taken from npm dungeongenerator (currently broken there, but essentially 
useful): https://github.com/nerox8664/dungeongenerator/blob/master/src/dungeon.js
*/
import RoomsSpec from './RoomsSpec.js'

import Surfaces from './Surfaces.js'
import Objects from './Objects.js'

import FoV from './FoV.js'

import { store } from '../store/index.js'

const defaultTile = Surfaces.indexOf('unknown')

export default class DungeonGenerator {
  constructor(depth, rooms, roomSize=RoomsSpec.defaultRoomSize) {
    this.maze = []
    this.surfaces = []
    this.objects = []
    
    // randomize map dimensions, but keep them from being too long/narrow
    let [x,y] = [(Math.random()+Math.random())/2, (Math.random()+Math.random())/2]
    let s = Math.sqrt(
      ~~(rooms.length * roomSize.width * roomSize.height * (1/0.667)));
    [x,y] = [~~(s * (x/y)), ~~(s * (y/x))]
    this.w = (x < (roomSize.width*Math.sqrt(rooms.length)))? 
      ~~(roomSize.width*Math.sqrt(rooms.length)): x
    this.h = (y < (roomSize.height*Math.sqrt(rooms.length)))? 
      ~~(roomSize.height*Math.sqrt(rooms.length)): y

    this.rooms = [];
    this.roomSize = roomSize;
    this.depth = depth

    this._lastRoomId=2;

    this._createEmpty();

    rooms.forEach(room => {
      var newRoom = this._createRoom(room);
      if (newRoom) {
        this._appendRoom(newRoom);
        this.rooms.push(newRoom);
      }
    })

    console.log('Total rooms created: ' + this.rooms.length);

    this._connectRooms();
    this._restoreMaze();
    
    let maxwidth=0, maxheight=0
    this.maze.forEach(row => {
      let maxrow = row.reduce((p,c,i) => c.surface !== defaultTile? i: p, 0)
      maxheight = maxrow > maxheight? maxrow: maxheight
      maxwidth += (!!maxrow)?1:0
    })
    let maze = [...Array(maxwidth)].map(()=> [...Array(maxheight+1)])
    this.maze = maze.map((r,x) => r.map((c,y) => this.maze[x][y] ))

    this.fov = new FoV(this.maze)
  }
  
  setSpawn() {
    let player = store.getState().player
    player.i= Objects.indexOf('player')
    
    let room = this.rooms[Math.floor(this.rooms.length * Math.random())];
    this.maze[room.cy][room.cx].objects.unshift(player)
    return {x:room.cy,y:room.cx} // don't ask me, I inverted the x,y coordinates elsewhere
  }

  _restoreMaze() {
    for (var i = 0; i < this.rooms.length; i++) {
      this._appendRoom(this.rooms[i]);
    }
  }

  _connectRooms() {
    var findNearest = (room, except) => {
      var inearest = -1;
      var imin = this.h * this.w;

      for (var i = 0; i < this.rooms.length; i++) {
        if (except.indexOf(this.rooms[i]) !== -1)
          continue

        var dist = Math.sqrt((room.cx - this.rooms[i].cx) * 
          (room.cx - this.rooms[i].cx) +
          (room.cy - this.rooms[i].cy) * (room.cy - this.rooms[i].cy));

        if (dist < imin) {
          inearest = i;
          imin = dist;
        }
      }

      return this.rooms[inearest];
    };

    var createLink = (roomA, roomB) => {

      var dx = roomA.cx > roomB.cx ? -1 : 1;
      var dy = roomA.cy > roomB.cy ? -1 : 1;

      for (var x = roomA.cx, y = roomA.cy;;) {
        if (roomB.contains(y,x)) {
          break;
        }

        if (y != roomB.cy) {
          y += dy;
        } else if (x != roomB.cx) {
          x += dx;
        } else {
          break;
        }

        this.maze[y][x].surface = Surfaces.indexOf('passage');
      }
    };

    var except = [];
    for (var i = 0; i < this.rooms.length; i++) {
      except.push(this.rooms[i]);
      var nearest = findNearest(this.rooms[i], except);
      if (nearest) {
        createLink(this.rooms[i], nearest);
      }
    }
  }

  _createRoom(type) {
    var room = {
      id: this._lastRoomId++,
      tile: Surfaces.indexOf('room'),
      h: ~~(Math.random() * this.roomSize.height / 2.0 + 
        this.roomSize.height / 2.0),
      w: ~~(Math.random() * this.roomSize.width / 2.0 + 
        this.roomSize.height / 2.0),
      x: 0,
      y: 0,
      cx: 0,
      cy: 0,
      contains: function (l,r) { 
        return 
          this.x<=l && l <= this.x + this.w &&
          this.y<=r && l <= this.y + this.h
      }
    };

    while (this._isColliding(room)) {
      room.x += ~~(Math.random() * 3);
      if (room.x + room.w >= this.w) {
        room.x = 0;
        room.y++;
        if (room.y + room.h >= this.h) {
          return null;
        }
      }
    }

    room.cx = ~~(room.x + room.w / 2.0)
    room.cy = ~~(room.y + room.h / 2.0)

    if(Surfaces.altNames.hasOwnProperty(type)) {
      let x = ~~((room.w * Math.random())/2)+room.x
      let y = ~~((room.h * Math.random())/2)+room.y
      Surfaces.arrayMap.some((s,i) => {
        if(s.hasOwnProperty(Surfaces.altNames[type])) {
          this.surfaces.push({x,y, i})
          return true
        }
      })
    }
    
    if(Objects.altNames.hasOwnProperty(type)) {
      let x = ~~((room.w * Math.random())/2)+room.x
      let y = ~~((room.h * Math.random())/2)+room.y
      Objects.arrayMap.some((o,i) => {
        let alt = Objects.altNames[type]
        if (typeof alt === 'function')
          alt = alt()
        if(o.hasOwnProperty(alt)) {
          let generator=Objects.factories[alt]
          generator.bind(generator)
          let object = generator.call(undefined,this.depth)
          object.i = i
          object.position = {x:y, y:x}
          this.maze[y][x].objects.push(object)
          return true
        }
      })
    }

    return room;
  }

  _appendRoom(room) {
    for (var i = room.y; i < room.y + room.h; i++) {
      for (var j = room.x; j < room.x + room.w; j++) {
        let tile = this.surfaces.find(s => s.x===j && s.y===i)
        tile = tile? tile.i: room.tile
        this.maze[i][j].surface = tile
      }
    }
  }

  _isColliding(room) {
    for (var i = Math.max(0, room.y - 1); i < 
        Math.min(this.h, room.y + room.h + 1); i++) {
      for (var j = Math.max(0, room.x - 1); j < 
          Math.min(this.w, room.x + room.w + 1); j++) {
        if (this.maze[i][j].surface != defaultTile) {
          return true;
        }
      }
    }

    return false;
  }

  _createEmpty() {
    for (var i = 0; i < this.h; i++) {
      this.maze[i] = [];
      for (var j = 0; j < this.w; j++) {
        this.maze[i][j] = {surface: defaultTile, objects: []}
      }
    }
  }

}