import { createStore } from 'redux'

import { PAGE_ROOT } from '../routes'
import routerReducer from './router'
import tracksReducer from './tracks'
import playerReducer from './player'

export function getReducer() {
  // TODO: might be better to re-think store structure and use `combineReducers`
  const reducers = [
    routerReducer,
    tracksReducer,
    playerReducer,
  ]

  return (state, action) => reducers.reduce((state, fn) => fn(state, action), state)
}

export function getDefaults() {
  return {
    // router
    currentPage: PAGE_ROOT,
    prevPage: undefined,

    // player
    isPlaying: false,
    isTalking: false,
    playingSettings: {
      // currentMode: 'timings',
      talkTime: 10,
      holdTime: 10,
      fadeTime: 10,
    },
    playingProgress: {
      duration: 0,
      position: 0,
      bufferedPosition: 0,
    },
    playingChapters: {
      currentMark: 0,
      marks: [],
    },
    playingTrack: undefined,

    // tracks
    tracks: [],
    editingTrack: undefined,
  }
}

export function initStore(initial = getDefaults()) {
  return createStore(getReducer(), initial)
}

export default initStore
