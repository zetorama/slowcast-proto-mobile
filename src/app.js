import React, {Component} from 'react'
import {Platform, StyleSheet, Text, View} from 'react-native'
import TrackPlayer from 'react-native-track-player'

import Test from './components/test'

import TrackForm from './components/track-form'
import { PrimaryButton } from './components/common/form'

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

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        {this.renderPage()}
      </View>
    )
  }

  renderPage() {
    const page = '/track/add'

    if (page === '/track/add') {
      return (
        <TrackForm>
          <PrimaryButton title='Add Track' />
        </TrackForm>
      )
    }

    // default = home page
    return (
      <>
        <Test style={{ color: 'red' }} />
        <Text style={styles.welcome}>Welcome to React Native!</Text>

        <PlayerInfo />
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'red',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})
