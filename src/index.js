import React from 'react'
import ReactDOM from 'react-dom'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import Helmet from 'react-helmet'

import rootReducer from './redux/reducers/rootReducer'

import './style/index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'

export const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware // lets us dispatch() functions
  )
)

const app = (
  <Provider store={store}>
    <Helmet
      title='Track Money'
    />
    <App/>
  </Provider>
)

ReactDOM.render(app, document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
