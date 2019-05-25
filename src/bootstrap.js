import TrackPlayer from 'react-native-track-player'
import { subscribeToPlayback, subscribeToStore as bindPlaybackToStore } from './playback-service'

export default async () => {
  TrackPlayer.registerPlaybackService(() => subscribeToPlayback)
  bindPlaybackToStore()
}
