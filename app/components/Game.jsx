import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'

import { store, mapStateToProps } from '../store/index.js'

import GameEngine from '../GameEngine.js'

import Surfaces from '../map/Surfaces.js'
import Objects from '../map/Objects.js'

import InfoPanel from './InfoPanel.jsx'
import Controls from './Controls.jsx'
import WinCondition from './WinCondition.jsx'

class GamePreRedux extends React.Component {
  constructor (props) {
    super (props)

    this.initGame()
       
    this.state = {
      settings: {
        surfaces:Surfaces,
        objects:Objects    
      }
    }
  }

  newGame() {
    this.initGame()
    this.nextLevel()
  }

  initGame() {
    store.dispatch({reducer: 'ui', type: 'SET WIN CONDITION', 
      condition: undefined})
    this.cyclePlayer()
    this.cycleMap()
    store.dispatch({reducer: 'dungeon', type: 'SET DEPTH', depth:0})
    store.dispatch({reducer: 'player', type: 'NOTE CURRENT DEPTH', depth: 0})
    store.dispatch({
      reducer: 'infoPanelKey', 
      type: 'SET KEY', 
      key: Math.random()
    })
  }

  cycleMap () {
    store.dispatch({reducer: 'dungeon', type: 'GENERATE MAP'})
    store.dispatch({reducer: 'dungeon', type: 'SET SPAWN LOCATION'})
    let position = this.props.dungeon.spawnPosition
    store.dispatch({reducer: 'player', type: 'SET POSITION', position})
  }

  cyclePlayer () {
    store.dispatch({reducer: 'player', type: 'NEW'})
  }

  resizeCanvas (context) {
    let parentSize = context.refs.map.parentNode.getBoundingClientRect();
    context.refs.map.width = parentSize.width - 25 // cludge but it works
    context.refs.map.height = parentSize.height - 210

    context.props.ui.gameEngine.draw()
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
        <Controls ref="controls" canvasID="map" nextLevel={this.nextLevel.bind(this)} />
        <WinCondition newGame={this.newGame.bind(this)} />
      </div>
    ) 
  }
  
  componentDidMount () {
    window.addEventListener('resize', (() => this.resizeCanvas(this)), false)
    this.refs.controls.getWrappedInstance().addEventListeners()
  
    this.nextGameEngine()
    this.resizeCanvas(this)
  }
}

const Game = connect(mapStateToProps)(GamePreRedux);

ReactDOM.render(
    <Provider store={store}>
      <Game />
    </Provider>,
  document.getElementById('app'));