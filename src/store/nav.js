import { PAGE_ROOT } from '../routes'
// NOTE: structure based on https://github.com/erikras/ducks-modular-redux

// Default state (thanks to hoisting, keeping it on top for a quick reference)
reducer.getInitialState = () => ({
  currentPage: PAGE_ROOT, // TODO: derivative from `history[currentHistoryIndex]`
  prevPage: undefined,
  // currentHistoryIndex: 0,
  // history: [PAGE_ROOT],
})

// Action types
export const PAGE_GO_TO = 'slowcast/nav/PAGE_GO_TO'
export const PAGE_GO_BACK = 'slowcast/nav/PAGE_GO_BACK'
// export const PAGE_GO_FORWARD = 'slowcast/nav/PAGE_GO_FORWARD'

// Reducer
export default function reducer(state = reducer.getInitialState(), action) {
  const { type, payload } = action

  switch (type) {
    case PAGE_GO_TO: {
      const { page: currentPage } = payload
      if (currentPage === state.currentPage) return state

      return {
        ...state,
        currentPage,
        prevPage: state.currentPage,
      }
    }

    case PAGE_GO_BACK: {
      // TODO: switch to history array?
      if (!state.prevPage) return state

      return {
        ...state,
        currentPage: state.prevPage,
        prevPage: null,
      }
    }

    default:
      return state
  }
}

// Actions
export const gotoPage = (page) => ({
  type: PAGE_GO_TO,
  payload: { page },
})

export const goHome = () => ({
  type: PAGE_GO_TO,
  payload: { page: PAGE_ROOT },
})

export const goBack = (n = 1) => ({
  type: PAGE_GO_BACK,
  payload: { n }
})

// export const goForward = (n = 1) => ({
//   type: PAGE_GO_BACK,
//   payload: { n }
// })
