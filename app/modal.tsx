import {Platform, View} from 'react-native'
import {StatusBar} from 'expo-status-bar'

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      {/* TODO: Build the UI for the modal screen */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}
