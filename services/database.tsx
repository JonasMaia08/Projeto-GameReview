import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Review {
  id: string;
  gameName: string;
  reviewText: string;
  stars: number;
  imageUri: string | null;
  createdAt: string;
}

const STORAGE_KEY = '@game_reviews';

export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const reviewsJson = await AsyncStorage.getItem(STORAGE_KEY);
    if (reviewsJson) {
      return JSON.parse(reviewsJson);
    }
    return [];
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

export const createReview = async (review: Omit<Review, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const reviews = await getAllReviews();
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [...reviews, newReview];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));

    return newReview.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const updateReview = async (id: string, review: Omit<Review, 'id' | 'createdAt'>): Promise<void> => {
  try {
    const reviews = await getAllReviews();
    const updatedReviews = reviews.map(r =>
      r.id === id
        ? { ...review, id, createdAt: r.createdAt }
        : r
    );

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  try {
    const reviews = await getAllReviews();
    const updatedReviews = reviews.filter(r => r.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};