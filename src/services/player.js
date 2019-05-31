import TrackPlayer from 'react-native-track-player'
import createQueue from '../utils/queue'
import animate from '../utils/animate'

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
    () => playingTrack ? TrackPlayer.add([playingTrack]) : undefined,
    () => playingTrack && playingTrack.progress ? TrackPlayer.seekTo(playingTrack.progress) : undefined,
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

let volumeAnimation = null
export async function changeVolume({ level, from = null, fadeTime = 0 }) {
  volumeAnimation && volumeAnimation.cancel()

  if (!fadeTime) {
    return Q.enqueue(
      () => TrackPlayer.setVolume(level),
    )
  }

  if (from == null) {
    await Q.enqueue(
      async () => (from = await TrackPlayer.getVolume()),
    )
  }

  if (from === level) {
    return Q.enqueue(
      () => TrackPlayer.setVolume(level),
    )
  }

  return Q.enqueue(
    () => {
      const steps = Math.round(fadeTime / 100)
      const speed = (level - from) / fadeTime
      let current = from
      volumeAnimation = animate(fadeTime, steps, async (dt) => {
        current += speed * dt
        return TrackPlayer.setVolume(Math.max(0, Math.min(1, current)))
      })

      return volumeAnimation.then(
        () => {
          volumeAnimation = null
          return TrackPlayer.setVolume(level)
        },
        (err) => {
          if (err !== 'cancel') {
            console.error('Cannot animate volume', err)
          }
        }
      )
    }
  )


}
