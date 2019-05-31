import {
  TRACK_DELETE,
} from './library'

import {
  _handlePlayingReset,
} from './player'

// NOTE: this is a specific reducer to handle situations,
// when library actions affect player and vice versa

export default function reducer(state, action) {
  const { type, payload } = action

  switch (type) {
    // TODO: check if TRACK_SAVE_EDITING updates current playing track,
    // so its metadata can be updated
    // (see https://react-native-kit.github.io/react-native-track-player/documentation/#updatemetadatafortrackid-metadata)

    case TRACK_DELETE: {
      const { id } = payload
      const { playingTrack = {} } = state.player
      if (id !== playingTrack.id) return state

      // stop playback and clear track (mostly, same as player/SET_READY = false)
      return {
        ...state,
        player: {
          ...state.player,

          isReady: false,
          playingTrack: undefined,
          ..._handlePlayingReset(state.player),
        },
      }
    }

    default:
      return state
  }
}
