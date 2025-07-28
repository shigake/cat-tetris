# 🐱 Cat Tetris

Um jogo de Tetris divertido e fofo com tema de gatos, desenvolvido em React e Tailwind CSS!

## 🎮 Funcionalidades

### 🐾 Peças Temáticas de Gatos
- Cada peça do Tetris tem um emoji de gato único
- Cores vibrantes e amigáveis para cada tipo de peça
- Nomes personalizados para cada gatinho

### 🎯 Controles Clássicos
- **Setas ← →**: Mover peças para esquerda/direita
- **Seta ↑**: Girar peça
- **Seta ↓**: Acelerar queda
- **Espaço**: Drop instantâneo
- **Shift**: Guardar peça (hold)
- **P**: Pausar/despausar jogo

### 📊 Sistema de Pontuação
- Pontos por linha removida
- Sistema de combos para mais pontos
- Níveis que aumentam a velocidade
- Recorde salvo no localStorage

### 🎵 Som e Efeitos
- Som de miado ao encaixar peças
- Som animado ao limpar linhas
- Som de game over
- Animações suaves com Framer Motion

### 🎨 Visual Fofo
- Tema colorido e vibrante
- Animações de entrada e saída
- Interface responsiva para mobile e desktop
- Controles touch para dispositivos móveis

## 🚀 Como Jogar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Execute o projeto:**
   ```bash
   npm run dev
   ```

3. **Abra no navegador:**
   - Acesse `http://localhost:3000`
   - O jogo abrirá automaticamente

## 🎯 Objetivo

- Complete linhas horizontais para ganhar pontos
- Quanto mais linhas de uma vez, mais pontos!
- Evite que as peças cheguem ao topo
- Tente bater seu recorde!

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **react-use-sound** - Sistema de som
- **Vite** - Build tool

## 📱 Responsividade

- ✅ Desktop (teclado)
- ✅ Mobile (controles touch)
- ✅ Tablet (ambos os controles)

## 🎨 Personalização

### Cores das Peças
As cores podem ser personalizadas no arquivo `tailwind.config.js`:

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

### Sons
Substitua os arquivos de som na pasta `public/sounds/`:
- `meow.mp3` - Som de miado
- `line-clear.mp3` - Som de limpeza de linha
- `game-over.mp3` - Som de game over

## 🏆 Sistema de Pontuação

- **1 linha**: 100 × nível + combo
- **2 linhas**: 300 × nível + combo
- **3 linhas**: 500 × nível + combo
- **4 linhas**: 800 × nível + combo
- **Combo**: +50 pontos por combo
- **Hard Drop**: +2 pontos por linha

## 🐱 Tipos de Gatos

1. **🐱 Gato Azul (I)** - Linha reta
2. **😺 Gato Amarelo (O)** - Quadrado
3. **😸 Gato Roxo (T)** - T
4. **😻 Gato Verde (S)** - S
5. **😽 Gato Vermelho (Z)** - Z
6. **😹 Gato Laranja (J)** - J
7. **😿 Gato Rosa (L)** - L

## 🎮 Controles Mobile

- **Botões ← →**: Mover
- **Botão 🔄**: Girar
- **Botão ⬇️**: Drop instantâneo
- **Botão ↓**: Acelerar
- **Botão 💾**: Guardar peça
- **Botão ⏸️/▶️**: Pausar/despausar

## 🔧 Desenvolvimento

### Estrutura do Projeto
```
src/
├── components/          # Componentes React
│   ├── TetrisBoard.jsx
│   ├── Scoreboard.jsx
│   ├── Controls.jsx
│   ├── GameOverScreen.jsx
│   └── NextPieces.jsx
├── utils/              # Lógica do jogo
│   ├── GameLogic.js
│   └── PieceGenerator.js
├── App.jsx             # Componente principal
├── main.jsx           # Ponto de entrada
└── index.css          # Estilos globais
```

### Scripts Disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview da build

## 🎉 Recursos Extras

- **Salvamento automático** do recorde
- **Animações fluidas** em todas as interações
- **Interface intuitiva** e amigável
- **Tema consistente** de gatos
- **Performance otimizada**

## 🤝 Contribuição

Sinta-se à vontade para contribuir com melhorias! Algumas ideias:

- Adicionar mais tipos de gatos
- Implementar modo multiplayer
- Criar diferentes temas visuais
- Adicionar power-ups especiais
- Implementar sistema de conquistas

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

---

**Divirta-se jogando com os gatinhos! 🐱✨** 