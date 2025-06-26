import { IconSymbol } from '@/components/IconsSymbol';
import Loading from '@/components/Loading';
import { ArticleStorage } from '@/utils/articleUtils';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function NewsDetailsScreen() {
	const { id } = useLocalSearchParams();
	const [article, setArticle] = useState<Article | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaved, setIsSaved] = useState(false);

	useEffect(() => {
		loadArticle();
	}, [id]);

	const loadArticle = async () => {
		if (!id || typeof id !== 'string') {
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);

			// Try to find the article in cache
			const cachedArticle = await ArticleStorage.findCachedArticle(id);

			if (cachedArticle) {
				setArticle(cachedArticle);

				// Check if article is saved
				const savedStatus = await ArticleStorage.isArticleSaved(id);
				setIsSaved(savedStatus);
			} else {
				// Article not found in cache
				Alert.alert('Error', 'Article not found or expired');
				router.back();
			}
		} catch (error) {
			console.error('Error loading article:', error);
			Alert.alert('Error', 'Failed to load article');
			router.back();
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		router.back();
	};

	const handleBookmarkToggle = async () => {
		if (!article || !id || typeof id !== 'string') return;

		try {
			if (isSaved) {
				await ArticleStorage.unsaveArticle(id);
				setIsSaved(false);
			} else {
				await ArticleStorage.saveArticle(id);
				setIsSaved(true);
			}
		} catch (error) {
			console.error('Error toggling bookmark:', error);
			Alert.alert('Error', 'Failed to update bookmark');
		}
	};

	if (isLoading) {
		return (
			<SafeAreaView className='flex-1 bg-white dark:bg-black'>
				<Loading />
			</SafeAreaView>
		);
	}

	if (!article) {
		return (
			<SafeAreaView className='flex-1 bg-white dark:bg-black'>
				<View className='flex-1 justify-center items-center'>
					<Text className='text-lg text-gray-500 dark:text-gray-400'>
						Article not found
					</Text>
					<TouchableOpacity
						onPress={handleBack}
						className='mt-4 px-6 py-2 bg-blue-500 rounded-lg'
					>
						<Text className='text-white font-medium'>Go Back</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className='flex-1 bg-white relative dark:bg-black '>
			<View className='flex-row items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'>
				<TouchableOpacity
					onPress={handleBack}
					className='p-2 bg-gray-100 dark:bg-gray-800 rounded-full'
				>
					<IconSymbol name='chevron.left' size={24} color='gray' />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleBookmarkToggle}
					className={`p-2 rounded-full ${
						isSaved
							? 'bg-green-100 dark:bg-green-900'
							: 'bg-gray-100 dark:bg-gray-800'
					}`}
				>
					<IconSymbol
						name={isSaved ? 'bookmark.fill' : 'bookmark'}
						size={24}
						color={isSaved ? 'green' : 'gray'}
					/>
				</TouchableOpacity>
			</View>

			<WebView source={{ uri: article.url }} className='flex-1 ' />
		</SafeAreaView>
	);
}
