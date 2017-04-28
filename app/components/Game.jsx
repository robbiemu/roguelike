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
    store.dispatch({reducer: 'dungeon', type: 'NEW'})
    let position = this.props.dungeon.spawnPosition
    store.dispatch({reducer: 'player', type: 'SET POSITION', position})

    let game, ctx        
    let settings = {
      surfaces:Surfaces,
      objects:Objects,
      ctx
    }

    this.state = {
      mousePos:undefined,
      squareSize: 0,
      game,
      settings
    }
  }
  
  render () { 
    return (
      <div className="map container">
        <InfoPanel mousePos={this.state.mousePos} />
        <canvas ref="map" id="map" />
        <Controls ref="controls" gamestate={this.state} />
      </div>
    ) 
  }
  
  componentDidMount () {
    window.addEventListener('resize', resizeCanvas, false);
  
    let self = this
    function resizeCanvas() {
      let parentSize = self.refs.map.parentNode.getBoundingClientRect();
      self.props.dungeon.map.width = parentSize.width - 25 // cludge but it works
      self.props.dungeon.map.height = parentSize.height - 210

      self.state.squareSize = game.draw()
    }
    
    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }
    
    self.refs.map.addEventListener('mousemove', function(evt) {
      let mousePos = getMousePos(self.refs.uimap, evt);
      let coords = {
        x:~~(mousePos.x/self.state.squareSize), 
        y:~~(mousePos.y/self.state.squareSize)
      }
      mousePos = (coords.x >= self.props.dungeon.map.length || 
        coords.y >= self.props.dungeon.map[0].length)?
          undefined:
          self.props.dungeon.map[coords.x][coords.y]
      self.setState({mousePos})
    }, false);
    
    self.refs.map.addEventListener('click', function(e) {
      let mousePos = getMousePos(self.refs.map, e);
      let coords = {
        x:~~(mousePos.x/self.state.squareSize), 
        y:~~(mousePos.y/self.state.squareSize)
      }
      mousePos = (coords.x >= self.props.dungeon.map.length || 
        coords.y >= self.props.dungeon.map[0].length)?
          undefined:
          self.props.dungeon.map[coords.x][coords.y]
      if(mousePos)
        self.refs.controls.getWrappedInstance().handleClick(
          self.state.game, self.state, coords)
    } , false);
    
    self.refs.map.addEventListener ("mouseout", () => 
      self.setState({mousePos:undefined}), false);
    
    let settings = this.state.settings
    settings.ctx = this.refs.map.getContext('2d')
    
    function nextLevel() {
      store.dispatch({reducer: 'dungeon', type: 'NEW'})

      self.setState({ settings: self.state.settings })
      game = new GameEngine(self.state.settings)
      self.setState({ game })
      game.clear()
      game.draw()
    }
    let game = new GameEngine(settings)
    this.setState({game, settings})

    resizeCanvas()
  }
}

const Game = connect(mapStateToProps)(GamePreRedux);

ReactDOM.render(
    <Provider store={store}>
      <Game />
    </Provider>,
  document.getElementById('app'));