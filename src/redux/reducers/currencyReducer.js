import { ADD_CURRENCIES } from '../actions/actionTypes'

export default (state = [], action) => {
  switch (action.type) {
  case ADD_CURRENCIES:
    return action.payload
  default:
    return state
  }
}
