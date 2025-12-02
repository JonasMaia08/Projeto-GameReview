import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../utils/storage';

export interface Review {
  id: string;
  userId: string; // Adicionar ID do usuário
  gameName: string;
  reviewText: string;
  stars: number;
  imageUri: string | null;
  createdAt: string;
}

const STORAGE_KEY = '@game_reviews';

// Obter chave específica do usuário
const getUserReviewsKey = (userId: string): string => {
  return `${STORAGE_KEY}_${userId}`;
};

export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }

    const userKey = getUserReviewsKey(currentUser.userId);
    const reviewsJson = await AsyncStorage.getItem(userKey);

    if (reviewsJson) {
      const reviews = JSON.parse(reviewsJson);
      // Ordenar por data de criação (mais recente primeiro)
      return reviews.sort((a: Review, b: Review) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return [];
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

export const createReview = async (review: Omit<Review, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    const userKey = getUserReviewsKey(currentUser.userId);
    const reviews = await getAllReviews();

    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      userId: currentUser.userId,
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [...reviews, newReview];
    await AsyncStorage.setItem(userKey, JSON.stringify(updatedReviews));

    return newReview.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const updateReview = async (id: string, review: Omit<Review, 'id' | 'userId' | 'createdAt'>): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    const userKey = getUserReviewsKey(currentUser.userId);
    const reviews = await getAllReviews();

    const updatedReviews = reviews.map(r =>
      r.id === id
        ? { ...review, id, userId: currentUser.userId, createdAt: r.createdAt }
        : r
    );

    await AsyncStorage.setItem(userKey, JSON.stringify(updatedReviews));
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    const userKey = getUserReviewsKey(currentUser.userId);
    const reviews = await getAllReviews();
    const updatedReviews = reviews.filter(r => r.id !== id);

    await AsyncStorage.setItem(userKey, JSON.stringify(updatedReviews));
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Função para resetar dados (apenas para demonstração)
export const clearUserReviews = async (): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const userKey = getUserReviewsKey(currentUser.userId);
      await AsyncStorage.removeItem(userKey);
    }
  } catch (error) {
    console.error('Error clearing reviews:', error);
  }
};