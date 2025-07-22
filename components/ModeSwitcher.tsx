import React from 'react'
import {Text, TouchableOpacity, View, useColorScheme} from 'react-native'
import Colors from '@/constants/Colors'
import {UserRole} from '@/convex/schema'

interface ModeSwitcherProps {
  currentRole: UserRole
  onRoleChange: (role: UserRole) => void
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  currentRole,
  onRoleChange,
}) => {
  const colorScheme = useColorScheme() ?? 'light'
  const tintColor = Colors[colorScheme].tint
  const selectedTextColor =
    colorScheme === 'light' ? Colors.dark.text : Colors.light.text

  return (
    <View
      className="flex-row rounded-lg border overflow-hidden my-5 mx-5"
      style={{borderColor: tintColor}}>
      <TouchableOpacity
        className={`flex-1 py-3 items-center justify-center ${
          currentRole === 'social' ? '' : 'bg-transparent'
        }`}
        style={currentRole === 'social' && {backgroundColor: tintColor}}
        onPress={() => onRoleChange('social')}
        activeOpacity={0.7}>
        <Text
          className="text-base font-semibold"
          style={{
            color:
              currentRole === 'social'
                ? selectedTextColor
                : Colors[colorScheme].text,
          }}>
          Social
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 py-3 items-center justify-center ${
          currentRole === 'host' ? '' : 'bg-transparent'
        }`}
        style={currentRole === 'host' && {backgroundColor: tintColor}}
        onPress={() => onRoleChange('host')}
        activeOpacity={0.7}>
        <Text
          className="text-base font-semibold"
          style={{
            color:
              currentRole === 'host'
                ? selectedTextColor
                : Colors[colorScheme].text,
          }}>
          Host
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ModeSwitcher
