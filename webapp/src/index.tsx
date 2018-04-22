import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { StoreState, INITIAL_STATE } from './types'
import { models } from './types/models'
import { rootReducer } from './reducers'
import { Provider } from 'react-redux'
import { App } from './App'

require('file-loader?name=[name].[ext]!./index.html')

const store = createStore<StoreState>(
  rootReducer,
  INITIAL_STATE,
  applyMiddleware(thunkMiddleware)
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
