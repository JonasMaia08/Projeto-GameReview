import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { logoutUser, getCurrentUser } from '../utils/storage';
import { getAllReviews, deleteReview, Review } from '../services/database';
import ReviewCard from '../components/ReviewCard';

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      loadUserData();
      loadReviews();
    }, [])
  );

  const loadUserData = async () => {
    const user = await getCurrentUser();
    if (user) {
      setUserName(user.name || user.email);
    }
  };

  const loadReviews = async () => {
    setRefreshing(true);
    try {
      const allReviews = await getAllReviews();
      setReviews(allReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteReview = (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta review?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReview(id);
              await loadReviews();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a review');
            }
          },
        },
      ]
    );
  };

  const handleEditReview = (review: Review) => {
    router.push({
      pathname: '/edit-review',
      params: { review: JSON.stringify(review) }
    });
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>GameReview</Text>
          {userName ? (
            <Text style={styles.userName}>Olá, {userName}!</Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma review encontrada</Text>
          <Text style={styles.emptySubtext}>Adicione sua primeira review!</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReviewCard
              review={item}
              onEdit={() => handleEditReview(item)}
              onDelete={() => handleDeleteReview(item.id)}
            />
          )}
          refreshing={refreshing}
          onRefresh={loadReviews}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-review')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#2d2d2d',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#444',
    borderRadius: 6,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});