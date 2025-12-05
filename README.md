# GameReview

Um aplicativo móvel completo para criar, visualizar, editar e excluir reviews de jogos. Desenvolvido com React Native e Expo, oferecendo uma experiência CRUD completa com interface intuitiva e armazenamento local.

# Sobre o Projeto

- O GameReview permite que usuários:

- Criar reviews de jogos com nome, avaliação em estrelas, texto descritivo e imagem

- Visualizar todas as reviews em uma lista organizada

- Editar reviews existentes

- Excluir reviews

- Possui acesso protegido por um sistema simples de autenticação

# Tecnologias Utilizadas

- React Native – Framework para desenvolvimento mobile

- Expo – Plataforma para desenvolvimento React Native

- Expo Router – Navegação entre telas

- TypeScript – Tipagem estática

- AsyncStorage – Armazenamento local de dados

- Expo Image Picker – Seleção de imagens da galeria

- React Native Async Storage – Persistência de dados

# Pré-requisitos

**Antes de começar, você precisa ter instalado:**

- Node.js (versão 16 ou superior)

- Git

- Expo CLI

***Para testar no celular***

- Aplicativo Expo Go instalado (Android/iOS)

***Para emular no computador***

- Android Studio (emulador Android)

# Como Instalar e Executar

1. Clone o repositório
git clone https://github.com/seu-usuario/gamereview.git
```cd gamereview```

2. Instale as dependências
```npm install```

3. Execute o projeto
Opção 1: Dispositivo físico
```npx expo start```

Abra o app Expo Go e escaneie o QR Code.

Opção 2: Emulador Android
```npx expo start --android```

Opção 3: Emulador iOS (macOS)
```npx expo start --ios```

Opção 4: Navegador Web
```npx expo start --web```

# Configuração do Ambiente de Desenvolvimento
Android Studio

Instale o Android Studio

Abra o Android Studio

Vá em Tools → AVD Manager

Clique em Create Virtual Device

Selecione um dispositivo (ex: Pixel 6)

Escolha uma imagem do sistema (API 30+)

Conclua a criação e inicie o emulador

**Executar no emulador**
```npx expo start --android```

**Credenciais de Login (Demo)**
```
Email: demo@email.com

Senha: 123456
```
