const { chromium } = require('playwright');

async function auditAllFeatures() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 800
  });
  
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  console.log('\n🔍 AUDITORIA COMPLETA - TESTANDO TODAS AS FEATURES\n');
  console.log('='.repeat(60));
  
  const results = {
    tutorial: { status: '?', details: '' },
    gameplay: { status: '?', details: '' },
    missions: { status: '?', details: '' },
    achievements: { status: '?', details: '' },
    shop: { status: '?', details: '' },
    leaderboard: { status: '?', details: '' },
    multiplayer: { status: '?', details: '' },
    gameModes: { status: '?', details: '' },
    settings: { status: '?', details: '' }
  };
  
  const errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('404') && !msg.text().includes('favicon')) {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', err => {
    errors.push(`PAGE ERROR: ${err.message}`);
  });
  
  await page.goto('http://localhost:5173/cat-tetris/');
  await page.waitForTimeout(2000);
  
  // ============================================================
  // 1. TUTORIAL
  // ============================================================
  console.log('\n1️⃣  TESTANDO TUTORIAL...');
  
  try {
    const tutorialVisible = await page.isVisible('text="Tutorial"', { timeout: 2000 });
    if (tutorialVisible) {
      const tutorialState = await page.evaluate(() => {
        const hasNextButton = document.body.innerHTML.includes('Próximo');
        const hasSkipButton = document.body.innerHTML.includes('Pular');
        const hasContent = document.body.innerHTML.includes('Bem-vindo') || 
                          document.body.innerHTML.includes('controles');
        return { hasNextButton, hasSkipButton, hasContent };
      });
      
      if (tutorialState.hasContent && tutorialState.hasNextButton) {
        results.tutorial.status = '✅ FUNCIONA';
        results.tutorial.details = 'Tutorial aparece com conteúdo e navegação';
      } else {
        results.tutorial.status = '⚠️ PARCIAL';
        results.tutorial.details = 'Tutorial aparece mas pode estar incompleto';
      }
      
      // Pular para continuar testando
      await page.click('text="Pular"');
      await page.waitForTimeout(1000);
    } else {
      results.tutorial.status = '❌ NÃO APARECE';
      results.tutorial.details = 'Tutorial não está visível';
    }
  } catch (e) {
    results.tutorial.status = '❌ ERRO';
    results.tutorial.details = e.message;
  }
  
  // ============================================================
  // 2. GAMEPLAY BÁSICO
  // ============================================================
  console.log('\n2️⃣  TESTANDO GAMEPLAY...');
  
  try {
    await page.click('text="Novo Jogo"');
    await page.waitForTimeout(2000);
    
    const gameplayState = await page.evaluate(() => {
      const hasBackButton = !!document.querySelector('[title="Voltar ao Menu"]');
      const hasTetrisGrid = !!document.querySelector('.tetris-grid');
      const cellsCount = document.querySelectorAll('.tetris-cell').length;
      const hasCatBlocks = !!document.querySelector('.cat-block');
      
      return { hasBackButton, hasTetrisGrid, cellsCount, hasCatBlocks };
    });
    
    if (gameplayState.hasTetrisGrid && gameplayState.cellsCount > 0) {
      results.gameplay.status = '✅ FUNCIONA';
      results.gameplay.details = `Tabuleiro renderiza ${gameplayState.cellsCount} células, ${gameplayState.hasCatBlocks ? 'peças aparecem' : 'SEM PEÇAS VISÍVEIS'}`;
    } else {
      results.gameplay.status = '❌ QUEBRADO';
      results.gameplay.details = `Grid: ${gameplayState.hasTetrisGrid}, Cells: ${gameplayState.cellsCount}`;
    }
    
    // Voltar ao menu
    await page.click('[title="Voltar ao Menu"]');
    await page.waitForTimeout(1000);
  } catch (e) {
    results.gameplay.status = '❌ ERRO';
    results.gameplay.details = e.message;
  }
  
  // ============================================================
  // 3. MISSÕES DIÁRIAS
  // ============================================================
  console.log('\n3️⃣  TESTANDO MISSÕES...');
  
  try {
    await page.click('text="Missões"');
    await page.waitForTimeout(1500);
    
    const missionsState = await page.evaluate(() => {
      const hasTitle = document.body.innerHTML.includes('Missões Diárias') || 
                      document.body.innerHTML.includes('Daily Missions');
      const hasMissionsList = document.body.innerHTML.includes('pontos') || 
                             document.body.innerHTML.includes('Faça');
      const hasProgress = document.body.innerHTML.includes('/') || 
                         document.body.innerHTML.includes('0%');
      
      return { hasTitle, hasMissionsList, hasProgress };
    });
    
    if (missionsState.hasTitle && missionsState.hasMissionsList) {
      results.missions.status = '✅ FUNCIONA';
      results.missions.details = 'Missões aparecem com progresso';
    } else {
      results.missions.status = '❌ INCOMPLETO';
      results.missions.details = JSON.stringify(missionsState);
    }
    
    // Fechar
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  } catch (e) {
    results.missions.status = '❌ ERRO';
    results.missions.details = e.message;
  }
  
  // ============================================================
  // 4. CONQUISTAS
  // ============================================================
  console.log('\n4️⃣  TESTANDO CONQUISTAS...');
  
  try {
    await page.click('text="Conquistas"');
    await page.waitForTimeout(1500);
    
    const achievementsState = await page.evaluate(() => {
      const hasTitle = document.body.innerHTML.includes('Conquistas') || 
                      document.body.innerHTML.includes('Achievements');
      const hasAchievements = document.body.innerHTML.includes('🏆') || 
                             document.body.innerHTML.includes('Primeira');
      
      return { hasTitle, hasAchievements };
    });
    
    if (achievementsState.hasTitle && achievementsState.hasAchievements) {
      results.achievements.status = '✅ FUNCIONA';
      results.achievements.details = 'Conquistas carregam';
    } else {
      results.achievements.status = '❌ QUEBRADO';
      results.achievements.details = JSON.stringify(achievementsState);
    }
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  } catch (e) {
    results.achievements.status = '❌ ERRO';
    results.achievements.details = e.message;
  }
  
  // ============================================================
  // 5. LOJA
  // ============================================================
  console.log('\n5️⃣  TESTANDO LOJA...');
  
  try {
    await page.click('text="Loja"');
    await page.waitForTimeout(1500);
    
    const shopState = await page.evaluate(() => {
      const hasTitle = document.body.innerHTML.includes('Loja');
      const hasThemes = document.body.innerHTML.includes('Gatos') || 
                       document.body.innerHTML.includes('tema');
      const hasPrices = document.body.innerHTML.includes('🪙') || 
                       document.body.innerHTML.includes('moedas');
      const hasError = document.body.innerHTML.includes('Ops!') || 
                      document.body.innerHTML.includes('erro');
      
      return { hasTitle, hasThemes, hasPrices, hasError };
    });
    
    if (shopState.hasError) {
      results.shop.status = '❌ ERRO VISUAL';
      results.shop.details = 'Mostra tela de erro';
    } else if (shopState.hasThemes && shopState.hasPrices) {
      results.shop.status = '✅ FUNCIONA';
      results.shop.details = 'Loja carrega temas com preços';
    } else {
      results.shop.status = '⚠️ PARCIAL';
      results.shop.details = JSON.stringify(shopState);
    }
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  } catch (e) {
    results.shop.status = '❌ ERRO';
    results.shop.details = e.message;
  }
  
  // ============================================================
  // 6. RANKING
  // ============================================================
  console.log('\n6️⃣  TESTANDO RANKING...');
  
  try {
    await page.click('text="Ranking"');
    await page.waitForTimeout(1500);
    
    const leaderboardState = await page.evaluate(() => {
      const hasTitle = document.body.innerHTML.includes('Ranking') || 
                      document.body.innerHTML.includes('Leaderboard');
      const hasPlayers = document.body.innerHTML.includes('1.') || 
                        document.body.innerHTML.includes('#1');
      const hasScores = /\d{3,}/.test(document.body.innerHTML);
      
      return { hasTitle, hasPlayers, hasScores };
    });
    
    if (leaderboardState.hasTitle && leaderboardState.hasPlayers) {
      results.leaderboard.status = '✅ FUNCIONA';
      results.leaderboard.details = 'Ranking mostra jogadores (mock data)';
    } else {
      results.leaderboard.status = '❌ QUEBRADO';
      results.leaderboard.details = JSON.stringify(leaderboardState);
    }
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  } catch (e) {
    results.leaderboard.status = '❌ ERRO';
    results.leaderboard.details = e.message;
  }
  
  // ============================================================
  // 7. MULTIPLAYER
  // ============================================================
  console.log('\n7️⃣  TESTANDO MULTIPLAYER...');
  
  try {
    await page.click('text="Multiplayer"');
    await page.waitForTimeout(1500);
    
    const multiplayerState = await page.evaluate(() => {
      const hasTitle = document.body.innerHTML.includes('Multiplayer');
      const hasModes = document.body.innerHTML.includes('1v1') || 
                      document.body.innerHTML.includes('vs IA');
      const hasPlayButton = document.body.innerHTML.includes('Play') || 
                           document.body.innerHTML.includes('Jogar');
      
      return { hasTitle, hasModes, hasPlayButton };
    });
    
    if (multiplayerState.hasModes && multiplayerState.hasPlayButton) {
      // Tentar clicar em Play
      try {
        await page.click('text="Play"', { timeout: 2000 });
        await page.waitForTimeout(2000);
        
        const startedGame = await page.evaluate(() => {
          return !!document.querySelector('.tetris-grid');
        });
        
        if (startedGame) {
          results.multiplayer.status = '✅ FUNCIONA';
          results.multiplayer.details = 'Multiplayer inicia jogo';
        } else {
          results.multiplayer.status = '❌ NÃO IMPLEMENTADO';
          results.multiplayer.details = 'UI existe mas não inicia jogo';
        }
      } catch {
        results.multiplayer.status = '❌ BOTÃO NÃO FUNCIONA';
        results.multiplayer.details = 'Play button não responde';
      }
    } else {
      results.multiplayer.status = '❌ INCOMPLETO';
      results.multiplayer.details = JSON.stringify(multiplayerState);
    }
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  } catch (e) {
    results.multiplayer.status = '❌ ERRO';
    results.multiplayer.details = e.message;
  }
  
  // ============================================================
  // 8. MODOS DE JOGO
  // ============================================================
  console.log('\n8️⃣  TESTANDO MODOS DE JOGO...');
  
  try {
    await page.click('text="Modos"');
    await page.waitForTimeout(1500);
    
    const modesState = await page.evaluate(() => {
      const hasTitle = document.body.innerHTML.includes('Modos de Jogo');
      const hasModes = document.body.innerHTML.includes('Clássico') || 
                      document.body.innerHTML.includes('Sprint');
      
      return { hasTitle, hasModes };
    });
    
    if (modesState.hasTitle && modesState.hasModes) {
      results.gameModes.status = '⚠️ PARCIAL';
      results.gameModes.details = 'UI existe, funcionalidade não testada';
    } else {
      results.gameModes.status = '❌ QUEBRADO';
      results.gameModes.details = JSON.stringify(modesState);
    }
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  } catch (e) {
    results.gameModes.status = '❌ ERRO';
    results.gameModes.details = e.message;
  }
  
  // ============================================================
  // RELATÓRIO FINAL
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('📊 RELATÓRIO DE AUDITORIA');
  console.log('='.repeat(60));
  
  Object.entries(results).forEach(([feature, result]) => {
    console.log(`\n${feature.toUpperCase()}`);
    console.log(`  Status: ${result.status}`);
    console.log(`  Detalhes: ${result.details}`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`❌ ERROS JAVASCRIPT: ${errors.length}`);
  if (errors.length > 0) {
    console.log('\nPrimeiros 5 erros:');
    errors.slice(0, 5).forEach((e, i) => {
      console.log(`  ${i+1}. ${e.substring(0, 100)}`);
    });
  }
  
  console.log('\n⏳ Browser aberto por 20s para revisão manual...');
  await page.waitForTimeout(20000);
  
  await browser.close();
  
  // Salvar relatório
  const fs = require('fs');
  fs.writeFileSync('AUDITORIA-FEATURES.json', JSON.stringify({ results, errors }, null, 2));
  console.log('\n✅ Relatório salvo em: AUDITORIA-FEATURES.json');
}

auditAllFeatures().catch(console.error);
