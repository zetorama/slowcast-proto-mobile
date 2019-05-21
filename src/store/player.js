import { PAGE_ROOT } from '../routes'

// NOTE: structure by https://github.com/erikras/ducks-modular-redux

// Action types
export const TRACK_PICK = 'slowcast/player/TRACK_PICK'
export const SETTINGS_UPDATE = 'slowcast/player/SETTINGS_UPDATE'

// Reducer
export default function reducer(state, action) {
  const { type, payload } = action

  switch (type) {
    case TRACK_PICK: {
      return {
        ...state,
        currentPage: PAGE_ROOT,
        prevPage: null,

        playingTrack: payload.track,
      }
    }

    case SETTINGS_UPDATE: {
      return {
        ...state,

        playingSettings: {
          ...state.playingSettings,
          ...payload.settings,
        }
      }
    }

    default:
      return state
  }
}

// Actions
export const pickTrack = (track) => ({
  type: TRACK_PICK,
  payload: { track },
})

export const updateSettings = (settings) => ({
  type: SETTINGS_UPDATE,
  payload: { settings },
})
