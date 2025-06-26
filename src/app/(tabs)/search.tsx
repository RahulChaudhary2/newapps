import { IconSymbol } from '@/components/IconsSymbol';
import NewSection from '@/components/NewSection';
import { getSearchNews } from '@/services/api';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<Article[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Search function
	const performSearch = async (query: string) => {
		if (query.trim().length === 0) {
			setSearchResults([]);
			setHasSearched(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await getSearchNews(query.trim());
			setSearchResults(response.articles || []);
			setHasSearched(true);
		} catch (err) {
			console.error('Search error:', err);
			setError('Failed to search articles. Please try again.');
			setSearchResults([]);
		} finally {
			setIsLoading(false);
		}
	};

	// Debounced search function
	const debouncedSearch = useCallback((query: string) => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = setTimeout(() => {
			performSearch(query);
		}, 500);
	}, []);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, []);

	// Handle search input change
	const handleSearchChange = (text: string) => {
		setSearchQuery(text);
		debouncedSearch(text);
	};

	// Clear search
	const clearSearch = () => {
		setSearchQuery('');
		setSearchResults([]);
		setHasSearched(false);
		setError(null);
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}
	};

	return (
		<SafeAreaView className='flex-1 bg-white dark:bg-black'>
			{/* Header */}
			<View className='px-4 py-2'>
				<Text className='text-3xl font-bold dark:text-white mb-4'>
					Search News
				</Text>

				{/* Search Input */}
				<View className='flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-3 mb-4'>
					<IconSymbol
						name='magnifyingglass'
						size={20}
						color='#6B7280'
					/>
					<TextInput
						className='flex-1 ml-3 text-black dark:text-white text-base'
						placeholder='Search for news...'
						placeholderTextColor='#6B7280'
						value={searchQuery}
						onChangeText={handleSearchChange}
						returnKeyType='search'
						autoCapitalize='none'
						autoCorrect={false}
					/>
					{searchQuery.length > 0 && (
						<TouchableOpacity
							onPress={clearSearch}
							className='ml-2'
						>
							<IconSymbol
								name='xmark.circle.fill'
								size={20}
								color='#6B7280'
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Content */}
			<View className='flex-1'>
				{isLoading ? (
					<View className='flex-1 justify-center items-center'>
						<ActivityIndicator size='large' color='#3B82F6' />
						<Text className='text-gray-600 dark:text-gray-400 mt-2'>
							Searching...
						</Text>
					</View>
				) : error ? (
					<View className='flex-1 justify-center items-center px-4'>
						<Text className='text-red-500 text-center mb-4'>
							{error}
						</Text>
						<TouchableOpacity
							onPress={() => performSearch(searchQuery)}
							className='bg-blue-500 px-6 py-3 rounded-lg'
						>
							<Text className='text-white font-semibold'>
								Try Again
							</Text>
						</TouchableOpacity>
					</View>
				) : hasSearched ? (
					searchResults.length > 0 ? (
						<FlatList
							data={searchResults}
							keyExtractor={(_, idx) => `search-result-${idx}`}
							renderItem={({ item }) => (
								<NewSection items={[item]} />
							)}
							showsVerticalScrollIndicator={false}
							ListHeaderComponent={() => (
								<View className='px-4 py-2'>
									<Text className='text-gray-600 dark:text-gray-400 text-sm'>
										Found {searchResults.length} result
										{searchResults.length !== 1
											? 's'
											: ''}{' '}
										for "{searchQuery}"
									</Text>
								</View>
							)}
						/>
					) : (
						<View className='flex-1 justify-center items-center px-4'>
							<Text className='text-gray-600 dark:text-gray-400 text-lg mb-2'>
								No results found
							</Text>
							<Text className='text-gray-500 dark:text-gray-500 text-center'>
								Try searching with different keywords
							</Text>
						</View>
					)
				) : (
					// Show empty state when no search has been made
					<View className='flex-1 justify-center items-center px-4'>
						<IconSymbol
							name='magnifyingglass'
							size={48}
							color='#9CA3AF'
						/>
						<Text className='text-xl font-semibold dark:text-white mt-4 mb-2'>
							Search for News
						</Text>
						<Text className='text-gray-500 dark:text-gray-400 text-center'>
							Enter keywords in the search bar above to find the
							latest news articles
						</Text>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
}
