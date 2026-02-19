const { chromium } = require('playwright');

async function testTutorialSystem() {
  console.log('🧪 Testando Sistema de Tutorial...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // 1. Abrir aplicação
    console.log('1️⃣ Abrindo aplicação...');
    await page.goto('http://localhost:5173/cat-tetris');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/tutorial-test-01-menu.png' });
    
    // 2. Abrir Tutorial Hub
    console.log('2️⃣ Abrindo Tutorial Hub...');
    await page.click('text=Tutorial Educativo');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/tutorial-test-02-hub.png' });
    
    // 3. Selecionar primeira lição
    console.log('3️⃣ Selecionando primeira lição...');
    const firstLesson = await page.locator('.lesson-card').first();
    await firstLesson.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/tutorial-test-03-introduction.png' });
    
    // 4. Testar botão Ver Demonstração
    console.log('4️⃣ Testando botão Ver Demonstração...');
    const demoButton = await page.locator('text=Ver Demonstração');
    const demoExists = await demoButton.count() > 0;
    console.log(`   Botão demonstração existe: ${demoExists ? '✅' : '❌'}`);
    
    if (demoExists) {
      await demoButton.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'test-results/tutorial-test-04-demonstration.png' });
      
      // Verificar elementos da demonstração
      const cpuPlaying = await page.locator('text=CPU jogando').count() > 0;
      console.log(`   CPU jogando visível: ${cpuPlaying ? '✅' : '❌'}`);
      
      // Clicar Ir para Prática
      await page.click('text=Ir para Prática');
      await page.waitForTimeout(2000);
    } else {
      // Ir direto para prática
      await page.click('text=Ir para Prática');
      await page.waitForTimeout(2000);
    }
    
    // 5. Verificar tela de prática
    console.log('5️⃣ Verificando tela de prática...');
    await page.screenshot({ path: 'test-results/tutorial-test-05-practice.png' });
    
    const objective = await page.locator('text=Objetivo').count() > 0;
    console.log(`   Objetivo visível: ${objective ? '✅' : '❌'}`);
    
    const board = await page.locator('.tetris-board').count() > 0;
    console.log(`   Board renderizado: ${board ? '✅' : '❌'}`);
    
    // 6. Testar componentes separados
    console.log('\n6️⃣ Verificando arquitetura refatorada...');
    const fs = require('fs');
    
    const files = [
      'src/components/lesson/IntroductionScreen.jsx',
      'src/components/lesson/DemonstrationScreen.jsx',
      'src/components/lesson/PracticeScreen.jsx',
      'src/components/CelebrationParticles.jsx'
    ];
    
    files.forEach(file => {
      const exists = fs.existsSync(file);
      console.log(`   ${file}: ${exists ? '✅' : '❌'}`);
    });
    
    // 7. Verificar demonstrações
    console.log('\n7️⃣ Verificando demonstrações...');
    const { listDemonstrations } = require('./src/core/services/DemonstrationLibrary.js');
    const demos = listDemonstrations();
    console.log(`   Total de demonstrações: ${demos.length}`);
    console.log(`   Cobertura: ${Math.round(demos.length / 21 * 100)}%`);
    
    console.log('\n✅ TESTE COMPLETO!');
    console.log('📸 Screenshots salvos em test-results/');
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
  } finally {
    await browser.close();
  }
}

testTutorialSystem();
