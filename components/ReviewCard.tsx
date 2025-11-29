import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Review } from '../services/database';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  return (
    <View style={styles.card}>
      {review.imageUri && (
        <Image source={{ uri: review.imageUri }} style={styles.image} />
      )}

      <View style={styles.content}>
        <Text style={styles.gameName}>{review.gameName}</Text>

        <View style={styles.ratingContainer}>
          <StarRating rating={review.stars} size={20} disabled={true} />
          <Text style={styles.ratingText}>({review.stars}/5)</Text>
        </View>

        <Text style={styles.reviewText}>{review.reviewText}</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  gameName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    color: '#ccc',
    marginLeft: 8,
    fontSize: 14,
  },
  reviewText: {
    color: '#e5e5e5',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});