# 🚀 Guia de Deploy - Cat Tetris

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Git

---

## 🛠️ Instalação Local

### 1. Clone o repositório

```bash
git clone https://github.com/shigake/cat-tetris.git
cd cat-tetris
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

### 4. Abra no navegador

```
http://localhost:5173/cat-tetris
```

---

## 🏗️ Build para Produção

### 1. Gerar build otimizado

```bash
npm run build
```

Isso cria a pasta `dist/` com os arquivos otimizados.

### 2. Preview do build

```bash
npm run preview
```

---

## 🌐 Deploy

### **Opção 1: Vercel (Recomendado)**

1. Instale Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure:
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `./`

### **Opção 2: Netlify**

1. Instale Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Configure:
- Build command: `npm run build`
- Publish directory: `dist`

### **Opção 3: GitHub Pages**

1. Ajuste `vite.config.js`:
```js
export default defineConfig({
  base: '/cat-tetris/',
  // ...
})
```

2. Adicione ao `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Instale gh-pages:
```bash
npm install --save-dev gh-pages
```

4. Deploy:
```bash
npm run deploy
```

### **Opção 4: Servidor próprio**

1. Build:
```bash
npm run build
```

2. Copie `dist/` para seu servidor

3. Configure servidor web (nginx exemplo):
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    root /var/www/cat-tetris/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔧 Configuração Avançada

### **Customizar Base URL**

Edite `vite.config.js`:

```js
export default defineConfig({
  base: '/seu-caminho/',
  // ...
})
```

### **Variáveis de Ambiente**

Crie `.env.production`:

```env
VITE_APP_NAME=Cat Tetris
VITE_API_URL=https://api.seu-dominio.com
```

### **PWA**

O projeto já está configurado para PWA!

Arquivos importantes:
- `manifest.json` - Configuração do app
- `sw.js` - Service Worker
- `icons/` - Ícones em vários tamanhos

---

## 📱 Mobile

### **iOS (Safari)**

1. Abra no Safari
2. Toque no botão "Compartilhar"
3. Selecione "Adicionar à Tela Inicial"

### **Android (Chrome)**

1. Abra no Chrome
2. Menu (⋮) → "Instalar aplicativo"
3. Confirme instalação

---

## 🧪 Testes

### **Teste automatizado**

```bash
node test-tutorial-system.cjs
```

### **Testes manuais**

1. Tutorial completo
2. Multiplayer (1v1 e vs IA)
3. Missões diárias
4. Conquistas
5. Loja de temas
6. Modos de jogo

---

## 📊 Performance

### **Lighthouse Score Esperado**

- Performance: 95+
- Accessibility: 100
- Best Practices: 95+
- SEO: 100
- PWA: ✅

### **Otimizações Aplicadas**

- Code splitting
- Lazy loading
- Image optimization
- Service Worker caching
- Gzip compression

---

## 🔒 Segurança

### **Headers Recomendados**

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 🐛 Troubleshooting

### **Problema: Página em branco**

- Verifique a configuração do `base` no `vite.config.js`
- Verifique o console do navegador para erros
- Certifique-se de que os arquivos estão no caminho correto

### **Problema: PWA não instala**

- Verifique se está usando HTTPS (localhost é exceção)
- Verifique se `manifest.json` está acessível
- Verifique Service Worker no DevTools

### **Problema: Build falha**

```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📈 Monitoramento

### **Analytics (Opcional)**

Adicione ao `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### **Error Tracking (Opcional)**

Integre Sentry:

```bash
npm install @sentry/react
```

---

## 🔄 Atualizações

### **Para atualizar o projeto**

```bash
git pull origin main
npm install
npm run build
```

### **Versioning**

Use tags Git:

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## 📞 Suporte

- **Issues:** https://github.com/shigake/cat-tetris/issues
- **Documentação:** Ver arquivos `*.md` no repositório
- **Email:** (adicionar se necessário)

---

## ✅ Checklist de Deploy

- [ ] Build gerado sem erros
- [ ] Testes automatizados passando
- [ ] Performance testada (Lighthouse)
- [ ] PWA funcionando
- [ ] Mobile testado (iOS + Android)
- [ ] Backup do código atual
- [ ] Variáveis de ambiente configuradas
- [ ] Analytics configurado (opcional)
- [ ] Domínio configurado
- [ ] HTTPS ativo
- [ ] Service Worker ativo

---

## 🎉 Pronto!

Seu Cat Tetris está no ar! 🚀

**URL de exemplo:** https://seu-dominio.com/cat-tetris

---

**Última atualização:** 2026-02-19  
**Versão:** 1.0.0
