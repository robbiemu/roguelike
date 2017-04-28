import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'

import { store, mapStateToProps } from '../store/index.js'

import GameEngine from '../GameEngine.js'

import Surfaces from '../map/Surfaces.js'
import Objects from '../map/Objects.js'

import InfoPanel from './InfoPanel.jsx'
import Controls from './Controls.jsx'

class GamePreRedux extends React.Component {
  constructor (props) {
    super (props)

    store.dispatch({reducer: 'player', type: 'NEW'})
    this.cycleMap()
       
    this.state = {
      settings: {
        surfaces:Surfaces,
        objects:Objects    
      }
    }
  }

  cycleMap () {
    store.dispatch({reducer: 'dungeon', type: 'GENERATE MAP'})
    store.dispatch({reducer: 'dungeon', type: 'SET SPAWN LOCATION'})
    let position = this.props.dungeon.spawnPosition
    store.dispatch({reducer: 'player', type: 'SET POSITION', position})
  }

  resizeCanvas () {
    let parentSize = this.refs.map.parentNode.getBoundingClientRect();
    this.refs.map.width = parentSize.width - 25 // cludge but it works
    this.refs.map.height = parentSize.height - 210

    let squareSize = this.props.ui.gameEngine.draw()
    store.dispatch({reducer: 'ui', type: 'SET SQUARE SIZE', squareSize})
  }

  nextLevel () {
    this.cycleMap()
    this.nextGameEngine()
    
    this.props.ui.gameEngine.clear()
    this.props.ui.gameEngine.draw()
  }

  nextGameEngine () {
    let gameEngine = new GameEngine(this.state.settings)
    store.dispatch({reducer: 'ui', type: 'SET GAME ENGINE', gameEngine}) 
  }
  
  render () { 
    return (
      <div className="map container">
        <InfoPanel />
        <canvas ref="map" id="map" />
        <Controls ref="controls" canvasID="map" nextLevel={this.nextLevel} />
      </div>
    ) 
  }
  
  componentDidMount () {
    window.addEventListener('resize', this.resizeCanvas, false)
    this.refs.controls.getWrappedInstance().addEventListeners()
  
    this.nextGameEngine()
    this.resizeCanvas()
  }
}

const Game = connect(mapStateToProps)(GamePreRedux);

ReactDOM.render(
    <Provider store={store}>
      <Game />
    </Provider>,
  document.getElementById('app'));