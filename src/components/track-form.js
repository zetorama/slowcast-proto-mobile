import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'

import { TextField } from './common/form'

const noop = () => { }

export function TrackForm({ style, track = {}, onTrackUpdate = noop, children }) {
  const handleChangeUrl = useCallback(value => onTrackUpdate('url', value), [onTrackUpdate])
  const handleChangeTitle = useCallback(value => onTrackUpdate('title', value), [onTrackUpdate])
  const handleChangeArtist = useCallback(value => onTrackUpdate('artist', value), [onTrackUpdate])

  const hasChildren = Boolean(Array.isArray(children) ? children.length : children)

  return (
    <View style={StyleSheet.flatten(styles.container, style)}>
      <View style={styles.formFieldset}>
        <TextField
          label='URL'
          placeholder='Path to mp3'
          value={track.url}
          onChangeText={handleChangeUrl}
        />

        <View style={styles.row}>
          <TextField
            fieldStyle={styles.rowField}
            style={styles.infoInput}
            label='ID'
            editable={false}
            value={track.id || '—'}
          />
          <TextField
            fieldStyle={styles.rowField}
            style={styles.infoInput}
            label='Size'
            editable={false}
            value={track.size || '—'}
          />
          <TextField
            fieldStyle={styles.rowField}
            style={styles.infoInput}
            label='Time'
            editable={false}
            value={track.time || '—'}
          />
        </View>

        <TextField
          label='Title'
          placeholder='Episode #42: The meaning of life'
          value={track.title}
          onChangeText={handleChangeTitle}
        />
        <TextField
          label='Artist'
          placeholder='Podcast about everything'
          value={track.artist}
          onChangeText={handleChangeArtist}
        />
        <TextField
          label='Chapters'
          placeholder={['0:00 Hello', '1:22 Discuss subject', '1:25 Joke of the day', '6:66 […]'].join('\n')}
          multiline
          numberOfLines={4}
          editable={false}
        />
      </View>

      {hasChildren && (
        <View style={styles.formChildren}>
          {children}
        </View>
      )}

    </View>
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowField: {
    width: '30%',
  },
  infoInput: {
    textAlign: 'center',
  },
  formFieldset: {
    flex: 1,
  },
  formChildren: {
  },
})

export default TrackForm
