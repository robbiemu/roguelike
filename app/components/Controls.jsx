import React from 'react'
import { connect } from 'react-redux'

import { store, mapStateToProps } from '../store/index.js'

import Surfaces from '../map/Surfaces.js'
import Objects from '../map/Objects.js'

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}

class ControlsPreRedux extends React.Component {
  addEventListeners () { //call me from parent!
    window.addEventListener('keydown', ((e) => this.handleKeypress(this,e)))
    
    let canvas = document.getElementById(this.props.canvasID)

    canvas.addEventListener('mousemove', ((e) => this.mouseMove(this,e)), false)
    canvas.addEventListener('click', ((e) => this.onClick(this,e)), false)    
    canvas.addEventListener ('mouseout', () => 
      store.dispatch({
        reducer: 'ui', 
        type: 'SET MOUSECELL', 
        mouseCell:undefined
    }), false)
  }
  
  handleKeypress (context, e) {
    let vector = '';
    switch (e.keyCode) {
      case 65: //a
      case 37:
        vector = {x: -1, y: 0};
        break;
      case 87://w
      case 38:
        vector = {x: 0, y: -1};
        break;
      case 68: //d
      case 39:
        vector = {x: 1, y: 0};
        break;
      case 83: //s
      case 40:
        vector = {x: 0, y: 1};
        break;
      default:
        vector = '';
        break;
    }
    if (vector) {
      e.preventDefault();
      context.props.ui.gameEngine.handleMove(context.props.player, vector);
    }
  }
  
  handleClick (position) {
    let {surface, objects} = this.props.dungeon.map[position.x][position.y]
    switch (surface) {
      case Surfaces.indexOf('stairs up'):
      case Surfaces.indexOf('stairs down'):
        if(Objects.areAdjacent(this.props.player, {position}))
          this.props.nextLevel()
        return
      /*default:
      case Surfaces.indexOf('unknown'): 
        return*/
    }
    
    let action =
    objects.reduce((p,c) => {
      switch(c.constructor.name) {
        case 'Creature':
          return c
        case 'Weapon':
        case 'Potion':
        case 'Food':
          return p instanceof Creature? p: 'MOVE'
      }
    }, 'NOTHING')
    switch (action) {
      case 'NOTHING':
        return
      case 'MOVE':
        if(Objects.areAdjacent(this.props.player, {position}))
          gameEngine.handleMove(this.props.player, position)
        return
      default: //ATTACK
        if(Objects.areAdjacent(this.props.player, {position}) || 
            (this.props.player.weapon && this.props.player.weapon.isRanged())) {
          this.props.ui.gameEngine.processAttack({from:this.props.player, to:action})
          this.props.ui.gameEngine.turnCycle()
        }
    }
  }

  mouseMove (context, e) {
    let mousePos = getMousePos(
      document.getElementById(context.props.canvasID), e)
    let coords = {
      x:~~(mousePos.x/context.props.ui.squareSize), 
      y:~~(mousePos.y/context.props.ui.squareSize)
    }
    let mouseCell = (coords.x >= context.props.dungeon.map.length || 
      coords.y >= context.props.dungeon.map[0].length)?
        undefined:
        context.props.dungeon.map[coords.x][coords.y]
    if(mouseCell !== this.props.ui.mouseCell) {
      store.dispatch({ reducer: 'ui', type: 'SET MOUSECELL', mouseCell })
      store.dispatch({ reducer: 'infoPanelKey', 
        type: 'SET KEY', key: Math.random() })    }
  }

  onClick (context, e) {
    let mousePos = getMousePos(
      document.getElementById(context.props.canvasID), e)
    let coords = {
      x:~~(mousePos.x/context.props.ui.squareSize), 
      y:~~(mousePos.y/context.props.ui.squareSize)
    }
    mousePos = (coords.x >= context.props.dungeon.map.length || 
      coords.y >= context.props.dungeon.map[0].length)?
        undefined:
        context.props.dungeon.map[coords.x][coords.y]
    if(mousePos)
      context.handleClick(coords)
  }
  
  render () { 
    return (
      <div className="controls panel">
        <h2>Controls</h2>
      </div>
    ) 
  }
}

export default connect(mapStateToProps,
  null, null, {withRef:true})(ControlsPreRedux)
