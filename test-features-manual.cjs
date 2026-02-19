/**
 * test-features-manual.cjs
 * Teste manual interativo - abre o jogo e aguarda inspeção
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🧪 TESTE MANUAL DE FEATURES\n');
  console.log('Este teste abre o jogo e aguarda você testar manualmente.\n');

  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();

  try {
    console.log('📂 Abrindo Cat Tetris...\n');
    await page.goto('http://localhost:5173/cat-tetris/');
    await page.waitForTimeout(2000);

    console.log('✅ Jogo aberto!');
    console.log('\n📋 CHECKLIST DE TESTES:\n');
    console.log('1. ✓ Pular tutorial (se aparecer)');
    console.log('2. ✓ Abrir MISSÕES → Verificar se aparecem');
    console.log('3. ✓ Abrir CONQUISTAS → Verificar se aparecem');
    console.log('4. ✓ Abrir LOJA → VERIFICAR ERRO VISUAL');
    console.log('5. ✓ Abrir MODOS DE JOGO → Testar cada modo');
    console.log('6. ✓ JOGAR um jogo completo');
    console.log('7. ✓ Abrir MISSÕES novamente → Verificar progresso');
    console.log('8. ✓ Abrir CONQUISTAS → Verificar se desbloqueou algo');
    console.log('\n⏳ Aguardando 5 minutos para testes manuais...');
    console.log('(Feche o navegador quando terminar)\n');

    // Aguarda 5 minutos ou até navegador fechar
    await page.waitForTimeout(300000);

  } catch (error) {
    if (error.message.includes('Target closed') || error.message.includes('has been closed')) {
      console.log('\n✅ Navegador fechado pelo usuário.');
    } else {
      console.error('\n❌ ERRO:', error.message);
    }
  }

  try {
    await browser.close();
  } catch (e) {
    // Já fechado
  }

  console.log('\n🎯 TESTE MANUAL FINALIZADO\n');
  console.log('Por favor, reporte o que você encontrou:');
  console.log('- Missões rastreiam? (progresso muda?)');
  console.log('- Conquistas desbloqueiam?');
  console.log('- Loja tem erro visual? (qual?)');
  console.log('- Modos de jogo funcionam? (regras aplicam?)');
})();
