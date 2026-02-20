/**
 * dump-errors.cjs - Script para extrair os error logs do Cat Tetris
 * 
 * USO:
 *   node dump-errors.cjs              → Lê logs do app rodando (precisa Playwright)
 *   node dump-errors.cjs --local      → Lê de um arquivo JSON exportado manualmente
 *   node dump-errors.cjs --parse FILE → Parseia um arquivo JSON exportado
 * 
 * O output vai para error-log.json (completo) e error-log-summary.txt (resumo legível)
 * 
 * COMO USAR COM A IA:
 *   1. Rode o jogo (npm run dev)
 *   2. Jogue e provoque o erro  
 *   3. No jogo, clique 🐛 → Exportar (ou Ctrl+Shift+D)
 *   4. node dump-errors.cjs --parse <arquivo-baixado>.json
 *   5. Mostre o error-log-summary.txt para a IA corrigir
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, 'error-log.json');
const SUMMARY_FILE = path.join(__dirname, 'error-log-summary.txt');

async function extractWithPlaywright() {
  let playwright;
  try {
    playwright = require('playwright');
  } catch {
    console.error('❌ Playwright não instalado. Use: npx playwright install');
    console.error('   Ou exporte manualmente pelo botão 🐛 no jogo');
    console.error('   Depois rode: node dump-errors.cjs --parse <arquivo>.json');
    process.exit(1);
  }

  console.log('🚀 Abrindo o app para extrair logs...');
  
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Tentar conectar no dev server
    let url = 'http://localhost:5173';
    try {
      await page.goto(url, { timeout: 5000 });
    } catch {
      url = 'http://localhost:3000';
      try {
        await page.goto(url, { timeout: 5000 });
      } catch {
        console.error('❌ App não está rodando. Rode "npm run dev" primeiro.');
        await browser.close();
        process.exit(1);
      }
    }
    
    console.log(`✅ Conectado em ${url}`);
    
    // Esperar o app carregar
    await page.waitForTimeout(3000);
    
    // Extrair logs do localStorage
    const logData = await page.evaluate(() => {
      const errorLog = localStorage.getItem('cat_tetris_error_log');
      const exportLog = localStorage.getItem('cat_tetris_error_export');
      return {
        errorLog: errorLog ? JSON.parse(errorLog) : [],
        exportLog: exportLog || null
      };
    });
    
    await browser.close();
    return logData.errorLog;
  } catch (error) {
    await browser.close();
    throw error;
  }
}

function parseExportedFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  return data.logs || data;
}

function generateSummary(logs) {
  const errors = logs.filter(l => l.level === 'error');
  const warns = logs.filter(l => l.level === 'warn');
  const actions = logs.filter(l => l.level === 'action');
  
  let summary = '';
  summary += '═══════════════════════════════════════════════════\n';
  summary += '  🐱 CAT TETRIS - ERROR LOG SUMMARY\n';
  summary += `  Generated: ${new Date().toISOString()}\n`;
  summary += '═══════════════════════════════════════════════════\n\n';
  
  summary += `📊 STATS:\n`;
  summary += `   Total entries: ${logs.length}\n`;
  summary += `   ❌ Errors: ${errors.length}\n`;
  summary += `   ⚠️  Warnings: ${warns.length}\n`;
  summary += `   🎮 Actions: ${actions.length}\n`;
  summary += `   ℹ️  Info: ${logs.filter(l => l.level === 'info').length}\n\n`;
  
  if (errors.length === 0) {
    summary += '✅ NO ERRORS FOUND!\n\n';
  } else {
    summary += '❌ ERRORS (most recent first):\n';
    summary += '───────────────────────────────────────────────────\n';
    
    errors.reverse().forEach((err, i) => {
      const time = new Date(err.timestamp).toLocaleString();
      summary += `\n[Error #${i + 1}] ${time}\n`;
      summary += `  Source:  ${err.source}\n`;
      summary += `  Action:  ${err.action}\n`;
      summary += `  Message: ${err.message}\n`;
      
      if (err.details) {
        if (err.details.stack) {
          // Extrair só as primeiras linhas do stack
          const stackLines = err.details.stack.split('\n').slice(0, 5).join('\n    ');
          summary += `  Stack:\n    ${stackLines}\n`;
        }
        // Outros detalhes
        const otherDetails = { ...err.details };
        delete otherDetails.stack;
        if (Object.keys(otherDetails).length > 0) {
          summary += `  Details: ${JSON.stringify(otherDetails, null, 2).split('\n').join('\n  ')}\n`;
        }
      }
      
      if (err.gameState) {
        summary += `  Game State at error:\n`;
        summary += `    Playing: ${err.gameState.isPlaying}, Paused: ${err.gameState.isPaused}, GameOver: ${err.gameState.gameOver}\n`;
        summary += `    Score: ${err.gameState.score}, Level: ${err.gameState.level}, Lines: ${err.gameState.lines}\n`;
        summary += `    Piece: ${err.gameState.currentPiece} at (${err.gameState.currentPiecePos?.x}, ${err.gameState.currentPiecePos?.y})\n`;
        summary += `    Mode: ${err.gameState.gameMode || 'classic'}\n`;
        summary += `    Board filled rows: ${err.gameState.boardFilledRows}\n`;
      }
      
      summary += '\n';
    });
  }
  
  if (warns.length > 0) {
    summary += '\n⚠️  WARNINGS:\n';
    summary += '───────────────────────────────────────────────────\n';
    warns.slice(-10).reverse().forEach((w, i) => {
      const time = new Date(w.timestamp).toLocaleString();
      summary += `  [${time}] ${w.source}.${w.action}: ${w.message}\n`;
    });
  }
  
  // Mostrar últimas ações antes de cada erro (trail)
  if (errors.length > 0) {
    summary += '\n\n🎮 ACTION TRAIL (before first error):\n';
    summary += '───────────────────────────────────────────────────\n';
    
    const firstErrorTime = errors[errors.length - 1]?.timestamp;
    if (firstErrorTime) {
      const actionsBefore = actions
        .filter(a => a.timestamp <= firstErrorTime)
        .slice(-20);
      
      actionsBefore.forEach(a => {
        const time = new Date(a.timestamp).toLocaleTimeString();
        const detail = a.details?.args ? ` (${JSON.stringify(a.details.args)})` : '';
        summary += `  [${time}] ${a.source}.${a.action}${detail}\n`;
      });
    }
  }
  
  summary += '\n═══════════════════════════════════════════════════\n';
  summary += 'Para corrigir: mostre este arquivo para o Copilot/Claude\n';
  summary += 'Arquivo completo: error-log.json\n';
  summary += '═══════════════════════════════════════════════════\n';
  
  return summary;
}

async function main() {
  const args = process.argv.slice(2);
  let logs;
  
  if (args[0] === '--parse' && args[1]) {
    // Parsear arquivo exportado manualmente
    const filePath = path.resolve(args[1]);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Arquivo não encontrado: ${filePath}`);
      process.exit(1);
    }
    console.log(`📂 Lendo arquivo: ${filePath}`);
    logs = parseExportedFile(filePath);
  } else if (args[0] === '--local') {
    // Tentar ler de um export anterior
    if (fs.existsSync(OUTPUT_FILE)) {
      console.log(`📂 Lendo logs anteriores: ${OUTPUT_FILE}`);
      logs = parseExportedFile(OUTPUT_FILE);
    } else {
      console.error('❌ Nenhum log anterior encontrado. Rode sem --local primeiro.');
      process.exit(1);
    }
  } else {
    // Extrair via Playwright
    logs = await extractWithPlaywright();
  }
  
  if (!logs || logs.length === 0) {
    console.log('📝 Nenhum log encontrado.');
    
    // Criar arquivo vazio para referência
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ logs: [], exportDate: new Date().toISOString() }, null, 2));
    fs.writeFileSync(SUMMARY_FILE, '✅ Nenhum erro registrado!\n');
    return;
  }
  
  // Salvar logs completos
  const exportData = {
    exportDate: new Date().toISOString(),
    totalEntries: logs.length,
    errorCount: logs.filter(l => l.level === 'error').length,
    warnCount: logs.filter(l => l.level === 'warn').length,
    logs
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(exportData, null, 2));
  console.log(`✅ Logs completos salvos em: ${OUTPUT_FILE}`);
  
  // Gerar e salvar summary
  const summary = generateSummary(logs);
  fs.writeFileSync(SUMMARY_FILE, summary);
  console.log(`✅ Resumo salvo em: ${SUMMARY_FILE}`);
  
  // Mostrar resumo no terminal
  console.log('\n' + summary);
}

main().catch(error => {
  console.error('❌ Erro:', error.message);
  process.exit(1);
});
