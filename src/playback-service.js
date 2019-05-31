import TrackPlayer from 'react-native-track-player'
import BackgroundTimer from 'react-native-background-timer'

import {
  isPlayerAlive,
  preparePlayer,
  discardPlayer,
  setPlayingTrack,
  togglePlayPause,
  seekTo,
} from './services/player'

import {
  setReady,
  setPlaying,
  setPlayerState,
  updateTrackProgress,
  reportPlayerError,
} from './store/player'

import {
  keepTrackProgress,
} from './store/library'

import getStore from './store'

const PROGRESS_UPDATE_EVERY_MS = 1000

// background service for TrackPlayer
// subscribing here to variis playback updates, and tell store about them
export async function subscribeToPlayback() {
  const { dispatch } = getStore()

  TrackPlayer.addEventListener('playback-error', async ({ code, message }) => {
    console.log('!!!! playback-error !!!', code, message)

    dispatch(reportPlayerError(code, message))
  })

  TrackPlayer.addEventListener('playback-state', async ({ state }) => {
    const label = {
      [TrackPlayer.STATE_NONE]: 'STATE_NONE',
      [TrackPlayer.STATE_READY]: 'STATE_READY',
      [TrackPlayer.STATE_PLAYING]: 'STATE_PLAYING',
      [TrackPlayer.STATE_PAUSED]: 'STATE_PAUSED',
      [TrackPlayer.STATE_STOPPED]: 'STATE_STOPPED',
      [TrackPlayer.STATE_BUFFERING]: 'STATE_BUFFERING',
    }

    console.log('!!!! playback-state !!!', label[state])

    dispatch(setPlayerState(state))
  })

  TrackPlayer.addEventListener('remote-play', async () => {
    console.log('!!!! remote-play !!!')
    dispatch(setPlaying(true))
  })

  TrackPlayer.addEventListener('remote-pause', async () => {
    console.log('!!!! remote-pause !!!')
    dispatch(setPlaying(false))
  })

  TrackPlayer.addEventListener('remote-stop', async () => {
    console.log('!!!! remote-stop !!!')
    dispatch(setReady(false))
  })

  TrackPlayer.addEventListener('remote-duck', async (flags) => {
    console.log('!!!! remote-duck !!!', flags)
    if (flags.permanent) {
      // somebody else gained the audio focus :(
      dispatch(setReady(false))
    } else if (flags.paused || flags.ducking) {
      // as we don't want to interfere with others, just pause
      dispatch(setPlaying(false))
    } else {
      // otherwise, consider this is "stop ducking", so resume
      dispatch(setPlaying(true))
    }
  })
}

// basically, a player's operator
// converts declarative store updates into imperative player calls
export function subscribeToStore() {
  const { dispatch, subscribe } = getStore()
  let {
    isReady,
    isPlaying,
    isStreamActive,
    playingTrack,
    requestPosition,
  } = getPlayerState()

  return subscribe(() => {
    const state = getPlayerState()
    // NOTE: the order of operations might be important for now
    // e.g. handling `isReady` is supposed to be the very first operation
    if (isReady !== state.isReady) {
      isReady = state.isReady
      isReady ? preparePlayer() : discardPlayer()
    }

    if (playingTrack !== state.playingTrack) {
      playingTrack = state.playingTrack
      if (!isPlayerAlive()) restorePlayer()

      setPlayingTrack(playingTrack)
    }

    if (isPlaying !== state.isPlaying) {
      isPlaying = state.isPlaying
      if (!isPlayerAlive()) restorePlayer()

      toggleProgressWatcher(isPlaying)
    }

    if (isStreamActive !== state.isStreamActive) {
      isStreamActive = state.isStreamActive
      if (!isPlayerAlive()) restorePlayer()

      togglePlayPause(isStreamActive)
    }

    if (requestPosition !== state.requestPosition) {
      requestPosition = state.requestPosition
      if (!isPlayerAlive()) restorePlayer()

      seekTo(requestPosition)
    }

    console.log('==========================', isPlaying, isStreamActive)

  })
}

export default subscribeToPlayback

// helpers

const getPlayerState = () => getStore().getState().player || {}

const restorePlayer = () => {
  const { dispatch } = getStore()
  dispatch(setReady(true))

  return preparePlayer()
}

let playingSinceTs
let progressWatcherTid
const toggleProgressWatcher = (isOn) => {
  if (!isOn && progressWatcherTid) {
    BackgroundTimer.clearInterval(progressWatcherTid)
    progressWatcherTid = null
    playingSinceTs = null
  }

  if (isOn && !progressWatcherTid) {
    progressWatcherTid = BackgroundTimer.setInterval(putProgressToStore, PROGRESS_UPDATE_EVERY_MS)
    playingSinceTs = new Date()
    putProgressToStore()
  }
}

const putProgressToStore = async () => {
  const { dispatch, getState } = getStore()

  const [duration, position, bufferedPosition] = await Promise.all([
    await TrackPlayer.getDuration(),
    await TrackPlayer.getPosition(),
    await TrackPlayer.getBufferedPosition(),
  ])

  // add custom metric to track how many seconds passed since last play
  const playDuration = playingSinceTs ? (new Date() - playingSinceTs) / 1000 : undefined

  dispatch(updateTrackProgress({ playDuration, duration, position, bufferedPosition }))

  // TODO: find a better place for this!
  const { player: { isStreamActive, playingTrack } } = getState()
  if (isStreamActive && playingTrack) {
    dispatch(keepTrackProgress(playingTrack.id, position))
  }
}
