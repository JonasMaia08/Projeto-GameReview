import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { registerUser } from '../utils/storage';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(email, password, name);

      if (result.success) {
        Alert.alert(
          '🎉 Conta Criada!',
          result.message,
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        Alert.alert('❌ Erro', result.message);
      }
    } catch (error) {
      Alert.alert('❌ Erro', 'Não foi possível realizar o cadastro');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0a0a0a' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goToLogin} style={styles.backButton}>
            <Text style={styles.backButtonText}>← VOLTAR</Text>
          </TouchableOpacity>
          <Text style={styles.appName}>GameReview</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>CRIAR CONTA</Text>
            <Text style={styles.subtitle}>Junte-se à comunidade</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>NOME (OPCIONAL)</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Seu nome ou apelido"
              placeholderTextColor="#8b8b8b"
              autoCapitalize="words"
            />

            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor="#8b8b8b"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>SENHA</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#8b8b8b"
              secureTextEntry
            />

            <Text style={styles.label}>CONFIRMAR SENHA</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Digite novamente"
              placeholderTextColor="#8b8b8b"
              secureTextEntry
            />

            <View style={styles.requirements}>
              <Text style={styles.requirementsTitle}>REQUISITOS:</Text>
              <Text style={[styles.requirement, password.length >= 6 && styles.requirementMet]}>
                • Senha com 6+ caracteres {password.length >= 6 ? '✅' : '❌'}
              </Text>
              <Text style={[styles.requirement, password === confirmPassword && password !== '' && styles.requirementMet]}>
                • Senhas coincidem {password === confirmPassword && password !== '' ? '✅' : '❌'}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'CRIANDO...' : '🎮 CRIAR CONTA'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={goToLogin}
              disabled={loading}
            >
              <Text style={styles.loginLinkText}>
                Já tem uma conta? <Text style={styles.loginLinkBold}>FAZER LOGIN</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 DICAS:</Text>
          <Text style={styles.tip}>• Use um email válido</Text>
          <Text style={styles.tip}>• Senha forte combina letras e números</Text>
          <Text style={styles.tip}>• Apelidos criativos são bem-vindos!</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#00ff88',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#8b8b8b',
    letterSpacing: 1,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 16,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  requirements: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  requirementsTitle: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1,
  },
  requirement: {
    color: '#8b8b8b',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  requirementMet: {
    color: '#00ff88',
  },
  registerButton: {
    backgroundColor: '#00ff88',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  registerButtonText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#8b8b8b',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  loginLinkBold: {
    color: '#00ff88',
    fontWeight: '700',
    letterSpacing: 1,
  },
  tips: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  tipsTitle: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 1,
  },
  tip: {
    color: '#8b8b8b',
    fontSize: 13,
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});