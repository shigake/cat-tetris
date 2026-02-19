const { chromium } = require('playwright');

async function testCatTetris() {
  console.log('🧪 TESTE COMPLETO - CAT TETRIS\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  try {
    // ========================================
    // 1. ABERTURA DA APLICAÇÃO
    // ========================================
    console.log('1️⃣ Abrindo aplicação...');
    await page.goto('http://localhost:5173/cat-tetris/', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/01-menu-principal.png', fullPage: true });
    console.log('   ✅ Aplicação carregada');
    
    // Verificar título
    const title = await page.title();
    console.log(`   📄 Título: ${title || 'Sem título'}`);
    
    // Aguardar React renderizar
    await page.waitForSelector('button, a, [role="button"]', { timeout: 10000 });
    
    // Verificar botões do menu
    const allButtons = await page.locator('button, a, [role="button"]').allTextContents();
    console.log(`   🎮 Elementos clicáveis: ${allButtons.length}`);
    if (allButtons.length > 0) {
      allButtons.slice(0, 10).forEach((btn, i) => {
        if (btn.trim()) console.log(`      ${i+1}. "${btn.trim()}"`);
      });
    }
    
    // ========================================
    // 2. TUTORIAL
    // ========================================
    console.log('\n2️⃣ Testando Tutorial...');
    
    const tutorialButton = await page.locator('button, a').filter({ hasText: /tutorial/i }).first();
    const tutorialExists = await tutorialButton.count() > 0;
    
    if (tutorialExists) {
      console.log('   ✅ Botão Tutorial encontrado');
      await tutorialButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/02-tutorial-hub.png', fullPage: true });
      
      // Aguardar lições carregarem
      await page.waitForSelector('[class*="lesson"], .card, button', { timeout: 5000 }).catch(() => {});
      
      const lessons = await page.locator('[class*="lesson"], .card').count();
      console.log(`   📚 Elementos de lição encontrados: ${lessons}`);
      
      if (lessons > 0) {
        // Clicar na primeira lição
        console.log('   🎯 Abrindo primeira lição...');
        await page.locator('[class*="lesson"], .card').first().click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-results/03-lesson-intro.png', fullPage: true });
        
        // Verificar botões da lição
        const lessonButtons = await page.locator('button').allTextContents();
        const validButtons = lessonButtons.filter(b => b.trim());
        console.log(`   🎮 Botões na lição (${validButtons.length}): ${validButtons.join(', ')}`);
        
        // Procurar botão de demonstração
        const demoButton = await page.locator('button').filter({ hasText: /demonstra/i }).first();
        const demoExists = await demoButton.count() > 0;
        
        if (demoExists) {
          console.log('   ✅ Botão Demonstração encontrado - clicando...');
          await demoButton.click();
          await page.waitForTimeout(4000);
          await page.screenshot({ path: 'test-results/04-demonstration.png', fullPage: true });
          console.log('   ✅ Demonstração aberta - aguardando...');
          
          // Aguardar demonstração por 5 segundos
          await page.waitForTimeout(5000);
          
          // Procurar botão para pular/ir para prática
          const nextButtons = await page.locator('button').filter({ hasText: /pr[aá]tica|pular|skip|pr[oó]ximo/i });
          if (await nextButtons.count() > 0) {
            await nextButtons.first().click();
            await page.waitForTimeout(2000);
            console.log('   ✅ Indo para prática');
          }
        } else {
          console.log('   ℹ️  Botão Demonstração não encontrado - indo direto para prática');
          const practiceButton = await page.locator('button').filter({ hasText: /pr[aá]tica/i }).first();
          if (await practiceButton.count() > 0) {
            await practiceButton.click();
            await page.waitForTimeout(2000);
          }
        }
        
        await page.screenshot({ path: 'test-results/05-practice.png', fullPage: true });
        console.log('   ✅ Modo prática (ou continuação) capturado');
        
        // Voltar ao menu principal
        console.log('   🔙 Voltando ao menu...');
        await page.goto('http://localhost:5173/cat-tetris/', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
      } else {
        console.log('   ⚠️  Nenhuma lição encontrada no hub');
        await page.goto('http://localhost:5173/cat-tetris/', { waitUntil: 'networkidle' });
      }
    } else {
      console.log('   ⚠️  Botão Tutorial não encontrado');
    }
    
    // ========================================
    // 3. MULTIPLAYER
    // ========================================
    console.log('\n3️⃣ Testando Multiplayer...');
    
    const multiplayerButton = await page.locator('button, a').filter({ hasText: /multiplayer/i }).first();
    const multiplayerExists = await multiplayerButton.count() > 0;
    
    if (multiplayerExists) {
      console.log('   ✅ Botão Multiplayer encontrado');
      await multiplayerButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/06-multiplayer-menu.png', fullPage: true });
      
      const mpButtons = await page.locator('button').allTextContents();
      const validMp = mpButtons.filter(b => b.trim());
      console.log(`   🎮 Opções (${validMp.length}): ${validMp.join(', ')}`);
      
      // Voltar
      await page.goto('http://localhost:5173/cat-tetris/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
    } else {
      console.log('   ⚠️  Botão Multiplayer não encontrado');
    }
    
    // ========================================
    // 4. JOGAR CLÁSSICO
    // ========================================
    console.log('\n4️⃣ Testando Jogo Clássico...');
    
    const playButton = await page.locator('button, a').filter({ hasText: /jogar|play|cl[aá]ssico|iniciar/i }).first();
    const playExists = await playButton.count() > 0;
    
    if (playExists) {
      console.log('   ✅ Botão Jogar encontrado');
      await playButton.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'test-results/07-gameplay-start.png', fullPage: true });
      
      // Verificar board
      const board = await page.locator('[class*="board"], canvas, svg').count();
      console.log(`   🎮 Elementos de jogo encontrados: ${board}`);
      
      if (board > 0) {
        // Simular algumas jogadas
        console.log('   🕹️  Simulando jogadas...');
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(300);
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(300);
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(300);
        await page.keyboard.press('Space');
        await page.waitForTimeout(500);
        
        await page.screenshot({ path: 'test-results/08-gameplay-action.png', fullPage: true });
        console.log('   ✅ Jogabilidade testada');
      }
    } else {
      console.log('   ⚠️  Botão Jogar não encontrado');
    }
    
    // ========================================
    // RESUMO
    // ========================================
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DOS TESTES');
    console.log('='.repeat(60));
    console.log(`Aplicação: ${allButtons.length > 0 ? '✅ SIM' : '❌ NÃO'} (${allButtons.length} elementos)`);
    console.log(`Tutorial: ${tutorialExists ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`Multiplayer: ${multiplayerExists ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`Gameplay: ${playExists ? '✅ SIM' : '❌ NÃO'}`);
    console.log('='.repeat(60));
    console.log('\n📸 Screenshots salvos em: test-results/');
    console.log('✅ TESTE COMPLETO!\n');
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message);
    console.error('Stack:', error.stack);
    await page.screenshot({ path: 'test-results/ERROR.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testCatTetris();
