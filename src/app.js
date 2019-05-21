import React from 'react'
import { Provider } from 'react-redux'

import initStore from './store'
import AppIndex from './pages'

export const store = initStore()

export function App() {
  return (
    <Provider store={store}>
      <AppIndex />
    </Provider>
  )
}

export default App
