import React, { useCallback } from 'react'
import { connect } from 'react-redux'

import { PAGE_TRACKS_ROOT } from '../routes'
import { gotoPage } from '../store/nav'
import { updateSettings, togglePlayPause, seekTo } from '../store/player'
import AppLayout, { Icons } from '../components/app-layout'
import PlayerScreen from '../components/player-screen'

export function Home({
  isPlayerOk,
  isPlaying,
  isStreamActive,
  isBuffering,
  playingTrack,
  playingSettings,
  trackProgress,
  holdingTimeLeft,
  holdingWaitLeft,
  gotoPage,
  togglePlayPause,
  updateSettings,
  seekTo,
}) {
  const handlePressTrackPicker = useCallback(() => gotoPage(PAGE_TRACKS_ROOT), [gotoPage, PAGE_TRACKS_ROOT])

  return (
    <AppLayout title='SlowCast Proto'>
      <PlayerScreen
        isPlaying={isPlaying}
        isPlayerOk={isPlayerOk}
        isBuffering={isBuffering}
        isHolding={!isStreamActive}
        holdingTimeLeft={holdingTimeLeft}
        holdingWaitLeft={holdingWaitLeft}
        track={playingTrack}
        progress={trackProgress}
        settings={playingSettings}
        onPressTrackPicker={handlePressTrackPicker}
        onChangeSettings={updateSettings}
        onPressPlay={togglePlayPause}
        onChangePosition={seekTo}
      />
    </AppLayout>
  )
}

const mapStateToProps = ({
  player: {
    isPlayerOk,
    isPlaying,
    isStreamActive,
    isBuffering,
    playingTrack,
    playingSettings,
    trackProgress,
    holdingTimeLeft,
    holdingWaitLeft,
  },
}) => ({
  isPlayerOk,
  isPlaying,
  isStreamActive,
  isBuffering,
  playingTrack,
  playingSettings,
  trackProgress,
  holdingTimeLeft,
  holdingWaitLeft,
})

const mapDispatchToProps = {
  gotoPage,
  seekTo,
  updateSettings,
  togglePlayPause,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
