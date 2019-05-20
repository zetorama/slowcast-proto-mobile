import React, { useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { IconButton, Icons } from './form'

export { Icons }

const noop = () => {}

export function TrackCard({
  style,
  track = {},
  icon = Icons.bars,
  onPressTitle = noop,
  onPressIcon = noop,
  hideArtist = false,
}) {
  const handlePressIcon = useCallback(() => onPressIcon(), [onPressIcon])
  const handlePressTitle = useCallback(() => onPressTitle(), [onPressTitle])

  return (
    <View style={StyleSheet.flatten([styles.card, style])}>
      {hideArtist || (
        <Text style={styles.cardArtist}>{track.artist || ' '}</Text>
      )}
      <TouchableOpacity disabled={onPressTitle === noop} onPress={handlePressTitle}>
        <Text style={styles.cardTitle}>{track.title || 'No track'}</Text>
      </TouchableOpacity>
      {icon && (
        <IconButton
          icon={icon}
          iconStyle={styles.cardIcon}
          style={styles.cardIconButton}
          onPress={handlePressIcon}
        />
      )}
    </View>
  )
}

export const styles = StyleSheet.create({
  card: {
    paddingRight: 30,
  },
  cardArtist: {
    fontWeight: 'bold',
    color: '#29648a',
  },
  cardTitle: {
    fontSize: 36,
    color: '#2e9cca',
  },
  cardIconButton: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    padding: 5,
  },
  cardIcon: {
    fontSize: 30,
    color: '#2e9cca',
  },
})

export default {
  TrackCard,
}
