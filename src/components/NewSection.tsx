import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { ArticleStorage } from '@/utils/articleUtils';

type Props = {
  items: Article[];
};

export default function NewSection({ items }: Props) {
	

	const handlePress = async (item: Article) => {
		// Cache the article for offline access
		await ArticleStorage.cacheArticle(item);

		// Navigate to news detail screen using article ID
		const articleId = ArticleStorage.generateArticleId(item);
		router.push(`/news/${articleId}`);
	};

  const renderItem = ({ item }: { item: Article }) => (
		<TouchableOpacity
			className='mb-4 mx-2 rounded-xl'
			onPress={() => handlePress(item)}
			activeOpacity={0.7}
		>
			<View className='flex-row overflow-hidden rounded-xl '>
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
					<Text className='text-[10px] text-gray-500 dark:text-gray-400'>
						{new Date(item.publishedAt).toLocaleDateString()}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
  );

  return (
    <View className="px-2 py-2">
      <FlatList
        data={items}
        keyExtractor={(_, idx) => `news-item-${idx}`}
        renderItem={renderItem}
        scrollEnabled={false}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
