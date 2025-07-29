# 🐱 **Cat Tetris** 

Um jogo de Tetris profissional com tema de gatos, desenvolvido com **React 18** e arquitetura limpa baseada em **SOLID Principles** e **Design Patterns**.

## 🎮 **Funcionalidades**

### 🐾 **Tema Felino Encantador**
- Peças temáticas com emojis de gatos únicos
- Cores vibrantes e amigáveis para cada tipo de peça
- Interface responsiva com animações suaves
- Visual moderno e profissional

### ⌨️ **Controles Clássicos & Modernos**
- **Setas ← →**: Mover peças lateralmente
- **Seta ↑**: Rotacionar peça
- **Seta ↓**: Acelerar queda (soft drop)
- **Espaço**: Drop instantâneo (hard drop)
- **Shift**: Guardar peça (hold function)
- **P**: Pausar/despausar
- **Controles touch** para dispositivos móveis

### 📊 **Sistema de Pontuação Avançado**
- Pontuação baseada nas regras oficiais do Tetris
- Sistema de combos e multiplicadores
- T-Spins com bonificação especial
- Back-to-back bonus para Tetris consecutivos
- Níveis progressivos com aumento de velocidade
- Persistência de recordes no localStorage

### 🎵 **Sistema de Áudio**
- Sons temáticos de miados
- Efeitos sonoros para limpeza de linhas
- Som de game over
- Controle de volume configurável

### ✨ **Recursos Avançados**
- **Drop Preview**: Sombra mostrando posição final
- **Hold System**: Guardar peças para uso estratégico
- **Next Pieces**: Visualização das próximas 3 peças
- **Estatísticas detalhadas** de jogo
- **Configurações personalizáveis**
- **Error Boundary** para tratamento de erros

## 🚀 **Como Executar**

### **Pré-requisitos**
- Node.js 16+ 
- npm ou yarn

