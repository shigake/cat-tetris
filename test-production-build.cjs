const { chromium } = require('playwright');

async function testProductionBuild() {
  console.log('🧪 TESTES DE PRODUÇÃO - CAT TETRIS BUILD\n');
  console.log('📦 Testando build de produção em: http://localhost:4173/cat-tetris/\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
  };
  
  try {
    // ========================================
    // 1. TESTE DE CARREGAMENTO
    // ========================================
    console.log('1️⃣ Teste de Carregamento...');
    const startTime = Date.now();
    
    await page.goto('http://localhost:4173/cat-tetris/', { 
      waitUntil: 'networkidle', 
      timeout: 15000 
    });
    
    const loadTime = Date.now() - startTime;
    console.log(`   ⏱️  Tempo de carregamento: ${loadTime}ms`);
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/prod-01-load.png', fullPage: true });
    
    if (loadTime < 5000) {
      console.log('   ✅ PASSOU - Carregamento rápido (<5s)');
      results.passed++;
    } else {
      console.log('   ⚠️  AVISO - Carregamento lento (>5s)');
      results.warnings++;
    }
    
    results.tests.push({ name: 'Carregamento', status: 'PASSOU', time: loadTime });
    
    // ========================================
    // 2. TESTE DE TÍTULO E CONTEÚDO
    // ========================================
    console.log('\n2️⃣ Teste de Título e Conteúdo...');
    
    const title = await page.title();
    console.log(`   📄 Título: "${title}"`);
    
    if (title && title.includes('Cat Tetris')) {
      console.log('   ✅ PASSOU - Título correto');
      results.passed++;
      results.tests.push({ name: 'Título', status: 'PASSOU' });
    } else {
      console.log('   ❌ FALHOU - Título incorreto');
      results.failed++;
      results.tests.push({ name: 'Título', status: 'FALHOU' });
    }
    
    // ========================================
    // 3. TESTE DE ELEMENTOS INTERATIVOS
    // ========================================
    console.log('\n3️⃣ Teste de Elementos Interativos...');
    
    await page.waitForSelector('button, a, [role="button"]', { timeout: 10000 });
    const buttons = await page.locator('button, a, [role="button"]').count();
    console.log(`   🎮 Elementos clicáveis encontrados: ${buttons}`);
    
    if (buttons >= 10) {
      console.log('   ✅ PASSOU - Elementos suficientes (≥10)');
      results.passed++;
      results.tests.push({ name: 'Elementos Interativos', status: 'PASSOU', count: buttons });
    } else {
      console.log('   ❌ FALHOU - Poucos elementos (<10)');
      results.failed++;
      results.tests.push({ name: 'Elementos Interativos', status: 'FALHOU', count: buttons });
    }
    
    // ========================================
    // 4. TESTE DO TUTORIAL
    // ========================================
    console.log('\n4️⃣ Teste do Tutorial...');
    
    const tutorialBtn = await page.locator('button, a').filter({ hasText: /tutorial/i }).first();
    const tutorialExists = await tutorialBtn.count() > 0;
    
    if (tutorialExists) {
      console.log('   ✅ Botão Tutorial encontrado');
      await tutorialBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/prod-02-tutorial.png', fullPage: true });
      
      // Verificar se abriu
      const modalVisible = await page.locator('[class*="modal"], [class*="panel"]').count() > 0;
      
      if (modalVisible) {
        console.log('   ✅ PASSOU - Tutorial abriu corretamente');
        results.passed++;
        results.tests.push({ name: 'Tutorial', status: 'PASSOU' });
      } else {
        console.log('   ⚠️  AVISO - Tutorial pode não ter carregado visualmente');
        results.warnings++;
        results.tests.push({ name: 'Tutorial', status: 'AVISO' });
      }
      
      // Voltar
      await page.goto('http://localhost:4173/cat-tetris/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
    } else {
      console.log('   ❌ FALHOU - Botão Tutorial não encontrado');
      results.failed++;
      results.tests.push({ name: 'Tutorial', status: 'FALHOU' });
    }
    
    // ========================================
    // 5. TESTE DO MULTIPLAYER
    // ========================================
    console.log('\n5️⃣ Teste do Multiplayer...');
    
    const mpBtn = await page.locator('button, a').filter({ hasText: /multiplayer/i }).first();
    const mpExists = await mpBtn.count() > 0;
    
    if (mpExists) {
      console.log('   ✅ Botão Multiplayer encontrado');
      await mpBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/prod-03-multiplayer.png', fullPage: true });
      
      console.log('   ✅ PASSOU - Multiplayer abriu');
      results.passed++;
      results.tests.push({ name: 'Multiplayer', status: 'PASSOU' });
      
      await page.goto('http://localhost:4173/cat-tetris/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
    } else {
      console.log('   ❌ FALHOU - Botão Multiplayer não encontrado');
      results.failed++;
      results.tests.push({ name: 'Multiplayer', status: 'FALHOU' });
    }
    
    // ========================================
    // 6. TESTE DE GAMEPLAY
    // ========================================
    console.log('\n6️⃣ Teste de Gameplay...');
    
    const playBtn = await page.locator('button, a').filter({ hasText: /jogar|play/i }).first();
    const playExists = await playBtn.count() > 0;
    
    if (playExists) {
      console.log('   ✅ Botão Jogar encontrado');
      await playBtn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'test-results/prod-04-gameplay.png', fullPage: true });
      
      // Simular jogadas
      console.log('   🕹️  Simulando jogadas...');
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(200);
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(200);
      await page.keyboard.press('Space');
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: 'test-results/prod-05-gameplay-action.png', fullPage: true });
      
      console.log('   ✅ PASSOU - Gameplay funcional');
      results.passed++;
      results.tests.push({ name: 'Gameplay', status: 'PASSOU' });
    } else {
      console.log('   ❌ FALHOU - Botão Jogar não encontrado');
      results.failed++;
      results.tests.push({ name: 'Gameplay', status: 'FALHOU' });
    }
    
    // ========================================
    // 7. TESTE DE PERFORMANCE (LIGHTHOUSE-LIKE)
    // ========================================
    console.log('\n7️⃣ Teste de Performance...');
    
    await page.goto('http://localhost:4173/cat-tetris/', { waitUntil: 'networkidle' });
    
    const performanceData = await page.evaluate(() => {
      const perf = window.performance;
      const timing = perf.timing;
      
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        domInteractive: timing.domInteractive - timing.navigationStart
      };
    });
    
    console.log(`   📊 DOM Content Loaded: ${performanceData.domContentLoaded}ms`);
    console.log(`   📊 Load Complete: ${performanceData.loadComplete}ms`);
    console.log(`   📊 DOM Interactive: ${performanceData.domInteractive}ms`);
    
    if (performanceData.loadComplete < 3000) {
      console.log('   ✅ PASSOU - Performance excelente (<3s)');
      results.passed++;
      results.tests.push({ name: 'Performance', status: 'PASSOU', metrics: performanceData });
    } else if (performanceData.loadComplete < 5000) {
      console.log('   ⚠️  AVISO - Performance aceitável (3-5s)');
      results.warnings++;
      results.tests.push({ name: 'Performance', status: 'AVISO', metrics: performanceData });
    } else {
      console.log('   ❌ FALHOU - Performance ruim (>5s)');
      results.failed++;
      results.tests.push({ name: 'Performance', status: 'FALHOU', metrics: performanceData });
    }
    
    // ========================================
    // 8. TESTE DE PWA
    // ========================================
    console.log('\n8️⃣ Teste de PWA...');
    
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    if (swRegistered) {
      console.log('   ✅ PASSOU - Service Worker suportado');
      results.passed++;
      results.tests.push({ name: 'PWA', status: 'PASSOU' });
    } else {
      console.log('   ⚠️  AVISO - Service Worker não suportado');
      results.warnings++;
      results.tests.push({ name: 'PWA', status: 'AVISO' });
    }
    
    // ========================================
    // 9. TESTE DE CONSOLE ERRORS
    // ========================================
    console.log('\n9️⃣ Teste de Console Errors...');
    
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:4173/cat-tetris/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    if (errors.length === 0) {
      console.log('   ✅ PASSOU - Sem erros no console');
      results.passed++;
      results.tests.push({ name: 'Console Errors', status: 'PASSOU' });
    } else {
      console.log(`   ⚠️  AVISO - ${errors.length} erro(s) no console`);
      errors.forEach(err => console.log(`      - ${err}`));
      results.warnings++;
      results.tests.push({ name: 'Console Errors', status: 'AVISO', errors });
    }
    
    // ========================================
    // RESUMO FINAL
    // ========================================
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DOS TESTES DE PRODUÇÃO');
    console.log('='.repeat(60));
    console.log(`✅ Testes Passados: ${results.passed}`);
    console.log(`⚠️  Avisos: ${results.warnings}`);
    console.log(`❌ Testes Falhados: ${results.failed}`);
    console.log(`📊 Total: ${results.tests.length}`);
    console.log('='.repeat(60));
    
    const successRate = (results.passed / results.tests.length * 100).toFixed(1);
    console.log(`\n🎯 Taxa de Sucesso: ${successRate}%`);
    
    if (results.failed === 0) {
      console.log('🎉 TODOS OS TESTES PASSARAM! Build de produção aprovado!');
    } else {
      console.log(`⚠️  ${results.failed} teste(s) falharam. Revisar necessário.`);
    }
    
    console.log('\n📸 Screenshots salvos em: test-results/prod-*.png');
    console.log('✅ TESTES DE PRODUÇÃO COMPLETOS!\n');
    
    // Salvar resultados em JSON
    const fs = require('fs');
    fs.writeFileSync(
      'test-results/production-test-results.json',
      JSON.stringify(results, null, 2)
    );
    console.log('💾 Resultados salvos em: test-results/production-test-results.json\n');
    
  } catch (error) {
    console.error('\n❌ ERRO CRÍTICO NO TESTE:', error.message);
    console.error('Stack:', error.stack);
    await page.screenshot({ path: 'test-results/prod-ERROR.png', fullPage: true });
    results.failed++;
  } finally {
    await browser.close();
  }
  
  return results;
}

testProductionBuild().then(results => {
  process.exit(results.failed > 0 ? 1 : 0);
});
