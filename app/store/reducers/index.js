import { combineReducers } from 'redux'

import bossNames from './boss-names.js'
import bossAdjectives from './boss-adjectives.js'

const rootReducer = combineReducers({bossNames, bossAdjectives})

export default rootReducer