import configureStore from './create.js'

export const store = configureStore()

export function mapStateToProps(state) {
  return {
    player: state.player
  }
}