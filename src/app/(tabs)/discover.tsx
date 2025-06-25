import { View, Text, ScrollView } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CategoriesCard from '@/components/CategoriesCard';
import { NEWS_CATEGORIES } from '@/constants/Categories';
import { useQuery } from '@tanstack/react-query';
import { getDiscoverNews } from '@/services/api';
import Loading from '@/components/Loading';
import NewSection from '@/components/NewSection';

export default function DiscoverScreen() {

  const [discoverNews, setDiscoverNews] = useState<Article[]>([])

  const [activeCategory, setActiveCategory] = useState(NEWS_CATEGORIES[0].id);
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const { isLoading: isDiscovrNewsLoading } = useQuery<NewsResponse>({
      queryKey: ['discoverNews', activeCategory],
      queryFn:  () => getDiscoverNews(activeCategory),
      onSuccess: (data) => {
        const filterNews = data.articles.filter((article)=>(
          article.title !== '[remove]'
        ))
        setDiscoverNews(filterNews);
      },
      onError: (error) => {
        console.error('Error fetching discover news:', error);
        setDiscoverNews([]);
      },
    });
  

  return (
		<SafeAreaView className='flex-1 bg-white dark:bg-black py-4 px-2'>
			<View>
				<View className='px-4 mb-6 justify-between'>
					<Text className='text-3xl font-bold dark:text-white py-2'>
						Discover
					</Text>
					<Text className='text-base text-gray-600 dark:text-gray-200'>
						News from all over the world
					</Text>
				</View>

				{/* Search */}

				{/* CategoryList */}

				<View className='mb-4'>
					<CategoriesCard
						categories={NEWS_CATEGORIES}
						activeCategory={activeCategory}
						handleCategoryChange={handleCategoryChange}
					/>
				</View>

				{/* Category News List */}

				<View>
					{isDiscovrNewsLoading ? (
						<Loading />
					) : (
						<ScrollView>
							<NewSection items={discoverNews} />
						</ScrollView>
					)}
				</View>
			</View>
		</SafeAreaView>
  );
}