const puppeteer = require('puppeteer');
const path = require('path');

async function takeScreenshot() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport to requested size
  await page.setViewport({
    width: 1024,
    height: 768,
    deviceScaleFactor: 1
  });
  
  // Navigate to the HTML file
  const filePath = '/Users/jason/expedia-dashboard-redesign/mockups/02-chat-interface.html';
  await page.goto(`file://${filePath}`, {
    waitUntil: 'networkidle0',
    timeout: 10000
  });
  
  // Wait a bit for any animations or charts to load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Take screenshot
  const screenshotPath = '/Users/jason/expedia-dashboard-redesign/chat-interface-screenshot.png';
  await page.screenshot({
    path: screenshotPath,
    fullPage: true, // Capture full page to see all charts
    type: 'png'
  });
  
  console.log(`Screenshot saved to: ${screenshotPath}`);
  
  await browser.close();
  return screenshotPath;
}

takeScreenshot().catch(console.error);