### **Instalação & Execução**
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/cat-tetris.git
cd cat-tetris

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Acesse no navegador
http://localhost:3000
```

### **Build para Produção**
```bash
npm run build
npm run preview
```

## 🏗️ **Arquitetura & Design Patterns**

Este projeto implementa uma **arquitetura limpa** e **escalável** seguindo os princípios **SOLID** e múltiplos **Design Patterns**:

### **🎯 Core Patterns**
- **🏭 Factory Pattern**: Criação de peças e estratégias
- **🎯 Strategy Pattern**: Algoritmos de movimento intercambiáveis  
- **👁️ Observer Pattern**: Sistema de eventos desacoplado
- **📝 Command Pattern**: Encapsulamento de ações do jogo
- **🎨 Builder Pattern**: Construção fluente de objetos
- **🔄 State Pattern**: Gerenciamento de estados do jogo
- **🗄️ Repository Pattern**: Abstração de persistência de dados

### **🎮 Service Layer**
- **GameService**: Lógica principal do jogo
- **ScoringService**: Sistema de pontuação
- **LocalStorageRepository**: Persistência de dados

### **⚛️ React Patterns**
- **Custom Hooks**: Lógica reutilizável e separação de responsabilidades
- **Context API**: Gerenciamento de estado global
- **Error Boundaries**: Tratamento robusto de erros
- **Compound Components**: Componentização modular

## 📁 **Estrutura do Projeto**

```
src/
├── components/              # 🎨 Componentes React
│   ├── TetrisBoard.jsx      # Tabuleiro principal
│   ├── Scoreboard.jsx       # Placar e estatísticas
│   ├── Controls.jsx         # Controles mobile
│   ├── GameOverScreen.jsx   # Tela de game over
│   ├── NextPieces.jsx       # Preview das próximas peças
│   ├── HeldPiece.jsx        # Peça guardada
│   ├── Statistics.jsx       # Estatísticas detalhadas
│   ├── SettingsMenu.jsx     # Menu de configurações
│   ├── ParticleEffect.jsx   # Efeitos visuais
│   └── ErrorBoundary.jsx    # Tratamento de erros
│
├── core/                    # 🎯 Lógica de negócio
│   ├── entities/            # Entidades do domínio
│   │   ├── Board.js         # Tabuleiro
│   │   ├── Piece.js         # Peça
│   │   └── Score.js         # Pontuação
│   ├── services/            # Serviços de aplicação
│   │   ├── GameService.js   # Serviço principal
│   │   └── ScoringService.js # Serviço de pontuação
│   └── repositories/        # Persistência
│       └── LocalStorageRepository.js
│
├── patterns/                # 🎨 Design Patterns
│   ├── strategies/          # Strategy Pattern
│   │   ├── BaseMovementStrategy.js
│   │   ├── LeftMovementStrategy.js
│   │   ├── RightMovementStrategy.js
│   │   ├── DownMovementStrategy.js
│   │   ├── RotateMovementStrategy.js
│   │   └── HardDropMovementStrategy.js
│   ├── commands/            # Command Pattern
│   │   ├── MoveCommand.js
│   │   ├── RotateCommand.js
│   │   ├── PlaceCommand.js
│   │   └── HoldCommand.js
│   ├── builder/             # Builder Pattern
│   │   └── PieceBuilder.js
│   ├── state/               # State Pattern
│   │   ├── PlayingState.js
│   │   ├── PausedState.js
│   │   └── GameOverState.js
│   ├── Factory.js           # Factory Pattern
│   ├── Observer.js          # Observer Pattern
│   └── Command.js           # Command base
│
├── hooks/                   # ⚛️ Custom Hooks
│   ├── useGameService.js    # Hook principal do jogo
│   ├── useGameEngine.js     # Motor do jogo
│   └── useSoundManager.js   # Gerenciamento de som
│
├── utils/                   # 🛠️ Utilitários
│   ├── GameLogic.js         # Lógica auxiliar
│   ├── PieceGenerator.js    # Geração de peças
│   └── soundUtils.js        # Utilitários de som
│
├── config/                  # ⚙️ Configurações
│   └── GameConfig.js        # Constantes do jogo
│
├── interfaces/              # 📋 TypeScript-like interfaces
│   ├── IGameActions.js      # Interface de ações
│   ├── IGameState.js        # Interface de estado
│   └── IMovementStrategy.js # Interface de estratégias
│
├── contexts/                # 🌐 React Context
│   └── GameContext.jsx      # Contexto global
│
├── services/                # 🎵 Serviços externos
│   ├── ScoreService.js      # Serviço de pontuação
│   └── SoundService.js      # Serviço de som
│
├── App.jsx                  # 🏠 Componente principal
├── main.jsx                 # 🚀 Ponto de entrada
└── index.css                # 🎨 Estilos globais
```

## 🛠️ **Tecnologias Utilizadas**

### **Core**
- **React 18** - Framework principal
- **Vite** - Build tool ultra-rápido
- **ES6+ Modules** - Sintaxe moderna

### **UI & Styling**
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Animações fluidas
- **PostCSS** - Processamento CSS

### **Audio & Effects**
- **use-sound** - Sistema de áudio
- **Particle Effects** - Efeitos visuais

### **Development**
- **Hot Module Replacement** - Desenvolvimento ágil
- **TypeScript interfaces** - Tipagem implícita
- **Clean Architecture** - Código escalável

## 🎯 **Tipos de Peças (Tetrominós)**

| Peça | Emoji | Cor | Formato |
|------|-------|-----|---------|
| **I** | 🐱 | Azul | Linha reta (4 blocos) |
| **O** | 😺 | Amarelo | Quadrado (2x2) |
| **T** | 😸 | Roxo | Formato T |
| **S** | 😻 | Verde | Formato S |
| **Z** | 😽 | Vermelho | Formato Z |
| **J** | 😹 | Laranja | Formato J |
| **L** | 😿 | Rosa | Formato L |

## 🏆 **Sistema de Pontuação**

### **Pontuação Base**
- **1 linha**: 100 × nível
- **2 linhas**: 300 × nível  
- **3 linhas**: 500 × nível
- **4 linhas (Tetris)**: 800 × nível

### **Bônus Especiais**
- **T-Spin Single**: 800 × nível
- **T-Spin Double**: 1200 × nível
- **T-Spin Triple**: 1600 × nível
- **Back-to-back**: +50% do valor base
- **Soft Drop**: +1 ponto por linha
- **Hard Drop**: +2 pontos por linha
- **Combo**: +50 × combo × nível

## 📱 **Responsividade**

### **Desktop** 
- ✅ Controles por teclado
- ✅ Interface otimizada para telas grandes
- ✅ Sidebar com próximas peças e estatísticas

### **Mobile & Tablet**
- ✅ Controles touch intuitivos
- ✅ Layout adaptativo
- ✅ Gestos para rotação e movimento

## ⚙️ **Configurações**

### **Opções Disponíveis**
- 🔊 **Volume**: Controle de áudio (0-100%)
- ⚡ **Velocidade**: Normal, Rápido, Muito Rápido
- ✨ **Efeitos de Partículas**: Ativar/Desativar
- 🎨 **Tema**: Personalizações visuais

### **Persistência**
Todas as configurações são salvas automaticamente no `localStorage`.

## 🎮 **Como Jogar**

### **Objetivo**
- Complete linhas horizontais para eliminá-las
- Evite que as peças atinjam o topo do tabuleiro
- Maximize sua pontuação com combos e T-Spins

### **Dicas Estratégicas**
- 💡 Use a **sombra de preview** para planejar jogadas
- 🎯 Mantenha o **hold** para peças estratégicas  
- ⚡ Busque fazer **T-Spins** para pontuação máxima
- 🔥 Faça **Tetris consecutivos** para back-to-back bonus

## 🔧 **Scripts Disponíveis**

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção  
npm run preview  # Preview da build
```

## 🎨 **Personalização**

### **Cores do Tema**
Edite `tailwind.config.js` para personalizar as cores:

```javascript
colors: {
  cat: {
    pink: '#FFB6C1',
    orange: '#FFA500', 
    yellow: '#FFD700',
    blue: '#87CEEB',
    green: '#98FB98',
    purple: '#DDA0DD',
    red: '#FF6B6B'
  }
}
```

### **Sons Personalizados**
Substitua os arquivos em `public/sounds/`:
- `meow.mp3` - Som de colocação de peça
- `line-clear.mp3` - Som de limpeza de linha  
- `game-over.mp3` - Som de game over

## 🤝 **Contribuição**

### **Como Contribuir**
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### **Ideias para Contribuição**
- 🎮 Modo multiplayer online
- 🏆 Sistema de conquistas  
- 📊 Gráficos de performance
- 🎨 Novos temas visuais
- 🤖 IA para sugestão de jogadas
- 🌐 Internacionalização (i18n)

## 📊 **Performance & Qualidade**

- ✅ **60 FPS** garantidos com requestAnimationFrame
- ✅ **Código limpo** sem console.logs ou comentários desnecessários
- ✅ **Arquitetura escalável** com design patterns
- ✅ **Error handling** robusto
- ✅ **Memory efficient** com cleanup adequado
- ✅ **Mobile optimized** com touch events

## 📄 **Licença**

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🌟 **Créditos**

Desenvolvido com ❤️ usando **React**, **Tailwind CSS** e muito ☕

**Divirta-se jogando Cat Tetris!** 🐱✨

---

*Para documentação técnica detalhada sobre a arquitetura, consulte [REFATORACAO_FINAL.md](./REFATORACAO_FINAL.md)* 