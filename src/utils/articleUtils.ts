import AsyncStorage from '@react-native-async-storage/async-storage';

export class ArticleStorage {
  private static readonly CACHED_ARTICLES_KEY = 'cached_articles';
  private static readonly SAVED_ARTICLES_KEY = 'saved_articles';

  // Cache article for offline access
  static async cacheArticle(article: Article): Promise<void> {
    try {
      const cached = await this.getCachedArticles();
      const articleId = this.generateArticleId(article);
      
      // Remove existing entry and add updated one
      const filtered = cached.filter(a => this.generateArticleId(a) !== articleId);
      filtered.push(article);
      
      await AsyncStorage.setItem(this.CACHED_ARTICLES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error caching article:', error);
    }
  }

  // Get cached articles
  static async getCachedArticles(): Promise<Article[]> {
    try {
      const cached = await AsyncStorage.getItem(this.CACHED_ARTICLES_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Error getting cached articles:', error);
      return [];
    }
  }

  // Find cached article by ID
  static async findCachedArticle(articleId: string): Promise<Article | null> {
    try {
      const cached = await this.getCachedArticles();
      
      // First try to find with new ID format
      let article = cached.find(article => 
        this.generateArticleId(article) === articleId
      );
      
      // If not found, try legacy format (encoded URL or title) for backward compatibility
      if (!article) {
        article = cached.find(article => 
          encodeURIComponent(article.url || article.title) === articleId
        );
        
        // If found with legacy format, re-cache with new format
        if (article) {
          await this.cacheArticle(article);
        }
      }
      
      return article || null;
    } catch (error) {
      console.error('Error finding cached article:', error);
      return null;
    }
  }

  // Save article to reading list
  static async saveArticle(articleId: string): Promise<void> {
    try {
      const saved = await this.getSavedArticleIds();
      if (!saved.includes(articleId)) {
        saved.push(articleId);
        await AsyncStorage.setItem(this.SAVED_ARTICLES_KEY, JSON.stringify(saved));
      }
    } catch (error) {
      console.error('Error saving article:', error);
    }
  }

  // Remove article from reading list
  static async unsaveArticle(articleId: string): Promise<void> {
    try {
      const saved = await this.getSavedArticleIds();
      const filtered = saved.filter(id => id !== articleId);
      await AsyncStorage.setItem(this.SAVED_ARTICLES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error unsaving article:', error);
    }
  }

  // Check if article is saved
  static async isArticleSaved(articleId: string): Promise<boolean> {
    try {
      const saved = await this.getSavedArticleIds();
      return saved.includes(articleId);
    } catch (error) {
      console.error('Error checking if article is saved:', error);
      return false;
    }
  }

  // Get saved article IDs
  static async getSavedArticleIds(): Promise<string[]> {
    try {
      const saved = await AsyncStorage.getItem(this.SAVED_ARTICLES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error getting saved articles:', error);
      return [];
    }
  }

  // Get saved articles
  static async getSavedArticles(): Promise<Article[]> {
    try {
      const savedIds = await this.getSavedArticleIds();
      const cached = await this.getCachedArticles();
      
      return cached.filter(article => 
        savedIds.includes(this.generateArticleId(article))
      );
    } catch (error) {
      console.error('Error getting saved articles:', error);
      return [];
    }
  }

  // Generate consistent article ID
  static generateArticleId(article: Article): string {
    // Create a simple hash from the article URL or title
    const source = article.url || article.title;
    let hash = 0;
    for (let i = 0; i < source.length; i++) {
      const char = source.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Convert to positive number and add timestamp for uniqueness
    const positiveHash = Math.abs(hash);
    const timestamp = new Date(article.publishedAt).getTime();
    return `${positiveHash}_${timestamp}`;
  }

  // Clear all cached data
  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CACHED_ARTICLES_KEY);
      await AsyncStorage.removeItem(this.SAVED_ARTICLES_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

// Utility functions for formatting
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

export const formatDetailedDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getReadingTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.split(' ').length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};
