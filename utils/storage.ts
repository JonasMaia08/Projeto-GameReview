import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@user_auth';

// Mock user for demo purposes
const MOCK_USER = {
  email: 'demo@email.com',
  password: '123456'
};

export const loginUser = async (email: string, password: string): Promise<boolean> => {
  // Simple mock authentication
  if (email === MOCK_USER.email && password === MOCK_USER.password) {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ email, loggedIn: true }));
    return true;
  }
  return false;
};

export const logoutUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_KEY);
};

export const checkAuth = async (): Promise<boolean> => {
  try {
    const authData = await AsyncStorage.getItem(AUTH_KEY);
    if (authData) {
      const { loggedIn } = JSON.parse(authData);
      return loggedIn === true;
    }
    return false;
  } catch (error) {
    console.error('Error checking auth:', error);
    return false;
  }
};