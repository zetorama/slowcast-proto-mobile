import * as route from '../routes'
import { SELECT_TRACK } from './player'
import {
  TRACK_SAVE_EDITING,
  TRACK_SET_EDITING,
  TRACK_DELETE,
  TRACK_EDIT,
} from './library'

// NOTE: this is a specific (temporary) reducer to handle page transitions on different actions
// TODO: might be better go with some native-navigation and/or redux-saga/redux-loop

const transitions = {
  [route.PAGE_TRACKS_ROOT]: {
    [TRACK_SET_EDITING]: route.PAGE_TRACKS_ADD,
    [TRACK_EDIT]: route.PAGE_TRACKS_EDIT,
    [SELECT_TRACK]: route.PAGE_ROOT,
  },

  [route.PAGE_TRACKS_ADD]: {
    [TRACK_DELETE]: route.PAGE_TRACKS_ROOT,
    [TRACK_SAVE_EDITING]: route.PAGE_TRACKS_ROOT,
  },

  [route.PAGE_TRACKS_EDIT]: {
    [TRACK_DELETE]: route.PAGE_TRACKS_ROOT,
    [TRACK_SAVE_EDITING]: route.PAGE_TRACKS_ROOT,
  },
}

export default function reducer(state, action) {
  const { nav: { currentPage } } = state
  const nextPage = transitions[currentPage] && transitions[currentPage][action.type]

  console.log('*** ACTION ***', action.type, currentPage)

  return !nextPage || nextPage === currentPage ? state : {
    // NOTE: basically, same logic as in `nav/PAGE_GO_TO` reducer
    ...state,
    nav: {
      ...state.nav,
      currentPage: nextPage,
      prevPage: currentPage,
    },
  }
}
