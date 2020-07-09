import { ADD, ADD_CURRENCIES, CLEAR } from './actionTypes'
import { FIXER_API_ACCESS_KEY } from '../../setting'

const url = `http://data.fixer.io/api/latest?access_key=${ FIXER_API_ACCESS_KEY }`

export function add (data) {
  return {
    type: ADD,
    payload: data
  }
}

export function clear (date) {
  return {
    type: CLEAR,
    payload: date
  }
}

export const addCurrencies = payload => ({ type: ADD_CURRENCIES, payload })

export const fetchCurrencies = () => {
  return async dispatch => {
    const currencies = await getCurrencies()
    dispatch(addCurrencies(Object.keys(currencies.rates)))
  }
}

export const getCurrencies = () => {
  return fetch(url)
    .then(result => {
      if (result.status === 200) {
        return result.json()
      } else {
        throw new Error('Invalid response')
      }
    },
    error => { throw new Error(error) }
    )
    .then(data => data)
}
