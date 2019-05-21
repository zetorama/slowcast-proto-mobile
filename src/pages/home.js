import React, { useCallback } from 'react'
import { connect } from 'react-redux'

import { PAGE_TRACKS_ROOT } from '../routes'
import { gotoPage } from '../store/router'
import { updateSettings, togglePlay } from '../store/player'
import PlayerScreen from '../components/player-screen'

export function Home({ isPlaying, playingTrack, playingSettings, gotoPage, togglePlay, updateSettings }) {
  const handlePressTrackPicker = useCallback(() => gotoPage(PAGE_TRACKS_ROOT), [gotoPage, PAGE_TRACKS_ROOT])

  return (
    <PlayerScreen
      isPlaying={isPlaying}
      track={playingTrack}
      settings={playingSettings}
      onPressTrackPicker={handlePressTrackPicker}
      onChangeSettings={updateSettings}
      onPressPlay={togglePlay}
    />
  )
}

const mapStateToProps = ({ isPlaying, playingTrack, playingSettings }) => ({
  isPlaying,
  playingTrack,
  playingSettings,
})

const mapDispatchToProps = {
  gotoPage,
  updateSettings,
  togglePlay,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
