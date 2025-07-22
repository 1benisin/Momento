'use client'

import type React from 'react'
import {useState} from 'react'
import {Pressable, Text, TextInput, View} from 'react-native'
import {Eye, EyeOff} from 'lucide-react-native'

interface AuthInputProps {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  secureTextEntry?: boolean
  error?: string
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  autoComplete?: string
  autoCorrect?: boolean
  maxLength?: number
  onBlur?: () => void
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  autoCorrect = false,
  maxLength,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View className="mb-4 w-full">
      <Text className="mb-1 font-['Inter'] text-[#F8F6F1] text-sm">
        {label}
      </Text>
      <View className="relative">
        <TextInput
          accessibilityLabel={label}
          className="w-full bg-black border border-[#333333] rounded-md px-4 py-3 text-[#F8F6F1] font-['Inter'] focus:border-[#D4AF37]"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#666666"
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete as 'one-time-code' | 'email' | 'tel'}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          onBlur={onBlur}
        />
        {secureTextEntry && (
          <Pressable
            className="absolute right-3 top-3"
            onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={20} color="#F8F6F1" />
            ) : (
              <Eye size={20} color="#F8F6F1" />
            )}
          </Pressable>
        )}
      </View>
      {error && (
        <Text className="mt-1 text-[#8B2635] text-xs font-['Inter']">
          {error}
        </Text>
      )}
    </View>
  )
}
