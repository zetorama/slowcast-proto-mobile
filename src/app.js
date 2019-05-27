import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { getStore, getPersistor } from './store'
import AppIndex from './pages'

const store = getStore()
const persistor = getPersistor()

export function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppIndex />
      </PersistGate>
    </Provider>
  )
}

export default App
