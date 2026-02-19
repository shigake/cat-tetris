const { chromium } = require('playwright');

async function testShopManually() {
  console.log('🔍 Testando Loja manualmente...\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capturar logs do console
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    if (type === 'error') {
      console.log(`❌ [CONSOLE ERROR]: ${text}`);
    } else if (type === 'warn') {
      console.log(`⚠️  [CONSOLE WARN]: ${text}`);
    } else if (text.includes('[ShopPanel]') || text.includes('[GameModesPanel]') || text.includes('[MultiplayerPanel]')) {
      console.log(`📝 [LOG]: ${text}`);
    }
  });
  
  // Capturar erros não tratados
  page.on('pageerror', error => {
    console.log(`💥 [PAGE ERROR]: ${error.message}`);
    console.log(error.stack);
  });
  
  try {
    console.log('📱 Abrindo Cat Tetris...');
    await page.goto('http://localhost:5173/cat-tetris/');
    await page.waitForTimeout(3000);
    
    // Pular tutorial se aparecer
    try {
      const skipBtn = page.locator('button:has-text("Pular")').first();
      if (await skipBtn.isVisible({ timeout: 2000 })) {
        await skipBtn.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {}
    
    // Testar LOJA
    console.log('\n🛍️  Testando LOJA...');
    try {
      await page.locator('button:has-text("Loja")').first().click();
      await page.waitForTimeout(3000);
      console.log('✅ Loja abriu!');
    } catch (e) {
      console.log('❌ Erro ao abrir loja:', e.message);
    }
    
    // Fechar loja
    try {
      await page.locator('button:has-text("✕")').or(page.locator('button:has-text("Fechar")')).first().click();
      await page.waitForTimeout(1000);
    } catch (e) {}
    
    // Testar MODOS DE JOGO
    console.log('\n🎯 Testando MODOS DE JOGO...');
    try {
      await page.locator('button:has-text("Modos")').or(page.getByRole('button', { name: /Modos de Jogo/i })).first().click();
      await page.waitForTimeout(3000);
      console.log('✅ Modos de Jogo abriu!');
    } catch (e) {
      console.log('❌ Erro ao abrir modos:', e.message);
    }
    
    // Fechar
    try {
      await page.locator('button:has-text("✕")').first().click();
      await page.waitForTimeout(1000);
    } catch (e) {}
    
    // Testar MULTIPLAYER
    console.log('\n🎮 Testando MULTIPLAYER...');
    try {
      await page.getByRole('button', { name: /Multiplayer/i }).first().click();
      await page.waitForTimeout(3000);
      console.log('✅ Multiplayer abriu!');
    } catch (e) {
      console.log('❌ Erro ao abrir multiplayer:', e.message);
    }
    
    console.log('\n✅ Testes concluídos! Mantendo browser aberto por 10s...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('\n💥 Erro fatal:', error.message);
  } finally {
    await browser.close();
    console.log('\n🏁 Browser fechado.');
  }
}

testShopManually().catch(console.error);
