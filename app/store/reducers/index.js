import { combineReducers } from 'redux'

import bossNames from './boss-names.js'
import bossAdjectives from './boss-adjectives.js'
import monsters from './monsters.js'
import player from './player.js'
import dungeon from './dungeon.js'

const rootReducer = combineReducers({bossNames, bossAdjectives, monsters,
player, dungeon})

export default rootReducer