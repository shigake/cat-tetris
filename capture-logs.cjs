const { chromium } = require('playwright');

async function captureAllLogs() {
  const browser = await chromium.launch({ 
    headless: false
  });
  
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  console.log('📝 Capturando TODOS os console.log...\n');
  
  page.on('console', msg => {
    const text = msg.text();
    console.log(`[CONSOLE] ${text}`);
  });
  
  await page.goto('http://localhost:5173/cat-tetris/');
  await page.waitForTimeout(2000);
  
  // Pular tutorial
  try {
    await page.click('text="Pular"', { timeout: 2000 });
    await page.waitForTimeout(500);
  } catch(e) {}
  
  console.log('\n🎮 Clicando em "Novo Jogo"...\n');
  await page.click('text="Novo Jogo"');
  
  console.log('\n⏳ Aguardando 10 segundos para ver logs...\n');
  await page.waitForTimeout(10000);
  
  await browser.close();
}

captureAllLogs().catch(console.error);
