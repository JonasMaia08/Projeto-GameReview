import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import { checkAuth } from '../utils/storage';

export default function Index() {
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const { isAuthenticated } = await checkAuth();

    if (isAuthenticated) {
      router.replace('/home');
    } else {
      router.replace('/login');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={{ color: 'white', marginTop: 16, fontSize: 16 }}>Carregando GameReview...</Text>
    </View>
  );
}