import React, { useCallback } from 'react'
import { connect } from 'react-redux'

import { PAGE_TRACKS_ROOT } from '../routes'
import { gotoPage } from '../store/router'
import { updateSettings } from '../store/player'
import PlayerScreen from '../components/player-screen'

export function Home({ playingTrack, playingSettings, gotoPage, updateSettings }) {
  const handlePressTrackPicker = useCallback(() => gotoPage(PAGE_TRACKS_ROOT), [gotoPage, PAGE_TRACKS_ROOT])

  return (
    <PlayerScreen
      track={playingTrack}
      settings={playingSettings}
      onPressTrackPicker={handlePressTrackPicker}
      onChangeSettings={updateSettings}
    />
  )
}

const mapStateToProps = ({ playingTrack, playingSettings }) => ({
  playingTrack,
  playingSettings,
})

const mapDispatchToProps = {
  gotoPage,
  updateSettings
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
