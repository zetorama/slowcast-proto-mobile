import { PAGE_ROOT } from '../routes'

// Action types
export const PAGE_GO_TO = 'slowcast/router/PAGE_GO_TO'
export const PAGE_GO_HOME = 'slowcast/router/PAGE_GO_HOME'
export const PAGE_GO_BACK = 'slowcast/router/PAGE_GO_BACK'

// Reducer
export default function reducer(state, action) {
  const { type, payload } = action

  switch (type) {
    case PAGE_GO_TO: {
      return {
        ...state,
        currentPage: payload.page,
        prevPage: state.currentPage,
      }
    }

    case PAGE_GO_HOME: {
      return {
        ...state,
        currentPage: PAGE_ROOT,
        prevPage: state.currentPage,
      }
    }

    case PAGE_GO_BACK: {
      if (!state.prevPage || state.prevPage === state.currentPage) {
        return state
      }

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
  type: PAGE_GO_HOME,
})

export const goBack = () => ({
  type: PAGE_GO_BACK,
})
