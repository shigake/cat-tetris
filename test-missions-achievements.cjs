/**
 * test-missions-achievements.cjs
 * Testa se Missões e Conquistas rastreiam durante gameplay
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🧪 TESTANDO MISSÕES E CONQUISTAS...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // 1. Abrir jogo
    console.log('📂 Abrindo jogo...');
    await page.goto('http://localhost:5173/cat-tetris/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 2. Pular tutorial se aparecer
    const skipButton = await page.locator('button:has-text("Pular Tutorial")').first();
    if (await skipButton.isVisible()) {
      console.log('⏭️  Pulando tutorial...');
      await skipButton.click();
      await page.waitForTimeout(1000);
    }

    // 3. Verificar estado inicial das missões
    console.log('\n📋 VERIFICANDO MISSÕES...');
    await page.click('button:has-text("Missões")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/test-missions-before.png' });
    
    const missionsText = await page.locator('.daily-missions-panel, [class*="mission"]').first().textContent();
    console.log('Missões visíveis:', !!missionsText);
    
    await page.click('button:has-text("Fechar"), button:has-text("×")');
    await page.waitForTimeout(500);

    // 4. Verificar conquistas iniciais
    console.log('\n🏆 VERIFICANDO CONQUISTAS...');
    await page.click('button:has-text("Conquistas")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/test-achievements-before.png' });
    
    const achievementsText = await page.locator('[class*="achievement"]').first().textContent();
    console.log('Conquistas visíveis:', !!achievementsText);
    
    await page.click('button:has-text("Fechar"), button:has-text("×")');
    await page.waitForTimeout(500);

    // 5. Iniciar jogo
    console.log('\n🎮 INICIANDO JOGO...');
    await page.click('button:has-text("Jogar")');
    await page.waitForTimeout(2000);

    // 6. Jogar por 30 segundos (ações básicas)
    console.log('🎯 Jogando por 30 segundos...');
    const gameActions = async () => {
      for (let i = 0; i < 30; i++) {
        // Simula jogadas
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(100);
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(100);
        await page.keyboard.press('Space'); // Hard drop
        await page.waitForTimeout(800);
      }
    };
    
    await gameActions();
    await page.screenshot({ path: 'test-results/test-gameplay.png' });

    // 7. Game over (deixar peças subirem)
    console.log('💀 Aguardando game over...');
    await page.waitForTimeout(5000);
    
    const gameOverVisible = await page.locator('text=Game Over, text=Fim de Jogo').isVisible();
    if (gameOverVisible) {
      console.log('✅ Game over detectado');
      await page.screenshot({ path: 'test-results/test-gameover.png' });
    }

    // 8. Voltar ao menu
    await page.click('button:has-text("Menu"), button:has-text("Voltar")');
    await page.waitForTimeout(2000);

    // 9. Verificar missões novamente
    console.log('\n📋 VERIFICANDO PROGRESSO DAS MISSÕES...');
    await page.click('button:has-text("Missões")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/test-missions-after.png' });
    
    // Tentar ler progresso
    const missionProgress = await page.locator('[class*="progress"], [class*="mission"]').allTextContents();
    console.log('Progresso encontrado:', missionProgress.length > 0);
    
    await page.click('button:has-text("Fechar"), button:has-text("×")');
    await page.waitForTimeout(500);

    // 10. Verificar conquistas novamente
    console.log('\n🏆 VERIFICANDO NOVAS CONQUISTAS...');
    await page.click('button:has-text("Conquistas")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/test-achievements-after.png' });
    
    await page.click('button:has-text("Fechar"), button:has-text("×")');
    await page.waitForTimeout(500);

    console.log('\n✅ TESTE COMPLETO!');
    console.log('📸 Screenshots salvos em test-results/');
    console.log('\nVerifique manualmente:');
    console.log('- test-missions-before.png vs test-missions-after.png');
    console.log('- test-achievements-before.png vs test-achievements-after.png');
    console.log('- Se progresso mudou = Tracking funciona ✅');
    console.log('- Se progresso igual = Tracking quebrado ❌');

  } catch (error) {
    console.error('❌ ERRO:', error.message);
    await page.screenshot({ path: 'test-results/test-error.png' });
  }

  await page.waitForTimeout(3000);
  await browser.close();
})();
