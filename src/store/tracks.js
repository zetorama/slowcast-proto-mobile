import { PAGE_TRACKS_ADD, PAGE_TRACKS_EDIT } from '../routes'

// NOTE: structure by https://github.com/erikras/ducks-modular-redux

// Action types
export const TRACK_ADD = 'slowcast/tracks/TRACK_ADD'
export const TRACK_EDIT = 'slowcast/tracks/TRACK_EDIT'
export const TRACK_UPDATE_EDITING = 'slowcast/tracks/TRACK_UPDATE_EDITING'
export const TRACK_SAVE_EDITING = 'slowcast/tracks/TRACK_SAVE_EDITING'
export const TRACK_DELETE = 'slowcast/tracks/TRACK_DELETE'

// Reducer
const getNextId = (tracks) => (Math.max(0, ...tracks.map(one => one.id))) + 1

export default function reducer(state, action) {
  const { type, payload } = action

  switch (type) {
    case TRACK_ADD: {
      return {
        ...state,
        currentPage: PAGE_TRACKS_ADD,
        prevPage: state.currentPage,

        editingTrack: { ...payload.track },
      }
    }

    case TRACK_EDIT: {
      const track = state.tracks.find(one => one.id === payload.id)
      if (!track) {
        throw new Error(`Cannot edit track with id ${payload.id}`)
      }
      return {
        ...state,
        currentPage: PAGE_TRACKS_EDIT,
        prevPage: state.currentPage,

        editingTrack: { ...track },
      }
    }

    case TRACK_DELETE: {
      const tracks = state.tracks.filter(one => one.id !== payload.id)
      return {
        ...state,
        currentPage: state.prevPage,
        prevPage: null,

        editingTrack: null,
        tracks,
      }
    }

    case TRACK_UPDATE_EDITING: {
      return {
        ...state,
        editingTrack: { ...state.editingTrack, ...payload.track },
      }
    }

    case TRACK_SAVE_EDITING: {
      if (!state.editingTrack) {
        return state
      }

      const { id } = state.editingTrack
      const original = id ? state.tracks.find(one => one.id === id) : {}
      const tracks = id ? state.tracks.filter(one => one.id !== id) : state.tracks.slice()

      return {
        ...state,
        currentPage: state.prevPage,
        prevPage: null,

        editingTrack: null,
        tracks: tracks.concat({
          ...original,
          ...state.editingTrack,
          id: id || getNextId(tracks),
        }),
      }
    }

    default:
      return state
  }
}

// Actions
export const addTrack = (track = {}) => ({
  type: TRACK_ADD,
  payload: { track },
})

export const editTrack = ({ id }) => ({
  type: TRACK_EDIT,
  payload: { id },
})

export const changeEditingTrack = (track) => ({
  type: TRACK_UPDATE_EDITING,
  payload: { track },
})

export const saveEditingTrack = () => ({
  type: TRACK_SAVE_EDITING,
})

export const deleteTrack = ({ id }) => ({
  type: TRACK_DELETE,
  payload: { id },
})

// Extra helpers / side-effects
export const _validateTrack = (track) => Boolean(track.url && track.title && track.artist)
