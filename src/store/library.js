// NOTE: structure based on https://github.com/erikras/ducks-modular-redux

// Default state (thanks to hoisting, keeping it on top for a quick reference)
reducer.getInitialState = () => ({
  tracksRoot: [
    // TODO: support hierarchy, e.g.:
    // {
    //   listKey: '123',
    //   listTitle: 'Random podcast',
    //   meta: {
    //     type: 'rss',
    //     url: 'http://...',
    //   },
    //   tracks: [],
    // },

    ...require('./__tracks__.json'),
  ],
  editingTrack: undefined,
})

// Action types
export const TRACK_EDIT = 'slowcast/library/TRACK_EDIT'
export const TRACK_DELETE = 'slowcast/library/TRACK_DELETE'
export const TRACK_SET_EDITING = 'slowcast/library/TRACK_SET_EDITING'
export const TRACK_UPDATE_EDITING = 'slowcast/library/TRACK_UPDATE_EDITING'
export const TRACK_KEEP_PROGRESS = 'slowcast/library/TRACK_KEEP_PROGRESS'
export const TRACK_SAVE_EDITING = 'slowcast/library/TRACK_SAVE_EDITING'

// Reducer
const getNextId = (tracksRoot) => (Math.max(0, ...tracksRoot.map(one => one.id))) + 1
const matcherById = (id, inverse = false) => track => inverse ^ (track.id === id)

export default function reducer(state = reducer.getInitialState(), action) {
  const { type, payload } = action

  switch (type) {
    case TRACK_EDIT: {
      const track = state.tracksRoot.find(matcherById(payload.id))
      if (!track) {
        throw new Error(`Cannot edit track with unknown id ${payload.id}`)
      }
      if (state.editingTrack && state.editingTrack.id === track.id) return state

      return {
        ...state,
        editingTrack: { ...track },
      }
    }

    case TRACK_DELETE: {
      const tracksRoot = state.tracksRoot.filter(matcherById(payload.id, true))
      if (tracksRoot.length === state.tracksRoot.length) return state

      const { editingTrack } = state
      return {
        ...state,
        tracksRoot,
        editingTrack: editingTrack && editingTrack.id === payload.id ? undefined : editingTrack,
      }
    }

    case TRACK_KEEP_PROGRESS: {
      const { id, progress } = payload
      const { tracksRoot } = state
      const track = tracksRoot.find(matcherById(id))
      if (!track) {
        throw new Error(`Cannot keep progress of track with unknown id ${payload.id}`)
      }

      return {
        ...state,
        tracksRoot: tracksRoot.map(one => one.id !== id ? one : { ...track, progress }),
      }
    }

    case TRACK_SET_EDITING: {
      const { editingTrack } = payload
      if (editingTrack === state.editingTrack) return state

      return {
        ...state,
        editingTrack: { ...editingTrack },
      }
    }

    case TRACK_UPDATE_EDITING: {
      const { editingTrack } = payload
      if (editingTrack === state.editingTrack) return state

      return {
        ...state,
        editingTrack: { ...state.editingTrack, ...editingTrack },
      }
    }

    case TRACK_SAVE_EDITING: {
      if (!state.editingTrack) return state

      const { editingTrack, tracksRoot } = state
      const original = editingTrack.id ? tracksRoot.find(matcherById(editingTrack.id)) : undefined
      const track = original
        ? { ...original, ...editingTrack }
        : { ...editingTrack, id: getNextId(tracksRoot) }

      return {
        ...state,
        editingTrack: undefined,
        tracksRoot: original
          ? tracksRoot.map(one => one.id !== original.id ? one : track)
          : [...tracksRoot, track],
      }
    }

    default:
      return state
  }
}

// Actions
export const editTrack = ({ id }) => ({
  type: TRACK_EDIT,
  payload: { id },
})

export const deleteTrack = ({ id }) => ({
  type: TRACK_DELETE,
  payload: { id },
})

export const keepTrackProgress = (id, progress) => ({
  type: TRACK_KEEP_PROGRESS,
  payload: { id, progress },
})

export const setEditingTrack = (editingTrack = {}) => ({
  type: TRACK_SET_EDITING,
  payload: { editingTrack },
})

export const updateEditingTrack = (editingTrack) => ({
  type: TRACK_UPDATE_EDITING,
  payload: { editingTrack },
})

export const saveEditingTrack = () => ({
  type: TRACK_SAVE_EDITING,
})
