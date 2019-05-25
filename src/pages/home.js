import React, { useCallback } from 'react'
import { connect } from 'react-redux'

import { PAGE_TRACKS_ROOT } from '../routes'
import { gotoPage } from '../store/router'
import { updateSettings, togglePlayPause } from '../store/player'
import PlayerScreen from '../components/player-screen'

export function Home({
  isPlaying,
  isLoading,
  playingTrack,
  playingSettings,
  gotoPage,
  togglePlayPause,
  updateSettings ,
}) {
  const handlePressTrackPicker = useCallback(() => gotoPage(PAGE_TRACKS_ROOT), [gotoPage, PAGE_TRACKS_ROOT])

  return (
    <PlayerScreen
      isPlaying={isPlaying}
      isLoading={isLoading}
      track={playingTrack}
      settings={playingSettings}
      onPressTrackPicker={handlePressTrackPicker}
      onChangeSettings={updateSettings}
      onPressPlay={togglePlayPause}
    />
  )
}

const mapStateToProps = ({
  isPlaying,
  isLoading,
  playingTrack,
  playingSettings,
}) => ({
  isPlaying,
  isLoading,
  playingTrack,
  playingSettings,
})

const mapDispatchToProps = {
  gotoPage,
  updateSettings,
  togglePlayPause,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
