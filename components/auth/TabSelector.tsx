import type React from 'react'
import {View, Text, Pressable} from 'react-native'

interface TabSelectorProps {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <View className="flex-row mb-6 border-b border-[#333333]">
      {tabs.map(tab => (
        <Pressable
          key={tab}
          className={`flex-1 py-3 ${activeTab === tab ? 'border-b-2 border-[#D4AF37]' : ''}`}
          onPress={() => onTabChange(tab)}>
          <Text
            className={`text-center font-['Inter'] ${
              activeTab === tab
                ? 'text-[#D4AF37] font-medium'
                : 'text-[#F8F6F1]'
            }`}>
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}
