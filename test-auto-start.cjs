const { chromium } = require('playwright');

async function testAutoStart() {
  console.log('🔍 TESTE: O jogo auto-inicia ao abrir?\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });
  
  const page = await browser.newPage();
  
  let movePieceCalled = false;
  
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('GameService movePiece')) {
      movePieceCalled = true;
      console.log('❌ PROBLEMA: GameService.movePiece foi chamado automaticamente!');
      console.log(`   ${text}`);
    }
    if (text.includes('[GameScreen]')) {
      console.log(`📊 ${text}`);
    }
  });
  
  await page.goto('http://localhost:5173/cat-tetris/');
  console.log('✅ Página carregada\n');
  
  // Pular tutorial
  try {
    await page.click('text="Pular"', { timeout: 2000 });
    console.log('✅ Tutorial pulado\n');
  } catch(e) {}
  
  console.log('⏳ Aguardando 5 segundos para ver se o jogo auto-inicia...\n');
  await page.waitForTimeout(5000);
  
  console.log('\n📊 RESULTADO:\n');
  
  if (movePieceCalled) {
    console.log('❌ BUG AINDA PRESENTE: O jogo está rodando automaticamente!');
  } else {
    console.log('✅ CORRETO: O jogo NÃO auto-iniciou!');
  }
  
  console.log('\n⏳ Mantendo browser aberto por 10s para inspeção visual...');
  await page.waitForTimeout(10000);
  
  await browser.close();
  
  return !movePieceCalled;
}

testAutoStart()
  .then(success => {
    if (success) {
      console.log('\n✅ TESTE PASSOU!');
      process.exit(0);
    } else {
      console.log('\n❌ TESTE FALHOU!');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('\n💥 ERRO:', err.message);
    process.exit(1);
  });
