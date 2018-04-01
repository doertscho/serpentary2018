import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { createStore } from 'redux'
import { StoreState } from './types'
import { models } from './types/models.js'
import { rootReducer } from './reducers'
import { Provider } from 'react-redux';

import { VisibleMatchList } from './containers/VisibleMatchList'

require('file-loader?name=[name].[ext]!../index.html')

const store = createStore<StoreState>(
  rootReducer,
  { matches: new Map<number, models.Match>() }
)

ReactDOM.render(
  <Provider store={store}>
    <VisibleMatchList />
  </Provider>,
  document.getElementById('app')
)
