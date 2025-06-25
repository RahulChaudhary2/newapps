import axios from 'axios';
const NEWS_CONFIG = {
    BASE_URL: 'https://newsapi.org/v2',
    API_KEY: process.env.EXPO_PUBLIC_NEWS_API_KEY,
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
      },
}

const BreakingNewsURl = `${NEWS_CONFIG.BASE_URL}/top-headlines?country=us&apiKey=${NEWS_CONFIG.API_KEY}`;

const RecommendedNewsUrl = `${NEWS_CONFIG.BASE_URL}/top-headlines?country=us&category=technology&apiKey=${NEWS_CONFIG.API_KEY}`;

const DiscoverNewsURL = (discover: string)=> `${NEWS_CONFIG.BASE_URL}/top-headlines?country=us&category=${discover}&apiKey=${NEWS_CONFIG.API_KEY}`;

const SearchNewsURL = (search: string) => `${NEWS_CONFIG.BASE_URL}/everything?q=${search}&apiKey=${NEWS_CONFIG.API_KEY}`;


const NewsAPICall = async ({endpoint, params, method}: {endpoint: string, params?: Record<string, string>, method?: string}) =>{
    const options ={
        method: method ? method.toUpperCase() : 'GET',
        url: endpoint,
        params: params ? params : {},
    }

    try {
        const res = await axios.request(options);
        return res.data;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error; // Re-throw the error for further handling
        
    }
} 

export  const getBreakingNews = async () => {
    return await NewsAPICall({endpoint: BreakingNewsURl});
}
export const getRecommendedNews = async () => {
    return await NewsAPICall({endpoint: RecommendedNewsUrl});
}
export const getDiscoverNews = async (discover: string) => {
    return await NewsAPICall({endpoint: DiscoverNewsURL(discover)});
}
export const getSearchNews = async (search: string) => {
    return await NewsAPICall({endpoint: SearchNewsURL(search)});
}




