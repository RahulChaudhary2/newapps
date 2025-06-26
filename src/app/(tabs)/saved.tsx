import { IconSymbol } from '@/components/IconsSymbol';
import Loading from '@/components/Loading';
import { ArticleStorage, formatDate } from '@/utils/articleUtils';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
	FlatList,
	Image,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SavedScreen() {
	const [savedArticles, setSavedArticles] = useState<Article[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	useFocusEffect(
		useCallback(() => {
			loadSavedArticles();
		}, [])
	);

	const loadSavedArticles = async () => {
		try {
			setIsLoading(true);
			const articles = await ArticleStorage.getSavedArticles();
			setSavedArticles(articles);
		} catch (error) {
			console.error('Error loading saved articles:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await loadSavedArticles();
		setRefreshing(false);
	};

	const handleRemoveFromSaved = async (article: Article) => {
		try {
			const articleId = ArticleStorage.generateArticleId(article);
			await ArticleStorage.unsaveArticle(articleId);
			setSavedArticles((prev) =>
				prev.filter(
					(a) => ArticleStorage.generateArticleId(a) !== articleId
				)
			);
		} catch (error) {
			console.error('Error removing from saved:', error);
		}
	};

	const handleArticlePress = async (article: Article) => {
		try {
			// Ensure article is cached before navigating
			await ArticleStorage.cacheArticle(article);
			const articleId = ArticleStorage.generateArticleId(article);
			router.push(`/news/${articleId}`);
		} catch (error) {
			console.error('Error navigating to article:', error);
		}
	};

	const renderSavedArticle = ({ item }: { item: Article }) => (
		<TouchableOpacity
			className='mb-4 mx-2 rounded-xl'
			onPress={() => handleArticlePress(item)}
			activeOpacity={0.7}
		>
			<View className='flex-row overflow-hidden rounded-xl relative'>
				<Image
					source={{
						uri:
							item.urlToImage ||
							'https://via.placeholder.com/150',
					}}
					className='w-28 h-28 rounded-xl'
					resizeMode='cover'
				/>
				<View className='flex-1 px-3 py-2 justify-center'>
					<Text
						className='text-sm font-semibold text-black dark:text-white'
						numberOfLines={2}
					>
						{item.title}
					</Text>
					<Text
						className='text-xs text-gray-600 dark:text-gray-300 my-2'
						numberOfLines={2}
					>
						{item.description}
					</Text>
					<View className='flex-row justify-between items-center'>
						<Text className='text-[10px] text-gray-500 dark:text-gray-400'>
							{formatDate(item.publishedAt)}
						</Text>
						<TouchableOpacity
							onPress={() => handleRemoveFromSaved(item)}
							className='p-1 rounded-full bg-red-50 dark:bg-red-900/20 ml-2'
							activeOpacity={0.7}
						>
							<IconSymbol
								name='trash'
								size={12}
								color='#EF4444'
							/>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);

	const EmptyState = () => (
		<View className='flex-1 justify-center items-center px-8 py-16'>
			<View className='w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full justify-center items-center mb-6'>
				<IconSymbol name='bookmark' size={40} color='#9CA3AF' />
			</View>
			<Text className='text-xl font-bold text-gray-900 dark:text-white mb-3 text-center'>
				No Saved Articles Yet
			</Text>
			<Text className='text-gray-600 dark:text-gray-400 text-center leading-6 text-base'>
				Discover interesting articles and save them by tapping the
				bookmark icon. They'll appear here for easy access later.
			</Text>
		</View>
	);

	if (isLoading) {
		return (
			<SafeAreaView className='flex-1 bg-white dark:bg-black'>
				<Loading />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className='flex-1 bg-white dark:bg-black py-4 px-2'>
			{/* Header */}
			<View className='px-4 mb-6 justify-between'>
				<Text className='text-3xl font-bold dark:text-white py-2'>
					Saved Articles
				</Text>
				<Text className='text-base text-gray-600 dark:text-gray-200'>
					{savedArticles.length} article
					{savedArticles.length !== 1 ? 's' : ''} saved
				</Text>
			</View>

			{/* Articles List */}
			{savedArticles.length === 0 ? (
				<EmptyState />
			) : (
				<FlatList
					data={savedArticles}
					renderItem={renderSavedArticle}
					keyExtractor={(item) =>
						ArticleStorage.generateArticleId(item)
					}
					contentContainerStyle={{
						paddingHorizontal: 0,
						paddingVertical: 0,
						paddingBottom: 32,
					}}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							colors={['#FF7E5F']}
							tintColor='#FF7E5F'
						/>
					}
				/>
			)}
		</SafeAreaView>
	);
}
