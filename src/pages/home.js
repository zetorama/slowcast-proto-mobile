import React, { useCallback } from 'react'
import { connect } from 'react-redux'

import { PAGE_TRACKS_ROOT } from '../routes'
import { gotoPage } from '../store/nav'
import { updateSettings, togglePlayPause } from '../store/player'
import AppLayout, { Icons } from '../components/app-layout'
import PlayerScreen from '../components/player-screen'

export function Home({
  isPlayerOk,
  isPlaying,
  isBuffering,
  playingTrack,
  playingSettings,
  trackProgress,
  gotoPage,
  togglePlayPause,
  updateSettings,
}) {
  const handlePressTrackPicker = useCallback(() => gotoPage(PAGE_TRACKS_ROOT), [gotoPage, PAGE_TRACKS_ROOT])

  return (
    <AppLayout title='SlowCast Proto'>
      <PlayerScreen
        isPlaying={isPlaying}
        isPlayerOk={isPlayerOk}
        isBuffering={isBuffering}
        track={playingTrack}
        progress={trackProgress}
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
    isPlayerOk,
    isPlaying,
    isBuffering,
    playingTrack,
    playingSettings,
    trackProgress,
  },
}) => ({
  isPlayerOk,
  isPlaying,
  isBuffering,
  playingTrack,
  playingSettings,
  trackProgress,
})

const mapDispatchToProps = {
  gotoPage,
  updateSettings,
  togglePlayPause,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
