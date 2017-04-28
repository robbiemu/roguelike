import Container from './objects/Container.js'
import Objects from './map/Objects.js'

export default class GameEngine {
  constructor({map=[[]], surfaces, objects, 
    ctx=document.getElementById('map').getContext('2d')}, nextLevel) {
    this.map = map
    this.ctx = ctx
    this.surfaces = surfaces
    this.objects = objects
    this.nextLevel = nextLevel
  }
  draw () {
    let fw = this.ctx.canvas.width / this.map.length
    let fh = this.ctx.canvas.height / this.map[0].length
    fh = ~~(fh < fw? fh: fw)
    fw = ~~(fw < fh? fw: fh)

    for (var i = 0; i < this.map.length; i++) {
      for (var j = 0; j < this.map[i].length; j++) {
        if(!this.isVisible(this.map[i][j])) {
          this.ctx.beginPath()
          this.ctx.fillStyle = this.surfaces.entryMap().unknown          
          this.ctx.fillRect(i * fw, j * fh, fw, fh)
          this.ctx.closePath()
        } else {
          this.ctx.beginPath()
          this.ctx.fillStyle = Object.values(
            this.surfaces.arrayMap[this.map[i][j].surface])[0]
          this.ctx.fillRect(i * fw, j * fh, fw, fh)
          this.ctx.closePath()
          
          if(this.map[i][j].objects.length > 0) {
            this.ctx.beginPath()
            this.ctx.arc((i * fw) + (fw/2), (j * fh) + (fh/2), fw/2, 0, 
              2 * Math.PI, false)
            this.ctx.fillStyle = Object.values(
              this.objects.arrayMap[this.map[i][j].objects[0].i])[0]
              this.ctx.fill()
            this.ctx.closePath()
          }
        }
      }
    }
    return fw
  }
  isVisible(){return true}
  
  turnCycle (map) {
    map.forEach((row, ri) => {
      row.forEach((cel, ci) => cel.objects
        .filter(o => !o.isPossessable() && o.hasTurn() )
        .forEach(o => {
          o.processTurn(this, map)
          if (o.isDead()) {
            if (o.isPlayer()) {
              
            } else {
              console.log(`${o.name} is dead!`)
              this.kill(o, map, {x:ri, y:ci})
            }
          }
        }))
    })

    this.draw()
  }
  
  kill (o, map, position) {
    let corpse = new Container({
      inventory: o.inventory, 
      name: 'corpse of ' + o.name,
      position: o.position
    })
    corpse.i = Objects.indexOf('corpse')
    let c = map[position.x][position.y]
    c.objects[c.objects.indexOf(o)] = corpse
    this.objects[this.objects.indexOf(o)] = corpse
  }
  
  handleMove (creature, vector, map) {
    let fro = creature.position
    let toTile = map[fro.x+vector.x][fro.y+vector.y]
    if(toTile.surface) {
      if(toTile.objects.every(o => o.isPossessable() || 
          o.constructor.name === 'Container')) {
        let os = map[fro.x][fro.y].objects
        os.splice(os.indexOf(creature), 1)
        
        creature.move(vector)
        
        let to = creature.position

        // get items now
        toTile.objects.forEach(o => {
          if(o.isPossessable())
            creature.take(o)
        })
        toTile.objects=toTile.objects.filter(o => !o.isPossessable())        
        toTile.objects.unshift(creature)
      } else {
        //attack
      }
      
      this.turnCycle (map)
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
