import React, { useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { getStore, getPersistor } from './store'
import AppIndex from './pages'

const store = getStore()
const persistor = getPersistor()


export function App() {
  const [appState, setAppState] = useState(AppState.currentState)

  useEffect(() => {
    AppState.addEventListener('change', setAppState)
    return () => AppState.removeEventListener('change', setAppState)
  })

  // Just render nothing, when app is in background
  if (appState !== 'active') return null

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppIndex />
      </PersistGate>
    </Provider>
  )
}

export default App
