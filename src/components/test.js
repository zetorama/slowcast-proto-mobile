import React from 'react'
import FaIcon, { Icons } from 'react-native-fontawesome'

export { Icons }

export function Test({ style = {}, icon = Icons.handSpock }) {

  return (
    <FaIcon style={{ padding: 10, fontSize: 50, ...style }}>
      {icon}
    </FaIcon>
  )
}

export default Test
