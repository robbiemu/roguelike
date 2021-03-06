import configureStore from './create.js'

export const store = configureStore()

export function mapStateToProps(state) {
  return {
    player: state.player,
    dungeon: state.dungeon,
    ui: state.ui,
    infoPanelKey: state.infoPanelKey
  }
}