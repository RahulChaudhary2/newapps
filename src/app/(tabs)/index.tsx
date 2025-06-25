import BreakingNews from '@/components/BreakingNews';
import Loading from '@/components/Loading';
import NewSection from '@/components/NewSection';
import { getBreakingNews, getRecommendedNews } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function index() {
	const [recommendedNews, setRecommendedNews] = useState<Article[]>([]);
	const [breakingNews, setBreakingNews] = useState<Article[]>([]);

	// Breaking News
	const { isLoading: isBreakingNewsLoading } = useQuery<NewsResponse>({
		queryKey: ['breakingNews'],
		queryFn: getBreakingNews,
		onSuccess: (data) => {
			setBreakingNews(data.articles);
		},
		onError: (error) => {
			console.error('Error fetching breaking news:', error);
			setBreakingNews([]);
		},
	});

	// Recommended News
	const { isLoading: isRecommendedNewsLoading } = useQuery<NewsResponse>({
		queryKey: ['recommendedNews'],
		queryFn: getRecommendedNews,
		onSuccess: (data) => {
			setRecommendedNews(data.articles || []);
		},
		onError: (error) => {
			console.error('Error fetching recommended news:', error);
			setRecommendedNews([]);
		},
	});

	return (
		<SafeAreaView className='flex-1 bg-white dark:bg-black py-4 px-2'>
			<Text className='text-3xl pl-4 font-bold dark:text-white py-2'>
				Breaking News
			</Text>

			{/* Breaking News Section */}
			{isBreakingNewsLoading ? (
				<Loading />
			) : (
				<BreakingNews data={breakingNews} />
			)}

			{/* Recommended News Section */}
			<View >
				
				<Text className='text-3xl pl-4 font-bold dark:text-white py-2'>
					Recommended News
				</Text>

				<ScrollView>
					{isRecommendedNewsLoading ? (
						<Loading />
					) : (
						<NewSection items={recommendedNews} />
					)}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}
