const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'http://localhost:5177/cat-tetris/';
const SCREENSHOT_DIR = path.join(__dirname, 'public', 'screenshots');

async function generateScreenshots() {
  console.log('🎮 Launching browser for screenshot capture...');
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    // ========== MOBILE SCREENSHOT 1 - Main Menu ==========
    console.log('📱 Capturing mobile screenshot 1 (Main Menu)...');
    const mobileContext1 = await browser.newContext({
      viewport: { width: 412, height: 915 },
      deviceScaleFactor: 2.625, // Results in ~1080x2403, we'll crop to 1080x1920
      colorScheme: 'dark',
      locale: 'pt-BR'
    });
    const mobilePage1 = await mobileContext1.newPage();
    await mobilePage1.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage1.waitForTimeout(2000); // Wait for animations
    
    await mobilePage1.screenshot({
      path: path.join(SCREENSHOT_DIR, 'mobile-1.png'),
      clip: { x: 0, y: 0, width: 1080, height: 1920 }
    });
    console.log('✅ mobile-1.png saved (Main Menu)');
    await mobileContext1.close();

    // ========== MOBILE SCREENSHOT 2 - Gameplay ==========
    console.log('📱 Capturing mobile screenshot 2 (Gameplay)...');
    const mobileContext2 = await browser.newContext({
      viewport: { width: 412, height: 915 },
      deviceScaleFactor: 2.625,
      colorScheme: 'dark',
      locale: 'pt-BR'
    });
    const mobilePage2 = await mobileContext2.newPage();
    await mobilePage2.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage2.waitForTimeout(2000);
    
    // Click "Jogar" / start game button
    try {
      // Look for the main play button
      const playButton = await mobilePage2.$('button:has-text("Jogar"), button:has-text("Novo Jogo"), button:has-text("Play")');
      if (playButton) {
        await playButton.click();
        await mobilePage2.waitForTimeout(3000); // Wait for game to load and start
      } else {
        // Try clicking any prominent button
        const buttons = await mobilePage2.$$('button');
        if (buttons.length > 0) {
          await buttons[0].click();
          await mobilePage2.waitForTimeout(3000);
        }
      }
    } catch (e) {
      console.log('⚠️ Could not click play button, capturing current state');
    }
    
    await mobilePage2.screenshot({
      path: path.join(SCREENSHOT_DIR, 'mobile-2.png'),
      clip: { x: 0, y: 0, width: 1080, height: 1920 }
    });
    console.log('✅ mobile-2.png saved (Gameplay)');
    await mobileContext2.close();

    // ========== DESKTOP SCREENSHOT 1 - Gameplay ==========
    console.log('🖥️ Capturing desktop screenshot (Gameplay)...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      colorScheme: 'dark',
      locale: 'pt-BR'
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await desktopPage.waitForTimeout(2000);
    
    // Start a game for desktop screenshot
    try {
      const playButton = await desktopPage.$('button:has-text("Jogar"), button:has-text("Novo Jogo"), button:has-text("Play")');
      if (playButton) {
        await playButton.click();
        await desktopPage.waitForTimeout(3000);
      } else {
        const buttons = await desktopPage.$$('button');
        if (buttons.length > 0) {
          await buttons[0].click();
          await desktopPage.waitForTimeout(3000);
        }
      }
    } catch (e) {
      console.log('⚠️ Could not click play button for desktop');
    }
    
    await desktopPage.screenshot({
      path: path.join(SCREENSHOT_DIR, 'desktop-1.png'),
      fullPage: false
    });
    console.log('✅ desktop-1.png saved (Desktop Gameplay)');
    await desktopContext.close();

    console.log('\n🎉 All screenshots generated successfully!');
    console.log(`📁 Location: ${SCREENSHOT_DIR}`);
    
  } catch (error) {
    console.error('❌ Error generating screenshots:', error);
  } finally {
    await browser.close();
  }
}

generateScreenshots();
