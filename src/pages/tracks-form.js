import React, { useCallback } from 'react'
import { connect } from 'react-redux'

import confirm from '../utils/confirm'
import { validateTrack } from '../services/tracks'
import { goBack } from '../store/nav'
import { deleteTrack, saveEditingTrack, updateEditingTrack } from '../store/library'

import AppLayout, { Icons } from '../components/app-layout'
import Form from '../components/track-form'
import { PrimaryButton } from '../components/common/form'

export function TracksForm({
  editingTrack,
  goBack,
  deleteTrack,
  saveEditingTrack,
  updateEditingTrack,
}) {
  const handleDelete = useCallback(
    () => editingTrack && confirm({
      title: 'Are you sure?',
      text: `This will delete track "${editingTrack.title}".`,
      onConfirm: () => deleteTrack(editingTrack),
    }),
    [editingTrack, deleteTrack],
  )

  const canSave = validateTrack(editingTrack)
  const isEditing = Boolean(editingTrack.id)

  return (
    <AppLayout
      title={isEditing ? 'Track Info' : 'New Track'}
      iconPrimary={Icons.arrowLeft}
      onPressPrimary={goBack}
      iconSecondary={isEditing ? Icons.trash : undefined}
      iconSecondaryStyle={{ color: 'crimson' }}
      onPressSecondary={isEditing ? handleDelete : undefined}
    >
      <Form track={editingTrack} onTrackUpdate={updateEditingTrack}>
        <PrimaryButton disabled={!canSave} title='Save Track' onPress={saveEditingTrack} />
        </Form>
    </AppLayout>
  )
}

const mapStateToProps = ({
  library: {
    editingTrack,
  },
}) => ({
  editingTrack,
})
const mapDispatchToProps = {
  goBack,
  deleteTrack,
  saveEditingTrack,
  updateEditingTrack,
}

export default connect(mapStateToProps, mapDispatchToProps)(TracksForm)
