import React from 'react'
import {FontAwesome} from '@expo/vector-icons'
import {Tabs, useRouter} from 'expo-router'
import {View, ActivityIndicator, Text} from 'react-native'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'

import Colors from '@/constants/Colors'
import {useColorScheme} from '@/hooks/useColorScheme'
import {useClientOnlyValue} from '@/hooks/useClientOnlyValue'
import {useQuery} from 'convex/react'
import {api} from '@/convex/_generated/api'
import {UserRole, AccountStatuses} from '@/convex/schema'
import {useAuth} from '@clerk/clerk-expo'
import {devLog} from '@/utils/devLog'

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={28} style={{marginBottom: -3}} {...props} />
}

const allTabs: {
  name: string
  title: string
  icon: React.ComponentProps<typeof FontAwesome>['name']
  role: UserRole
}[] = [
  // Social Tabs
  {
    name: '(social)/discover',
    title: 'Discover',
    icon: 'compass',
    role: 'social',
  },
  {
    name: '(social)/events',
    title: 'Events',
    icon: 'calendar',
    role: 'social',
  },
  {
    name: '(social)/memory-book',
    title: 'Memory Book',
    icon: 'book',
    role: 'social',
  },
  {
    name: '(social)/social-profile',
    title: 'Profile',
    icon: 'user',
    role: 'social',
  },
  // Host Tabs
  {
    name: '(host)/dashboard',
    title: 'Dashboard',
    icon: 'tachometer',
    role: 'host',
  },
  {name: '(host)/events', title: 'Events', icon: 'calendar', role: 'host'},
  {name: '(host)/inbox', title: 'Inbox', icon: 'inbox', role: 'host'},
  {name: '(host)/host-profile', title: 'Profile', icon: 'user', role: 'host'},
]

export default function TabLayout() {
  devLog('Hot reloading test!')
  const colorScheme = useColorScheme()
  const router = useRouter()
  const user = useQuery(api.user.me)
  const {signOut} = useAuth()
  const headerShown = useClientOnlyValue(false, true)

  if (user === undefined) {
    devLog('[TabLayout] user is undefined, showing loading spinner')
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
        <Text className="mt-4 text-gray-500">
          tabs loadingView (user undefined)
        </Text>
      </View>
    )
  }

  const isHybridUser = !!user?.socialProfile && !!user?.hostProfile
  let effectiveRole: UserRole | null = null

  if (isHybridUser) {
    effectiveRole = user?.active_role || 'social'
    devLog('[TabLayout] Hybrid user detected. effectiveRole:', effectiveRole)
  } else if (user?.socialProfile) {
    effectiveRole = 'social'
    devLog('[TabLayout] Social profile detected. effectiveRole: social')
  } else if (user?.hostProfile) {
    effectiveRole = 'host'
    devLog('[TabLayout] Host profile detected. effectiveRole: host')
  }

  const isPaused = user?.accountStatus === AccountStatuses.PAUSED

  const onSignOutPress = async () => {
    try {
      devLog('[TabLayout] Signing out')
      await signOut()
    } catch (err) {
      devLog('[TabLayout] Error signing out:', err)
      console.error('Error signing out:', err)
    }
  }

  if (!effectiveRole) {
    devLog(
      '[TabLayout] No effectiveRole found. Both profiles missing or user doc issue.',
    )
    // This can happen if user has no profile yet (still in onboarding)
    // or if there is an issue with the user document.
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
        <Text className="mt-4 text-gray-500">
          tabs loadingView (no effectiveRole)
        </Text>
        <Text>
          {
            "No role found (both 'Social' and 'Host' profiles are missing). Please contact support."
          }
        </Text>
      </View>
    )
  }

  devLog(
    '[TabLayout] Rendering tabs for role:',
    effectiveRole,
    'isPaused:',
    isPaused,
  )

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown,
        headerRight: () => (
          <View className="flex-row items-center gap-4 pr-4">
            <Menu>
              <MenuTrigger>
                <View className="flex-row items-center">
                  <FontAwesome
                    name="user-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                  />
                  {isPaused && (
                    <FontAwesome
                      name="exclamation-triangle"
                      size={14}
                      color="gold"
                      style={{position: 'absolute', right: -2, top: -2}}
                    />
                  )}
                </View>
              </MenuTrigger>
              <MenuOptions customStyles={menuOptionsStyles}>
                <MenuOption onSelect={() => router.push('/account')}>
                  <View className="flex-row items-center justify-between px-2.5 py-2.5">
                    <Text className="text-base">Account</Text>
                    {isPaused && (
                      <FontAwesome
                        name="exclamation-triangle"
                        size={16}
                        color="gold"
                      />
                    )}
                  </View>
                </MenuOption>
                <MenuOption onSelect={() => router.push('/settings')}>
                  <Text className="px-2.5 py-2.5 text-base">Settings</Text>
                </MenuOption>
                <View className="my-1 h-px bg-gray-200" />
                <MenuOption onSelect={onSignOutPress}>
                  <Text className="px-2.5 py-2.5 text-base text-red-500">
                    Sign Out
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        ),
      }}>
      {allTabs.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name as string}
          options={{
            title: tab.title,
            tabBarIcon: ({color}) => (
              <TabBarIcon name={tab.icon} color={color} />
            ),
            href: effectiveRole === tab.role ? undefined : null,
          }}
        />
      ))}
      <Tabs.Screen name="account" options={{href: null}} />
      <Tabs.Screen name="settings" options={{href: null}} />
      <Tabs.Screen name="(host)/CreateEvent" options={{href: null}} />
    </Tabs>
  )
}

const menuOptionsStyles = {
  optionsContainer: {
    borderRadius: 10,
    marginTop: 30,
    width: 160,
  },
}
