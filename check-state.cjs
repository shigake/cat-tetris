const { chromium } = require('playwright');

async function checkGameState() {
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 500
  });
  
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 } // Desktop size
  });
  
  await page.goto('http://localhost:5173/cat-tetris/');
  await page.waitForTimeout(2000);
  
  // Pular tutorial
  try {
    await page.click('text="Pular"', { timeout: 2000 });
    await page.waitForTimeout(500);
  } catch(e) {}
  
  console.log('🎮 Clicando em "Novo Jogo"...\n');
  await page.click('text="Novo Jogo"');
  await page.waitForTimeout(2000);
  
  // Injetar código para acessar o gameState do React
  const stateInfo = await page.evaluate(() => {
    // Tentar acessar o estado do React através do DOM
    const root = document.querySelector('#root');
    if (!root) return { error: 'No root found' };
    
    // Verificar elementos renderizados
    const hasTetrisBoard = !!document.querySelector('.tetris-board');
    const boardCells = document.querySelectorAll('[class*="cell"]').length;
    const hiddenDivs = document.querySelectorAll('.hidden').length;
    const lgFlexDivs = document.querySelectorAll('.lg\\:flex').length;
    
    // Verificar se está mostrando desktop ou mobile layout
    const mobileLayout = document.querySelector('[data-testid="mobile-layout"]');
    const hasMobileLayout = !!mobileLayout;
    const mobileLayoutVisible = mobileLayout && window.getComputedStyle(mobileLayout).display !== 'none';
    
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      hasTetrisBoard,
      boardCells,
      hiddenDivs,
      lgFlexDivs,
      hasMobileLayout,
      mobileLayoutVisible,
      hasCanvas: !!document.querySelector('canvas'),
      htmlSample: root.innerHTML.substring(0, 500)
    };
  });
  
  console.log('📊 Informações do estado:\n');
  console.log(JSON.stringify(stateInfo, null, 2));
  
  console.log('\n⏳ Aguardando 20 segundos para inspeção...');
  await page.waitForTimeout(20000);
  
  await browser.close();
}

checkGameState().catch(console.error);
