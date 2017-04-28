import Container from './objects/Container.js'
import Objects from './map/Objects.js'

import { store } from './store/index.js'


export default class GameEngine {
  constructor({surfaces, objects, 
      ctx=document.getElementById('map').getContext('2d')}) {
    this.ctx = ctx
    this.surfaces = surfaces
    this.objects = objects
  }
  draw () {
    let map = store.getState().dungeon.map
    let fw = this.ctx.canvas.width / map.length
    let fh = this.ctx.canvas.height / map[0].length
    fh = ~~(fh < fw? fh: fw)
    fw = ~~(fw < fh? fw: fh)
    store.dispatch({reducer: 'ui', type: 'SET SQUARE SIZE', squareSize:fw})

    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[i].length; j++) {
        if(!this.isVisible(map[i][j])) {
          this.ctx.beginPath()
          this.ctx.fillStyle = this.surfaces.entryMap().unknown          
          this.ctx.fillRect(i * fw, j * fh, fw, fh)
          this.ctx.closePath()
        } else {
          this.ctx.beginPath()
          this.ctx.fillStyle = Object.values(
            this.surfaces.arrayMap[map[i][j].surface])[0]
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
  isVisible(){return true}
  
  turnCycle () {
    let map = store.getState().dungeon.map
    map.forEach((row, ri) => {
      row.forEach((cel, ci) => cel.objects
        .filter(o => !o.isPossessable() && o.hasTurn() )
        .forEach(o => {
          o.processTurn(this, map)
          if (o.isDead()) {
            if (o.isPlayer()) {
              
            } else {
              console.log(`${o.name} is dead!`)
              this.kill(o, {x:ri, y:ci})
            }
          }
        }))
    })

    this.draw()
  }
  
  kill (o, position) {
    let map = store.getState().dungeon.map
    let corpse = new Container({
      inventory: o.inventory, 
      name: 'corpse of ' + o.name,
      position: o.position
    })
    corpse.i = Objects.indexOf('corpse')

    store.dispatch({reducer: 'dungeon', action: 'REPLACE OBJECT', 
      from:o, to:corpse, position})
  }
  
  handleMove (creature, vector) {
    let map = store.getState().dungeon.map

    let fro = creature.position
    let toTile = map[fro.x+vector.x][fro.y+vector.y]
    if(toTile.surface) { // if the surface index != 0 (UNKNOWN), then we can move there
      if(toTile.objects.every(o => o.isPossessable() || 
          o.constructor.name === 'Container')) {
        creature.move(vector) // let the creature dispatch its movement across the map

        toTile.objects.forEach(o => { // get items now
          if(o.isPossessable())
            creature.take(o)
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
      console.log(`${to.name} attacked (falls to ${to.health} health)`)
    }

}
