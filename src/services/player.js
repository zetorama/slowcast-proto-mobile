import TrackPlayer from 'react-native-track-player'
import createQueue from '../utils/queue'

// All player API calls should use shared Q
const Q = createQueue()

// Player init/destroy
let _isPlayerReady = false
const _switchPlayerReadiness = (isOn) => isOn === _isPlayerReady ? false : (_isPlayerReady = isOn, true)
export const isPlayerAlive = () => _isPlayerReady

export async function discardPlayer() {
  if (!_switchPlayerReadiness(false)) return

  return Q.enqueue(
    () => console.log('>>> discardPlayer...go'),
    () => TrackPlayer.destroy(),
    () => console.log('>>> discardPlayer...done'),
  )
}

export async function preparePlayer() {
  if (!_switchPlayerReadiness(true)) return

  return Q.enqueue(
    () => console.log('>>> preparePlayer...go'),
    () => TrackPlayer.setupPlayer(),
    () => TrackPlayer.updateOptions({
      // doc: https://react-native-kit.github.io/react-native-track-player/documentation/#updateoptionsoptions
      color: '#25274d',

      // jumpInterval: 15,

      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
      ],

      // short notification buttons on Android
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE
      ],
    }),
    () => console.log('>>> preparePlayer...done'),
  )
}

export async function setPlayingTrack(playingTrack) {
  console.log('>>> setPlayingTrack', playingTrack)

  if (!isPlayerAlive()) {
    throw new Error('Player must be ready to set track')
  }

  return Q.enqueue(
    () => TrackPlayer.reset(),
    () => playingTrack ? TrackPlayer.add([playingTrack]) : {},
  )
}

export async function togglePlayPause(isPlaying) {
  console.log('>>> togglePlayPause', isPlaying)

  if (!isPlayerAlive()) {
    throw new Error('Player must be ready to toggle play/pause')
  }

  return Q.enqueue(
    () => isPlaying ? TrackPlayer.play() : TrackPlayer.pause(),
  )
}

export async function seekTo(position) {
  console.log('>>> seekTo', position)

  if (!isPlayerAlive()) {
    throw new Error('Player must be ready to toggle play/pause')
  }

  return Q.enqueue(
    () => TrackPlayer.seekTo(position),
  )

}
