import React, { useCallback } from 'react'
import { connect } from 'react-redux'

import { PAGE_TRACKS_ROOT } from '../routes'
import { gotoPage } from '../store/nav'
import { updateSettings, togglePlayPause } from '../store/player'
import AppLayout, { Icons } from '../components/app-layout'
import PlayerScreen from '../components/player-screen'

export function Home({
  isPlaying,
  isBuffering,
  playingTrack,
  playingSettings,
  gotoPage,
  togglePlayPause,
  updateSettings ,
}) {
  const handlePressTrackPicker = useCallback(() => gotoPage(PAGE_TRACKS_ROOT), [gotoPage, PAGE_TRACKS_ROOT])

  return (
    <AppLayout title='SlowCast Proto'>
      <PlayerScreen
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        track={playingTrack}
        settings={playingSettings}
        onPressTrackPicker={handlePressTrackPicker}
        onChangeSettings={updateSettings}
        onPressPlay={togglePlayPause}
        />
    </AppLayout>
  )
}

const mapStateToProps = ({
  player: {
    isPlaying,
    isBuffering,
    playingTrack,
    playingSettings,
  },
}) => ({
  isPlaying,
  isBuffering,
  playingTrack,
  playingSettings,
})

const mapDispatchToProps = {
  gotoPage,
  updateSettings,
  togglePlayPause,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
