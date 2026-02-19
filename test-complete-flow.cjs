const { chromium } = require('playwright');

async function testGameFlow() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  console.log('🔍 TESTE COMPLETO DO FLUXO DO JOGO\n');
  
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('GameService') || text.includes('[GameScreen]') || text.includes('isPlaying')) {
      logs.push(text);
      console.log(`📝 ${text}`);
    }
  });
  
  console.log('1️⃣  Abrindo Cat Tetris...\n');
  await page.goto('http://localhost:5173/cat-tetris/');
  await page.waitForTimeout(3000);
  
  // Pular tutorial
  try {
    await page.click('text="Pular"', { timeout: 2000 });
    await page.waitForTimeout(1000);
  } catch(e) {}
  
  console.log('2️⃣  VERIFICANDO ESTADO NO MENU (antes de clicar Novo Jogo)...\n');
  await page.waitForTimeout(2000);
  
  const beforeClick = await page.evaluate(() => {
    // Verificar se está no menu
    return {
      hasNewGameButton: document.body.innerHTML.includes('Novo Jogo'),
      hasBackButton: !!document.querySelector('[title="Voltar ao Menu"]'),
      currentScreenLooksLikeMenu: document.body.innerHTML.includes('Cat Tetris') && document.body.innerHTML.includes('Missões')
    };
  });
  
  console.log('Estado antes de clicar:', JSON.stringify(beforeClick, null, 2));
  console.log('\n3️⃣  CLICANDO EM "NOVO JOGO"...\n');
  
  await page.click('text="Novo Jogo"');
  await page.waitForTimeout(3000);
  
  console.log('\n4️⃣  VERIFICANDO SE O JOGO INICIOU...\n');
  
  const afterClick = await page.evaluate(() => {
    const hasBackButton = !!document.querySelector('[title="Voltar ao Menu"]');
    const hasTetrisGrid = !!document.querySelector('.tetris-grid');
    const cellsCount = document.querySelectorAll('.tetris-cell').length;
    
    return {
      hasBackButton,
      hasTetrisGrid,
      cellsCount,
      htmlSnippet: document.body.innerHTML.substring(0, 400)
    };
  });
  
  console.log('Estado depois de clicar:', JSON.stringify(afterClick, null, 2));
  
  console.log('\n5️⃣  TESTANDO CONTROLES...\n');
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(500);
  
  console.log('\n6️⃣  RESUMO DOS LOGS:\n');
  logs.forEach(log => console.log(`   ${log}`));
  
  console.log('\n✅ Teste concluído! Browser fechará em 10s...');
  await page.waitForTimeout(10000);
  
  await browser.close();
}

testGameFlow().catch(console.error);
