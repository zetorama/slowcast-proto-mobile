import { createStore, combineReducers } from 'redux'

import nav from './nav'
import library from './library'
import player from './player'
import router from './router'

let store

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
    router,
  ]
  return (state, action) => reducers.reduce((state, fn) => fn(state, action), state)
}

export function getInitialState() {
  return {
    nav: nav.getInitialState(),
    library: library.getInitialState(),
    player: player.getInitialState(),
  }
}


export default getStore
