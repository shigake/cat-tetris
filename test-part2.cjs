const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const screenshotsDir = path.join(__dirname, 'test-results');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testRemaining() {
  console.log('🎬 Continuando testes - Parte 2...\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
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
    console.log('📱 Carregando...');
    await page.goto('http://localhost:5173/cat-tetris/');
    await sleep(3000);
    
    // Pular tutorial se aparecer
    try {
      const skipBtn = page.locator('button').filter({ hasText: 'Pular' }).first();
      if (await skipBtn.isVisible({ timeout: 2000 })) {
        await skipBtn.click();
        await sleep(1000);
      }
    } catch (e) {}
    
    // 6. MODOS DE JOGO
    console.log('\n🎯 6. Testando Modos de Jogo...');
    try {
      await page.locator('button', { hasText: 'Modos' }).or(page.getByRole('button', { name: /Modos de Jogo/i })).first().click({ timeout: 5000 });
      await sleep(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '06-modos-jogo.png'),
        fullPage: true 
      });
      console.log('   ✅ Screenshot: Modos de Jogo');
      await page.getByRole('button', { name: '✕' }).first().click();
      await sleep(1000);
    } catch (e) {
      console.log('   ⚠️  Modo de Jogo não encontrado');
    }
    
    // 7. LEADERBOARD
    console.log('\n🏆 7. Testando Ranking...');
    try {
      await page.getByRole('button', { name: /Ranking/i }).or(page.locator('text=Ranking')).first().click({ timeout: 5000 });
      await sleep(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '07-leaderboard.png'),
        fullPage: true 
      });
      console.log('   ✅ Screenshot: Leaderboard');
      await page.getByRole('button', { name: '✕' }).first().click();
      await sleep(1000);
    } catch (e) {
      console.log('   ⚠️  Leaderboard não encontrado');
    }
    
    // 8. MULTIPLAYER
    console.log('\n🎮 8. Testando Multiplayer...');
    try {
      await page.getByRole('button', { name: /Multiplayer/i }).or(page.locator('text=Multiplayer')).first().click({ timeout: 5000 });
      await sleep(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '08-multiplayer-menu.png'),
        fullPage: true 
      });
      console.log('   ✅ Screenshot: Multiplayer Menu');
      
      // vs IA
      console.log('\n🤖 8.1. Config vs IA...');
      await page.locator('button:has-text("vs IA")').first().click();
      await sleep(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '08.1-vs-ia-config.png'),
        fullPage: true 
      });
      console.log('   ✅ Screenshot: Config vs IA');
      
      // Mostrar dificuldades
      await page.locator('button:has-text("Expert")').first().click();
      await sleep(500);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '08.2-vs-ia-expert.png'),
        fullPage: true 
      });
      console.log('   ✅ Screenshot: IA Expert');
      
      await page.locator('button:has-text("Voltar")').first().click();
      await sleep(1000);
      
      // 1v1 Local
      console.log('\n👥 8.2. Config 1v1 Local...');
      await page.locator('button:has-text("1v1 Local")').first().click();
      await sleep(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '08.3-1v1-local-config.png'),
        fullPage: true 
      });
      console.log('   ✅ Screenshot: Config 1v1 Local');
      
      await page.locator('button:has-text("Voltar")').first().click();
      await sleep(500);
      await page.getByRole('button', { name: '✕' }).first().click();
      await sleep(1000);
    } catch (e) {
      console.log('   ⚠️  Multiplayer erro:', e.message);
    }
    
    // 9. GAMEPLAY
    console.log('\n🎮 9. Testando Gameplay...');
    try {
      const playButtons = await page.getByRole('button').filter({ hasText: /Jogar|Novo Jogo/i }).all();
      if (playButtons.length > 0) {
        await playButtons[0].click();
        await sleep(3000);
        await page.screenshot({ 
          path: path.join(screenshotsDir, '09-gameplay-inicial.png'),
          fullPage: true 
        });
        console.log('   ✅ Screenshot: Gameplay Inicial');
        
        // Simular jogadas
        console.log('   🎮 Simulando jogadas...');
        for (let i = 0; i < 8; i++) {
          await page.keyboard.press('ArrowLeft');
          await sleep(200);
          await page.keyboard.press('ArrowDown');
          await sleep(200);
          await page.keyboard.press('ArrowUp');
          await sleep(200);
          await page.keyboard.press('Space');
          await sleep(400);
        }
        
        await page.screenshot({ 
          path: path.join(screenshotsDir, '09.1-gameplay-acao.png'),
          fullPage: true 
        });
        console.log('   ✅ Screenshot: Gameplay em Ação');
        
        // Pausar
        await page.keyboard.press('KeyP');
        await sleep(1500);
        await page.screenshot({ 
          path: path.join(screenshotsDir, '09.2-gameplay-pausado.png'),
          fullPage: true 
        });
        console.log('   ✅ Screenshot: Jogo Pausado');
        
        // Voltar
        await page.locator('button:has-text("Menu")').first().click();
        await sleep(2000);
      }
    } catch (e) {
      console.log('   ⚠️  Gameplay erro:', e.message);
    }
    
    // Screenshot final
    await page.screenshot({ 
      path: path.join(screenshotsDir, '10-menu-final.png'),
      fullPage: true 
    });
    console.log('\n📸 ✅ Screenshot Final\n');
    
    console.log('✅ TESTES COMPLETOS!');
    console.log(`\n📁 Screenshots: ${screenshotsDir}`);
    console.log('🎬 Vídeo será salvo ao fechar...\n');
    
    await sleep(3000);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await context.close();
    await browser.close();
    console.log('✅ Concluído!');
  }
}

testRemaining().catch(console.error);
