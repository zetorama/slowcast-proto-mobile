import React from 'react'
import { connect } from 'react-redux'

import { goHome } from '../store/nav'
import { selectTrack } from '../store/player'
import { setEditingTrack, editTrack } from '../store/library'

import AppLayout, { Icons } from '../components/app-layout'
import List from '../components/track-list'
import { PrimaryButton } from '../components/common/form'

export function TracksList({ tracks, goHome, setEditingTrack, editTrack, selectTrack }) {
  return (
    <AppLayout title='Tracks List' iconPrimary={Icons.arrowLeft} onPressPrimary={goHome}>
      <List tracks={tracks} onPressIcon={editTrack} onPressTitle={selectTrack}>
        <PrimaryButton title='Add New Track' onPress={setEditingTrack} />
        </List>
    </AppLayout>
  )
}

const mapStateToProps = ({ library: { tracksRoot } }) => ({
  tracks: tracksRoot,
})
const mapDispatchToProps = {
  setEditingTrack,
  editTrack,
  selectTrack,
  goHome,
}

export default connect(mapStateToProps, mapDispatchToProps)(TracksList)
