import React from 'react'
import { StyleSheet, Text, View, TextInput, Button } from 'react-native'

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

export function PrimaryButton({ style, ...buttonProps }) {
  return (
    <Button style={StyleSheet.flatten([styles.primaryButton, style])} {...buttonProps} />
  )
}

export const styles = StyleSheet.create({
  label: {
    color: '#aaa',
  },
  field: {
    alignItems: 'stretch',
    marginBottom: 5,
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#aaa',
    backgroundColor: '#fff',
  },
  primaryButton: {
    // NOTE: these styles don't make sense for `<Button/>` component
    // color: 'blue'
  },
})

export default {
  Field,
  TextField,
  PrimaryButton,
}
