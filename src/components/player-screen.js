import React, { useCallback } from 'react'
import { StyleSheet, View, Text, Alert } from 'react-native'

import { PrimaryButton, IconButton, Icons, SpinnerField } from './common/form'
import { TrackCard } from './common/track'


const noop = () => { }

export function PlayerScreen({
  style,
  track = {},
  progress = {},
  settings = {},
  isPlaying = false,
  onPressTrackPicker,
  onChangeSettings,
  onPressPlay,
}) {

  return (
    <View style={StyleSheet.flatten(styles.playerScreen, style)}>
      <TrackCard
        style={styles.screenTrack}
        track={track}
        icon={Icons.fileImport}
        onPressIcon={onPressTrackPicker}
      />

      <PlayerSettings
        style={styles.screenSettings}
        settings={settings}
        onChangeSettings={onChangeSettings}
      />

      <PlayerProgress
        style={styles.screenProgress}
        disabled={!Boolean(track.url)}
        progress={progress}
        isPlaying={isPlaying}
        onPressPlay={onPressPlay}
      />

    </View>
  )
}

export function PlayerProgress({
  style,
  disabled,
  isPlaying,
  progress,
  onPressPlay,
}) {
  const playIcon = isPlaying ? Icons.pauseCircle : Icons.playCircle
  const { duration, position = 0 } = progress

  return (
    <View style={StyleSheet.flatten([styles.playerProgress, style])}>
      {!disabled && duration && (
        <View style={styles.progressBar}>
          <Text style={styles.progressLabel}>
            {position}/{duration} s
          </Text>
        </View>
      )}
      <View style={styles.controlsBar}>
        <IconButton
          icon={playIcon}
          disabled={disabled}
          iconStyle={!disabled ? styles.playIcon : styles.playIconDisabled}
          onPress={onPressPlay}
        />
      </View>

    </View>
  )
}

export function PlayerSettings({ style, settings, onChangeSettings = noop }) {
  const handleChangeTalkTime = useCallback(talkTime => onChangeSettings({ talkTime }), [onChangeSettings])
  const handleChangeHoldTime = useCallback(holdTime => onChangeSettings({ holdTime }), [onChangeSettings])
  const handleChangeFadeTime = useCallback(fadeTime => onChangeSettings({ fadeTime }), [onChangeSettings])

  return (
    <View style={StyleSheet.flatten([styles.playerSettings, style])}>

      <View style={styles.rowEven}>
        <PrimaryButton title='Chapters' disabled />
        <PrimaryButton title='Timings' />
      </View>

      <View style={styles.rowDistant}>
        <SpinnerField
          fieldStyle={styles.rowField}
          style={styles.settingInput}
          label='TALK, min'
          value={settings.talkTime}
          min={0}
          onPressSpinner={handleChangeTalkTime}
        />
        <SpinnerField
          fieldStyle={styles.rowField}
          style={styles.settingInput}
          label='HOLD, min'
          value={settings.holdTime}
          min={0}
          onPressSpinner={handleChangeHoldTime}
        />
        <SpinnerField
          fieldStyle={styles.rowField}
          style={styles.settingInput}
          label='FADE, sec'
          value={settings.fadeTime}
          min={0}
          step={5}
          onPressSpinner={handleChangeFadeTime}
        />
      </View>

    </View>
  )
}

export const styles = StyleSheet.create({
  playerScreen: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  screenTrack: {
  },
  screenSettings: {
    justifyContent: 'center',
  },
  screenProgress: {
  },

  playerSettings: {
    flex: 1,
  },
  rowEven: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  rowDistant: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowField: {
    width: '30%',
    alignItems: 'center',
  },
  settingInput: {
    fontWeight: 'bold',
    color: '#2e9cca',
    // backgroundColor: 'transparent',
  },

  playerProgress: {
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
  controlsBar: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
  playIcon: {
    fontSize: 72,
    color: '#2e9cca',
  },
  playIconDisabled: {
    fontSize: 72,
    color: '#464866',
  },
  progressLabel: {
    fontSize: 16,
    color: '#29648a',
  },
})

export default PlayerScreen
