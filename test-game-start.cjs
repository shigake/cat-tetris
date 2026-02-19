const { chromium } = require('playwright');

async function testGameStart() {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  const logs = [];
  
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[GameState]') || text.includes('[Board]') || text.includes('[Game]')) {
      logs.push(text);
      console.log(`📝 ${text}`);
    }
  });
  
  page.on('pageerror', err => {
    console.log(`❌ ${err.message}`);
  });
  
  await page.goto('http://localhost:5173/cat-tetris/');
  await page.waitForTimeout(2000);
  
  // Pular tutorial
  try {
    await page.click('text="Pular"', { timeout: 2000 });
    await page.waitForTimeout(500);
  } catch(e) {}
  
  console.log('\n🎮 Antes de clicar "Novo Jogo":\n');
  
  const beforeClick = await page.evaluate(() => {
    const root = document.querySelector('#root');
    return {
      hasMenu: root?.innerHTML.includes('Novo Jogo'),
      hasBoard: !!document.querySelector('[class*="board"]'),
      hasGrid: !!document.querySelector('[class*="grid"]'),
      currentScreen: root?.innerHTML.substring(0, 200)
    };
  });
  
  console.log(JSON.stringify(beforeClick, null, 2));
  
  console.log('\n🎮 Clicando em "Novo Jogo"...\n');
  await page.click('text="Novo Jogo"');
  await page.waitForTimeout(2000);
  
  console.log('\n🎮 Depois de clicar "Novo Jogo":\n');
  
  const afterClick = await page.evaluate(() => {
    const root = document.querySelector('#root');
    const hasGameContainer = root?.innerHTML.includes('game-container');
    const hasBoard = !!document.querySelector('.tetris-board, [class*="board"]');
    const hasCells = document.querySelectorAll('[class*="cell"]').length;
    const hasCanvas = !!document.querySelector('canvas');
    
    // Tentar encontrar o componente de jogo
    const gameDiv = document.querySelector('.game-container');
    
    return {
      hasGameContainer,
      hasBoard,
      hasCells,
      hasCanvas,
      gameDivExists: !!gameDiv,
      gameDivHTML: gameDiv?.innerHTML.substring(0, 400),
      rootHTML: root?.innerHTML.substring(0, 400)
    };
  });
  
  console.log(JSON.stringify(afterClick, null, 2));
  
  console.log('\n⏳ Aguardando 20 segundos para inspeção manual...');
  await page.waitForTimeout(20000);
  
  await browser.close();
}

testGameStart().catch(console.error);
