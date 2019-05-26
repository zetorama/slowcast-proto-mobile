import React from 'react'
import { connect } from 'react-redux'

import { setEditingTrack, editTrack } from '../store/library'

import List from '../components/track-list'
import { PrimaryButton } from '../components/common/form'

export function TracksList({ tracks, setEditingTrack, editTrack, onPressTrackTitle }) {
  return (
    <List tracks={tracks} onPressIcon={editTrack} onPressTitle={onPressTrackTitle}>
      <PrimaryButton title='Add New Track' onPress={setEditingTrack} />
    </List>
  )
}

const mapStateToProps = ({ library: { tracksRoot } }) => ({
  tracks: tracksRoot,
})
const mapDispatchToProps = {
  setEditingTrack,
  editTrack,
}

export default connect(mapStateToProps, mapDispatchToProps)(TracksList)
