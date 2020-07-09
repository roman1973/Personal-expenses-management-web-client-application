import { ADD, CLEAR } from '../actions/actionTypes'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
  case ADD:
    const dateEntry = state[action.payload.date]
    return {
      ...state,
      [action.payload.date]: [...(dateEntry || []), action.payload]
    }
  case CLEAR:
    delete state[action.payload]
    return state
  default:
    return state
  }
}
