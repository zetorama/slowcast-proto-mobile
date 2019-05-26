// NOTE: structure based on https://github.com/erikras/ducks-modular-redux

// Default state (thanks to hoisting, keeping it on top for a quick reference)
reducer.getInitialState = () => ({
  isReady: false,
  isPlaying: false,
  isBuffering: false,
  playingTrack: undefined,
  trackProgress: {
    duration: 0,
    position: 0,
    bufferedPosition: 0,
  },
  isHolding: false, // derivative from `holdingSinceTs > -1`
  holdingSinceTs: -1, // UNIX timestamp, ms
  // lastHoldPosition: 0,

  playingSettings: {
    // currentMode: 'timings',
    talkTime: 10,
    holdTime: 10,
    fadeTime: 10,
  },
  // playingChapters: {
  //   currentMark: 0,
  //   marks: [],
  // },
})


// Action types
export const SET_READY = 'slowcast/player/SET_READY'
export const SET_PLAYING = 'slowcast/player/SET_PLAYING'
export const TOGGLE_PLAYING = 'slowcast/player/TOGGLE_PLAYING'
export const SET_BUFFERING = 'slowcast/player/SET_BUFFERING'
export const SELECT_TRACK = 'slowcast/player/SELECT_TRACK'
export const CLEAR_TRACK = 'slowcast/player/CLEAR_TRACK'
export const UPDATE_SETTINGS = 'slowcast/player/UPDATE_SETTINGS'

export const TRACK_REDISTRIBUTE = 'slowcast/player/TRACK_REDISTRIBUTE'
export const DEBUG_PLAYER_STATE_SET = 'slowcast/player/DEBUG_PLAYER_STATE_SET'

// Reducer
export default function reducer(state = reducer.getInitialState(), action) {
  const { type, payload = {} } = action

  switch (type) {
    case SET_READY: {
      const { isReady } = payload
      return isReady === state.isReady ? state : {
        ...state,
        isReady,
        ...handlePlayingChange(state, false),
      }
    }

    case SET_PLAYING: {
      const patch = handlePlayingChange(state, payload.isPlaying)
      return patch ? { ...state, ...patch } : state
    }

    case TOGGLE_PLAYING: {
      const patch = handlePlayingChange(state, !state.isPlaying)
      return patch ? { ...state, ...patch } : state
    }

    case SET_BUFFERING: {
      const { isBuffering } = payload
      return isBuffering === state.isBuffering ? state : { ...state, isBuffering }
    }

    case SELECT_TRACK: {
      const { playingTrack } = payload
      return playingTrack === state.playingTrack ? state : {
        ...state,
        playingTrack,
        ...handlePlayingChange(state, false),
      }
    }

    case CLEAR_TRACK: {
      if (!state.playingTrack) return state

      return {
        ...state,
        playingTrack: undefined,
        ...handlePlayingChange(state, false),
      }
    }

    case UPDATE_SETTINGS: {
      const { playingSettings } = payload
      if (playingSettings === state.playingSettings) return state

      return {
        ...state,
        playingSettings: { ...state.playingSettings, ...playingSettings },
      }
    }

    default:
      return state
  }
}

// Helpers
const handlePlayingChange = (state, isPlaying) => {
  if (isPlaying === state.isPlaying || isPlaying && !state.playingTrack) return undefined

  if (isPlaying) {
    // on play
    return {
      isPlaying: true,
    }
  }

  // on cancel
  return {
    isPlaying: false,

  }
}

// Actions
export const setReady = (isReady) => ({
  type: SET_READY,
  payload: { isReady },
})

export const setBuffering = (isBuffering) => ({
  type: SET_BUFFERING,
  payload: { isBuffering },
})

export const setPlaying = (isPlaying) => ({
  type: SET_PLAYING,
  payload: { isPlaying },
})

export const togglePlayPause = () => ({
  type: TOGGLE_PLAYING,
})

export const selectTrack = (playingTrack) => ({
  type: SELECT_TRACK,
  payload: { playingTrack },
})

export const clearTrack = () => ({
  type: CLEAR_TRACK,
})

export const updateSettings = (playingSettings) => ({
  type: UPDATE_SETTINGS,
  payload: { playingSettings },
})
