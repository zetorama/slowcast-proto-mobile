import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

import { IconButton, Icons } from './common/form'

export { Icons }

export function AppLayout({
  style,
  headerStyle,
  title,
  titleTextStyle,
  onPressTitle,
  iconPrimary,
  iconPrimaryStyle,
  onPressPrimary,
  iconSecondary,
  onPressSecondary,
  iconSecondaryStyle,
  children,
}) {
  const hasHeader = Boolean(iconPrimary || iconSecondary || title)

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      {hasHeader && (
        <View style={StyleSheet.flatten([styles.header, headerStyle])}>
          {iconPrimary && (
            <IconButton
              style={styles.headerIcon}
              iconStyle={StyleSheet.flatten([styles.headerIconText, iconPrimaryStyle])}
              icon={iconPrimary}
              onPress={onPressPrimary}
            />
          )}
          {title && (
            <TouchableOpacity style={styles.headerTitle} disabled={!onPressTitle} onPress={onPressTitle}>
              {/* <View> */}
                <Text style={StyleSheet.flatten([styles.headerTitleText, titleTextStyle])}>{title}</Text>
              {/* </View> */}
            </TouchableOpacity>
          )}
          {iconSecondary && (
            <IconButton
              style={styles.headerIcon}
              iconStyle={StyleSheet.flatten([styles.headerIconText, iconSecondaryStyle])}
              icon={iconSecondary}
              onPress={onPressSecondary}
            />
          )}
        </View>
      )}

      {children}
    </View>
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#25274d',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: '#464866',
    padding: 10,
    minHeight: 60,
    margin: -20,
    marginBottom: 0,
  },
  headerIcon: {
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 5,
  },
  headerIconText: {
    fontSize: 20,
  },
  headerTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    textAlign: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f0ebf4',
    textAlign: 'center',
  },
})


export default AppLayout
