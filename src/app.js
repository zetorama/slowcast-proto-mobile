import React from 'react'
import { Provider } from 'react-redux'

import getStore from './store'
import AppIndex from './pages'

const store = getStore()

export function App() {
  return (
    <Provider store={store}>
      <AppIndex />
    </Provider>
  )
}

export default App
