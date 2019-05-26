import TrackPlayer from 'react-native-track-player'
// NOTE: structure based on https://github.com/erikras/ducks-modular-redux

// Default state (thanks to hoisting, keeping it on top for a quick reference)
reducer.getInitialState = () => ({
  isReady: false,
  isPlayerOk: true,
  isBuffering: false,
  isPlaying: false,
  playingTrack: undefined,
  trackProgress: undefined,
  // trackProgress: {
  //   duration: 0,
  //   position: 0,
  //   bufferedPosition: 0,
  // },
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
export const SET_PLAYER_STATE = 'slowcast/player/SET_PLAYER_STATE'
export const SELECT_TRACK = 'slowcast/player/SELECT_TRACK'
export const CLEAR_TRACK = 'slowcast/player/CLEAR_TRACK'
export const UPDATE_SETTINGS = 'slowcast/player/UPDATE_SETTINGS'
export const UPDATE_TRACK_PROGRESS = 'slowcast/player/UPDATE_TRACK_PROGRESS'

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
        ...handlePlayingReset(state),
      }
    }

    case SET_PLAYING: {
      const { isPlaying } = payload
      return isPlaying === state.isPlaying ? state : {
        ...state,
        isPlaying,
      }
    }

    case TOGGLE_PLAYING: {
      return { ...state, isPlaying: !state.isPlaying }
    }

    case SET_PLAYER_STATE: {
      const isPlayerOk = payload.playerState !== TrackPlayer.STATE_NONE
      const isBuffering = payload.playerState === TrackPlayer.STATE_BUFFERING

      if (isPlayerOk === state.isPlayerOk && isBuffering === state.isBuffering) return state

      return { ...state, isPlayerOk, isBuffering }
    }

    case SELECT_TRACK: {
      const { playingTrack } = payload
      return playingTrack === state.playingTrack ? state : {
        ...state,
        playingTrack,
        ...handlePlayingReset(state),
      }
    }

    case CLEAR_TRACK: {
      if (!state.playingTrack) return state

      return {
        ...state,
        playingTrack: undefined,
        ...handlePlayingReset(state),
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

    case UPDATE_TRACK_PROGRESS: {
      const { trackProgress } = payload
      if (trackProgress === state.trackProgress) return state

      return {
        ...state,
        trackProgress: { ...state.trackProgress, ...trackProgress },
      }
    }

    default:
      return state
  }
}

// Helpers
const handlePlayingReset = (state) => {
  if (!state.isPlaying) return undefined

  return {
    isPlaying: false,
    trackProgress: undefined,
  }
}

// Actions
export const setReady = (isReady) => ({
  type: SET_READY,
  payload: { isReady },
})

export const setPlayerState = (playerState) => ({
  type: SET_PLAYER_STATE,
  payload: { playerState },
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

export const updateTrackProgress = (trackProgress) => ({
  type: UPDATE_TRACK_PROGRESS,
  payload: { trackProgress },
})
