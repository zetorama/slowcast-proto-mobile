import React, { useCallback } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import FaIcon, { Icons } from 'react-native-fontawesome'

export { Icons }

const noop = () => {}

export function Field({ fieldStyle, label, children }) {
  return (
    <View style={StyleSheet.flatten([styles.field, fieldStyle])}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  )
}

export function TextField({ label, fieldStyle, style, ...inputProps }) {
  return (
    <Field label={label} fieldStyle={fieldStyle}>
      <TextInput style={StyleSheet.flatten([styles.textInput, style])} {...inputProps} />
    </Field>
  )
}

export function SpinnerField({
  label,
  fieldStyle,
  style,
  value,
  step = 1,
  min = -Infinity,
  max = Infinity,
  onPressSpinner = noop,
  keyboardType = 'numeric',
  ...inputProps
}) {
  const decValue = typeof value === 'number' && value - step >= min ? value - step : null
  const incValue = typeof value === 'number' && value + step <= max ? value + step : null
  const handlePressMinus = useCallback(
    () => decValue != null && onPressSpinner(decValue),
    [onPressSpinner, decValue],
  )
  const handlePressPlus = useCallback(
    () => incValue != null && onPressSpinner(incValue),
    [onPressSpinner, incValue],
  )

  return (
    <Field label={label} fieldStyle={fieldStyle}>
      <View style={styles.spinnerRow}>
        <IconButton
          style={styles.spinnerButton}
          iconStyle={styles.spinnerButtonIcon}
          icon={Icons.minus}
          onPress={handlePressMinus}
        />
        <TextInput
          style={StyleSheet.flatten([styles.spinnerInput, style])}
          value={String(value)}
          keyboardType={keyboardType}
          editable={false}
          {...inputProps}
        />
        <IconButton
          style={styles.spinnerButton}
          iconStyle={styles.spinnerButtonIcon}
          icon={Icons.plus}
          onPress={handlePressPlus}
        />
      </View>
    </Field>
  )
}

export function IconButton({ style, iconStyle, icon, disabled, ...touchableProps }) {
  return (
    <TouchableNativeFeedback disabled={disabled} {...touchableProps}>
      <View style={StyleSheet.flatten([styles.iconButton, style])}>
        <FaIcon style={[disabled && styles.disabledButtonText, iconStyle]}>{icon}</FaIcon>
      </View>
    </TouchableNativeFeedback>
  )
}

export function PrimaryButton({ style, titleStyle, title, disabled, ...touchableProps }) {
  return (
    <TouchableNativeFeedback disabled={disabled} {...touchableProps}>
      <View style={StyleSheet.flatten([styles.primaryButton, disabled && styles.disabledButton, style])}>
        <Text style={StyleSheet.flatten([styles.primaryButtonText, disabled && styles.disabledButtonText, titleStyle])}>
          {title}
        </Text>
      </View>
    </TouchableNativeFeedback>
  )
}

export const styles = StyleSheet.create({
  label: {
    marginBottom: 3,
    fontWeight: 'bold',
    color: '#29648a',
  },
  field: {
    alignItems: 'stretch',
    marginBottom: 10,
  },
  spinnerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  spinnerInput: {
    flex: 2,
    padding: 3,
    borderRadius: 2,
    backgroundColor: '#f0ebf4',
    textAlign: 'center',
  },
  spinnerButtonIcon: {
    color: '#f0ebf4',
  },
  spinnerButton: {
    flex: 1,
    padding: 3,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#29648a',
  },
  textInput: {
    padding: 10,
    borderRadius: 2,
    backgroundColor: '#f0ebf4',
  },
  iconButton: {
  },
  primaryButton: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2e9cca',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#464866',
  },
  disabledButtonText: {
    color: '#aaabbb',
  },
})

export default {
  Field,
  SpinnerField,
  TextField,
  IconButton,
  PrimaryButton,
}
