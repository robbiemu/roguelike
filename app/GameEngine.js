import PF from 'pathfinding'

import Container from './objects/Container.js'
import Objects from './map/Objects.js'

import { store } from './store/index.js'
import { shadeBlendConvert } from './ColorUtils.js'

const visitedColor = (hex) => shadeBlendConvert(-0.3,hex)

export default class GameEngine {
  constructor({surfaces, objects, 
      ctx=document.getElementById('map').getContext('2d')}) {
    this.ctx = ctx
    this.surfaces = surfaces
    this.objects = objects
    this.finder = new PF.AStarFinder({
      allowDiagonal: true
    })
    this.turn=0
  }
  draw () {
    let state = store.getState()
    let map = state.dungeon.map
    let visited = state.dungeon.visited
    let player = state.player
    let fw = this.ctx.canvas.width / map.length
    let fh = this.ctx.canvas.height / map[0].length
    fh = ~~(fh < fw? fh: fw)
    fw = ~~(fw < fh? fw: fh)
    store.dispatch({reducer: 'ui', type: 'SET SQUARE SIZE', squareSize:fw})

    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[i].length; j++) {
        if(!this.isVisible({x:i,y:j})) {
          if(visited[i][j]) {
            this.ctx.beginPath()
            this.ctx.fillStyle = visitedColor(Object.values(
              this.surfaces.arrayMap[map[i][j].surface])[0])         
            this.ctx.fillRect(i * fw, j * fh, fw, fh)
            this.ctx.closePath()
          } else {
            this.ctx.beginPath()
            this.ctx.fillStyle = this.surfaces.entryMap().unknown          
            this.ctx.fillRect(i * fw, j * fh, fw, fh)
            this.ctx.closePath()
          }
        } else {
          this.ctx.beginPath()

          const a = i - player.position.x
          const b = j - player.position.y
          const dist = Math.sqrt( a*a + b*b );
          const shade = (dist/player.livingState.visRange) * 
            (map[i][j].surface? 0.667: 0.25)

          this.ctx.fillStyle = shadeBlendConvert(shade, Object.values(
            this.surfaces.arrayMap[map[i][j].surface])[0], '#878787')
          this.ctx.fillRect(i * fw, j * fh, fw, fh)
          this.ctx.closePath()
          
          if(map[i][j].objects.length > 0) {
            this.ctx.beginPath()
            this.ctx.arc((i * fw) + (fw/2), (j * fh) + (fh/2), fw/2, 0, 
              2 * Math.PI, false)
            this.ctx.fillStyle = Object.values(
              this.objects.arrayMap[map[i][j].objects[0].i])[0]
              this.ctx.fill()
            this.ctx.closePath()
          }
        }
      }
    }
  }
  isVisible(coords){
    let state = store.getState()
    let map = state.dungeon.map
    let fov = state.dungeon.dg.fov
    let player = state.player
    let res = fov.isVisibleTo(player, coords)
    fov.contextMap.forEach((row,x) => 
      row.forEach((c,y) => {
        if(c.visible)
          state.dungeon.visited[x][y]=true
      }))
    return res
  }
  
  turnCycle () {
    this.turn++
    let map = store.getState().dungeon.map
    map.forEach((row, ri) => {
      row.forEach((cel, ci) => cel.objects
        .filter(o => !o.isPossessable() && o.hasTurn() )
        .forEach(o => {
          o.processTurn(this.turn)
          if (o.isDead() && !o.isPlayer()) { // player watches their own death for game state
            console.log(`${o.name} is dead!`)
            this.kill(o, {x:ri, y:ci})
          }
        }))
    })

    this.draw()
  }

  moveTowardDest (creature, dest) {
    let map = store.getState().dungeon.map
    let path = this.plotPath(creature, dest)
    if (path.length>0 &&  
      !((path[1][0] === dest.x) && (path[1][1]===dest.y)) &&
      !map[path[1][0]][path[1][1]].objects.some(o => o.hasTurn())
    )
      creature.move({
        x: path[1][0] - creature.position.x, 
        y: path[1][1] - creature.position.y
      })
  }
  moveAwayFrom (creature, fromCreature) {
    let map = store.getState().dungeon.map
    let dest = {
      x:-1 * (fromCreature.position.x - creature.position.x),
      y:-1 * (fromCreature.position.y - creature.position.y)
    }
    if(map[dest.x][dest.y].surface) {
      this.moveTowardDest (creature, dest)
    }
  }

  plotPath (creature, dest) {
    let state = store.getState()
    let map = state.dungeon.map

    if(!map[dest.x][dest.y].surface || creature.isAdjacentTo({position: dest}))
      return undefined

    var grid = new PF.Grid(map.length, map[0].length)

    map.forEach((r,x) => r.forEach((c,y) => {
      if((creature.isAdjacentTo({position:{x,y}}) && 
          c.objects.some(o => o.hasTurn())) || !c.surface)
        grid.setWalkableAt(x, y, false);
    }))

    return this.finder.findPath(creature.position.x, creature.position.y, 
      dest.x, dest.y, grid)
  }
  
  kill (o, position) {
    if(o.i === Objects.indexOf('boss'))
      store.getState().player.hasKilledBoss = true
    let map = store.getState().dungeon.map
    let corpse = new Container({
      inventory: o.inventory, 
      name: 'corpse of ' + o.name,
      position: o.position
    })
    corpse.i = Objects.indexOf('corpse')

    store.dispatch({reducer: 'dungeon', type: 'REPLACE OBJECT', 
      from:o, to:corpse, position})
  }
  
  handleMove (creature, vector) {
    let fro = creature.position
    let to = {x:fro.x+vector.x, y:fro.y+vector.y}
    let map = store.getState().dungeon.map
    if(to.x < 0 || to.y < 0 || to.x >= map.length || to.y >= map[0].length)
      return // nothing doing

    let toTile = map[to.x][to.y]
    if(toTile.surface) { // if the surface index != 0 (UNKNOWN), then we can move there
      if(toTile.objects.every(o => o.isPossessable() || 
          o.constructor.name === 'Container')) {
        creature.move(vector) // let the creature dispatch its movement across the map

        toTile.objects.forEach(o => { // get items now
          if(o.isPossessable())
            creature.take(o)
          if(o.constructor.name === 'Container' && creature.isPlayer())
            o.inventory = o.inventory.map(i => {
              if(!i.isPossessable())
                return i
              creature.take(i)
              return null
            }).filter(x => x !== null)
        })
        toTile.objects=toTile.objects.filter(o => !o.isPossessable())        
//        toTile.objects.unshift(creature)
      } else {
        //attack
      }
      
      this.turnCycle()
    }
  }
  
  clear () {
    this.ctx.beginPath()
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.ctx.closePath()
  }
  
  processAttack ({from,to}={}) {
      if (!from || !to) 
        return 
      let damage = from.getDamage()

      if(to.isPlayer()) {
        this.ctx.beginPath()
        this.ctx.fillStyle = 'red'
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.closePath()

        let self = this
        setTimeout(function () { 
          self.ctx.beginPath()
          self.ctx.fillStyle = 'black'
          self.ctx.fillRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height)
          self.ctx.closePath()
          self.draw() 
        }, 300)
      }

      to.takeDamage(damage)
      console.log(`${to.name} attacked (falls to ${to.livingState.health} health)`)
    }

}
