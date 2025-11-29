// lib/reviewStore.ts
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export type Review = {
  id: string;
  gameName: string;
  rating: number; // 0-5
  text: string;
  imageUri?: string | null;
  createdAt: string;
};

type ContextType = {
  reviews: Review[];
  addReview: (r: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  updateReview: (id: string, r: Partial<Omit<Review,'id'|'createdAt'>>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  load: () => Promise<void>;
};

const STORAGE_KEY = '@game_reviews_v1';

const ReviewContext = createContext<ContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if (s) setReviews(JSON.parse(s));
    } catch (e) {
      console.warn('failed to load reviews', e);
    }
  };

  const persist = async (data: Review[]) => {
    try {
      setReviews(data);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('failed to persist reviews', e);
    }
  };

  const addReview = async (r: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...r,
    };
    await persist([newReview, ...reviews]);
  };

  const updateReview = async (id: string, r: Partial<Omit<Review,'id'|'createdAt'>>) => {
    const updated = reviews.map((rev) => (rev.id === id ? { ...rev, ...r } : rev));
    await persist(updated);
  };

  const deleteReview = async (id: string) => {
    const ok = await new Promise<boolean>((res) => {
      Alert.alert('Confirmar', 'Deseja remover essa review?', [
        { text: 'Cancelar', onPress: () => res(false), style: 'cancel' },
        { text: 'Excluir', onPress: () => res(true), style: 'destructive' },
      ]);
    });
    if (!ok) return;
    const filtered = reviews.filter((r) => r.id !== id);
    await persist(filtered);
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, updateReview, deleteReview, load }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewProvider');
  return ctx;
};
