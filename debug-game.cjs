const { chromium } = require('playwright');

async function debugGame() {
  console.log('🐛 DEBUGGING: Capturando erros reais do jogo\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });
  
  const page = await browser.newPage();
  
  const consoleErrors = [];
  const pageErrors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('404') && !msg.text().includes('favicon')) {
      console.log(`🔴 CONSOLE: ${msg.text()}`);
      consoleErrors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.log(`💥 PAGE ERROR: ${error.message}`);
    console.log(`   Stack: ${error.stack.substring(0, 200)}`);
    pageErrors.push(error.message);
  });
  
  try {
    await page.goto('http://localhost:5173/cat-tetris/');
    console.log('✅ Página carregada\n');
    await page.waitForTimeout(3000);
    
    // Pular tutorial se aparecer
    try {
      const skip = await page.$('text="Pular"');
      if (skip) {
        await skip.click();
        console.log('✅ Tutorial pulado\n');
        await page.waitForTimeout(1000);
      }
    } catch (e) {}
    
    console.log('🎮 Clicando em "Novo Jogo"...\n');
    await page.click('text="Novo Jogo"');
    await page.waitForTimeout(2000);
    
    // Verificar estado após clicar
    const state = await page.evaluate(() => {
      return {
        url: window.location.href,
        hasCanvas: !!document.querySelector('canvas'),
        hasBoard: !!document.querySelectorAll('[class*="board"]').length,
        hasGrid: !!document.querySelectorAll('[class*="grid"]').length,
        bodyClasses: document.body.className,
        appHTML: document.querySelector('#root')?.innerHTML.substring(0, 300)
      };
    });
    
    console.log('📊 Estado após "Novo Jogo":');
    console.log(JSON.stringify(state, null, 2));
    
    console.log('\n🎹 Testando controles...');
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(300);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    await page.keyboard.press('ArrowDown');
    
    console.log('\n⏱️  Aguardando 15 segundos para observar...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('RESUMO DOS ERROS');
  console.log('='.repeat(60));
  console.log(`\nConsole errors: ${consoleErrors.length}`);
  console.log(`Page errors: ${pageErrors.length}\n`);
  
  if (consoleErrors.length > 0) {
    console.log('CONSOLE ERRORS:');
    consoleErrors.forEach((e, i) => console.log(`  ${i+1}. ${e.substring(0, 100)}`));
  }
  
  if (pageErrors.length > 0) {
    console.log('\nPAGE ERRORS:');
    pageErrors.forEach((e, i) => console.log(`  ${i+1}. ${e}`));
  }
  
  if (consoleErrors.length === 0 && pageErrors.length === 0) {
    console.log('✅ Nenhum erro JavaScript encontrado!');
  }
  
  await browser.close();
}

debugGame().catch(console.error);
