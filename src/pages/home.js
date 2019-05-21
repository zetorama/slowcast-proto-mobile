import React, { useCallback } from 'react'
import { connect } from 'react-redux'

import { PAGE_TRACKS_ROOT } from '../routes';
import { gotoPage } from '../store/router'
import PlayerScreen from '../components/player-screen'

export function Home({ playingTrack, playingSettings, gotoPage }) {
  const handlePressTrackPicker = useCallback(() => gotoPage(PAGE_TRACKS_ROOT), [gotoPage, PAGE_TRACKS_ROOT])

  return (
    <PlayerScreen
      track={playingTrack}
      settings={playingSettings}
      onPressTrackPicker={handlePressTrackPicker}
    />
  )
}

const mapStateToProps = ({ playingTrack, playingSettings }) => ({
  playingTrack,
  playingSettings,
})

const mapDispatchToProps = {
  gotoPage,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
