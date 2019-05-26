import { Alert } from 'react-native'

export default function confirm({ title, text, onConfirm }) {
  Alert.alert(
    title,
    text,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: onConfirm,
      },
    ],
    { cancelable: false },
  )
}
