import React, { Component, useState } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'

import PlayerScreen from './components/player-screen'
import TrackList from './components/track-list'
import TrackForm from './components/track-form'
import { PrimaryButton } from './components/common/form'

const tracks = [
  { id: 1, artist: 'Foo bar', title: 'Hello World' },
  { id: 2, artist: 'AAA', title: 'aaa' },
  { id: 3, artist: 'ZZZ', title: 'yo!' },
  { id: 4, artist: 'AAA', title: 'bbb' },
]

const PAGE = {
  DEFAULT: '/',
  TRACK_LIST: '/tracks',
  TRACK_ADD: '/tracks/add',
}

export function App(props) {
  return (
    <View style={styles.container}>
      <AppPage {...props} />
    </View>
  )
}

export function AppPage(props) {
  const [page, setPage] = useState('/')

  if (page === PAGE.TRACK_LIST) {
    return (
      <TrackList tracks={tracks}>
        <PrimaryButton title='Add New Track' onPress={() => setPage(PAGE.TRACK_ADD)} />
      </TrackList>
    )
  }
  else if (page === PAGE.TRACK_ADD) {
    return (
      <TrackForm>
        <PrimaryButton title='Save Track' onPress={() => setPage(PAGE.DEFAULT)} />
      </TrackForm>
    )
  }

  // default = home page
  return (
    <PlayerScreen
      track={tracks[0]}
      onPressTrackPicker={() => setPage(PAGE.TRACK_LIST)}
    />
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#25274d',
    padding: 20,
  },
})

export default App
