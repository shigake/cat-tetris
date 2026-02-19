const { chromium } = require('playwright');

async function testAllFeatures() {
  console.log('🔍 Testando TODAS as funcionalidades (modo oculto)...\n');
  
  const browser = await chromium.launch({
    headless: true
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  const success = [];
  
  page.on('pageerror', error => {
    const msg = error.message;
    if (!msg.includes('favicon')) {
      errors.push(`PAGE ERROR: ${msg}`);
    }
  });
  
  try {
    console.log('1️⃣  Carregando...');
    await page.goto('http://localhost:5173/cat-tetris/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    success.push('✅ App carregou');
    
    // Pular tutorial
    try {
      await page.click('text="Pular"', { timeout: 2000 });
      await page.waitForTimeout(1000);
    } catch (e) {}
    
    // 2. MISSÕES
    console.log('2️⃣  Missões...');
    try {
      await page.click('text="Missões Diárias"', { timeout: 10000 });
      await page.waitForTimeout(2000);
      const visible = await page.isVisible('h2:has-text("Missões Diárias")');
      if (visible) {
        success.push('✅ Missões OK');
        await page.click('button:has-text("✕")');
        await page.waitForTimeout(500);
      } else {
        errors.push('❌ Missões: Modal não abriu');
      }
    } catch (e) {
      errors.push(`❌ Missões: ${e.message.substring(0, 80)}`);
    }
    
    // 3. CONQUISTAS
    console.log('3️⃣  Conquistas...');
    try {
      await page.click('text="Conquistas"', { timeout: 10000 });
      await page.waitForTimeout(2000);
      const visible = await page.isVisible('h2:has-text("Conquistas")');
      if (visible) {
        success.push('✅ Conquistas OK');
        await page.click('button:has-text("✕")');
        await page.waitForTimeout(500);
      } else {
        errors.push('❌ Conquistas: Modal não abriu');
      }
    } catch (e) {
      errors.push(`❌ Conquistas: ${e.message.substring(0, 80)}`);
    }
    
    // 4. LOJA
    console.log('4️⃣  Loja...');
    try {
      await page.click('text="Loja"', { timeout: 10000 });
      await page.waitForTimeout(2500);
      
      const hasError = await page.isVisible('text="Ops! Algo deu errado"');
      const hasThemes = await page.isVisible('text="🐱 Gatos Clássicos"');
      
      if (hasError) {
        errors.push('❌ Loja: Tela de erro');
      } else if (hasThemes) {
        success.push('✅ Loja OK');
      } else {
        errors.push('❌ Loja: Conteúdo não carregou');
      }
      
      await page.click('button:has-text("✕")');
      await page.waitForTimeout(500);
    } catch (e) {
      errors.push(`❌ Loja: ${e.message.substring(0, 80)}`);
    }
    
    // 5. MODOS
    console.log('5️⃣  Modos...');
    try {
      await page.click('text="Modos de Jogo"', { timeout: 10000 });
      await page.waitForTimeout(2000);
      const visible = await page.isVisible('h2:has-text("Modos de Jogo")');
      if (visible) {
        success.push('✅ Modos OK');
        await page.click('button:has-text("✕")');
        await page.waitForTimeout(500);
      } else {
        errors.push('❌ Modos: Modal não abriu');
      }
    } catch (e) {
      errors.push(`❌ Modos: ${e.message.substring(0, 80)}`);
    }
    
    // 6. RANKING
    console.log('6️⃣  Ranking...');
    try {
      await page.click('text="Ranking"', { timeout: 10000 });
      await page.waitForTimeout(2000);
      const visible = await page.isVisible('h2:has-text("Ranking")');
      if (visible) {
        success.push('✅ Ranking OK');
        await page.click('button:has-text("✕")');
        await page.waitForTimeout(500);
      } else {
        errors.push('❌ Ranking: Modal não abriu');
      }
    } catch (e) {
      errors.push(`❌ Ranking: ${e.message.substring(0, 80)}`);
    }
    
    // 7. MULTIPLAYER
    console.log('7️⃣  Multiplayer...');
    try {
      await page.click('text="Multiplayer"', { timeout: 10000 });
      await page.waitForTimeout(2000);
      const visible = await page.isVisible('h2:has-text("Multiplayer")');
      if (visible) {
        success.push('✅ Multiplayer OK');
        await page.click('button:has-text("✕")');
        await page.waitForTimeout(500);
      } else {
        errors.push('❌ Multiplayer: Modal não abriu');
      }
    } catch (e) {
      errors.push(`❌ Multiplayer: ${e.message.substring(0, 80)}`);
    }
    
    // 8. GAMEPLAY
    console.log('8️⃣  Gameplay...');
    try {
      await page.click('text="Novo Jogo"', { timeout: 10000 });
      await page.waitForTimeout(3000);
      // Verificar se está jogando (elemento de pontuação visível)
      const playing = await page.isVisible('text="Pontos:"') || await page.isVisible('text="Nível:"');
      if (playing) {
        success.push('✅ Gameplay OK');
      } else {
        errors.push('❌ Gameplay: Jogo não iniciou');
      }
    } catch (e) {
      errors.push(`❌ Gameplay: ${e.message.substring(0, 80)}`);
    }
    
  } catch (error) {
    errors.push(`💥 Fatal: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  // RELATÓRIO
  console.log('\n' + '='.repeat(60));
  console.log('📊 RELATÓRIO FINAL');
  console.log('='.repeat(60));
  
  console.log(`\n✅ SUCESSOS (${success.length}/8):`);
  success.forEach(s => console.log(`   ${s}`));
  
  if (errors.length > 0) {
    console.log(`\n❌ ERROS (${errors.length}):`);
    errors.forEach(e => console.log(`   ${e}`));
  } else {
    console.log(`\n🎉 ZERO ERROS!`);
  }
  
  const percentage = Math.round((success.length / 8) * 100);
  console.log(`\n📈 TAXA: ${percentage}% (${success.length}/8)`);
  
  if (percentage === 100) {
    console.log('\n🏆 100% FUNCIONAL!');
  } else if (percentage >= 75) {
    console.log('\n👍 Quase pronto!');
  } else {
    console.log('\n⚠️  Precisa correções.');
  }
  
  console.log('='.repeat(60) + '\n');
  
  return { success: success.length, errors: errors.length };
}

testAllFeatures().catch(console.error);
