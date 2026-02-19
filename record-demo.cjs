const { chromium } = require('playwright');

async function recordGameplayDemo() {
  console.log('🎬 Gravando vídeo demonstrativo do Cat Tetris...\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500  // Mais lento para ficar cinematográfico
  });
  
  const context = await browser.newContext({
    recordVideo: {
      dir: './test-results/',
      size: { width: 1920, height: 1080 }
    },
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📱 1. Abrindo Cat Tetris...');
    await page.goto('http://localhost:5173/cat-tetris/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('📖 2. Mostrando Tutorial...');
    // Se tutorial aparecer, avançar rápido
    try {
      const tutorialVisible = await page.isVisible('text="Tutorial"', { timeout: 2000 });
      if (tutorialVisible) {
        await page.click('text="Próximo"', { timeout: 1000 }).catch(() => {});
        await page.waitForTimeout(1500);
        await page.click('text="Próximo"', { timeout: 1000 }).catch(() => {});
        await page.waitForTimeout(1500);
        await page.click('text="Pular"', { timeout: 1000 }).catch(() => {});
        await page.waitForTimeout(1000);
      }
    } catch (e) {}
    
    console.log('🎮 3. Menu Principal - Tour completo...');
    await page.waitForTimeout(2000);
    
    // Mostrar Missões
    console.log('   📋 Mostrando Missões Diárias...');
    await page.click('text="Missões Diárias"');
    await page.waitForTimeout(3000);
    await page.click('button:has-text("✕")');
    await page.waitForTimeout(1000);
    
    // Mostrar Conquistas
    console.log('   🏆 Mostrando Conquistas...');
    await page.click('text="Conquistas"');
    await page.waitForTimeout(3000);
    // Rolar para ver mais conquistas
    await page.evaluate(() => {
      const modal = document.querySelector('[class*="overflow"]');
      if (modal) modal.scrollBy(0, 300);
    });
    await page.waitForTimeout(2000);
    await page.click('button:has-text("✕")');
    await page.waitForTimeout(1000);
    
    // Mostrar Loja
    console.log('   🛍️ Mostrando Loja de Temas...');
    await page.click('text="Loja"');
    await page.waitForTimeout(3000);
    // Rolar pela loja
    await page.evaluate(() => {
      const modal = document.querySelector('[class*="overflow"]');
      if (modal) modal.scrollBy(0, 400);
    });
    await page.waitForTimeout(2000);
    await page.click('button:has-text("✕")');
    await page.waitForTimeout(1000);
    
    // Mostrar Ranking
    console.log('   🌍 Mostrando Leaderboard...');
    await page.click('text="Ranking"');
    await page.waitForTimeout(3000);
    await page.click('button:has-text("✕")');
    await page.waitForTimeout(1000);
    
    // Mostrar Multiplayer
    console.log('   🎮 Mostrando Multiplayer...');
    await page.click('text="Multiplayer"');
    await page.waitForTimeout(3000);
    // Mostrar vs IA
    await page.click('text="vs IA"');
    await page.waitForTimeout(2000);
    await page.click('text="Voltar"');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("✕")');
    await page.waitForTimeout(1000);
    
    // Iniciar Gameplay
    console.log('🎮 4. Iniciando Gameplay...');
    await page.click('text="Novo Jogo"');
    await page.waitForTimeout(2000);
    
    // Jogar por 15 segundos (automatizado)
    console.log('   🕹️ Gameplay automático (15s)...');
    const moves = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'];
    
    for (let i = 0; i < 30; i++) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      await page.keyboard.press(randomMove);
      await page.waitForTimeout(500);
    }
    
    console.log('   ⏸️ Pausando jogo...');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(2000);
    
    console.log('   📊 Voltando ao menu...');
    try {
      await page.click('text="Menu"', { timeout: 3000 });
    } catch (e) {
      await page.click('text="Sair"', { timeout: 3000 }).catch(() => {});
    }
    await page.waitForTimeout(2000);
    
    // Final - Menu principal
    console.log('🏁 5. Tela final - Menu Principal...');
    await page.waitForTimeout(3000);
    
    console.log('\n✅ Gravação concluída!');
    console.log('⏳ Processando vídeo...');
    
  } catch (error) {
    console.error('❌ Erro durante gravação:', error.message);
  } finally {
    await context.close();
    await browser.close();
  }
  
  console.log('\n🎬 VÍDEO SALVO EM: test-results/');
  console.log('📹 Formato: WebM (VP8)');
  console.log('📐 Resolução: 1920x1080 (Full HD)');
  console.log('⏱️ Duração: ~45-60 segundos');
  console.log('\n🎉 Vídeo demonstrativo completo!');
}

recordGameplayDemo().catch(console.error);
