const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Criar pasta para screenshots e vídeos
const screenshotsDir = path.join(__dirname, 'test-results');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testCatTetris() {
  console.log('🎬 Iniciando testes do Cat Tetris...\n');
  
  // Lançar browser com gravação de vídeo
  const browser = await chromium.launch({
    headless: false, // Mostrar browser
    slowMo: 500 // Slow motion para melhor visualização
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: screenshotsDir,
      size: { width: 1920, height: 1080 }
    }
  });
  
  const page = await context.newPage();
  
  try {
    // 1. CARREGAR O JOGO
    console.log('📱 1. Carregando Cat Tetris...');
    await page.goto('http://localhost:5173/cat-tetris/');
    await sleep(2000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '01-menu-inicial.png'),
      fullPage: true 
    });
    console.log('   ✅ Screenshot: Menu Inicial');
    
    // 2. VERIFICAR TUTORIAL (se aparecer)
    console.log('\n📖 2. Verificando Tutorial...');
    const tutorialVisible = await page.isVisible('text=Tutorial').catch(() => false);
    if (tutorialVisible) {
      await sleep(1000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '02-tutorial.png'),
        fullPage: true 
      });
      console.log('   ✅ Screenshot: Tutorial');
      
      // Pular tutorial
      const skipButton = await page.locator('button:has-text("Pular")').first();
      if (await skipButton.isVisible().catch(() => false)) {
        await skipButton.click();
        await sleep(1000);
      }
    }
    
    // 3. TESTAR MISSÕES DIÁRIAS
    console.log('\n📋 3. Testando Missões Diárias...');
    await page.click('text=Missões Diárias');
    await sleep(1500);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '03-missoes-diarias.png'),
      fullPage: true 
    });
    console.log('   ✅ Screenshot: Missões Diárias');
    await page.click('button:has-text("✕")').catch(() => {});
    await sleep(1000);
    
    // 4. TESTAR CONQUISTAS
    console.log('\n🏆 4. Testando Conquistas...');
    await page.click('text=Conquistas');
    await sleep(1500);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '04-conquistas.png'),
      fullPage: true 
    });
    console.log('   ✅ Screenshot: Conquistas');
    await page.click('button:has-text("✕")').catch(() => {});
    await sleep(1000);
    
    // 5. TESTAR LOJA
    console.log('\n🛍️ 5. Testando Loja de Temas...');
    await page.click('text=Loja');
    await sleep(1500);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '05-loja-temas.png'),
      fullPage: true 
    });
    console.log('   ✅ Screenshot: Loja de Temas');
    await page.click('button:has-text("✕")').catch(() => {});
    await sleep(1000);
    
    // 6. TESTAR MODOS DE JOGO
    console.log('\n🎯 6. Testando Modos de Jogo...');
    await page.click('text=Modos de Jogo');
    await sleep(1500);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '06-modos-jogo.png'),
      fullPage: true 
    });
    console.log('   ✅ Screenshot: Modos de Jogo');
    await page.click('button:has-text("✕")').catch(() => {});
    await sleep(1000);
    
    // 7. TESTAR LEADERBOARD
    console.log('\n🏆 7. Testando Ranking Global...');
    await page.click('text=Ranking');
    await sleep(1500);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '07-leaderboard.png'),
      fullPage: true 
    });
    console.log('   ✅ Screenshot: Leaderboard');
    await page.click('button:has-text("✕")').catch(() => {});
    await sleep(1000);
    
    // 8. TESTAR MULTIPLAYER (NOVO!)
    console.log('\n🎮 8. Testando Multiplayer...');
    await page.click('text=Multiplayer');
    await sleep(1500);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '08-multiplayer-menu.png'),
      fullPage: true 
    });
    console.log('   ✅ Screenshot: Multiplayer Menu');
    
    // 8.1. vs IA
    console.log('\n🤖 8.1. Testando vs IA...');
    await page.click('text=vs IA');
    await sleep(1500);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '08.1-vs-ia-config.png'),
      fullPage: true 
    });
    console.log('   ✅ Screenshot: Config vs IA');
    
    // Testar dificuldades
    const difficulties = ['Fácil', 'Médio', 'Difícil', 'Expert'];
    for (const diff of difficulties) {
      await page.click(`text=${diff}`).catch(() => {});
      await sleep(500);
    }
    await page.screenshot({ 
      path: path.join(screenshotsDir, '08.2-vs-ia-dificuldades.png'),
      fullPage: true 
    });
    console.log('   ✅ Screenshot: Dificuldades IA');
    
    await page.click('text=Voltar');
    await sleep(1000);
    
    // 8.2. 1v1 Local
    console.log('\n👥 8.2. Testando 1v1 Local...');
    await page.click('text=1v1 Local');
    await sleep(1500);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '08.3-1v1-local-config.png'),
      fullPage: true 
    });
    console.log('   ✅ Screenshot: Config 1v1 Local');
    
    await page.click('text=Voltar');
    await sleep(500);
    await page.click('button:has-text("✕")').catch(() => {});
    await sleep(1000);
    
    // 9. TESTAR GAMEPLAY
    console.log('\n🎮 9. Testando Gameplay...');
    await page.click('text=Jogar').first();
    await sleep(2000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '09-gameplay-inicial.png'),
      fullPage: true 
    });
    console.log('   ✅ Screenshot: Gameplay Inicial');
    
    // Simular algumas jogadas
    console.log('   🎮 Simulando jogadas...');
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowLeft');
      await sleep(300);
      await page.keyboard.press('ArrowDown');
      await sleep(300);
      await page.keyboard.press('ArrowRight');
      await sleep(300);
      await page.keyboard.press('ArrowUp'); // Rotacionar
      await sleep(300);
      await page.keyboard.press('Space'); // Drop
      await sleep(500);
    }
    
    await page.screenshot({ 
      path: path.join(screenshotsDir, '09.1-gameplay-acao.png'),
      fullPage: true 
    });
    console.log('   ✅ Screenshot: Gameplay em Ação');
    
    // Pausar
    await page.keyboard.press('KeyP');
    await sleep(1000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '09.2-gameplay-pausado.png'),
      fullPage: true 
    });
    console.log('   ✅ Screenshot: Jogo Pausado');
    
    // Sair
    await page.click('text=Menu Principal');
    await sleep(2000);
    
    // 10. SCREENSHOT FINAL
    console.log('\n📸 10. Screenshot Final...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '10-menu-final.png'),
      fullPage: true 
    });
    console.log('   ✅ Screenshot: Menu Final\n');
    
    console.log('✅ TESTES COMPLETOS!');
    console.log(`\n📁 Screenshots salvos em: ${screenshotsDir}`);
    console.log('🎬 Vídeo será salvo ao fechar o browser...\n');
    
    // Aguardar 3 segundos antes de fechar
    await sleep(3000);
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'error.png'),
      fullPage: true 
    });
  } finally {
    await context.close();
    await browser.close();
    console.log('✅ Browser fechado. Vídeo salvo!');
  }
}

// Executar testes
testCatTetris().catch(console.error);
