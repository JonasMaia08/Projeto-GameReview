import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { updateReview, Review } from '../services/database';
import StarRating from '../components/StarRating';

export default function EditReview() {
  const params = useLocalSearchParams();

  // Parse a review apenas uma vez no início
  const initialReview = JSON.parse(params.review as string) as Review;

  const [gameName, setGameName] = useState(initialReview.gameName);
  const [reviewText, setReviewText] = useState(initialReview.reviewText);
  const [stars, setStars] = useState(initialReview.stars);
  const [imageUri, setImageUri] = useState<string | null>(initialReview.imageUri);
  const [loading, setLoading] = useState(false);

  // REMOVIDO: useEffect que causava a sobrescrita constante

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para adicionar imagens.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!gameName.trim() || !reviewText.trim() || stars === 0) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos e selecione uma avaliação em estrelas');
      return;
    }

    setLoading(true);

    try {
      await updateReview(initialReview.id, {
        gameName: gameName.trim(),
        reviewText: reviewText.trim(),
        stars,
        imageUri,
      });

      Alert.alert('Sucesso', 'Review atualizada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.replace('/home') // Mudei para replace
        }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a review');
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Editar Review</Text>

      <Text style={styles.label}>Nome do Jogo</Text>
      <TextInput
        style={styles.input}
        value={gameName}
        onChangeText={setGameName}
        placeholder="Digite o nome do jogo"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Avaliação</Text>
      <StarRating rating={stars} onRatingChange={setStars} />

      <Text style={styles.label}>Review</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={reviewText}
        onChangeText={setReviewText}
        placeholder="Escreva sua review..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Imagem do Jogo (opcional)</Text>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {imageUri ? 'Alterar Imagem' : 'Selecionar Imagem'}
        </Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Atualizando...' : 'Atualizar Review'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#2d2d2d',
    color: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#4b5563',
  },
  submitButton: {
    backgroundColor: '#6366f1',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});