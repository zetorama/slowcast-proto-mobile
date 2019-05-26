import React from 'react'
import { connect } from 'react-redux'

import { validateTrack } from '../services/tracks'
import { saveEditingTrack, updateEditingTrack } from '../store/library'

import Form from '../components/track-form'
import { PrimaryButton } from '../components/common/form'

export function TracksForm({ editingTrack, saveEditingTrack, updateEditingTrack }) {
  const canSave = validateTrack(editingTrack)

  return (
    <Form track={editingTrack} onTrackUpdate={updateEditingTrack}>
      <PrimaryButton disabled={!canSave} title='Save Track' onPress={saveEditingTrack} />
    </Form>
  )
}

const mapStateToProps = ({ library: { editingTrack } }) => ({
  editingTrack,
})
const mapDispatchToProps = {
  saveEditingTrack,
  updateEditingTrack,
}

export default connect(mapStateToProps, mapDispatchToProps)(TracksForm)
