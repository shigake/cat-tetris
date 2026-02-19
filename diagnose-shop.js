// Diagnóstico da Loja
console.log('=== DIAGNÓSTICO DA LOJA ===');

try {
  const { serviceContainer } = await import('./src/core/container/ServiceRegistration.js');
  
  console.log('1. Service Container:', serviceContainer ? '✅' : '❌');
  
  const shopService = serviceContainer.resolve('shopService');
  console.log('2. ShopService:', shopService ? '✅' : '❌');
  
  const themes = shopService.getAllThemes();
  console.log('3. Themes:', themes.length, 'temas');
  console.log('   ', themes.map(t => t.name));
  
  const equipped = shopService.getEquippedTheme();
  console.log('4. Equipped:', equipped?.name || 'nenhum');
  
  const stats = shopService.getStats();
  console.log('5. Stats:', stats);
  
  console.log('\n✅ LOJA OK!');
  
} catch (error) {
  console.error('❌ ERRO:', error.message);
  console.error('Stack:', error.stack);
}
