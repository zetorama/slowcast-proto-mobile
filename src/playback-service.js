import TrackPlayer from 'react-native-track-player'

import {
  isPlayerAlive,
  preparePlayer,
  discardPlayer,
  setPlayingTrack,
  togglePlayPause,
} from './services/player'

import {
  setReady,
  setPlaying,
  setBuffering,
} from './store/player'

import getStore from './store'
const getPlayerState = () => getStore().getState().player || {}

const restorePlayer = () => {
  const { dispatch } = getStore()
  dispatch(setReady(true))

  return preparePlayer()
}

export async function subscribeToPlayback() {
  const { dispatch } = getStore()

  TrackPlayer.addEventListener('playback-state', async ({ state }, ...args) => {
    const label = {
      [TrackPlayer.STATE_NONE]: 'STATE_NONE',
      [TrackPlayer.STATE_READY]: 'STATE_READY',
      [TrackPlayer.STATE_PLAYING]: 'STATE_PLAYING',
      [TrackPlayer.STATE_PAUSED]: 'STATE_PAUSED',
      [TrackPlayer.STATE_STOPPED]: 'STATE_STOPPED',
      [TrackPlayer.STATE_BUFFERING]: 'STATE_BUFFERING',
    }

    console.log('!!!! playback-state !!!', label[state], args)

    dispatch(setBuffering(state === TrackPlayer.STATE_BUFFERING))
  })

  TrackPlayer.addEventListener('remote-play', async (...args) => {
    console.log('!!!! remote-play !!!', args)
    dispatch(setPlaying(true))
  })

  TrackPlayer.addEventListener('remote-pause', async (...args) => {
    console.log('!!!! remote-pause !!!', args)
    dispatch(setPlaying(false))
  })

  TrackPlayer.addEventListener('remote-stop', async (...args) => {
    console.log('!!!! remote-stop !!!', args)
    dispatch(setReady(false))
  })
}

export function subscribeToStore() {
  const { dispatch, subscribe } = getStore()
  let {
    isReady,
    isPlaying,
    playingTrack,
  } = getPlayerState()

  return subscribe((...args) => {
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

      setPlayingTrack({ playingTrack })
    }

    if (isPlaying !== state.isPlaying) {
      isPlaying = state.isPlaying
      if (!isPlayerAlive()) restorePlayer()

      togglePlayPause({ isPlaying })
    }

  })
}

export default subscribeToPlayback
