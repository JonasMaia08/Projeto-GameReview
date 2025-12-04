import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar
} from 'react-native';
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
      setUserName(user.name || user.email.split('@')[0]);
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
      'CONFIRMAR EXCLUSÃO',
      'Tem certeza que deseja excluir esta review?',
      [
        { text: 'CANCELAR', style: 'cancel' },
        {
          text: 'EXCLUIR',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReview(id);
              await loadReviews();
            } catch (error) {
              Alert.alert('ERRO', 'Não foi possível excluir a review');
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

  const getStats = () => {
    const totalReviews = reviews.length;
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1)
      : '0.0';
    const fiveStarReviews = reviews.filter(r => r.stars === 5).length;

    return { totalReviews, avgRating, fiveStarReviews };
  };

  const stats = getStats();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0a0a0a" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.welcome}>👋 OLÁ,</Text>
          <Text style={styles.userName}>{userName.toUpperCase() || 'JOGADOR'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>SAIR</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalReviews}</Text>
          <Text style={styles.statLabel}>REVIEWS</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.avgRating}</Text>
          <Text style={styles.statLabel}>MÉDIA</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.fiveStarReviews}</Text>
          <Text style={styles.statLabel}>⭐5</Text>
        </View>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.sectionTitle}>MINHA BIBLIOTECA</Text>
        <Text style={styles.sectionSubtitle}>Suas avaliações de games</Text>
      </View>

      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🎮</Text>
          <Text style={styles.emptyTitle}>BIBLIOTECA VAZIA</Text>
          <Text style={styles.emptyText}>Adicione sua primeira review de game!</Text>
          <TouchableOpacity
            style={styles.addFirstButton}
            onPress={() => router.push('/add-review')}
          >
            <Text style={styles.addFirstButtonText}>+ ADICIONAR REVIEW</Text>
          </TouchableOpacity>
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
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      {reviews.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/add-review')}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  userInfo: {
    flex: 1,
  },
  welcome: {
    fontSize: 12,
    color: '#8b8b8b',
    fontWeight: '700',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 2,
    letterSpacing: 1,
  },
  logoutButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  logoutText: {
    color: '#ff4d4d',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00ff88',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#8b8b8b',
    fontWeight: '700',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#3a3a3a',
    marginHorizontal: 10,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8b8b8b',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#8b8b8b',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  addFirstButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addFirstButtonText: {
    color: '#0a0a0a',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00ff88',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    color: '#0a0a0a',
    fontSize: 28,
    fontWeight: '900',
  },
});