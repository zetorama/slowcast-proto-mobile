import React, { useCallback } from 'react'
import { connect } from 'react-redux'

import { BackHandler } from 'react-native'
import { getPersistor } from '../store'

import { PAGE_TRACKS_ROOT } from '../routes'
import { gotoPage } from '../store/nav'
import { updateSettings, togglePlayPause, seekTo, ackPlayerError } from '../store/player'
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
  playerErrors,
  holdingTimeLeft,
  holdingWaitLeft,
  gotoPage,
  togglePlayPause,
  updateSettings,
  seekTo,
  ackPlayerError,
}) {
  const handlePressTrackPicker = useCallback(() => gotoPage(PAGE_TRACKS_ROOT), [gotoPage, PAGE_TRACKS_ROOT])

  // TEMP: hook to purge store
  if (playingTrack && playingTrack.title === 'PURGE') {
    getPersistor().purge().then(() => BackHandler.exitApp()).catch(err => console.log('PURGE failed', err))
  }

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
        playerErrors={playerErrors}
        onPressAckError={ackPlayerError}
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
    playerErrors,
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
  playerErrors,
})

const mapDispatchToProps = {
  gotoPage,
  seekTo,
  updateSettings,
  togglePlayPause,
  ackPlayerError,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
