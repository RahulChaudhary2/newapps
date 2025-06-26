import { IconSymbol } from '@/components/IconsSymbol';
import { Tabs } from 'expo-router';
import {  useColorScheme } from 'nativewind';

export default function TabsLayout() {

	const {colorScheme} = useColorScheme()

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: '#e91e63',
				tabBarInactiveTintColor: '#8e8e93',
				tabBarStyle: {
					backgroundColor: colorScheme === 'dark' ? '#121212' : '#ffffff',
					borderTopWidth: 0,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '600',
				}
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					tabBarIcon: ({ focused }) => (
						<IconSymbol
							name='house.fill'
							size={26}
							color={focused ? 'green' : 'gray'}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='discover'
				options={{
					title: 'Discover',
					tabBarIcon: ({ focused }) => (
						<IconSymbol
							name='globe.europe.africa.fill'
							size={26}
							color={focused ? 'green' : 'gray'}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='search'
				options={{
					title: 'Search',
					tabBarIcon: ({ focused }) => (
						<IconSymbol
							name='magnifyingglass'
							size={26}
							color={focused ? 'green' : 'gray'}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='saved'
				options={{
					title: 'Saved',
					tabBarIcon: ({ focused }) => (
						<IconSymbol
							name='bookmark.fill'
							size={26}
							color={focused ? 'green' : 'gray'}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
