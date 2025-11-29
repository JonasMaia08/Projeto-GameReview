import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  disabled?: boolean;
}

export default function StarRating({
  rating,
  onRatingChange,
  size = 32,
  disabled = false
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange?.(star)}
          disabled={disabled || !onRatingChange}
          style={styles.starButton}
        >
          <Text style={[
            styles.star,
            { fontSize: size },
            star <= rating ? styles.filledStar : styles.emptyStar
          ]}>
            {star <= rating ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    padding: 4,
  },
  star: {
    color: '#ffd700',
  },
  filledStar: {
    color: '#ffd700',
  },
  emptyStar: {
    color: '#666',
  },
});