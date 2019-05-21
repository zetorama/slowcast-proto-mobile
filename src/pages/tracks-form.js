import React from 'react'
import { connect } from 'react-redux'

import { saveEditingTrack, changeEditingTrack, _validateTrack } from '../store/tracks'

import Form from '../components/track-form'
import { PrimaryButton } from '../components/common/form'

export function TracksForm({ editingTrack, saveEditingTrack, changeEditingTrack }) {
  const canSave = _validateTrack(editingTrack)

  return (
    <Form track={editingTrack} onTrackUpdate={changeEditingTrack}>
      <PrimaryButton disabled={!canSave} title='Save Track' onPress={saveEditingTrack} />
    </Form>
  )
}

const mapStateToProps = ({ editingTrack }) => ({
  editingTrack,
})
const mapDispatchToProps = {
  saveEditingTrack,
  changeEditingTrack,
}

export default connect(mapStateToProps, mapDispatchToProps)(TracksForm)
