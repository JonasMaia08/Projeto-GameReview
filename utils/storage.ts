import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@user_auth';
const USERS_KEY = '@game_review_users';

export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  createdAt: string;
}

// Usuário demo pré-cadastrado
const DEMO_USER: User = {
  id: 'demo-001',
  email: 'demo@email.com',
  password: '123456',
  name: 'Usuário Demo',
  createdAt: new Date().toISOString(),
};

// Inicializar usuários se não existirem
export const initializeUsers = async (): Promise<void> => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    if (!usersJson) {
      // Se não existir usuários, cria o usuário demo
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify([DEMO_USER]));
    }
  } catch (error) {
    console.error('Error initializing users:', error);
  }
};

// Cadastrar novo usuário
export const registerUser = async (
  email: string,
  password: string,
  name?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!email || !password) {
      return { success: false, message: 'Email e senha são obrigatórios' };
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Email inválido' };
    }

    // Validar senha (mínimo 6 caracteres)
    if (password.length < 6) {
      return { success: false, message: 'Senha deve ter pelo menos 6 caracteres' };
    }

    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    // Verificar se email já está cadastrado
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return { success: false, message: 'Email já cadastrado' };
    }

    // Criar novo usuário
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      name: name || email.split('@')[0], // Usa parte do email como nome se não fornecido
      createdAt: new Date().toISOString(),
    };

    // Adicionar usuário e salvar
    const updatedUsers = [...users, newUser];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

    return { success: true, message: 'Cadastro realizado com sucesso!' };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: 'Erro ao cadastrar usuário' };
  }
};

// Login de usuário
export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    // Buscar usuário pelo email e senha
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      // Salvar informações do usuário logado
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({
        userId: user.id,
        email: user.email,
        name: user.name,
        loggedIn: true,
      }));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error logging in:', error);
    return false;
  }
};

// Logout
export const logoutUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_KEY);
};

// Verificar autenticação
export const checkAuth = async (): Promise<{ isAuthenticated: boolean; user?: any }> => {
  try {
    const authData = await AsyncStorage.getItem(AUTH_KEY);
    if (authData) {
      const { loggedIn, ...user } = JSON.parse(authData);
      return { isAuthenticated: loggedIn === true, user };
    }
    return { isAuthenticated: false };
  } catch (error) {
    console.error('Error checking auth:', error);
    return { isAuthenticated: false };
  }
};

// Obter usuário atual
export const getCurrentUser = async (): Promise<any> => {
  try {
    const authData = await AsyncStorage.getItem(AUTH_KEY);
    if (authData) {
      const { loggedIn, ...user } = JSON.parse(authData);
      return loggedIn ? user : null;
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Inicializar na importação
initializeUsers();