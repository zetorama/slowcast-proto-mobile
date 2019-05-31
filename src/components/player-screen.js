import React, { useCallback } from 'react'
import { StyleSheet, View, Text, TouchableNativeFeedback, Dimensions } from 'react-native'

import { PrimaryButton, IconButton, Icons, SpinnerField } from './common/form'
import { TrackCard } from './common/track'


const noop = () => { }
const formatTime = (duration) => {
  if (!duration) return `0″`

  const min = Math.floor(duration / 60)
  const sec = parseInt(duration) % 60
  return min ? `${min}′ ${sec}″` : `${sec}″`
}

// TODO: OMG! So many props passing! refactor?
export function PlayerScreen({
  style,
  track = {},
  progress = {},
  settings = {},
  isPlayerOk = false,
  isPlaying = false,
  isBuffering = false,
  isHolding = false,
  playerErrors = [],
  holdingTimeLeft,
  holdingWaitLeft,
  onPressTrackPicker,
  onChangeSettings,
  onChangePosition,
  onPressPlay,
  onPressAckError = noop,
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

      <PlayerErrors errors={playerErrors} onPressAckError={onPressAckError} />

      <PlayerProgress
        style={styles.screenProgress}
        disabled={!isPlayerOk || !track.url}
        progress={progress}
        settings={settings}
        isPlayerOk={isPlayerOk}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        isHolding={isHolding}
        holdingTimeLeft={holdingTimeLeft}
        holdingWaitLeft={holdingWaitLeft}
        onPressPlay={onPressPlay}
        onChangePosition={onChangePosition}
      />

    </View>
  )
}

export function PlayerErrors({ errors, onPressAckError }) {
  const errorIndex = errors.findIndex(one => !one.isAck)
  if (!~errorIndex) return null

  const { code, message } = errors[errorIndex]
  const handleAck = useCallback(() => onPressAckError(errorIndex), [onPressAckError, errorIndex])

  return (
    <View style={styles.error}>
      <Text style={styles.errorText}>{code}: {message}</Text>
      <PrimaryButton small title='Dismiss' onPress={handleAck} />
    </View>
  )
}

