import React from 'react'
import FaIcon, { Icons } from 'react-native-fontawesome'

import TrackPlayer from 'react-native-track-player'

const STATES = {
  [TrackPlayer.STATE_NONE]: 'STATE_NONE',
  [TrackPlayer.STATE_READY]: 'STATE_READY',
  [TrackPlayer.STATE_PLAYING]: 'STATE_PLAYING',
  [TrackPlayer.STATE_PAUSED]: 'STATE_PAUSED',
  [TrackPlayer.STATE_STOPPED]: 'STATE_STOPPED',
  [TrackPlayer.STATE_BUFFERING]: 'STATE_BUFFERING',
}

class PlayerInfo extends Component {
  state = {}

  componentDidMount() {
    // Adds an event handler for the playback-track-changed event
    this._onPlayerStateChange = TrackPlayer.addEventListener('playback-state', async (data) => {

      const playerState = await TrackPlayer.getState()
      this.setState({ playerState })
      console.log('playback-state', playerState)
    })

    this._onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {

      const track = await TrackPlayer.getTrack(data.nextTrack)
      this.setState({ trackTitle: track.title })
      console.log('playback-track-changed', track)
    })
  }

  componentWillUnmount() {
    // Removes the event handler
    this._onPlayerStateChange.remove()
    this._onTrackChange.remove()
  }

  render() {
    const displayState = this.state.playerState == null ? 'N/A' : STATES[this.state.playerState]

    return (
      <>
        <Text>{this.state.playerState} = {displayState}</Text>
        <Text>{this.state.trackTitle}</Text>
      </>
    )
  }

}


export { Icons }

export function Test({ style = {}, icon = Icons.handSpock }) {

  return (
    <FaIcon style={{ padding: 10, fontSize: 50, ...style }}>
      {icon}
    </FaIcon>
  )
}

export default Test
