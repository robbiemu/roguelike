import { combineReducers } from 'redux'

import bossNames from './boss-names.js'
import bossAdjectives from './boss-adjectives.js'
import monsters from './monsters.js'

const rootReducer = combineReducers({bossNames, bossAdjectives, monsters})

export default rootReducer