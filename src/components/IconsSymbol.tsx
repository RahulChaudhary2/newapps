// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import {
	OpaqueColorValue,
	type StyleProp,
	type TextProps,
	type TextStyle,
} from 'react-native';

type IconMapping = Record<
	SymbolViewProps['name'],
	ComponentProps<typeof MaterialIcons>['name']
>;
type IconSymbolName = keyof typeof MAPPING;

export type IconSymbolProps = TextProps & {
	name: IconSymbolName;
	size?: number;
	color: string | OpaqueColorValue;
	style?: StyleProp<TextStyle>;
	weight?: SymbolWeight;
};

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
	'house.fill': 'home', // home
	'globe.europe.africa.fill': 'explore', // discover
	magnifyingglass: 'search', // search
	'bookmark.fill': 'bookmark', // saved - filled bookmark
	bookmark: 'bookmark-border', // saved - empty bookmark
	'person.crop.circle.fill': 'person', // profile

	// existing mappings
	'paperplane.fill': 'send',
	'chevron.left.forwardslash.chevron.right': 'chevron-left',
	'chevron.right': 'chevron-right',
	'chevron.left': 'chevron-left',
	'newspaper.fill': 'article',
	'heart.fill': 'favorite',
	'eye.fill': 'visibility',

	// search related icons
	'xmark.circle.fill': 'cancel',
	clock: 'history',
	'flame.fill': 'whatshot',
	trash: 'delete', // trash/delete icon
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
	name,
	size = 24,
	color,
	style,
	...rest
}: IconSymbolProps) {
	return (
		<MaterialIcons
			color={color}
			size={size}
			name={MAPPING[name]}
			style={style}
			{...rest}
		/>
	);
}
