import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { Text, Alert } from 'react-native'

import * as route from '../routes'
import { goBack, goHome } from '../store/router'
import { deleteTrack } from '../store/tracks'
import { selectTrack } from '../store/player'

// TODO: use AppLayout in every component itself
import AppLayout, { Icons } from '../components/app-layout'
import Home from './home'
import TracksList from './tracks-list'
import TracksForm from './tracks-form'

export function Index({
  DEBUG_playerState,
  currentPage,
  editingTrack,
  goHome,
  goBack,
  selectTrack,
  deleteTrack,
  ...props
}) {
  const handleDelete = useCallback(
    () => editingTrack && confirmDelete(editingTrack, deleteTrack),
    [confirmDelete, editingTrack, deleteTrack],
  )

  switch (currentPage) {
    case route.PAGE_ROOT:
      return (
        <AppLayout title='SlowCast Proto'>

          <Text style={{ color: 'red' }}>{`player-state: ${DEBUG_playerState}`}</Text>
          <Home {...props} />
        </AppLayout>
      )

    case route.PAGE_TRACKS_ROOT:
      return (
        <AppLayout title='Tracks List' iconPrimary={Icons.arrowLeft} onPressPrimary={goHome}>
          <TracksList onPressTrackTitle={selectTrack} {...props} />
        </AppLayout>
      )

    case route.PAGE_TRACKS_ADD:
      return (
        <AppLayout title='New Track' iconPrimary={Icons.arrowLeft} onPressPrimary={goBack}>
          <TracksForm {...props} />
        </AppLayout>
      )

    case route.PAGE_TRACKS_EDIT:
      return (
        <AppLayout
          title='Track Edit'
          iconPrimary={Icons.arrowLeft}
          onPressPrimary={goBack}
          iconSecondary={Icons.trash}
          iconSecondaryStyle={{color: 'crimson'}}
          onPressSecondary={handleDelete}
        >
          <TracksForm {...props} />
        </AppLayout>
      )

    default:
      return (
        <AppLayout title='404' iconPrimary={Icons.arrowLeft} onPressPrimary={goBack}>
          <Text style={{ color: 'red' }}>{currentPage} is Not found</Text>
        </AppLayout>
      )
  }
}

const confirmDelete = (track, onConfirm) => Alert.alert(
  'Are you sure?',
  `This will delete track "${track.title}".`,
  [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'OK',
      onPress: () => onConfirm(track),
    },
  ],
  { cancelable: false },
)

const mapStateToProps = ({
  DEBUG_playerState,
  currentPage,
  prevPage,
  editingTrack,
}) => ({
  DEBUG_playerState,
  currentPage,
  prevPage,
  editingTrack,
})
const mapDispatchToProps = {
  selectTrack,
  deleteTrack,
  goHome,
  goBack,
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
