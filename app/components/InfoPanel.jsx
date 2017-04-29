import React from 'react'
import { connect } from 'react-redux'

import { store, mapStateToProps } from '../store/index.js'

import Surfaces from '../map/Surfaces.js'
import Objects from '../map/Objects.js'

export default class InfoPanelPreRedux extends React.Component {
  getWeaponOfPlayer () {
    return this.props.player.livingState.weapon? 
      this.props.player.livingState.weapon.name + ' ('+
        JSON.stringify({
          damage: this.props.player.livingState.weapon.damage.toFixed(3),
          ranged: !this.props.player.livingState.weapon.multipliable
        }).replace(/"/g,'')
      +')': 
      `barehanded ${JSON.stringify({
        damage: this.props.player.livingState.damage.toFixed(3), 
        effective: this.props.player.getEffectiveDamage().toFixed(3)
        }).replace(/"/g,'')
      }`
  }
  
  getMouseoverObjects() {
    return this.props.ui.mouseCell.objects.map((o,i) => 
      <span className="component object" key={i}>
        {o.name + ' ' + this.getObjectDescriptor(o)}
      </span>)
  }
  
  getObjectDescriptor(o) {
    let descriptor, props
    if(o.isPossessable()) {
      switch(o.constructor.name){
        case 'Weapon':
          props = {
            damage:o.damage.toFixed(3), 
            effective:this.props.player.getEffectiveDamage(o).toFixed(3)
          }
          if(!o.multipliable)
            props.ranged='true'
          break
        case 'Potion':
          props={energy:o.energy.toFixed(3),turns:o.turnsRemaining}
          break
        case 'Food':
          props={health:o.health.toFixed(3), turns:o.turnsRemaining}
      }
      descriptor = JSON.stringify(props).replace(/"/g,'')
    } else if(!o.isPlayer()) {
      if (o.constructor.name === 'Container') {
        props = { inventory: o.inventory.map(i=>i.name) }
      } else {
        props = { health: o.apparentHealth(), 
          level: (o.livingState.damageMultiplier * 
            o.livingState.healthMultiplier * o.livingState.damage * 
            Math.sqrt(o.livingState.visRange>Math.sqrt(6*4)?
              o.livingState.visRange:1)).toFixed(1)}
      }
      descriptor = JSON.stringify(props).replace(/"/g,'')
    }
    return descriptor? `${descriptor}`:''
  }

  shouldComponentUpdate (nextProps) {
    return this.props.infoPanelKey !== nextProps.infoPanelKey
  }
  
  render() { 
    return <div className="info panel">{this.props.ui.mouseCell?
    (<div>
      <span className="component surface">
        {Object.keys(Surfaces.arrayMap[this.props.ui.mouseCell.surface])[0]}
      </span>
      {this.getMouseoverObjects()}
    </div>):
    (<div>
      <span className="component health">
        health: {this.props.player.apparentHealth()}</span>
      <span className="component energy">
        energy: {this.props.player.livingState.energy.toFixed(3)}</span>
      <span className="component weapon">
        weapon: {this.getWeaponOfPlayer()}</span>
      <span className="component weapon">
        armor: {this.props.player.livingState.healthMultiplier.toFixed(3)}</span>
    </div>)
  }
  <div className="float-right level">Depth {this.props.dungeon.depth}</div>
  {(this.props.player.hasKilledBoss?<div className="float-right can-ascend">you can ascend!</div>:'')}
  </div> 
  }
}

export default connect(mapStateToProps)(InfoPanelPreRedux);
