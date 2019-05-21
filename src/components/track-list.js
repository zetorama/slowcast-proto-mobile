import React, { useCallback } from 'react'
import { StyleSheet, View, Text, SectionList } from 'react-native'

import { TrackCard, Icons } from './common/track'

const noop = () => { }

const mapTracksOntoSections = tracks => tracks.reduce((all, one) => {
  if (!all.has(one.artist)) {
    all.set(one.artist, {
      title: one.artist,
      data: [],
    })
  }

  all.get(one.artist).data.push(one)
  return all
}, new Map())

const sortByTitle = (a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1

export function TrackList({
  style,
  tracks = [],
  icon = Icons.infoCircle,
  onPressIcon = noop,
  onPressTitle = noop,
  children,
}) {
  const sectionsMap = mapTracksOntoSections(tracks)
  const sortedSections = Array.from(sectionsMap.values()).sort(sortByTitle)

  const hasChildren = Boolean(Array.isArray(children) ? children.length : children)

  return (
    <View style={StyleSheet.flatten(styles.container, style)}>
      <SectionList
        style={styles.listIndex}
        sections={sortedSections}
        keyExtractor={({ id }, _index) => id}
        renderItem={({ item: track }) => (
          <TrackCard
            key={track.id}
            style={styles.sectionItem}
            hideArtist={true}
            track={track}
            icon={icon}
            onPressIcon={() => onPressIcon(track)}
            onPressTitle={() => onPressTitle(track)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text key={title} style={styles.sectionTitle}>{title}</Text>
        )}
      />
      {hasChildren && (
        <View style={styles.listChildren}>
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
  sectionTitle: {
    marginTop: 10,
    backgroundColor: '#464866',
    color: '#aaabbb',
  },
  sectionItem: {
  },
  listIndex: {
    flex: 1,
  },
  listChildren: {
  },
})

export default TrackList
