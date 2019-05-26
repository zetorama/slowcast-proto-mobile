import React from 'react'
import { connect } from 'react-redux'
import { Text } from 'react-native'

import { goBack } from '../store/nav'
import AppLayout, { Icons } from '../components/app-layout'

export function NotFound({ title = '404', onPressBack = goBack, currentPage }) {
  return (
    <AppLayout title={title} iconPrimary={Icons.arrowLeft} onPressPrimary={onPressBack}>
      <Text style={{ color: 'red' }}>{currentPage} is Not found</Text>
    </AppLayout>
  )
}

const mapStateToProps = ({ nav: { currentPage } }) => ({
  currentPage,
})
const mapDispatchToProps = {
  goBack,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotFound)