export function PlayerProgress({
  style,
  disabled,
  isPlayerOk,
  isBuffering,
  isPlaying,
  isHolding,
  holdingTimeLeft,
  holdingWaitLeft,
  progress,
  settings,
  onPressPlay,
  onChangePosition,
}) {
  const playIcon = isPlaying ? Icons.pauseCircle : Icons.playCircle
  const { duration = 0, position = 0 } = progress || {}
  const diskStyle = isBuffering ? styles.diskBuffering : !isPlayerOk ? styles.diskNotOk : ''
  const bufferPercents = position > 0 ? position / duration * 100 : 0
  const progressPercents = position > 0 ? position / duration * 100 : 0
  const hasProgress = !disabled && position > 0

  const totalParts = Math.ceil(progress.duration / (settings.talkTime * 60))
  const currentPart = Math.ceil(progress.position / (settings.talkTime * 60))

  const onPressProgress = useCallback((ev) => {
    const { width } = Dimensions.get('window')
    const x = ev.nativeEvent.locationX

    const requestPosition = x / width * duration
    return onChangePosition(requestPosition)
  }, [onChangePosition, duration])

  const skip20Forward = useCallback(() => onChangePosition(position + 20), [onChangePosition, position])
  const skip20Backward = useCallback(() => onChangePosition(position - 20), [onChangePosition, position])
  const jumpForward = useCallback(() => onChangePosition(position, true), [onChangePosition, position])
  const jumpBackward = useCallback(
    () => onChangePosition(position - (settings.talkTime * 60), true),
    [onChangePosition, position, settings.talkTime],
  )

  return (
    <View style={StyleSheet.flatten([styles.playerProgress, style])}>
      <View style={styles.infoPanel}>

        {!hasProgress && isBuffering ? (
          <View style={styles.progressLabel}>
            <Text style={styles.progressLabelText}>
              Buffering…
            </Text>
          </View>

        ) : hasProgress && (
          <>
            <View style={styles.progressLabel}>
              <Text style={styles.progressLabelText}>
                {formatTime(position)} / {formatTime(duration)}
              </Text>
            </View>

            {isBuffering ? (
              <PrimaryButton title={`Buffering…`} disabled small style={styles.progressBadge} />
            ) : isPlaying && isHolding && holdingTimeLeft > 0 ? (
              <PrimaryButton title={`HOLD: ${formatTime(holdingTimeLeft)}`} disabled small style={styles.holdingLeft} />
            ) : (
              <PrimaryButton title={`TALK: ${formatTime(holdingWaitLeft)}`} disabled small style={styles.holdingLeft} />
            )}

            <View style={styles.progressLabel}>
              <Text style={styles.progressLabelText}>
                ch.{currentPart} / {totalParts}
              </Text>
            </View>
          </>
        )}

      </View>
      <TouchableNativeFeedback disabled={!isPlaying} onPress={onPressProgress}>
        <View style={styles.progressPanel}>
          <View style={styles.progressBar}>
            <View style={StyleSheet.flatten([styles.progressBuffered, { width: `${bufferPercents}%` }])} />

            {isPlaying && hasProgress && (
              <View style={StyleSheet.flatten([styles.progressDisk, diskStyle, { left: `${progressPercents}%` }])} />
              )}
          </View>
        </View>
      </TouchableNativeFeedback>
      <View style={styles.controlsPanel}>
        {isPlaying && hasProgress && (isHolding ? (
          <IconButton
            icon={Icons.stepBackward}
            iconStyle={styles.skipIcon}
            onPress={jumpBackward}
          />
        ) : (
          <IconButton
            icon={Icons.chevronCircleLeft}
            iconStyle={styles.skipIcon}
            onPress={skip20Backward}
          />
        ))}

        <IconButton
          icon={playIcon}
          disabled={disabled}
          iconStyle={!disabled ? styles.playIcon : styles.playIconDisabled}
          onPress={onPressPlay}
        />

        {isPlaying && hasProgress && (isHolding ? (
          <IconButton
            icon={Icons.stepForward}
            iconStyle={styles.skipIcon}
            onPress={jumpForward}
          />
        ) : (
          <IconButton
            icon={Icons.chevronCircleRight}
            iconStyle={styles.skipIcon}
            onPress={skip20Forward}
          />
        ))}

      </View>

    </View>
  )
}

export function PlayerSettings({ style, settings, onChangeSettings = noop }) {
  const handleChangeTalkTime = useCallback(talkTime => onChangeSettings({ talkTime }), [onChangeSettings])
  const handleChangeHoldTime = useCallback(holdTime => onChangeSettings({ holdTime }), [onChangeSettings])
  const handleChangeRecurTime = useCallback(recurTime => onChangeSettings({ recurTime }), [onChangeSettings])

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
          value={settings.talkTime || 0}
          min={1}
          onPressSpinner={handleChangeTalkTime}
        />
        <SpinnerField
          fieldStyle={styles.rowField}
          style={styles.settingInput}
          label='HOLD, min'
          value={settings.holdTime || 0}
          min={1}
          onPressSpinner={handleChangeHoldTime}
        />
        <SpinnerField
          fieldStyle={styles.rowField}
          style={styles.settingInput}
          label='RECUR, sec'
          value={settings.recurTime || 0}
          min={0}
          step={5}
          onPressSpinner={handleChangeRecurTime}
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

  error: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    maxWidth: '80%',
    color: 'orangered',
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
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: 60,
    paddingBottom: 10,
  },
  progressPanel: {
    marginLeft: -20,
    marginRight: -20,
    height: 20,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  controlsPanel: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  skipIcon: {
    fontSize: 40,
    color: '#2e9cca',
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLabelText: {
    fontSize: 16,
    color: '#29648a',
  },
  progressBadge: {
    flex: 1,
  },
  holdingLeft: {
    minWidth: 100,
  }
})

export default PlayerScreen
