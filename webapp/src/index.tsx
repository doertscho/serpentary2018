import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Map } from 'immutable'
import { createStore } from 'redux'
import { StoreState } from './types'
import { models } from './types/models.js'
import { rootReducer } from './reducers'
import { Provider } from 'react-redux'

import { App } from './App'

require('file-loader?name=[name].[ext]!../index.html')

const store = createStore<StoreState>(
  rootReducer,
  { matches: Map<number, models.Match>() }
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
