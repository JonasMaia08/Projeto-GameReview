import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

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

  const getStarIcon = (star: number, isFilled: boolean) => {
    if (isFilled) {
      return '★';
    }
    return '☆';
  };

  return (
    <View style={styles.container}>
      {stars.map((star) => {
        const isFilled = star <= rating;
        return (
          <TouchableOpacity
            key={star}
            onPress={() => onRatingChange?.(star)}
            disabled={disabled || !onRatingChange}
            style={styles.starButton}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.star,
              {
                fontSize: size,
                color: isFilled ? '#00ff88' : '#3a3a3a',
                textShadowColor: isFilled ? 'rgba(0, 255, 136, 0.3)' : 'transparent',
                textShadowOffset: isFilled ? { width: 0, height: 0 } : undefined,
                textShadowRadius: isFilled ? 4 : 0,
              }
            ]}>
              {getStarIcon(star, isFilled)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '900',
  },
});