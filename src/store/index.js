import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import nav from './nav'
import library from './library'
import player from './player'
import libraryPlayerSync from './library-player-sync'
import router from './router'

let store
let persistor

const persistConfig = {
  key: 'proto:root',
  storage,
}

export function getPersistor() {
  if (!persistor) {
    persistor = persistStore(getStore())
  }

  return persistor
}

export function getStore() {
  if (!store) {
    store = createStore(getRootReducer(), getInitialState(), getEnhancer())
  }

  return store
}

export function getEnhancer() {}

export function getRootReducer() {
  const reducers = [
    combineReducers({
      nav,
      library,
      player,
    }),
    // these need to get whole state
    libraryPlayerSync,
    router,
  ]
  const rootReducer = (state, action) => reducers.reduce((state, fn) => fn(state, action), state)

  return persistReducer(persistConfig, rootReducer)
}

export function getInitialState() {
  return {
    nav: nav.getInitialState(),
    library: library.getInitialState(),
    player: player.getInitialState(),
  }
}


export default getStore
