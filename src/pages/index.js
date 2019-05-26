import React from 'react'
import { connect } from 'react-redux'

import * as route from '../routes'
import { goBack, goHome } from '../store/nav'

import NotFound from './404'
import Home from './home'
import TracksList from './tracks-list'
import TracksForm from './tracks-form'

export function Index({ currentPage, ...props }) {

  switch (currentPage) {
    case route.PAGE_ROOT:
      return <Home {...props} />

    case route.PAGE_TRACKS_ROOT:
      return <TracksList {...props} />

    case route.PAGE_TRACKS_ADD:
    case route.PAGE_TRACKS_EDIT:
      return <TracksForm {...props} />

    default:
      return <NotFound {...props} />
  }
}


const mapStateToProps = ({
  nav: {
    currentPage,
  },
}) => ({
  currentPage,
})
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
