const { chromium } = require('playwright');

async function testRealGameplay() {
  console.log('🔍 TESTANDO GAMEPLAY REAL - Debugging completo\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  
  // Capturar todos os erros
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error') {
      console.log(`❌ CONSOLE ERROR: ${text}`);
      errors.push(text);
    }
  });
  
  page.on('pageerror', error => {
    console.log(`💥 PAGE ERROR: ${error.message}`);
    errors.push(error.message);
  });
  
  try {
    console.log('1️⃣  Abrindo jogo...');
    await page.goto('http://localhost:5173/cat-tetris/');
    await page.waitForTimeout(3000);
    
    // Pular tutorial
    try {
      await page.click('text="Pular"', { timeout: 2000 });
      await page.waitForTimeout(1000);
    } catch (e) {}
    
    console.log('2️⃣  Clicando em "Novo Jogo"...');
    await page.click('text="Novo Jogo"');
    await page.waitForTimeout(3000);
    
    console.log('3️⃣  Verificando se o jogo iniciou...');
    const gameStarted = await page.evaluate(() => {
      // Verificar se há elementos do jogo na tela
      const scoreElement = document.querySelector('[class*="score"]') || document.querySelector('text*="Pontos"');
      const canvas = document.querySelector('canvas');
      const board = document.querySelector('[class*="board"]') || document.querySelector('[class*="grid"]');
      
      return {
        hasScore: !!scoreElement,
        hasCanvas: !!canvas,
        hasBoard: !!board,
        bodyHTML: document.body.innerHTML.substring(0, 500)
      };
    });
    
    console.log('📊 Estado do jogo:', JSON.stringify(gameStarted, null, 2));
    
    if (!gameStarted.hasScore && !gameStarted.hasCanvas && !gameStarted.hasBoard) {
      console.log('❌ JOGO NÃO INICIOU! Nenhum elemento de gameplay detectado.');
      console.log('HTML atual:', gameStarted.bodyHTML);
    } else {
      console.log('✅ Jogo parece ter iniciado.');
    }
    
    console.log('\n4️⃣  Tentando pressionar teclas...');
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(500);
    
    console.log('\n⏳ Aguardando 10 segundos para observar...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('\n💥 ERRO FATAL:', error.message);
    errors.push(error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DE ERROS');
  console.log('='.repeat(60));
  
  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} ERROS ENCONTRADOS:\n`);
    errors.forEach((err, i) => {
      console.log(`${i + 1}. ${err.substring(0, 150)}`);
    });
  } else {
    console.log('\n✅ NENHUM ERRO CAPTURADO!');
  }
  
  console.log('\n⏸️  Browser permanecerá aberto por 30s para inspeção manual...');
  await page.waitForTimeout(30000);
  
  await browser.close();
}

testRealGameplay().catch(console.error);
