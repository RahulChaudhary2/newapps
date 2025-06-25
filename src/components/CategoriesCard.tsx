import { useEffect, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

interface CategoriesCardProps {
	categories: { id: string; name: string }[];
	activeCategory: string;
	handleCategoryChange: (categoryId: string) => void;
}

export default function CategoriesCard({
	categories,
	activeCategory,
	handleCategoryChange,
}: CategoriesCardProps) {
	const scrollViewRef = useRef<ScrollView>(null);
	const categoryRefs = useRef<{ [key: string]: number }>({});

	// Auto-scroll to active category when it changes
	useEffect(() => {
		const activeIndex = categories.findIndex(
			(cat) => cat.id === activeCategory
		);
		if (activeIndex !== -1 && scrollViewRef.current) {
			// Calculate more precise scroll position
			const itemWidth = 100; // Approximate width including margins
			const containerPadding = 10;
			const scrollPosition = Math.max(
				0,
				activeIndex * itemWidth - containerPadding
			);

			scrollViewRef.current.scrollTo({
				x: scrollPosition,
				animated: true,
			});
		}
	}, [activeCategory, categories]);

	return (
		<ScrollView
			ref={scrollViewRef}
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ paddingHorizontal: 10 }}
		>
			{categories.map((category: { id: string; name: string }) => {
				const isActive = category.id === activeCategory;
				return (
					<TouchableOpacity
						key={category.id}
						className={`rounded-full px-4 py-2 mx-2 ${
							isActive
								? 'bg-blue-500 dark:bg-blue-600'
								: 'bg-gray-200 dark:bg-gray-800'
						}`}
						onPress={() => handleCategoryChange(category.id)}
						activeOpacity={0.7}
					>
						<Text
							className={`text-sm font-semibold ${
								isActive
									? 'text-white'
									: 'text-gray-700 dark:text-gray-300'
							}`}
						>
							{category.name}
						</Text>
					</TouchableOpacity>
				);
			})}
		</ScrollView>
	);
}
