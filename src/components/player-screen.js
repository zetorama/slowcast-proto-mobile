import React, { useCallback } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { PrimaryButton, IconButton, Icons, SpinnerField } from './common/form'
import { TrackCard } from './common/track'


const noop = () => { }
const formatTime = (duration) => {
  if (!duration) return `0″`

  const min = Math.floor(duration / 60)
  const sec = parseInt(duration) % 60
  return min ? `${min}′ ${sec}″` : `${sec}″`
}

export function PlayerScreen({
  style,
  track = {},
  progress = {},
  settings = {},
  isPlayerOk = false,
  isPlaying = false,
  isBuffering = false,
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
        disabled={!isPlayerOk || !track.url}
        progress={progress}
        isPlayerOk={isPlayerOk}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        onPressPlay={onPressPlay}
      />

    </View>
  )
}

export function PlayerProgress({
  style,
  disabled,
  isPlayerOk,
  isBuffering,
  isPlaying,
  progress,
  onPressPlay,
}) {
  const playIcon = isPlaying ? Icons.pauseCircle : Icons.playCircle
  const { duration, position = 0 } = progress || {}
  const diskStyle = isBuffering ? styles.diskBuffering : !isPlayerOk ? styles.diskNotOk : ''
  const bufferPercents = duration ? position / duration * 100 : 0
  const progressPercents = duration ? position / duration * 100 : 0

  return (
    <View style={StyleSheet.flatten([styles.playerProgress, style])}>
      <View style={styles.infoPanel}>

        {isBuffering ? (
          <Text style={styles.progressLabel}>
            Buffering…
          </Text>
        ) : Boolean(!disabled && duration) && (
          <Text style={styles.progressLabel}>
            {formatTime(position)} / {formatTime(duration)}
          </Text>
        )}

      </View>
      <View style={styles.progressBar}>
        <View style={StyleSheet.flatten([styles.progressBuffered, { width: `${bufferPercents}%` }])} />

        {Boolean(!disabled && duration) && (
          <View style={StyleSheet.flatten([styles.progressDisk, diskStyle, { left: `${progressPercents}%` }])} />
        )}
      </View>
      <View style={styles.controlsPanel}>
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
    alignItems: 'flex-start',
    height: 2,
    marginLeft: -20,
    marginRight: -20,
    backgroundColor: '#464866',
  },
  progressBuffered: {
    height: 2,
    backgroundColor: '#29648a',
  },
  progressDisk: {
    position: 'absolute',
    top: -3,
    left: '0%', // controlled by component
    width: 9,
    height: 9,
    backgroundColor: '#2e9cca',
    borderRadius: 6,
  },
  diskBuffering: {
    backgroundColor: '#29648a',
  },
  diskNotOk: {
    backgroundColor: '#464866',
  },
  infoPanel: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    minHeight: 60,
    marginLeft: -20,
    marginRight: -20,
    padding: 20,
  },
  controlsPanel: {
    paddingTop: 20,
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
