import React from 'react'
import { connect } from 'react-redux'

import { addTrack, editTrack } from '../store/tracks'

import List from '../components/track-list'
import { PrimaryButton } from '../components/common/form'

export function TracksList({ tracks, addTrack, editTrack, onPressTrackTitle }) {
  return (
    <List tracks={tracks} onPressIcon={editTrack} onPressTitle={onPressTrackTitle}>
      <PrimaryButton title='Add New Track' onPress={addTrack} />
    </List>
  )
}

const mapStateToProps = ({ tracks }) => ({
  tracks,
})
const mapDispatchToProps = {
  addTrack,
  editTrack,
}

export default connect(mapStateToProps, mapDispatchToProps)(TracksList)
