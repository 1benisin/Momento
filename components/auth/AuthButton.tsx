import type React from 'react'
import {ActivityIndicator, Pressable, Text, View} from 'react-native'

interface AuthButtonProps {
  title: string
  onPress: () => void
  isLoading?: boolean
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  variant = 'primary',
  disabled = false,
}) => {
  const isPrimary = variant === 'primary'

  return (
    <Pressable
      className={`w-full py-3 rounded-md flex-row justify-center items-center ${
        isPrimary ? 'bg-[#D4AF37]' : 'bg-transparent border border-[#D4AF37]'
      } ${disabled || isLoading ? 'opacity-50' : 'opacity-100'}`}
      onPress={onPress}
      disabled={disabled || isLoading}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? '#000000' : '#D4AF37'}
        />
      ) : (
        <Text
          className={`font-['Inter'] font-medium text-base ${isPrimary ? 'text-black' : 'text-[#D4AF37]'}`}>
          {title}
        </Text>
      )}
    </Pressable>
  )
}
