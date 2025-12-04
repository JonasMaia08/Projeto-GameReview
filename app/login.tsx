import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform // ADICIONAR ESTE IMPORT
} from 'react-native';
import { router } from 'expo-router';
import { loginUser } from '../utils/storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const success = await loginUser(email, password);

    if (success) {
      router.replace('/home');
    } else {
      Alert.alert('Erro', 'Credenciais inválidas');
    }
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      {/* Header com logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>🎮</Text>
        <Text style={styles.appName}>GameReview</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Acessar Conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#8b8b8b"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#8b8b8b"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>▶️ ENTRAR</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={goToRegister}>
          <Text style={styles.registerButtonText}>CRIAR NOVA CONTA</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Entre na maior comunidade de reviews de games</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#00ff88',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: '#8b8b8b',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  loginButton: {
    backgroundColor: '#00ff88',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3a3a3a',
  },
  dividerText: {
    color: '#8b8b8b',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  registerButtonText: {
    color: '#00ff88',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  demoCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  demoTitle: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1,
  },
  demoCredentials: {
    gap: 4,
  },
  demoText: {
    color: '#8b8b8b',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  demoHighlight: {
    color: '#ffffff',
    fontWeight: '600',
  },
  footer: {
    color: '#8b8b8b',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 12,
    letterSpacing: 0.5,
  },
});