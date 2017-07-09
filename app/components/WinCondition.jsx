import React from 'react'
import { connect } from 'react-redux'

import { store, mapStateToProps } from '../store/index.js'


class WinConditionPreRedux extends React.Component {
  constructor (props) {
    super(props)
    this.state = {previousWinCondition:undefined}
  }
  newGame () {
    console.log('new game called')
    store.dispatch({reducer: 'ui', type: 'SET WIN CONDITION', 
      condition: undefined})
    this.props.newGame()
  }

  hideModal () {
    this.newGame()
  }

  getWinMessage () {
    return (<div className='info-box'>
      <ul className="player-stats">
        <li>Name: {this.props.player.name}</li>
        <li>Max Depth: {this.props.player.maxDepth}</li>
      </ul>
    </div>)
  }
  getLoseMessage () {
    return (<div className='info-box'>
      <ul className="player-stats">
        <li>Name: {this.props.player.name}</li>
        <li>Weapon: {JSON.stringify(this.props.player.weapon||'barehanded').replace(/"/g,'')}</li>
        <li>Max Depth: {this.props.player.maxDepth}</li>
      </ul>
    </div>)
  }

  render () {
    return (<div onClick={this.hideModal.bind(this)} className={'win-condition modal ' + (this.props.ui.winCondition===undefined? 'disabled': 'enabled')}>
      <div className='message'>
        <h1>{this.props.ui.winCondition?'Ascension!':'You have died.'}</h1>
        {this.props.ui.winCondition?this.getWinMessage():this.getLoseMessage()}
        <button onClick={this.newGame.bind(this)}>{this.props.ui.winCondition?'Play':'Try'} Again</button>
      </div>
    </div>)
  }

  shouldComponentUpdate (nextProps) {
    let update = this.state.previousWinCondition !== nextProps.ui.winCondition 
    this.state.previousWinCondition = this.props.ui.winCondition
    return update
  }
}

export default connect(mapStateToProps)(WinConditionPreRedux);
