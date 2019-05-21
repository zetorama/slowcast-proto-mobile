import TrackPlayer from 'react-native-track-player'
import { subscribeToPlayback } from './playback-service'

const track = {
  id: 1,
  // via http://songexploder.net/u2
  title: 'EPISODE 42: U2',
  artist: 'Song Exploder',
  url: 'https://dts.podtrac.com/redirect.mp3/dovetail.prxu.org/song-exploder/957d8cb0-ca64-4d1a-b761-63408a077009/SongExploder42-U2-DT.mp3',

  pitchAlgorithm: TrackPlayer.PITCH_ALGORITHM_VOICE,
}

export default async () => {
  TrackPlayer.registerPlaybackService(() => subscribeToPlayback)
  TrackPlayer.setupPlayer()

  // try {

  //   console.log('>>> setupPlayer')
  //   await TrackPlayer.setupPlayer()

  //   console.log('>>> add tracks')
  //   await TrackPlayer.add([track])
  //   console.log('>>> added!')

  //   console.log('>>> play!!!')
  //   TrackPlayer.play()
  // } catch (err) {
  //   console.error('!!! ERR')
  //   console.error(err)
  // }

}
