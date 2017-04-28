import { combineReducers } from 'redux'

import bossNames from './boss-names.js'
import bossAdjectives from './boss-adjectives.js'
import monsters from './monsters.js'
import player from './player.js'
import dungeon from './dungeon.js'
import ui from './ui.js'
import infoPanelKey from './infoPanelKey.js'

const rootReducer = combineReducers({bossNames, bossAdjectives, monsters,
player, dungeon, ui, infoPanelKey})

export default rootReducer