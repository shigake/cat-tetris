/**
 * test-shop-error.cjs
 * Investiga erro específico da loja
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🛍️ TESTANDO LOJA - CAÇANDO ERRO...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Capturar erros do console
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error' || type === 'warning') {
      console.log(`[BROWSER ${type.toUpperCase()}]`, text);
    }
  });

  // Capturar erros de página
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR]`, error.message);
    console.log(error.stack);
  });

  try {
    console.log('📂 Abrindo jogo...');
    await page.goto('http://localhost:5173/cat-tetris/');
    await page.waitForTimeout(3000);

    console.log('⏭️  Tentando pular tutorial...');
    try {
      const skipButton = await page.locator('button:has-text("Pular Tutorial")').first();
      if (await skipButton.isVisible({ timeout: 2000 })) {
        await skipButton.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {
      console.log('Tutorial não encontrado ou já pulado');
    }

    console.log('🛍️ Abrindo LOJA...');
    await page.screenshot({ path: 'test-results/shop-before-click.png' });
    
    await page.click('button:has-text("Loja")');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'test-results/shop-after-click.png' });
    console.log('📸 Screenshots salvos');

    // Verificar se há erro visível
    const errorVisible = await page.locator('text=Ops!, text=erro, text=Algo deu errado').count();
    if (errorVisible > 0) {
      console.log('\n❌ ERRO ENCONTRADO NA TELA!');
      const errorText = await page.locator('text=Ops!, text=erro').first().textContent();
      console.log('Mensagem:', errorText);
    } else {
      console.log('\n✅ LOJA ABRIU SEM ERROS VISÍVEIS!');
    }

    console.log('\n⏳ Aguardando 10 segundos para inspeção manual...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message);
    await page.screenshot({ path: 'test-results/shop-test-error.png' });
  }

  await browser.close();
  console.log('\n🎯 TESTE FINALIZADO');
})();
