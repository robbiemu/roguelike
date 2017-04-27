import { combineReducers } from 'redux'

import bossNames from './boss-names.js'
import bossAdjectives from './boss-adjectives.js'
import monsters from './monsters.js'
import player from './player.js'
const rootReducer = combineReducers({bossNames, bossAdjectives, monsters,
player})

export default rootReducer