import { PAGE_ROOT } from '../routes'

// NOTE: structure by https://github.com/erikras/ducks-modular-redux

// Action types
export const TRACK_PICK = 'slowcast/player/TRACK_PICK'

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

    default:
      return state
  }
}

// Actions
export const pickTrack = (track) => ({
  type: TRACK_PICK,
  payload: { track },
})
