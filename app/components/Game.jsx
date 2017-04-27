import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import configureStore from '../store/index.js';

import GameEngine from '../GameEngine.js'

import DungeonGenerator from '../map/DungeonGenerator.js'
import RoomsGenerator from '../map/RoomsGenerator.js'
import Surfaces from '../map/Surfaces.js'
import Objects from '../map/Objects.js'

import Player from '../objects/Player.js'

import InfoPanel from './InfoPanel.jsx'
import Controls from './Controls.jsx'

const rooms = RoomsGenerator.getRooms()

class Game extends React.Component {
  constructor (props) {
    super (props)
    let game, ctx
    
    this.state = { player: new Player({name:'O Patife'}) }
    
    let settings = {
      map: this.getMap(),
      surfaces:Surfaces,
      objects:Objects,
      ctx
    }

    this.state = Object.assign(this.state, {
      mousePos:undefined,
      squareSize: 0,
      game,
      settings
    })
  }
  
  getMap() {
    const dg = new DungeonGenerator(0, rooms, {width:6,height:4})
    this.state.player.position = dg.setSpawn(this.state.player) 
    this.setState({player:this.state.player})
    return dg.maze
  }

  processTurn () {
    this.game.draw()
  }
  
  render () { 
    return (
      <div className="map container">
        <InfoPanel player={this.state.player} mousePos={this.state.mousePos} />
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
      self.refs.map.width = parentSize.width - 25 // cludge but it works
      self.refs.map.height = parentSize.height - 210

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
      let mousePos = getMousePos(self.refs.map, evt);
      let coords = {x:~~(mousePos.x/self.state.squareSize), y:~~(mousePos.y/self.state.squareSize)}
      mousePos = (coords.x >= self.state.settings.map.length || 
        coords.y >= self.state.settings.map[0].length)?
          undefined:
          self.state.settings.map[coords.x][coords.y]
      self.setState({mousePos})
    }, false);
    
    self.refs.map.addEventListener('click', function(e) {
      let mousePos = getMousePos(self.refs.map, e);
      let coords = {x:~~(mousePos.x/self.state.squareSize), y:~~(mousePos.y/self.state.squareSize)}
      mousePos = (coords.x >= self.state.settings.map.length || 
        coords.y >= self.state.settings.map[0].length)?
          undefined:
          self.state.settings.map[coords.x][coords.y]
      if(mousePos)
        self.refs.controls.handleClick(self.state.game, self.state, coords, self.state.settings.map)
    } , false);
    
    self.refs.map.addEventListener ("mouseout", () => self.setState({mousePos:undefined}), false);
    
    let settings = this.state.settings
    settings.ctx = this.refs.map.getContext('2d')
    
    function nextLevel() {
      self.state.settings.map = self.getMap()
      self.setState({ settings: self.state.settings })
      game = new GameEngine(self.state.settings, nextLevel)
      self.setState({ game })
      game.clear()
      game.draw()
    }
    let game = new GameEngine(settings, nextLevel)
    this.setState({game, settings})

    resizeCanvas()
  }
}

ReactDOM.render(
    <Provider store={store}>
      <Game />
    </Provider>,, 
  document.getElementById('app'));