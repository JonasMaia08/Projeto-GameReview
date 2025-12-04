import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Review } from '../services/database';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRatingColor = (stars: number) => {
    if (stars >= 4) return '#00ff88';
    if (stars >= 3) return '#ffcc00';
    return '#ff4d4d';
  };

  return (
    <View style={styles.card}>
      {review.imageUri && (
        <Image source={{ uri: review.imageUri }} style={styles.image} />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.gameInfo}>
            <Text style={styles.gameName}>{review.gameName.toUpperCase()}</Text>
            <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
          </View>
          <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(review.stars) }]}>
            <Text style={styles.ratingBadgeText}>{review.stars}/5</Text>
          </View>
        </View>

        <StarRating rating={review.stars} size={20} disabled={true} />

        <Text style={styles.reviewText} numberOfLines={3}>
          {review.reviewText}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Text style={styles.editButtonText}>EDITAR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>EXCLUIR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
    color: '#8b8b8b',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  ratingBadgeText: {
    color: '#0a0a0a',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  reviewText: {
    color: '#e5e5e5',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  editButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  editButtonText: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  deleteButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  deleteButtonText: {
    color: '#ff4d4d',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});