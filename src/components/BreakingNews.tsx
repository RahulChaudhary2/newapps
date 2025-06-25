import React from 'react';
import { Dimensions, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import BreakingNewsCard from './BreakingNewsCard';

const { width } = Dimensions.get('window');

type Props = {
	data: Article[];
};

export default function BreakingNewsCarousel({ data }: Props) {
	return (
		<View className='mb-6'>
			<Carousel
				width={width - 20}
				height={200}
				autoPlay
				autoPlayInterval={3000}
				data={data}
				loop
				scrollAnimationDuration={1000}
				style={{
					width: width,
					alignItems: 'center',
				}}
				pagingEnabled
				snapEnabled
				mode='parallax'
				modeConfig={{
					parallaxScrollingScale: 0.9,
					parallaxScrollingOffset: 50,
				}}
				renderItem={({ item }) => <BreakingNewsCard item={item} />}
			/>
		</View>
	);
}
