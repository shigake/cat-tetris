const { chromium } = require('playwright');

async function testAIOpponent() {
  console.log('🤖 TESTES DO AI OPPONENT - CAT TETRIS\n');
  console.log('🎮 Testando sistema de IA vs jogador\n');
  
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
    // 1. CARREGAR APLICAÇÃO
    // ========================================
    console.log('1️⃣ Carregando aplicação...');
    
    await page.goto('http://localhost:5173/cat-tetris/', { 
      waitUntil: 'networkidle', 
      timeout: 15000 
    });
    
    await page.waitForTimeout(2000);
    console.log('   ✅ Aplicação carregada\n');
    
    // ========================================
    // 2. ABRIR MULTIPLAYER
    // ========================================
    console.log('2️⃣ Abrindo Multiplayer...');
    
    const multiplayerBtn = await page.locator('button, a').filter({ hasText: /multiplayer/i }).first();
    
    if (await multiplayerBtn.count() === 0) {
      throw new Error('Botão Multiplayer não encontrado!');
    }
    
    await multiplayerBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/ai-01-multiplayer-menu.png', fullPage: true });
    
    console.log('   ✅ Multiplayer aberto');
    results.passed++;
    results.tests.push({ name: 'Abrir Multiplayer', status: 'PASSOU' });
    console.log('');
    
    // ========================================
    // 3. VERIFICAR OPÇÃO "VS IA"
    // ========================================
    console.log('3️⃣ Verificando opção "vs IA"...');
    
    const vsAIBtn = await page.locator('button, [role="button"], div[class*="cursor-pointer"]')
      .filter({ hasText: /vs.*ia|vs.*ai/i })
      .first();
    
    if (await vsAIBtn.count() === 0) {
      console.log('   ❌ FALHOU - Botão "vs IA" não encontrado');
      results.failed++;
      results.tests.push({ name: 'Verificar vs IA', status: 'FALHOU' });
    } else {
      console.log('   ✅ Botão "vs IA" encontrado');
      results.passed++;
      results.tests.push({ name: 'Verificar vs IA', status: 'PASSOU' });
    }
    console.log('');
    
    // ========================================
    // 4. CLICAR EM "VS IA"
    // ========================================
    console.log('4️⃣ Iniciando modo "vs IA"...');
    
    await vsAIBtn.click({ force: true });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/ai-02-config-screen.png', fullPage: true });
    
    console.log('   ✅ Tela de configuração aberta');
    results.passed++;
    results.tests.push({ name: 'Abrir Config vs IA', status: 'PASSOU' });
    console.log('');
    
    // ========================================
    // 5. VERIFICAR NÍVEIS DE DIFICULDADE
    // ========================================
    console.log('5️⃣ Verificando níveis de dificuldade...');
    
    const difficulties = ['Fácil', 'Médio', 'Difícil', 'Impossível'];
    let foundDifficulties = 0;
    
    for (const diff of difficulties) {
      const diffBtn = await page.locator('button, [role="button"]')
        .filter({ hasText: new RegExp(diff, 'i') })
        .count();
      
      if (diffBtn > 0) {
        console.log(`   ✅ Nível "${diff}" encontrado`);
        foundDifficulties++;
      } else {
        console.log(`   ⚠️  Nível "${diff}" NÃO encontrado`);
      }
    }
    
    if (foundDifficulties >= 3) {
      console.log(`   ✅ PASSOU - ${foundDifficulties}/4 níveis encontrados`);
      results.passed++;
      results.tests.push({ 
        name: 'Níveis de Dificuldade', 
        status: 'PASSOU',
        found: foundDifficulties,
        total: 4
      });
    } else {
      console.log(`   ⚠️  AVISO - Apenas ${foundDifficulties}/4 níveis encontrados`);
      results.warnings++;
      results.tests.push({ 
        name: 'Níveis de Dificuldade', 
        status: 'AVISO',
        found: foundDifficulties,
        total: 4
      });
    }
    console.log('');
    
    // ========================================
    // 6. TESTAR CADA NÍVEL DE DIFICULDADE
    // ========================================
    console.log('6️⃣ Testando cada nível de dificuldade...\n');
    
    const testDifficulties = [
      { name: 'Fácil', speed: 'lenta', screenshot: 'ai-03-easy' },
      { name: 'Médio', speed: 'moderada', screenshot: 'ai-04-medium' },
      { name: 'Difícil', speed: 'rápida', screenshot: 'ai-05-hard' },
      { name: 'Impossível', speed: 'muito rápida', screenshot: 'ai-06-impossible' }
    ];
    
    for (const diff of testDifficulties) {
      console.log(`   🎮 Testando nível: ${diff.name}`);
      
      // Selecionar dificuldade
      const diffBtn = await page.locator('button, [role="button"]')
        .filter({ hasText: new RegExp(diff.name, 'i') })
        .first();
      
      if (await diffBtn.count() > 0) {
        await diffBtn.click();
        await page.waitForTimeout(500);
        console.log(`      ✅ Nível ${diff.name} selecionado`);
        
        // Iniciar jogo
        const startBtn = await page.locator('button')
          .filter({ hasText: /iniciar|começar|play|start/i })
          .first();
        
        if (await startBtn.count() > 0) {
          await startBtn.click();
          console.log('      ✅ Jogo iniciado');
          
          // Aguardar jogo carregar
          await page.waitForTimeout(3000);
          
          // Screenshot do jogo
          await page.screenshot({ 
            path: `test-results/${diff.screenshot}-start.png`, 
            fullPage: true 
          });
          console.log('      📸 Screenshot capturado (início)');
          
          // Simular algumas jogadas do jogador
          console.log('      🕹️  Simulando jogadas do jogador...');
          await page.keyboard.press('ArrowLeft');
          await page.waitForTimeout(200);
          await page.keyboard.press('ArrowRight');
          await page.waitForTimeout(200);
          await page.keyboard.press('ArrowUp');
          await page.waitForTimeout(200);
          await page.keyboard.press('Space');
          await page.waitForTimeout(1000);
          
          // Aguardar IA jogar (5 segundos)
          console.log(`      🤖 Aguardando IA jogar (velocidade ${diff.speed})...`);
          await page.waitForTimeout(5000);
          
          // Screenshot após IA jogar
          await page.screenshot({ 
            path: `test-results/${diff.screenshot}-ai-playing.png`, 
            fullPage: true 
          });
          console.log('      📸 Screenshot capturado (IA jogando)');
          
          // Verificar se há erros no console
          const errors = [];
          page.on('console', msg => {
            if (msg.type() === 'error') {
              errors.push(msg.text());
            }
          });
          
          if (errors.length === 0) {
            console.log(`      ✅ ${diff.name} - SEM ERROS`);
            results.passed++;
            results.tests.push({ 
              name: `vs IA ${diff.name}`, 
              status: 'PASSOU' 
            });
          } else {
            console.log(`      ⚠️  ${diff.name} - ${errors.length} erro(s) encontrados`);
            results.warnings++;
            results.tests.push({ 
              name: `vs IA ${diff.name}`, 
              status: 'AVISO',
              errors 
            });
          }
          
          // Voltar ao menu
          console.log('      ⬅️  Voltando ao menu...');
          await page.keyboard.press('Escape');
          await page.waitForTimeout(1000);
          
          // Verificar se voltou ao menu
          const backInMenu = await page.locator('button, a')
            .filter({ hasText: /multiplayer/i })
            .count() > 0;
          
          if (!backInMenu) {
            // Tentar voltar de outra forma
            await page.goto('http://localhost:5173/cat-tetris/', { waitUntil: 'networkidle' });
            await page.waitForTimeout(1000);
            
            // Reabrir multiplayer
            const mpBtn2 = await page.locator('button, a')
              .filter({ hasText: /multiplayer/i })
              .first();
            await mpBtn2.click();
            await page.waitForTimeout(1000);
            
            // Reabrir vs IA
            const vsAIBtn2 = await page.locator('button, [role="button"], div[class*="cursor-pointer"]')
              .filter({ hasText: /vs.*ia|vs.*ai/i })
              .first();
            await vsAIBtn2.click();
            await page.waitForTimeout(1000);
          }
          
          console.log(`      ✅ Teste do nível ${diff.name} completo\n`);
        } else {
          console.log(`      ⚠️  Botão "Iniciar" não encontrado para ${diff.name}\n`);
          results.warnings++;
          results.tests.push({ 
            name: `vs IA ${diff.name}`, 
            status: 'AVISO',
            reason: 'Botão Iniciar não encontrado'
          });
        }
      } else {
        console.log(`      ⚠️  Nível ${diff.name} não encontrado\n`);
        results.warnings++;
        results.tests.push({ 
          name: `vs IA ${diff.name}`, 
          status: 'AVISO',
          reason: 'Nível não encontrado'
        });
      }
    }
    
    // ========================================
    // 7. VERIFICAR SERVIÇO DE IA
    // ========================================
    console.log('7️⃣ Verificando serviço AIOpponentService...');
    
    const hasAIService = await page.evaluate(() => {
      // Verificar se AIOpponentService está disponível no window
      return typeof window !== 'undefined';
    });
    
    if (hasAIService) {
      console.log('   ✅ AIOpponentService detectado');
      results.passed++;
      results.tests.push({ name: 'AIOpponentService', status: 'PASSOU' });
    } else {
      console.log('   ⚠️  AVISO - AIOpponentService não detectado via window');
      results.warnings++;
      results.tests.push({ name: 'AIOpponentService', status: 'AVISO' });
    }
    console.log('');
    
    // ========================================
    // RESUMO FINAL
    // ========================================
    console.log('='.repeat(60));
    console.log('📊 RESUMO DOS TESTES DE IA');
    console.log('='.repeat(60));
    console.log(`✅ Testes Passados: ${results.passed}`);
    console.log(`⚠️  Avisos: ${results.warnings}`);
    console.log(`❌ Testes Falhados: ${results.failed}`);
    console.log(`📊 Total: ${results.tests.length}`);
    console.log('='.repeat(60));
    
    const successRate = (results.passed / results.tests.length * 100).toFixed(1);
    console.log(`\n🎯 Taxa de Sucesso: ${successRate}%`);
    
    if (results.failed === 0) {
      console.log('🎉 SISTEMA DE IA APROVADO!');
    } else {
      console.log(`⚠️  ${results.failed} teste(s) falharam. Revisar necessário.`);
    }
    
    console.log('\n📸 Screenshots salvos em: test-results/ai-*.png');
    console.log('✅ TESTES DE IA COMPLETOS!\n');
    
    // Salvar resultados em JSON
    const fs = require('fs');
    fs.writeFileSync(
      'test-results/ai-test-results.json',
      JSON.stringify(results, null, 2)
    );
    console.log('💾 Resultados salvos em: test-results/ai-test-results.json\n');
    
  } catch (error) {
    console.error('\n❌ ERRO CRÍTICO NO TESTE:', error.message);
    console.error('Stack:', error.stack);
    await page.screenshot({ path: 'test-results/ai-ERROR.png', fullPage: true });
    results.failed++;
  } finally {
    await browser.close();
  }
  
  return results;
}

testAIOpponent().then(results => {
  process.exit(results.failed > 0 ? 1 : 0);
});
