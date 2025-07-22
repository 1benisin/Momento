import React, {useEffect, useState} from 'react'
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

interface CustomTimePickerProps {
  isVisible: boolean
  onClose: () => void
  value: Date
  onChange: (date: Date) => void
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  isVisible,
  onClose,
  value,
  onChange,
}) => {
  const [hour, setHour] = useState('')
  const [minute, setMinute] = useState('')
  const [isAM, setIsAM] = useState(true)

  useEffect(() => {
    const date = new Date(value)
    let h = date.getHours()
    const m = date.getMinutes()

    const am = h < 12
    setIsAM(am)

    if (h === 0) {
      h = 12 // Midnight case
    } else if (h > 12) {
      h -= 12
    }

    setHour(h.toString())
    setMinute(m.toString().padStart(2, '0'))
  }, [value])

  const handleHourChange = (text: string) => {
    const num = parseInt(text, 10)
    if (text === '' || (num >= 1 && num <= 12)) {
      setHour(text)
    }
  }

  const handleMinuteChange = (text: string) => {
    const num = parseInt(text, 10)
    if (text === '' || (num >= 0 && num <= 59)) {
      setMinute(text)
    }
  }

  const handleDone = () => {
    let h = parseInt(hour, 10) || 0
    const m = parseInt(minute, 10) || 0

    if (!isAM && h !== 12) {
      h += 12
    }
    if (isAM && h === 12) {
      h = 0 // Midnight case
    }

    const newDate = new Date(value)
    newDate.setHours(h, m)
    onChange(newDate)
    onClose()
  }

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[300px] p-5 bg-white rounded-lg items-center">
          <Text className="text-xl font-bold mb-5">Select Time</Text>
          <View className="flex-row items-center mb-5">
            <TextInput
              className="border border-gray-300 rounded-md p-2.5 text-2xl w-16 text-center"
              value={hour}
              onChangeText={handleHourChange}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text className="text-2xl mx-2.5">:</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2.5 text-2xl w-16 text-center"
              value={minute}
              onChangeText={handleMinuteChange}
              keyboardType="number-pad"
              maxLength={2}
            />
            <TouchableOpacity
              onPress={() => setIsAM(!isAM)}
              className="ml-2.5 p-2.5 border border-gray-300 rounded-md">
              <Text className="text-lg font-bold">{isAM ? 'AM' : 'PM'}</Text>
            </TouchableOpacity>
          </View>
          <Pressable
            onPress={handleDone}
            className="bg-blue-500 py-2 px-4 rounded">
            <Text className="text-white font-bold">Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

export default CustomTimePicker
