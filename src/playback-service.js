import TrackPlayer from 'react-native-track-player'

import getStore from './store'

const STATES = {
  [TrackPlayer.STATE_NONE]: 'STATE_NONE',
  [TrackPlayer.STATE_READY]: 'STATE_READY',
  [TrackPlayer.STATE_PLAYING]: 'STATE_PLAYING',
  [TrackPlayer.STATE_PAUSED]: 'STATE_PAUSED',
  [TrackPlayer.STATE_STOPPED]: 'STATE_STOPPED',
  [TrackPlayer.STATE_BUFFERING]: 'STATE_BUFFERING',
}

export async function subscribeToPlayback() {

  const store = getStore()
  subscribeToStore(store)

  TrackPlayer.addEventListener('playback-state', async ({ state }) => {
    console.log('!!!! playback-state !!!', state, STATES[state])
  })

}

export function subscribeToStore(store) {
  let { isPlaying, playingTrack } = store.getState()

  return store.subscribe(() => {
    const state = store.getState()

    if (playingTrack !== state.playingTrack) {
      playingTrack = state.playingTrack
      setPlayingTrack(playingTrack)
    }

    if (isPlaying !== state.isPlaying) {
      isPlaying = state.isPlaying
      triggerPlayPause(isPlaying)
    }

  })
}

export default subscribeToPlayback

// methods
let Q = Promise.resolve()
const enqueue = (callback) => (Q = Q.then(callback).catch(err => console.error(err)))

const setPlayingTrack = (track) => {
  console.log('!!!! setPlayingTrack', track)

  enqueue(() => TrackPlayer.reset())
  enqueue(() => TrackPlayer.add([track]))
}

const triggerPlayPause = (isPlaying) => {
  console.log('!!!! triggerPlayPause', isPlaying)

  enqueue(() => isPlaying ? TrackPlayer.play() : TrackPlayer.pause())
}
