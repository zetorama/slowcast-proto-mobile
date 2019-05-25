import { PAGE_ROOT } from '../routes'

// NOTE: structure by https://github.com/erikras/ducks-modular-redux

// Action types
export const SETTINGS_UPDATE = 'slowcast/player/SETTINGS_UPDATE'
export const TRACK_SELECT = 'slowcast/player/TRACK_SELECT'
export const TRACK_REDISTRIBUTE = 'slowcast/player/TRACK_REDISTRIBUTE'
export const PLAYING_TOGGLE = 'slowcast/player/PLAYING_TOGGLE'
export const PLAYING_SET = 'slowcast/player/PLAYING_SET'
export const LOADING_SET = 'slowcast/player/LOADING_SET'
export const DEBUG_PLAYER_STATE_SET = 'slowcast/player/DEBUG_PLAYER_STATE_SET'

// Reducer
export default function reducer(state, action) {
  const { type, payload = {} } = action

  switch (type) {
    case DEBUG_PLAYER_STATE_SET: {
      return {
        ...state,
        DEBUG_playerState: payload.playerState,
      }
    }

    case LOADING_SET: {
      if (state.isLoading === payload.isLoading) return state

      return {
        ...state,
        isLoading: payload.isLoading,
      }
    }

    case PLAYING_TOGGLE: {
      return {
        ...state,
        isPlaying: state.playingTrack ? !state.isPlaying : false,
      }
    }

    case PLAYING_SET: {
      if (state.isPlaying === payload.isPlaying) return state

      return {
        ...state,
        isPlaying: payload.isPlaying,
      }
    }

    case TRACK_SELECT: {
      return {
        ...state,
        currentPage: PAGE_ROOT,
        prevPage: null,

        playingTrack: payload.track,
      }
    }

    case TRACK_REDISTRIBUTE: {
      return {
        ...state,
        playingTrack: { ...state.playingTrack },
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
export const togglePlayPause = () => ({
  type: PLAYING_TOGGLE,
})

export const setLoading = (isLoading) => ({
  type: LOADING_SET,
  payload: { isLoading }
})

export const setPlaying = (isPlaying) => ({
  type: PLAYING_SET,
  payload: { isPlaying }
})

export const DEBUG_setPlayerState = (playerState) => ({
  type: DEBUG_PLAYER_STATE_SET,
  payload: { playerState },
})

export const selectTrack = (track) => ({
  type: TRACK_SELECT,
  payload: { track },
})

export const redistributeSelectedTrack = () => ({
  type: TRACK_REDISTRIBUTE,
})

export const updateSettings = (settings) => ({
  type: SETTINGS_UPDATE,
  payload: { settings },
})
