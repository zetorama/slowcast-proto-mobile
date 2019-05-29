import TrackPlayer from 'react-native-track-player'
// NOTE: structure based on https://github.com/erikras/ducks-modular-redux

// Multiplier for talk/hold time
const SETTINGS_TIME_COEFF_NORMAL = 60 // treat as minutes

// Default state (thanks to hoisting, keeping it on top for a quick reference)
reducer.getInitialState = () => ({
  isReady: false,
  isPlayerOk: true,
  isBuffering: false,
  isPlaying: false,
  playingTrack: undefined,
  trackProgress: undefined,
  // trackProgress: {
  //   playDuration: 0, // custom: how long since "play" in seconds
  //   duration: 0,
  //   position: 0,
  //   bufferedPosition: 0,
  // },
  isStreamActive: false,
  switchedStreamAt: null, // UNIX timestamp, ms
  holdingTimeLeft: 0, // seconds
  holdingWaitLeft: 0, // seconds
  requestPosition: -1, // seconds

  playingSettings: {
    // currentMode: 'timings',
    talkTime: 10,
    holdTime: 10,
    fadeTime: 10,
  },

  // playerErrors: [{
  //   code: 123,
  //   message: 'error',
  //   isAck: false,
  // }],
  playerErrors: [],
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
export const REQUEST_TRACK_POSITION = 'slowcast/player/REQUEST_TRACK_POSITION'
export const REPORT_PLAYER_ERROR = 'slowcast/player/REPORT_PLAYER_ERROR'
export const ACKNOWLEDGE_PLAYER_ERROR = 'slowcast/player/ACKNOWLEDGE_PLAYER_ERROR'

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
        isStreamActive: isPlaying,
        switchedStreamAt: new Date(),
      }
    }

    case TOGGLE_PLAYING: {
      return {
        ...state,
        isPlaying: !state.isPlaying,
        isStreamActive: !state.isPlaying,
        switchedStreamAt: new Date(),
      }
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

    case REQUEST_TRACK_POSITION: {
      const { requestPosition, isStreamActive } = payload
      const isSwitching = typeof isStreamActive === 'boolean' && isStreamActive !== state.isStreamActive
      if (requestPosition === state.requestPosition && !(isSwitching && isStreamActive)) return state

      return {
        ...state,
        requestPosition,
        // switch stream if requested
        isStreamActive: isSwitching ? isStreamActive : state.isStreamActive,
        switchedStreamAt: isSwitching ? new Date() : state.switchedStreamAt,
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

    case REPORT_PLAYER_ERROR: {
      const { code, message } = payload
      // keep only last ten errors
      const playerErrors = [{ code, message, isAck: false }].concat(state.playerErrors).slice(0, 10)

      return {
        ...state,
        playerErrors,
      }
    }

    case ACKNOWLEDGE_PLAYER_ERROR: {
      const { index } = payload

      console.log(index, state.playerErrors)
      if (!state.playerErrors[index] || state.playerErrors[index].isAck) return state

      // keep only last ten errors
      const playerErrors = state.playerErrors.map((one, idx) => idx !== index ? one : { ...one, isAck: true })

      return {
        ...state,
        playerErrors,
      }
    }

    // expecting this to be called like every second
    case UPDATE_TRACK_PROGRESS: {
      const { trackProgress } = payload
      if (trackProgress === state.trackProgress) return state

      return {
        ...state,
        trackProgress: { ...state.trackProgress, ...trackProgress },
        ...handlePlayingProgress(state),
      }
    }

    default:
      return state
  }
}

// Helpers
const handlePlayingProgress = (state) => {
  if (!state.isPlaying) return undefined

  const {
    isStreamActive,
    switchedStreamAt,
    playingSettings: {
      talkTime, // min
      holdTime, // min
    } = {},
  } = state

  const timeSinceSwitch = new Date() - switchedStreamAt
  const holdingTimeLeft = isStreamActive ? 0 : holdTime * SETTINGS_TIME_COEFF_NORMAL - timeSinceSwitch / 1000
  const holdingWaitLeft = isStreamActive ? talkTime * SETTINGS_TIME_COEFF_NORMAL - timeSinceSwitch / 1000 : 0

  if (isStreamActive && holdingWaitLeft < 0) {
    return {
      isStreamActive: false,
      switchedStreamAt: new Date(),
      holdingTimeLeft: (holdTime * SETTINGS_TIME_COEFF_NORMAL),
      holdingWaitLeft: 0,
    }
  }

  if (!isStreamActive && holdingTimeLeft < 0) {
    return {
      isStreamActive: true,
      switchedStreamAt: new Date(),
      holdingTimeLeft: 0,
      holdingWaitLeft: (talkTime * SETTINGS_TIME_COEFF_NORMAL),

    }
  }

  return {
    holdingTimeLeft,
    holdingWaitLeft,
  }
}

const handlePlayingReset = (state) => {
  // if (!state.isPlaying) return undefined

  return {
    isPlaying: false,
    isStreamActive: false,
    trackProgress: undefined,
    holdingTimeLeft: 0,
    holdingWaitLeft: (state.playingSettings.talkTime * SETTINGS_TIME_COEFF_NORMAL),
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

export const seekTo = (requestPosition, isStreamActive = undefined) => ({
  type: REQUEST_TRACK_POSITION,
  payload: {
    requestPosition: Math.max(0, requestPosition),
    isStreamActive,
  },
})

export const updateSettings = (playingSettings) => ({
  type: UPDATE_SETTINGS,
  payload: { playingSettings },
})

export const updateTrackProgress = (trackProgress) => ({
  type: UPDATE_TRACK_PROGRESS,
  payload: { trackProgress },
})

export const reportPlayerError = (code, message) => ({
  type: REPORT_PLAYER_ERROR,
  payload: { code, message },
})

export const ackPlayerError = (index = 0) => ({
  type: ACKNOWLEDGE_PLAYER_ERROR,
  payload: { index },
})
