const { chromium } = require('playwright');

async function testShop() {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  console.log('🛍️  TESTANDO LOJA DE VERDADE\n');
  
  const errors = [];
  
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' && !text.includes('404') && !text.includes('favicon')) {
      console.log(`❌ ERROR: ${text}`);
      errors.push(text);
    }
  });
  
  page.on('pageerror', err => {
    console.log(`💥 PAGE ERROR: ${err.message}`);
    errors.push(err.message);
  });
  
  await page.goto('http://localhost:5173/cat-tetris/');
  await page.waitForTimeout(2000);
  
  // Pular tutorial
  try {
    await page.click('text="Pular"', { timeout: 2000 });
    await page.waitForTimeout(1000);
  } catch(e) {}
  
  console.log('🛍️  Clicando em "Loja"...\n');
  await page.click('text="Loja"');
  await page.waitForTimeout(3000);
  
  const shopState = await page.evaluate(() => {
    const hasErrorScreen = document.body.innerHTML.includes('Ops! Algo deu errado');
    const hasThemes = document.body.innerHTML.includes('Gatos Clássicos') || document.body.innerHTML.includes('🐱');
    const hasShopTitle = document.body.innerHTML.includes('Loja de Temas');
    
    return { hasErrorScreen, hasThemes, hasShopTitle };
  });
  
  console.log('Estado da Loja:', JSON.stringify(shopState, null, 2));
  
  if (shopState.hasErrorScreen) {
    console.log('\n❌ LOJA ESTÁ QUEBRADA - Mostra tela de erro!');
  } else if (shopState.hasThemes) {
    console.log('\n✅ Loja carregou temas!');
  } else {
    console.log('\n⚠️  Loja abriu mas sem temas visíveis');
  }
  
  console.log('\n📊 ERROS CAPTURADOS:', errors.length);
  errors.forEach((e, i) => console.log(`  ${i+1}. ${e.substring(0, 120)}`));
  
  console.log('\n⏳ Browser aberto por 15s para inspeção...');
  await page.waitForTimeout(15000);
  
  await browser.close();
}

testShop().catch(console.error);
