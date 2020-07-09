import { combineReducers } from 'redux'

import currencyReducer from './currencyReducer'
import dataReducer from './dataReducer'

export default combineReducers({
  currency: currencyReducer,
  expense: dataReducer
})
