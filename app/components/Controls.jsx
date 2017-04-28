import React from 'react'
import { connect } from 'react-redux'

import { store, mapStateToProps } from '../store/index.js'

import Surfaces from '../map/Surfaces.js'
import Objects from '../map/Objects.js'

class ControlsPreRedux extends React.Component {
  constructor (props) {
    super (props)
    window.addEventListener('keydown', 
      ((e)=>this.handleKeypress(this.props.gamestate,e)));
  }
  
  handleKeypress (gamestate,e) {
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
      gamestate.game.handleMove(this.props.player, vector, gamestate.settings.map);
    }
  }
  
  handleClick (gameEngine, gamestate, position, map) {
    let {surface, objects} = map[position.x][position.y]
    switch (surface) {
      case Surfaces.indexOf('stairs up'):
      case Surfaces.indexOf('stairs down'):
        if(Objects.areAdjacent(this.props.player, {position}))
          gameEngine.nextLevel()
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
          gameEngine.handleMove(this.props.player, position, map)
        return
      default: //ATTACK
        if(Objects.areAdjacent(this.props.player, {position}) || 
            (this.props.player.weapon && this.props.player.weapon.isRanged())) {
          gameEngine.processAttack({from:this.props.player, to:action})
          gameEngine.turnCycle(map)
        }
    }
  }
  
  render () { return (
        <div className="controls panel">
          <h2>Controls</h2>
        </div>
    ) 
  }
}

export default connect(mapStateToProps)(ControlsPreRedux);

