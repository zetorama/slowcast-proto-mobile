import TrackPlayer from 'react-native-track-player'

import getStore from './store'
import {
  setPlaying,
  setLoading,
  selectTrack,
  DEBUG_setPlayerState,
} from './store/player'

const STATE_LABEL = {
  [TrackPlayer.STATE_NONE]: 'STATE_NONE',
  [TrackPlayer.STATE_READY]: 'STATE_READY',
  [TrackPlayer.STATE_PLAYING]: 'STATE_PLAYING',
  [TrackPlayer.STATE_PAUSED]: 'STATE_PAUSED',
  [TrackPlayer.STATE_STOPPED]: 'STATE_STOPPED',
  [TrackPlayer.STATE_BUFFERING]: 'STATE_BUFFERING',
}

export async function subscribeToPlayback() {
  const store = getStore()

  TrackPlayer.addEventListener('playback-state', async ({ state }, ...args) => {
    console.log('!!!! playback-state !!!', state, STATE_LABEL[state], args)
    const action = DEBUG_setPlayerState(STATE_LABEL[state])
    store.dispatch(action)

    store.dispatch(setLoading(state === TrackPlayer.STATE_BUFFERING))
  })

  TrackPlayer.addEventListener('remote-play', async (...args) => {
    console.log('!!!! remote-play !!!', args)
    store.dispatch(setPlaying(true))
  })

  TrackPlayer.addEventListener('remote-pause', async (...args) => {
    console.log('!!!! remote-pause !!!', args)
    store.dispatch(setPlaying(false))
  })

  TrackPlayer.addEventListener('remote-stop', async (...args) => {
    console.log('!!!! remote-stop !!!', args)
    discardPlayer()
    store.dispatch(setPlaying(false))
  })
}

export function subscribeToStore() {
  const store = getStore()
  let { isPlaying, playingTrack } = store.getState()

  return store.subscribe(() => {
    const state = store.getState()

    if (playingTrack !== state.playingTrack) {
      playingTrack = state.playingTrack
      setPlayingTrack({ playingTrack }, store.dispatch)
    }

    if (isPlaying !== state.isPlaying) {
      isPlaying = state.isPlaying
      togglePlayPause({ isPlaying }, store.dispatch)
    }

  })
}

// methods
// All player API calls should use shared Q
let Q = Promise.resolve()
export const enqueue = (callback) => (Q = Q.then(callback).catch(err => console.error(err)))

// Player init/destroy
let isPlayerReady = false
export const isPlayerAlive = () => isPlayerReady

export function discardPlayer() {
  if (!isPlayerReady) return Promise.resolve()

  isPlayerReady = false
  enqueue(() => TrackPlayer.destroy())
}

export function preparePlayer() {
  if (isPlayerReady) return Promise.resolve()

  isPlayerReady = true
  enqueue(initializePlayer)
  enqueue(() => {
    const store = getStore()
    const { playingTrack } = store.getState()
    if (playingTrack) {
      setPlayingTrack({ playingTrack }, store.dispatch)
    }
  })
}

export async function initializePlayer() {
  console.log('>>> initializePlayer...')
  await TrackPlayer.setupPlayer()
  await TrackPlayer.updateOptions({
    // doc: https://react-native-kit.github.io/react-native-track-player/documentation/#updateoptionsoptions
    color: '#25274d',

    // jumpInterval: 15,

    capabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_STOP,
    ],

    // An array of capabilities that will show up when the notification is in the compact form on Android
    compactCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE
    ],
  })

  console.log('>>> initializePlayer...done')
}

const setPlayingTrack = ({ playingTrack }, dispatch) => {
  console.log('>>> setPlayingTrack', playingTrack)
  preparePlayer()

  enqueue(() => TrackPlayer.reset())
  enqueue(() => TrackPlayer.add([playingTrack]))
  dispatch(selectTrack(playingTrack))
}

const togglePlayPause = ({ isPlaying }, dispatch) => {
  console.log('>>> togglePlayPause', isPlaying)
  // check if nothing to do
  if (!isPlaying && !isPlayerAlive()) return

  preparePlayer()

  enqueue(() => isPlaying ? TrackPlayer.play() : TrackPlayer.pause())
  dispatch(setPlaying(isPlaying))
}

export default subscribeToPlayback
