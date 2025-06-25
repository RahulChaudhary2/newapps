import { ArticleStorage } from '@/utils/articleUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
	item: Article;
};

export default function BreakingNewsCard({ item }: Props) {
	const handlePress = async () => {
		// Cache the article for offline access
		await ArticleStorage.cacheArticle(item);

		// Navigate to news detail screen using article ID
		const articleId = ArticleStorage.generateArticleId(item);
		router.push(`/news/${articleId}`);
	};

	return (
		<TouchableOpacity
			className='items-center justify-center mx-2'
			onPress={handlePress}
			activeOpacity={0.8}
		>
			<Image
				source={{
					uri: item.urlToImage || 'https://via.placeholder.com/150',
				}}
				className='w-full h-[200px]'
				resizeMode='cover'
				style={{
					borderRadius: 16,
				}}
			/>

			<LinearGradient
				colors={['transparent', 'rgba(0,0,0,0.9)']}
				className='absolute w-full h-[200px] justify-end px-4 py-4'
				style={{
					borderRadius: 16,
				}}
			>
				<View className='mb-1'>
					<Text className='text-white font-semibold text-xs opacity-80'>
						{item.source.name}
					</Text>
				</View>
				<Text
					numberOfLines={3}
					className='text-white font-bold text-lg leading-6'
				>
					{item.title}
				</Text>
				<Text className='text-white text-xs opacity-70 mt-1'>
					{new Date(item.publishedAt).toLocaleDateString()}
				</Text>
			</LinearGradient>
		</TouchableOpacity>
	);
}
